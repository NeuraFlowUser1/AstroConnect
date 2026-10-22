// Test-process-only counter collection. No production source or provider access.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const root=process.env.NEUTRAL_MEASUREMENT_ROOT,app=process.env.NEUTRAL_MEASUREMENT_APP;
if(!root?.startsWith('/tmp/astro-neutral-measurement-')||!app)throw Error('Explicit isolated measurement required');
const require=createRequire(path.join(app,'package.json')),{createCoverageMap}=require('istanbul-lib-coverage');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'baseline.json'))),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
const joined=createCoverageMap({}),rejections=[];let observations=0;
function collect(raw,kind){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)){rejections.push(kind+':counter_shape');return;}
 const accepted={};
 for(const [file,value]of Object.entries(raw)){
  const expected=baseline[file];
  if(!expected||!manifest.files[file]){rejections.push(kind+':unknown_owner');continue;}
  if(['statementMap','fnMap','branchMap'].some(key=>JSON.stringify(value[key])!==JSON.stringify(expected[key]))){rejections.push(kind+':source_map_mismatch');continue;}
  if(['s','f'].some(key=>Object.values(value[key]||{}).some(n=>!Number.isSafeInteger(n)||n<0))||Object.values(value.b||{}).some(xs=>!Array.isArray(xs)||xs.some(n=>!Number.isSafeInteger(n)||n<0))){rejections.push(kind+':counter_value');continue;}
  accepted[file]=value;
 }
 joined.merge(accepted);observations++;
}
const {chromium}=await import(pathToFileURL(path.join(app,'node_modules/playwright-core/index.mjs')).href);
const contextSeen=new WeakSet(),pageSeen=new WeakSet();
async function capture(page){try{if(!page.isClosed())collect(await page.evaluate(()=>globalThis.__neutralCoverage__||{}),'chrome');}catch{rejections.push('chrome:capture_failed');}}
async function prepare(context){
 if(contextSeen.has(context))return;contextSeen.add(context);
 await context.exposeBinding('__collectNeutralCoverage',(_source,value)=>collect(value,'chrome-navigation'));
 await context.addInitScript(()=>window.addEventListener('pagehide',()=>{if(globalThis.__neutralCoverage__)void window.__collectNeutralCoverage(globalThis.__neutralCoverage__);}));
 const oldPage=context.newPage.bind(context);context.newPage=async(...args)=>{const page=await oldPage(...args);decorate(page);return page;};
 const oldClose=context.close.bind(context);context.close=async(...args)=>{for(const page of context.pages())await capture(page);return oldClose(...args);};
 for(const page of context.pages())decorate(page);
}
function decorate(page){if(pageSeen.has(page))return;pageSeen.add(page);const close=page.close.bind(page);page.close=async(...args)=>{await capture(page);return close(...args);};}
const launch=chromium.launch.bind(chromium);
chromium.launch=async(...args)=>{
 const browser=await launch(...args),newContext=browser.newContext.bind(browser),newPage=browser.newPage.bind(browser),close=browser.close.bind(browser);
 browser.newContext=async(...options)=>{const context=await newContext(...options);await prepare(context);return context;};
 browser.newPage=async(...options)=>{const page=await newPage(...options);await prepare(page.context());decorate(page);return page;};
 browser.close=async(...options)=>{for(const context of browser.contexts())for(const page of context.pages())await capture(page);return close(...options);};return browser;
};
const {Miniflare}=await import(pathToFileURL(path.join(app,'node_modules/miniflare/dist/src/index.js')).href);
const dispose=Miniflare.prototype.dispose;
Miniflare.prototype.dispose=async function(...args){
 try{const response=await this.dispatchFetch('https://isolated-fixture.invalid/__isolated_neutral_coverage_20261022');if(response.status===200){const data=await response.json();if(data.measurement==='neutral-rc3-only')collect(data.coverage,'workerd');}}
 catch{rejections.push('workerd:capture_failed');}return dispose.apply(this,args);
};
process.once('exit',()=>{collect(globalThis.__neutralCoverage__||{},'node');fs.writeFileSync(path.join(root,'counters',String(process.pid)+'.json'),JSON.stringify({coverage:joined.toJSON(),observations,rejections}));});
