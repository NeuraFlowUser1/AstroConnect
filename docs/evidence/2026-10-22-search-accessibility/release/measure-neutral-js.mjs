// Disposable local measurement only. Never install/export/publish this copy.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const evidence=path.dirname(fileURLToPath(import.meta.url)),app=path.resolve(evidence,'../../../..'),source=path.resolve(app,'../releases/standard-qualification');
const require=createRequire(path.join(app,'package.json'));
const {createInstrumenter}=require('istanbul-lib-instrument');
const {createCoverageMap}=require('istanbul-lib-coverage');
const root=fs.mkdtempSync('/tmp/astro-neutral-measurement-'),copy=path.join(root,'package'),output=path.join(root,'counters');fs.mkdirSync(output);
const hash=raw=>createHash('sha256').update(raw).digest('hex');
const originalRelease=JSON.parse(fs.readFileSync(path.join(source,'release.json')));
if(originalRelease.content_digest!=='1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f')throw Error('Frozen source identity differs');
fs.cpSync(source,copy,{recursive:true,filter:file=>!['node_modules','__pycache__','.wrangler'].includes(path.basename(file))});
const files={},baseline=createCoverageMap({});
for(const shelf of ['browser','worker','hosting','engine','tools'])walk(path.join(source,shelf));
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
 if(['node_modules','__pycache__','.wrangler'].includes(item.name))continue;
 const file=path.join(dir,item.name);if(item.isSymbolicLink())throw Error('Unexpected measurement source link');
 if(item.isDirectory()){walk(file);continue;}if(!/\.(?:mjs|js)$/.test(item.name))continue;
 const relative=path.relative(source,file),raw=fs.readFileSync(file,'utf8');
 if(/(?:istanbul|c8|v8)\s+ignore/.test(raw))throw Error('Unreviewed source exclusion');
 const instrument=createInstrumenter({esModules:true,compact:false,produceSourceMap:false,coverageVariable:'__neutralCoverage__',coverageGlobalScope:'globalThis',coverageGlobalScopeFunc:false});
 let measured=instrument.instrumentSync(raw,file);baseline.addFileCoverage(instrument.lastFileCoverage());files[file]={relative,sha256:hash(raw)};
 // Keep the supported exact injection marker beside its original null value.
 // Istanbul's counter stays in the comma expression; only its comment moves.
 for(const marker of raw.match(/\/\*[A-Z_]+\*\/null/g)||[]){
  if(!measured.includes(marker)){
   const comment=marker.slice(0,-4),escaped=comment.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   const expression=new RegExp('\\('+escaped+'(cov_[a-zA-Z0-9_]+\\(\\)\\.s\\[[0-9]+\\]\\+\\+), null\\)');
   measured=measured.replace(expression,(_all,counter)=>'('+counter+', '+marker+')');
   if(!measured.includes(marker))throw Error('Measurement failed to retain injection marker: '+relative);
  }
 }
 if(relative==='worker/index.mjs'){
  if((measured.match(/export default \{/g)||[]).length!==1)throw Error('Expected default Worker entry changed');
  measured=measured.replace('export default {','const __isolatedMeasuredWorker = {');
  measured+='\nexport default {...__isolatedMeasuredWorker,async fetch(request,env,context){if(new URL(request.url).pathname==="/__isolated_neutral_coverage_20261022")return Response.json({measurement:"neutral-rc3-only",coverage:globalThis.__neutralCoverage__||{}});return __isolatedMeasuredWorker.fetch(request,env,context);}};\n';
 }
 fs.writeFileSync(path.join(copy,relative),measured);
}}
const manifest={scope:'Disposable fixture instrumentation, not a deployable package or product route',source,copy,output,original_release:originalRelease.content_digest,files};
fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));fs.writeFileSync(path.join(root,'baseline.json'),JSON.stringify(baseline.toJSON()));
// A test-only descriptor keeps the existing integrity fixtures meaningful for
// their disposable copy. It is never confused with or installed as original rc3.
const built=spawnSync('/tmp/abs-independent-python/bin/python',['-c','from pathlib import Path;from tools.install.package import build;build(Path("."),release="0.0.0-rc.999999")'],{cwd:copy,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',PYTHONPATH:path.join(copy,'engine')},encoding:'utf8'});
if(built.status!==0)throw Error('Test-only copy descriptor failed: '+built.stderr.slice(-200));
const deps=spawnSync('npm',['ci','--prefix','tools/checks','--ignore-scripts'],{cwd:copy,stdio:'ignore'});if(deps.status!==0)throw Error('Locked test dependencies unavailable');
const env={...process.env,NEUTRAL_MEASUREMENT_ROOT:root,NEUTRAL_MEASUREMENT_APP:app,BOOKING_CHROME_EXECUTABLE:'/home/anan/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',BOOKING_BROWSER_NODE_MODULES:path.join(app,'node_modules'),BOOKING_WEBSITE_PROOF_PROJECT:app,BOOKING_WEBSITE_PROOF_SITE:app,BOOKING_MINIFLARE_MODULE:path.join(app,'node_modules/miniflare/dist/src/index.js')};
for(const key of Object.keys(env))if(/^(?:PG|DATABASE_URL|GOOGLE_|RAZORPAY_|RESEND_)/.test(key))delete env[key];
const tests=fs.readdirSync(path.join(copy,'tests')).filter(x=>x.endsWith('.test.mjs')).sort().map(x=>'tests/'+x);
const log=fs.openSync(path.join(root,'run.log'),'w');
const run=spawnSync(process.execPath,['--import',path.join(evidence,'neutral-counter-preload.mjs'),'--test','--experimental-test-isolation=none','--test-reporter=spec',...tests],{cwd:copy,env,stdio:['ignore',log,log],timeout:30*60*1000});fs.closeSync(log);
const joined=createCoverageMap(baseline.toJSON());let records=0,rejections=[];
for(const file of fs.readdirSync(output)){
 const data=JSON.parse(fs.readFileSync(path.join(output,file)));records+=data.observations;rejections.push(...data.rejections);joined.merge(data.coverage);
}
for(const [file,item]of Object.entries(files))if(hash(fs.readFileSync(file))!==item.sha256)throw Error('Original source changed during measurement');
const summary=joined.getCoverageSummary().toJSON();const detail={...manifest,run_exit:run.status,counter_observations:records,rejections,summary,whole_working_js_files:Object.keys(files).length,source_unchanged:true,provider_actions:0,customer_actions:0};
fs.writeFileSync(path.join(root,'joined.json'),JSON.stringify(joined.toJSON()));fs.writeFileSync(path.join(root,'summary.json'),JSON.stringify(detail,null,2));
fs.writeFileSync(path.join(evidence,'neutral-js-measurement-pointer.json'),JSON.stringify({root,summary:detail},null,2)+'\n');
console.log(JSON.stringify({root,run_exit:run.status,files:Object.keys(files).length,observations:records,rejections:rejections.length,summary}));
process.exitCode=run.status===0&&rejections.length===0?0:1;
