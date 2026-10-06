// Existing npm aliases delegate to contained shared tests. No factory runtime.
import {existsSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const nativeInputs=['BOOKING_SQL_TEST_TARGET','BOOKING_CHROME_EXECUTABLE','BOOKING_AGE_BINARY'];
export function safeEnvironment(mode,source,project=root){
 const env={...source};
 for(const name of Object.keys(env))if(/^(?:BOOKING_|ASTRO_|VITE_|PG|DATABASE_URL|GOOGLE_|RAZORPAY_|RESEND_|DOCKER_|ABS_MEASURE_|NODE_OPTIONS|PYTHONPATH|PYTHONHOME|PYTHONOPTIMIZE)/.test(name))delete env[name];
 env.PYTHONDONTWRITEBYTECODE='1';env.PYTHONPATH=resolve(project,'appointment-system/engine');
 env.BOOKING_NODE_EXECUTABLE=process.execPath;
 env.BOOKING_MINIFLARE_MODULE=resolve(project,'node_modules/miniflare/dist/src/index.js');
 if(mode==='release'){
  if(!['abs-implementation-pg16','abs-implementation-pg18'].includes(source.BOOKING_SQL_TEST_TARGET))throw Error('release_requires_owned_isolated_SQL_target');
  for(const name of nativeInputs){if(!source[name])throw Error('release_requires_explicit_native_input:'+name);env[name]=source[name];}
  env.DOCKER_HOST='unix:///var/run/docker.sock';
  env.BOOKING_LEGACY_SQL_PROOF='owned';env.BOOKING_TEST_PROJECT=project;
  env.BOOKING_WEBSITE_PROOF_PROJECT=project;env.BOOKING_WEBSITE_PROOF_SITE=project;
  env.BOOKING_BROWSER_NODE_MODULES=resolve(project,'node_modules');
 }
 return env;
}
export function commandPlan(mode,source=process.env,project=root){
 if(!['fast','release','production'].includes(mode))throw Error('Use fast, release or production');
 const env=safeEnvironment(mode,source,project),packageRoot=resolve(project,'appointment-system');
 if(mode==='production')return [{name:'official-domain read-only and refusal-only checks',command:process.execPath,
  args:[resolve(project,'scripts/production-smoke.mjs')],cwd:project,env}];
 const python=source.ASTRO_TEST_PYTHON||'python3';
 const tests=readdirSync(resolve(packageRoot,'tests')).filter(name=>name.endsWith('.test.mjs')).sort().map(name=>'tests/'+name);
 if(tests.length===0)throw Error('Contained Node test selection is empty');
 return [
  {name:'lint',command:'npm',args:['run','lint'],cwd:project,env},
  {name:'production build',command:'npm',args:['run','build'],cwd:project,env},
  {name:'contained common Python checks',command:python,args:[resolve(project,'scripts/run-contained-tests.py'),mode,
   resolve(project,'verification-results/contained-'+mode+'.json')],cwd:packageRoot,env},
  {name:'contained common Node checks',command:process.execPath,args:['--test','--experimental-test-isolation=none',...tests],cwd:packageRoot,env},
 ];
}
const saveReport=(project,mode,report)=>{
 const output=resolve(project,'verification-results');mkdirSync(output,{recursive:true});writeFileSync(resolve(output,mode+'-latest.json'),JSON.stringify(report,null,2)+'\n');
};
export function main(mode,source=process.env,execute=spawnSync,save=saveReport,project=root){
 const plan=commandPlan(mode,source,project),groups=[];
 if(mode==='release')for(const name of ['BOOKING_CHROME_EXECUTABLE','BOOKING_AGE_BINARY'])if(!existsSync(source[name]))throw Error('Native executable missing:'+name);
 let failed=false;
 for(const job of plan){
  if(failed){groups.push({name:job.name,status:'not_run'});continue;}
  const result=execute(job.command,job.args,{cwd:job.cwd,env:job.env,stdio:'inherit',timeout:45*60*1000});
  const passed=result.status===0&&!result.error;groups.push({name:job.name,status:passed?'passed':'failed'});failed=!passed;
 }
 const report={mode,passed:!failed,qualification:false,groups,coverage_measured:false,
  scope:mode==='fast'?'Common tests with native SQL/browser/crypto/historical fixture flags absent; actual skips remain in test output.':
   mode==='release'?'Common tests against explicitly owned disconnected fixtures; target/native skips remain in actual output. This command is not the exhaustive reviewed release gate.':
   'Read-only website requests and unsigned refusals; no customer operation or provider dispatch.',
  hosted_or_provider_acceptance_complete:false};
 save(project,mode,report);
 console.log(JSON.stringify(report));return failed?1:0;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{process.exitCode=main(process.argv[2]);}catch(error){console.error(error.message);process.exitCode=2;}
}
