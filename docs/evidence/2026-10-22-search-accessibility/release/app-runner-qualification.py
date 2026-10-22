"""Exact app runner, disconnected miniature suites; no shared/database/provider use."""
import contextlib,coverage,hashlib,io,json,os,sys,tempfile,types,unittest
from pathlib import Path
from unittest.mock import patch
APP=Path(__file__).resolve().parents[4]; SOURCE=APP/'scripts/run-contained-tests.py'; OUT=APP/'verification-results/app-source-coverage-rc3'; original=SOURCE.read_bytes(); sha=hashlib.sha256(original).hexdigest(); API=APP/'api/index.py'; api_source=API.read_bytes(); api_sha=hashlib.sha256(api_source).hexdigest()
cov=coverage.Coverage(branch=True,include=[str(SOURCE),str(API)],data_file=str(OUT/'python-runner-coverage'),config_file=False);cov.set_option('report:exclude_lines',[]);cov.set_option('report:partial_branches',[]);cov.start();cases=[]
with tempfile.TemporaryDirectory(prefix='astro-app-runner-') as temporary:
 root=Path(temporary)/'neuraflow-website-factory/client'; package=root/'appointment-system';(package/'tests').mkdir(parents=True);(package/'engine').mkdir();(root/'scripts').mkdir();(root/'appointment-settings').mkdir();(package/'tests/__init__.py').write_text('')
 for name in ['project.json','monitor.json']:(root/'appointment-settings'/name).write_text('{}')
 ns={'__file__':str(SOURCE),'__name__':'qualification_runner'};exec(compile(original,str(SOURCE),'exec'),ns);ns['__file__']=str(root/'scripts/run-contained-tests.py')
 baseline_path=list(sys.path);cwd=Path.cwd()
 def run(label,mode='fast',environment=None,body='self.assertTrue(True)',expected=0,working=None,prefix=None,decorator=''):
  (package/'tests/test_probe.py').write_text('import unittest\nclass Probe(unittest.TestCase):\n '+decorator+'\n def test_probe(self):\n  '+body+'\n')
  for name in list(sys.modules):
   if name=='tests' or name.startswith('tests.'):sys.modules.pop(name)
  output=root/(label+'.json'); env={k:v for k,v in os.environ.items() if not k.startswith('BOOKING_')};env.update(environment or {})
  try:
   os.chdir(working or package)
   with patch.dict(os.environ,env,clear=True),patch.object(sys,'argv',['runner',mode,str(output)]),patch.object(sys,'prefix',prefix or '/tmp/independent-python'),contextlib.redirect_stdout(io.StringIO()),contextlib.redirect_stderr(io.StringIO()):
    if isinstance(expected,str):
     try:ns['main']()
     except ValueError as error:assert str(error)==expected
     else:raise AssertionError('Expected refusal: '+label)
    else:assert ns['main']()==expected,label
   if isinstance(expected,str):assert not output.exists()
   else:
    report=json.loads(output.read_text());assert report['executed_occurrences']==1;assert report['successful']==(expected==0)
   cases.append(label)
  finally:os.chdir(cwd);sys.path[:]=baseline_path
 run('fast-success');run('release-success','release',{'BOOKING_SQL_TEST_TARGET':'abs-implementation-pg18'});run('fast-native-refusal',environment={'BOOKING_SQL_TEST_TARGET':'abs-implementation-pg18'},expected='fast_SQL_target_forbidden');run('fast-history-refusal',environment={'BOOKING_LEGACY_SQL_PROOF':'owned'},expected='fast_historical_SQL_authority_forbidden');run('release-target-refusal','release',expected='owned_isolated_SQL_target_required');run('release-prefix-refusal','release',{'BOOKING_SQL_TEST_TARGET':'abs-implementation-pg18'},expected='release_requires_test_python_outside_factory_for_containment_proof',prefix=str(root/'python'));run('cwd-refusal',expected='contained_package_cwd_required',working=root);run('failure-preserved',body='self.assertTrue(False)',expected=1);run('error-preserved',body='raise RuntimeError("synthetic")',expected=1);run('skip-preserved',body='self.skipTest("synthetic unavailable target")');run('expected-failure-preserved',body='self.assertTrue(False)',expected=1,decorator='@unittest.expectedFailure');run('unexpected-success-refused',body='self.assertTrue(True)',expected=1,decorator='@unittest.expectedFailure')

# Wiring proof uses the exact entry bytes with a factory double; no profile,
# credentials, storage, network, or application operation is constructed.
path_before=list(sys.path);sentinel=object();seen=[]
module=types.ModuleType('appointment_system.runtime');module.create_application=lambda profile,environment:(seen.append((profile,environment)) or sentinel)
with patch.dict(sys.modules,{'appointment_system':types.ModuleType('appointment_system'),'appointment_system.runtime':module}),patch.dict(os.environ,{'APP_QUALIFICATION':'1'},clear=True):
 namespace={'__file__':str(API),'__name__':'qualification_entry'};exec(compile(api_source,str(API),'exec'),namespace);assert namespace['app'] is sentinel;assert seen==[(APP/'appointment-settings/project.json',{'APP_QUALIFICATION':'1'})];cases.append('entry-safe-delegation')
 with tempfile.TemporaryDirectory(prefix='astro-entry-link-') as temporary:
  link=Path(temporary)/'api.py';link.symlink_to(API)
  try:exec(compile(api_source,str(API),'exec'),{'__file__':str(link),'__name__':'qualification_entry'})
  except RuntimeError as error:assert str(error)=='Project entry point links are forbidden.'
  else:raise AssertionError('Linked entry accepted')
  assert len(seen)==1;cases.append('entry-link-refusal')
sys.path[:]=path_before
cov.stop();cov.save();cov.json_report(outfile=str(OUT/'python-runner-coverage.json'));data=json.loads((OUT/'python-runner-coverage.json').read_text());assert hashlib.sha256(SOURCE.read_bytes()).hexdigest()==sha;assert hashlib.sha256(API.read_bytes()).hexdigest()==api_sha
summary={'passed':True,'cases':cases,'source':str(SOURCE),'sha256':sha,'sources':{str(SOURCE):sha,str(API):api_sha},'totals':data['totals'],'providerCalls':0};(OUT/'python-runner-result.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary))
