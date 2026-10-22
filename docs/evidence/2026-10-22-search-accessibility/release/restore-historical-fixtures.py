"""Restore only the two already-owned empty PG18 historical test databases.

The power outage erased their tmpfs databases. This does not connect to any live
service, does not remove a database, and refuses a pre-existing target database.
"""
import fcntl,hashlib,json,subprocess,sys
from pathlib import Path
APP=Path(__file__).resolve().parents[4]
PACKAGE=APP/'appointment-system'
sys.path[:0]=[str(PACKAGE),str(PACKAGE/'engine')]
from tools.conversion.source import catalogue
IMAGE='postgres@sha256:d3e1620b530c944afa6e887d22eb899824da68e19c52024bf98f5220c88a65b2'
TARGETS={'legacy-004-31':'abs-legacy-prefix-004','legacy-004-52':'abs-legacy-004'}

def sql(name,database,body):
    p=subprocess.run(['docker','exec','-i','--user','postgres',name,'psql','-X','-U','postgres','-d',database,'-Atq','-v','ON_ERROR_STOP=1'],input=body,text=True,capture_output=True,timeout=90)
    if p.returncode:raise RuntimeError('isolated_historical_sql_failed_'+name)
    return p.stdout.strip()

for identifier,name in TARGETS.items():
    with open('/tmp/'+name+'-neondb-legacy-proof.lock','a') as lock:
        fcntl.flock(lock.fileno(),fcntl.LOCK_EX)
        d=json.loads(subprocess.check_output(['docker','inspect',name]))[0]
        assert d['Config']['Image']==IMAGE and d['Config']['Labels'].get('neuraflow-purpose')=='abs-isolated-legacy-inspection'
        assert d['HostConfig']['NetworkMode']=='none' and not d['HostConfig']['PortBindings'] and d['State']['Running']
        assert sql(name,'postgres',"SELECT count(*) FROM pg_database WHERE datname='neondb';")=='0','Existing target database is preserved, never overwritten.'
        sql(name,'postgres','CREATE DATABASE neondb;')
        layout=next(x for x in catalogue() if x.identifier==identifier)
        for filename,digest in layout.ledger.items():
            path=PACKAGE/'tests/legacy_schema/004'/filename
            assert hashlib.sha256(path.read_bytes()).hexdigest()==digest
            body='BEGIN;\n'+path.read_text()+"\nINSERT INTO sarsa_booking.schema_migrations(version,sha256) VALUES ('"+filename+"','"+digest+"');\nCOMMIT;"
            sql(name,'neondb',body)
        print(json.dumps({'fixture':name,'historical_layout':identifier,'pinned_migrations':len(layout.ledger),'synthetic_only':True,'network':'none'}))
