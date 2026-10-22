"""Full neutral local qualification with every working Python file retained.

Fixed owned targets, external Python, safe environment and no provider/customer
capability. No suite skips/failures are rewritten or credited as passing.
"""
import argparse,hashlib,json,os,sys,time,unittest
from pathlib import Path
import coverage

APP=Path(__file__).resolve().parents[4]
Q=APP.parent/'releases/standard-qualification'
OUT=APP/'verification-results'
EXPECTED='1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f'

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def inventory(pattern,folders):
 return {path.relative_to(Q).as_posix():sha(path) for folder in folders for path in (Q/folder).rglob(pattern)
         if not any(part in ('node_modules','__pycache__','.wrangler') for part in path.relative_to(Q).parts)}

def main():
 parser=argparse.ArgumentParser();parser.add_argument('target',choices=['abs-implementation-pg16','abs-implementation-pg18']);args=parser.parse_args()
 OUT.mkdir(exist_ok=True)
 label='neutral-'+args.target[-4:]+'-rc3'
 # No ambient provider, client, database or command-runner configuration enters
 # this test process. All declarations below are existing isolated local inputs.
 for name in list(os.environ):
  if name.startswith(('BOOKING_','ASTRO_','VITE_','PG','DATABASE_URL','GOOGLE_','RAZORPAY_','RESEND_','ABS_MEASURE_','NODE_OPTIONS','PYTHONPATH','PYTHONHOME','PYTHONOPTIMIZE')):os.environ.pop(name,None)
 os.environ.update(PYTHONDONTWRITEBYTECODE='1',PYTHONPATH=str(Q/'engine'),DOCKER_HOST='unix:///var/run/docker.sock',
  BOOKING_SQL_TEST_TARGET=args.target,BOOKING_LEGACY_SQL_PROOF='owned',BOOKING_TEST_PROJECT=str(APP),
  BOOKING_WEBSITE_PROOF_PROJECT=str(APP),BOOKING_WEBSITE_PROOF_SITE=str(APP),BOOKING_BROWSER_NODE_MODULES=str(APP/'node_modules'),
  BOOKING_NODE_EXECUTABLE='/home/anan/.nvm/versions/node/v22.22.0/bin/node' if Path('/home/anan/.nvm/versions/node/v22.22.0/bin/node').is_file() else '/usr/bin/node',
  BOOKING_CHROME_EXECUTABLE='/home/anan/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
  BOOKING_AGE_BINARY=str(APP.parents[1]/'backup-tools/age'),BOOKING_MINIFLARE_MODULE=str(APP/'node_modules/miniflare/dist/src/index.js'))
 # Use the actual available Node executable, never a guessed provider command.
 import shutil
 os.environ['BOOKING_NODE_EXECUTABLE']=shutil.which('node')
 assert Path(os.environ['BOOKING_AGE_BINARY']).is_file()
 sys.path[:0]=[str(Q),str(Q/'engine')];os.chdir(Q)
 from tools.install.package import verify
 release=verify(Q);assert release['content_digest']==EXPECTED
 sources=inventory('*.py',('engine','tools'));inputs=inventory('*.py',('tests',));inputs.update(inventory('*.sql',('engine/appointment_system/migrations',)))
 assert sources and inputs
 measure=coverage.Coverage(branch=True,source=[str(Q/'engine'),str(Q/'tools')],config_file=False,data_file=str(OUT/('.coverage.'+label)))
 measure.set_option('report:exclude_lines',[]);measure.set_option('report:partial_branches',[])
 measure.start();start=time.monotonic()
 suite=unittest.defaultTestLoader.discover('tests',pattern='test_*.py',top_level_dir='.')
 discovered=suite.countTestCases();result=unittest.TextTestRunner(verbosity=2).run(suite)
 measure.stop();measure.get_data().touch_files(str(Q/name) for name in sources);measure.save()
 measure.json_report(outfile=str(OUT/(label+'-coverage.json')))
 details=json.loads((OUT/(label+'-coverage.json')).read_text());totals=details['totals']
 after=inventory('*.py',('engine','tools'));after_inputs=inventory('*.py',('tests',));after_inputs.update(inventory('*.sql',('engine/appointment_system/migrations',)))
 same=sources==after and inputs==after_inputs and verify(Q)==release
 passed=result.wasSuccessful() and result.testsRun==discovered and not result.expectedFailures and not result.unexpectedSuccesses
 report={'release_digest':release['content_digest'],'manifest_files':len(release['files']),'target':args.target,'discovered':discovered,'executed':result.testsRun,
  'successful':bool(passed and same),'failures':[test.id() for test,_ in result.failures],'errors':[test.id() for test,_ in result.errors],
  'skips':[{'id':test.id(),'reason':reason} for test,reason in result.skipped],'source_unchanged':same,'source_sha256':sources,'input_sha256':inputs,
  'seconds':round(time.monotonic()-start,2),'coverage':totals,'coverage_denominator':'Every working Python file in engine and tools, including zero-hit files; no exclusions',
  'provider_actions':0,'customer_actions':0,'qualification_complete':False}
 (OUT/(label+'-result.json')).write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({k:report[k] for k in ('target','successful','discovered','executed','seconds','coverage','source_unchanged')}))
 return 0 if report['successful'] else 1

if __name__=='__main__':raise SystemExit(main())
