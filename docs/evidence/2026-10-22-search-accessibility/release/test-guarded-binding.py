"""Execute the exact operator guard only on the existing disconnected PG18 fixture."""
import importlib.util,json,sys,threading,time,unittest
from pathlib import Path
from uuid import uuid4
import psycopg
from psycopg.types.json import Jsonb
APP=Path(__file__).resolve().parents[4];PACKAGE=APP/'appointment-system'
sys.path[:0]=[str(PACKAGE),str(PACKAGE/'engine')]
from tools.checks.sql_target import SQLTarget
from tests.fixtures import installation,business
spec=importlib.util.spec_from_file_location('guarded_binding',Path(__file__).with_name('guarded-binding.py'));guard=importlib.util.module_from_spec(spec);spec.loader.exec_module(guard)
OLD='a'*64;NEW='b'*64
INSTALLATION='11111111-1111-4111-8111-111111111111';GENERATION='22222222-2222-4222-8222-222222222222';OPERATION='33333333-3333-4333-8333-333333333333';ORIGIN='https://practice.example.test';DATABASE='abs_guarded_worker_binding_20261022'

class GuardedBinding(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.target=SQLTarget('abs-implementation-pg18');cls.target.check_owned();cls.socket=cls.target.native_socket()
  with psycopg.connect(host=cls.socket,dbname='postgres',user='postgres',autocommit=True) as admin:
   exists=bool(admin.execute('select 1 from pg_database where datname=%s',(DATABASE,)).fetchone())
   if not exists:admin.execute('CREATE DATABASE '+DATABASE)
  cls.db=psycopg.connect(host=cls.socket,dbname=DATABASE,user='postgres',autocommit=True)
  if not exists:
   for path in sorted((PACKAGE/'engine/appointment_system/migrations').glob('[0-9][0-9][0-9]_*.sql')):cls.db.execute(path.read_text(),prepare=False)
   facts=installation();facts.update(installation_id=INSTALLATION,project_id='003',environment='production',origin=ORIGIN)
   cls.db.execute('SELECT appointment_system.configure_installation(%s,%s,false)',(Jsonb(facts),Jsonb(business())))
  # Only reuse this named synthetic database after validating its exact fixture
  # identity and proving it contains no appointment or enquiry records.
  assert str(cls.db.execute('SELECT installation_id FROM appointment_system.installation').fetchone()[0])==INSTALLATION
  assert cls.db.execute('SELECT (SELECT count(*) FROM appointment_system.bookings)+(SELECT count(*) FROM appointment_system.enquiries)').fetchone()[0]==0
  cls.db.execute("INSERT INTO appointment_system.control_operations(id,actor_subject,body_hash,expected_generation,expected_revision,target_enabled,reason,result_snapshot) VALUES(%s,'synthetic-operator',%s,%s,10,false,'Synthetic release guard proof','{}'::jsonb) ON CONFLICT(id) DO NOTHING",(OPERATION,'c'*64,GENERATION))
 @classmethod
 def tearDownClass(cls):cls.db.close()
 def setUp(self):
  self.db.execute('SELECT appointment_system.configure_worker_release(%s)',(OLD,))
  self.db.execute("UPDATE appointment_system.control_product_state SET enabled=false,requested_enabled=false,restore_generation=%s,revision=11,winning_operation=%s",(GENERATION,OPERATION))
 def values(self,**changes):return dict(installation=INSTALLATION,project='003',origin=ORIGIN,expected_digest=OLD,new_digest=NEW,generation=GENERATION,operation=OPERATION,revision=11,owner='postgres')|changes
 def run_guard(self,connection=None,**changes):
  connection=connection or self.db
  with connection.transaction():
   for statement in guard.statements(**self.values(**changes)):connection.execute(statement,prepare=False)
 def state(self):return self.db.execute('SELECT release_digest,active_run,active_until FROM appointment_system.worker_release').fetchone()
 def test_expected_idle_binding_and_reverse_rollback(self):
  self.run_guard();self.assertEqual(self.state(),(NEW,None,None));self.run_guard(expected_digest=NEW,new_digest=OLD);self.assertEqual(self.state(),(OLD,None,None))
 def test_live_and_inconsistent_leases_never_clear_or_change(self):
  for run,until in [(str(uuid4()),"clock_timestamp()+interval '90 seconds'"),(str(uuid4()),'NULL'),(None,"clock_timestamp()+interval '90 seconds'")]:
   self.db.execute('UPDATE appointment_system.worker_release SET active_run=%s,active_until='+until,(run,));before=self.state()
   with self.assertRaisesRegex(psycopg.Error,'guarded_binding_lease_not_idle'):self.run_guard()
   self.assertEqual(self.state(),before)
 def test_expected_digest_and_company_winner_must_still_match(self):
  for changes,code in [({'expected_digest':'c'*64},'release_changed'),({'operation':str(uuid4())},'company_intent_changed'),({'generation':str(uuid4())},'company_intent_changed'),({'revision':12},'company_intent_changed'),({'installation':str(uuid4())},'installation_mismatch'),({'origin':'https://other.example.test'},'installation_mismatch'),({'owner':'neondb_owner'},'owner_mismatch')]:
   before=self.state()
   with self.subTest(changes=tuple(changes)),self.assertRaisesRegex(psycopg.Error,'guarded_binding_'+code):self.run_guard(**changes)
   self.assertEqual(self.state(),before)
  self.db.execute('UPDATE appointment_system.control_product_state SET requested_enabled=true')
  with self.assertRaisesRegex(psycopg.Error,'company_intent_changed'):self.run_guard()
 def test_guard_waits_for_existing_worker_then_refuses_its_live_lease(self):
  held=threading.Event();release=threading.Event();errors=[]
  def worker():
   try:
    with psycopg.connect(host=self.socket,dbname=DATABASE,user='postgres') as c:
     c.execute('SELECT pg_advisory_xact_lock_shared(83124,5)');c.execute('SELECT pg_advisory_xact_lock_shared(83124,4)')
     c.execute('SELECT * FROM appointment_system.control_product_state FOR SHARE');c.execute('SELECT * FROM appointment_system.worker_release FOR UPDATE')
     c.execute("UPDATE appointment_system.worker_release SET active_run=%s,active_until=clock_timestamp()+interval '90 seconds'",(str(uuid4()),));held.set();release.wait(2)
   except Exception as e:errors.append(type(e).__name__);held.set()
  t=threading.Thread(target=worker);t.start();self.assertTrue(held.wait(3));timer=threading.Timer(.15,release.set);timer.start();start=time.monotonic()
  try:
   with self.assertRaisesRegex(psycopg.Error,'guarded_binding_lease_not_idle'):self.run_guard()
  finally:release.set();t.join(4);timer.cancel()
  self.assertGreaterEqual(time.monotonic()-start,.1);self.assertEqual(errors,[]);self.assertEqual(self.state()[0],OLD);self.assertIsNotNone(self.state()[1])
 def test_guard_lock_is_held_through_configuration_until_commit(self):
  with psycopg.connect(host=self.socket,dbname=DATABASE,user='postgres') as c:
   for statement in guard.statements(**self.values()):c.execute(statement,prepare=False)
   with psycopg.connect(host=self.socket,dbname=DATABASE,user='postgres') as other:
    self.assertFalse(other.execute('SELECT pg_try_advisory_xact_lock_shared(83124,4)').fetchone()[0])
   c.commit()
  self.assertEqual(self.state(),(NEW,None,None))
 def test_generator_refuses_invalid_inputs_before_sql(self):
  for changes in [{'installation':'no'},{'generation':'0'*36},{'operation':True},{'expected_digest':'x'},{'new_digest':OLD},{'project':'001'},{'origin':'http://invalid.test'},{'origin':'https://practice.example.test/path'},{'revision':'0'},{'owner':'unsafe'}]:
   with self.subTest(changes=tuple(changes)),self.assertRaises((ValueError,TypeError)):guard.statements(**self.values(**changes))

if __name__=='__main__':unittest.main(verbosity=2)
