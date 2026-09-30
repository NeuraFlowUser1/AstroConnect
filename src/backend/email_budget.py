"""Project003's allocated share of the shared Free-plan email allowance.

Reservations count conservatively even when a provider result is uncertain.
Daily buckets conservatively cover at least 31 days. Resend remains authoritative
for traffic outside the two booking applications, including received emails.
"""
from datetime import timedelta, timezone

DAILY_LIMIT = 80  # Project004 separately reserves at most 20 of the shared 100.
VERIFICATION_LIMIT = 60  # Leave 20 for already-saved inquiry/booking notifications.
MONTHLY_LIMIT = 2400  # Project004 separately reserves at most 600 of 3,000.
MONTHLY_PREFIX = 'resend:rolling31:'
TOTAL_KEY = 'resend:daily:all'
VERIFICATION_KEY = 'resend:daily:verification'


def reserve_email(conn, clock, *, verification=False):
    """Return None on reservation, or the earliest safe retry time when unavailable.

    Caller commits before sending. One shared lock serializes both sender paths;
    locks are released before any provider call. No credentials are stored here.
    """
    # count must be positive in the existing rate_limits schema. An absent row
    # is locked via a stable advisory lock until its first reservation is saved.
    conn.execute('SELECT pg_advisory_xact_lock(83124020)')
    # Read time AFTER the shared lock: a request waiting across midnight must
    # not restore yesterday's expiry over a newer counter.
    now = clock(conn).astimezone(timezone.utc)
    reset = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    rows = {row['key']: row for row in conn.execute(
        'SELECT key,count,resets_at FROM rate_limits WHERE key IN (%s,%s) FOR UPDATE',
        (TOTAL_KEY, VERIFICATION_KEY))}
    def used(key):
        row = rows.get(key)
        return row['count'] if row and row['resets_at'] > now else 0
    bucket=MONTHLY_PREFIX+now.date().isoformat()
    buckets=list(conn.execute('SELECT key,count,resets_at FROM rate_limits WHERE key LIKE %s AND resets_at>%s FOR UPDATE',
                              (MONTHLY_PREFIX+'%',now)))
    existing=next((row for row in buckets if row['key']==bucket),None)
    # A release must never reset the day's already-spent reservations. The
    # rollout also seeds a conservative historical baseline in this ledger.
    today=max(used(TOTAL_KEY),existing['count'] if existing else 0)
    monthly=today+sum(row['count'] for row in buckets if row['key']!=bucket)
    retry=None
    if used(TOTAL_KEY)>=DAILY_LIMIT or (verification and used(VERIFICATION_KEY)>=VERIFICATION_LIMIT):retry=reset
    if monthly>=MONTHLY_LIMIT:
        timeline=[(row['resets_at'],row['count']) for row in buckets if row['key']!=bucket]
        if today:timeline.append((reset+timedelta(days=31),today))
        remaining=monthly
        for expires,count in sorted(timeline):
            remaining-=count
            if remaining<MONTHLY_LIMIT:
                retry=max(retry,expires) if retry else expires
                break
    if retry:return retry
    for key in ((TOTAL_KEY, VERIFICATION_KEY) if verification else (TOTAL_KEY,)):
        conn.execute('''INSERT INTO rate_limits(key,count,resets_at) VALUES (%s,%s,%s)
            ON CONFLICT(key) DO UPDATE SET count=EXCLUDED.count,resets_at=EXCLUDED.resets_at''',
            (key, used(key) + 1, reset))
    # Keeping the entire date until the day AFTER its 31-day boundary prevents
    # an early-morning expiry from releasing late-evening mail too soon.
    conn.execute('''INSERT INTO rate_limits(key,count,resets_at) VALUES (%s,%s,%s)
        ON CONFLICT(key) DO UPDATE SET count=EXCLUDED.count,resets_at=EXCLUDED.resets_at''',
        (bucket,today+1,reset+timedelta(days=31)))
    return None
