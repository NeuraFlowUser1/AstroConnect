import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,writeFileSync,readFileSync,existsSync,rmSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const script=resolve('scripts/run-contained-tests.py');
function fixture(run){
 const root=mkdtempSync(join(tmpdir(),'astro-runner-check-')),app=join(root,'client'),source=join(app,'appointment-system');
 mkdirSync(join(app,'scripts'),{recursive:true});mkdirSync(join(app,'appointment-settings'));mkdirSync(join(source,'tests'),{recursive:true});mkdirSync(join(source,'engine'));
 copyFileSync(script,join(app,'scripts/run-contained-tests.py'));
 writeFileSync(join(app,'appointment-settings/project.json'),'{}');writeFileSync(join(app,'appointment-settings/monitor.json'),'{}');
 writeFileSync(join(app,'appointment-settings/staff-browser.json'),'{"synthetic_marker":"must_not_be_read_by_common_fixtures"}');
 writeFileSync(join(source,'tests/__init__.py'),'');
 writeFileSync(join(source,'tests/test_isolation.py'),`import os,unittest\nfrom pathlib import Path\nclass Isolation(unittest.TestCase):\n def test_exact_neutral_source_is_separate_from_client_settings(self):\n  package=Path(__file__).resolve().parents[1]\n  self.assertFalse((package.parent/'appointment-settings').exists())\n  self.assertNotEqual(package,Path(${JSON.stringify(source)}))\n  self.assertEqual(Path(os.environ['PYTHONPATH']),package/'engine')\n  client=os.environ.get('BOOKING_TEST_PROJECT')\n  if client:\n   self.assertNotEqual(Path(client)/'appointment-system',package)\n   self.assertTrue((Path(client)/'appointment-settings/project.json').is_file())\n   self.assertFalse((Path(client)/'appointment-settings/staff-browser.json').exists())\n`);
 try{return run({root,app,source});}finally{rmSync(root,{recursive:true,force:true});}
}
for(const mode of ['fast','release'])test(`contained ${mode} runner isolates common fixtures from real client settings and cleans copies`,()=>fixture(({app,source})=>{
 const output=join(app,'verification-results/result.json'),env={...process.env,PYTHONDONTWRITEBYTECODE:'1'};
 for(const key of Object.keys(env))if(/^(?:BOOKING_|ASTRO_|PYTHONPATH|PYTHONHOME|PG|DATABASE_URL)/.test(key))delete env[key];
 if(mode==='release')env.BOOKING_SQL_TEST_TARGET='abs-implementation-pg18';
 const result=spawnSync('python3',[join(app,'scripts/run-contained-tests.py'),mode,output],{cwd:source,env,encoding:'utf8',timeout:10000});
 assert.equal(result.status,0,result.stderr);const report=JSON.parse(readFileSync(output,'utf8'));
 assert.equal(report.successful,true);assert.equal(report.discovered_occurrences,1);assert.equal(report.executed_occurrences,1);assert.deepEqual(report.skips,[]);
 assert.deepEqual(readdirSync(join(app,'verification-results')),['result.json']);assert.equal(existsSync(join(app,'appointment-settings/staff-browser.json')),true);
}));
test('fast runner refuses native SQL authority and release refuses an undeclared target before creating proof data',()=>fixture(({app,source})=>{
 for(const [mode,target]of [['fast','abs-implementation-pg18'],['release','foreign-database']]){
  const output=join(app,'verification-results/result.json'),result=spawnSync('python3',[join(app,'scripts/run-contained-tests.py'),mode,output],{cwd:source,env:{...process.env,BOOKING_SQL_TEST_TARGET:target},encoding:'utf8',timeout:10000});
  assert.notEqual(result.status,0);assert.equal(existsSync(output),false);assert.equal(existsSync(join(app,'verification-results')),false);
 }
}));
