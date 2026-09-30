"""One-use, purpose-bound email verification with durable attempt limits."""

import hashlib
import hmac
import secrets
from datetime import timedelta
from uuid import UUID, uuid4

from .domain import RuleViolation
from .storage import StorageUnavailable
from .email_budget import reserve_email

PURPOSES = frozenset(("booking", "contact", "prashna"))


class EmailVerification:
    def __init__(self, store, secret, send_code):
        self.store = store
        self._secret = secret
        self.send_code = send_code

    def digest(self, value):
        if not self._secret or len(self._secret) < 32:
            raise StorageUnavailable("Email verification is not configured.")
        return hmac.new(self._secret.encode(), value.encode(), hashlib.sha256).hexdigest()

    @staticmethod
    def purpose(value):
        if value not in PURPOSES:
            raise RuleViolation("Please use the verification request for this form.")
        return value

    @staticmethod
    def bump(conn, key, now, seconds, maximum):
        row = conn.execute("""INSERT INTO rate_limits (key,count,resets_at) VALUES (%s,1,%s)
            ON CONFLICT (key) DO UPDATE SET
            count=CASE WHEN rate_limits.resets_at<=%s THEN 1 ELSE rate_limits.count+1 END,
            resets_at=CASE WHEN rate_limits.resets_at<=%s THEN EXCLUDED.resets_at ELSE rate_limits.resets_at END
            RETURNING count""", (key, now + timedelta(seconds=seconds), now, now)).fetchone()
        return row["count"] <= maximum

    def issue(self, email, purpose, client_ip):
        self.purpose(purpose)
        code = f"{secrets.randbelow(1000000):06d}"
        challenge_id = uuid4()
        code_digest = self.digest(f"code:{challenge_id}:{code}")
        allowed = True
        budget_reset = None
        with self.store.transaction() as conn:
            now = self.store.now(conn)
            # Stable order for rate-limit row locks across concurrent requests.
            for key, seconds, maximum in sorted((
                (self.digest(f"send:email:{email}"), 600, 5),
                (self.digest(f"send:cooldown:{email}"), 60, 1),
                (self.digest(f"send:ip:{client_ip}"), 600, 20),
            )):
                permitted = self.bump(conn, key, now, seconds, maximum)
                allowed = allowed and permitted
            if allowed:
                budget_reset = reserve_email(conn, self.store.now, verification=True)
                allowed = budget_reset is None
            if allowed:
                conn.execute("""INSERT INTO email_challenges (email,purpose,challenge_id,code_digest,expires_at)
                    VALUES (%s,%s,%s,%s,%s) ON CONFLICT (email,purpose) DO UPDATE SET
                    challenge_id=EXCLUDED.challenge_id,code_digest=EXCLUDED.code_digest,
                    expires_at=EXCLUDED.expires_at,attempts=0,send_accepted=false""",
                    (email, purpose, challenge_id, code_digest, now + timedelta(minutes=5)))
                conn.execute("DELETE FROM email_verifications WHERE email=%s AND purpose=%s", (email, purpose))
        if not allowed:
            if budget_reset:
                raise RuleViolation("Email verification has reached its sending allowance. Please try later or call +91 85277 90801.", 429, "email_allowance")
            raise RuleViolation("Too many code requests. Please wait before requesting another.", 429)
        try:
            send_accepted = self.send_code(email, code, purpose, challenge_id)
        except Exception:
            # Do not expose provider responses, tokens or customer data in logs.
            send_accepted = False
        if not send_accepted:
            raise StorageUnavailable("We could not confirm the verification email was sent. Please wait a minute and request a new code.")
        with self.store.transaction() as conn:
            # Keep correlation even if the user replaced this challenge while
            # the provider call was in flight; store no code or message body.
            if isinstance(send_accepted, str):
                try:
                    provider_id = UUID(send_accepted)
                except ValueError:
                    raise StorageUnavailable('The verification email reference could not be recorded.') from None
                conn.execute('''INSERT INTO verification_emails(challenge_id,provider_id,purpose,accepted_at)
                    VALUES (%s,%s,%s,%s) ON CONFLICT(challenge_id) DO NOTHING''',
                    (challenge_id, provider_id, purpose, self.store.now(conn)))
            updated = conn.execute("UPDATE email_challenges SET send_accepted=true WHERE email=%s AND purpose=%s AND challenge_id=%s AND expires_at>%s RETURNING email",
                                   (email, purpose, challenge_id, self.store.now(conn))).fetchone()
        if not updated:
            raise RuleViolation("This code request was replaced or expired. Please request a fresh code.", 409)

    def verify(self, email, purpose, code, client_ip):
        self.purpose(purpose)
        error = None
        token = None
        with self.store.transaction() as conn:
            now = self.store.now(conn)
            permitted = self.bump(conn, self.digest(f"verify:ip:{client_ip}"), now, 600, 50)
            row = conn.execute("SELECT * FROM email_challenges WHERE email=%s AND purpose=%s FOR UPDATE", (email, purpose)).fetchone()
            if not permitted:
                error = RuleViolation("Too many verification attempts. Please wait and try again.", 429)
            elif not row or not row["send_accepted"] or row["expires_at"] <= now:
                error = RuleViolation("The code is unavailable or expired. Please request a new code.")
            elif row["attempts"] >= 5:
                error = RuleViolation("Too many incorrect attempts. Please request a new code.", 429)
            else:
                conn.execute("UPDATE email_challenges SET attempts=attempts+1 WHERE email=%s AND purpose=%s", (email, purpose))
                if not hmac.compare_digest(row["code_digest"], self.digest(f"code:{row['challenge_id']}:{code}")):
                    error = RuleViolation("That verification code is incorrect.")
                else:
                    conn.execute("DELETE FROM email_challenges WHERE email=%s AND purpose=%s", (email, purpose))
                    token = secrets.token_urlsafe(32)
                    conn.execute("INSERT INTO email_verifications VALUES (%s,%s,%s,%s)",
                                 (self.digest(token), email, purpose, now + timedelta(minutes=15)))
        # Commit failed-attempt counters too. Raising inside the transaction would undo them.
        if error:
            raise error
        return token
