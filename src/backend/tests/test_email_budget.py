"""Shared allowance behavior against isolated PostgreSQL, no real mail."""
import os
import unittest
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta, timezone
from uuid import uuid4

from src.backend.application import Settings
from src.backend.domain import RuleViolation
from src.backend.email_budget import reserve_email, TOTAL_KEY, MONTHLY_PREFIX, MONTHLY_LIMIT
from src.backend.inquiry_delivery import InquiryDelivery
from src.backend.tests import test_foundation as foundation


@unittest.skipUnless(os.getenv('ASTRO_TEST_DATABASE_URL'), 'Requires isolated local database.')
class BudgetTests(unittest.TestCase):
    setUpClass = classmethod(foundation.PostgresTests.setUpClass.__func__)
    setUp = foundation.PostgresTests.setUp
    verified = foundation.PostgresTests.verified

    def reserve(self, verification=False):
        with self.store.transaction() as conn:
            return reserve_email(conn, self.store.now, verification=verification)

    def test_verification_leaves_room_for_accepted_obligations(self):
        for _ in range(60): self.assertIsNone(self.reserve(True))
        self.assertIsNotNone(self.reserve(True))
        for _ in range(20): self.assertIsNone(self.reserve())
        self.assertIsNotNone(self.reserve())
        with self.store.transaction() as conn:
            self.assertEqual(conn.execute('SELECT count FROM rate_limits WHERE key=%s', (TOTAL_KEY,)).fetchone()['count'], 80)

    def test_concurrent_instances_cannot_spend_the_last_allowance_twice(self):
        for _ in range(79): self.reserve()
        with ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(lambda _: self.reserve(), range(8)))
        self.assertEqual(results.count(None), 1)

    def test_utc_reset_and_transaction_rollback(self):
        self.time = self.time.astimezone(timezone.utc).replace(hour=23, minute=59, second=59)
        for _ in range(80): self.reserve()
        self.assertEqual(self.reserve(), self.time + timedelta(seconds=1))
        self.time += timedelta(seconds=1)
        with self.store.transaction() as conn:
            self.assertIsNone(reserve_email(conn, self.store.now, verification=True))
            conn.rollback()
        self.assertIsNone(self.reserve(True))
        with self.store.transaction() as conn:
            self.assertEqual(conn.execute('SELECT count FROM rate_limits WHERE key=%s', (TOTAL_KEY,)).fetchone()['count'], 1)

    def test_clock_is_read_only_after_the_shared_lock(self):
        def clock(conn):
            row = conn.execute("""SELECT EXISTS(SELECT 1 FROM pg_locks
                WHERE pid=pg_backend_pid() AND locktype='advisory'
                AND objid=83124020 AND granted) AS held""").fetchone()
            self.assertTrue(row['held'])
            return self.time
        with self.store.transaction() as conn:
            self.assertIsNone(reserve_email(conn, clock))

    def test_monthly_share_waits_until_enough_old_buckets_expire(self):
        with self.store.transaction() as conn:
            conn.execute('INSERT INTO rate_limits(key,count,resets_at) VALUES(%s,%s,%s)',
                         (MONTHLY_PREFIX+'older',MONTHLY_LIMIT,self.time+timedelta(days=3)))
        self.assertEqual(self.reserve(),self.time+timedelta(days=3))
        self.time+=timedelta(days=3)
        self.assertIsNone(self.reserve())

    def test_existing_daily_usage_is_preserved_at_rollout(self):
        reset=self.time.astimezone(timezone.utc).replace(hour=0,minute=0,second=0,microsecond=0)+timedelta(days=1)
        with self.store.transaction() as conn:
            conn.execute('INSERT INTO rate_limits(key,count,resets_at) VALUES(%s,79,%s)',(TOTAL_KEY,reset))
        self.assertIsNone(self.reserve())
        self.assertIsNotNone(self.reserve())
        with self.store.transaction() as conn:
            row=conn.execute('SELECT count FROM rate_limits WHERE key=%s',
                             (MONTHLY_PREFIX+self.time.astimezone(timezone.utc).date().isoformat(),)).fetchone()
            self.assertEqual(row['count'],80)

    def test_historical_baseline_consumes_monthly_share_without_spending_new_daily_capacity(self):
        with self.store.transaction() as conn:
            conn.execute('INSERT INTO rate_limits(key,count,resets_at) VALUES(%s,106,%s)',
                         (MONTHLY_PREFIX+self.time.astimezone(timezone.utc).date().isoformat(),self.time+timedelta(days=32)))
        self.assertIsNone(self.reserve())
        with self.store.transaction() as conn:
            self.assertEqual(conn.execute('SELECT count FROM rate_limits WHERE key=%s',(TOTAL_KEY,)).fetchone()['count'],1)
            self.assertEqual(conn.execute('SELECT sum(count) AS total FROM rate_limits WHERE key LIKE %s',
                (MONTHLY_PREFIX+'%',)).fetchone()['total'],107)

    def test_concurrent_last_monthly_allowance_and_whole_day_retention(self):
        with self.store.transaction() as conn:
            conn.execute('INSERT INTO rate_limits(key,count,resets_at) VALUES(%s,%s,%s)',
                         (MONTHLY_PREFIX+'older',MONTHLY_LIMIT-1,self.time+timedelta(days=3)))
        with ThreadPoolExecutor(max_workers=8) as pool:
            results=list(pool.map(lambda _:self.reserve(),range(8)))
        self.assertEqual(results.count(None),1)
        self.time+=timedelta(days=31)
        # The first day's late sends remain counted through the whole boundary day.
        with self.store.transaction() as conn:
            rows=list(conn.execute('SELECT count,resets_at FROM rate_limits WHERE key LIKE %s AND resets_at>%s',
                                   (MONTHLY_PREFIX+'%',self.time)))
            self.assertEqual(sum(r['count'] for r in rows),1)

    def test_denied_code_never_sends_or_creates_challenge(self):
        for _ in range(60): self.reserve(True)
        with self.assertRaises(RuleViolation) as error:
            self.verification.issue('new@example.com', 'contact', 'new-ip')
        self.assertEqual(error.exception.code, 'email_allowance')
        self.assertEqual(self.codes, [])
        with self.store.transaction() as conn:
            self.assertEqual(conn.execute('SELECT count(*) AS n FROM email_challenges').fetchone()['n'], 0)

    def test_uncertain_code_counts_and_is_not_queued(self):
        self.verification.send_code = lambda *args: False
        from src.backend.storage import StorageUnavailable
        with self.assertRaises(StorageUnavailable):
            self.verification.issue('new@example.com', 'contact', 'new-ip')
        with self.store.transaction() as conn:
            self.assertEqual(conn.execute('SELECT count FROM rate_limits WHERE key=%s', (TOTAL_KEY,)).fetchone()['count'], 1)
            self.assertEqual(conn.execute('SELECT count(*) AS n FROM delivery_jobs').fetchone()['n'], 0)

    def test_notification_waits_without_spending_attempt_then_resumes(self):
        payload = dict(kind='contact', name='Synthetic', email='synthetic@example.com', subject='Help', message='Synthetic message')
        inquiry = self.store.save_inquiry(payload, uuid4(), self.verified(payload['email'], 'contact'), 'a' * 64)
        with self.store.transaction() as conn:
            job = conn.execute("SELECT id FROM delivery_jobs WHERE record_id=%s AND kind='inquiry_received' LIMIT 1",
                               (inquiry,)).fetchone()['id']
        for _ in range(79): self.reserve()
        sends = []
        worker = InquiryDelivery(self.store, Settings(resend_key='synthetic', sender='studio@example.com'),
                                 sender=lambda *args: sends.append(args) or str(uuid4()))
        self.assertEqual(worker.run(job)['error_code'], 'email_allowance')
        self.assertEqual(sends, [])
        with self.store.transaction() as conn:
            row = conn.execute('SELECT attempts,first_attempt_at FROM delivery_jobs WHERE id=%s', (job,)).fetchone()
            self.assertEqual(row, {'attempts': 0, 'first_attempt_at': None})
        self.time += timedelta(days=1)
        self.assertEqual(worker.run(job)['state'], 'sent')
        self.assertEqual(len(sends), 1)
