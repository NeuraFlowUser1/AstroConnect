"""One explicit current-source local unit qualification, without SQL/providers."""
import hashlib,json,os,sys,time,unittest
from pathlib import Path
import coverage
APP=Path(__file__).resolve().parents[4]
Q=APP.parent/'releases/standard-qualification'
OUT=APP/'verification-results'
EXPECTED='1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f'
for key in list(os.environ):
    if key.startswith(('BOOKING_','ASTRO_','VITE_','PG','DATABASE_URL','GOOGLE_','RAZORPAY_','RESEND_','PYTHONPATH','PYTHONHOME')):os.environ.pop(key,None)
os.environ['PYTHONDONTWRITEBYTECODE']='1'
sys.path[:0]=[str(Q),str(Q/'engine')]
os.chdir(Q)
from tools.install.package import verify
release=verify(Q);assert release['content_digest']==EXPECTED
sources={path.relative_to(Q).as_posix():hashlib.sha256(path.read_bytes()).hexdigest() for folder in ('engine','tools') for path in (Q/folder).rglob('*.py') if not any(part in ('node_modules','__pycache__','.wrangler') for part in path.relative_to(Q).parts)}
measure=coverage.Coverage(branch=True,source=[str(Q/'engine'),str(Q/'tools')],config_file=False,data_file=str(OUT/'.coverage.neutral-runtime-rc3'))
measure.set_option('report:exclude_lines',[]);measure.set_option('report:partial_branches',[])
measure.start();start=time.monotonic()
suite=unittest.defaultTestLoader.discover(str(Path(__file__).parent),pattern='test_*_qualification.py')
result=unittest.TextTestRunner(verbosity=2).run(suite);measure.stop();measure.get_data().touch_files(str(Q/name) for name in sources);measure.save()
same=verify(Q)==release and all(hashlib.sha256((Q/name).read_bytes()).hexdigest()==digest for name,digest in sources.items())
report={'successful':result.wasSuccessful() and not result.skipped and same,'executed':result.testsRun,'source_unchanged':same,'release_digest':EXPECTED,'source_sha256':sources,'seconds':round(time.monotonic()-start,3),'provider_actions':0,'customer_actions':0}
(OUT/'neutral-runtime-rc3-result.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({key:value for key,value in report.items() if key!='source_sha256'}))
raise SystemExit(0 if report['successful'] else 1)
