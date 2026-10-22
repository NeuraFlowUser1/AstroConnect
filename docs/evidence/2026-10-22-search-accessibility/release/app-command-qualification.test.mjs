// App-owned command composition and read-only smoke contracts, disconnected.
import test from 'node:test';import assert from 'node:assert/strict';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..');
const {safeEnvironment,commandPlan,main}=await import(pathToFileURL(path.join(app,'scripts/verify.mjs')).href);
const {check}=await import(pathToFileURL(path.join(app,'scripts/production-smoke.mjs')).href);
const {default:config}=await import(pathToFileURL(path.join(app,'vite.config.js')).href);
const releaseInput={BOOKING_SQL_TEST_TARGET:'abs-implementation-pg16',BOOKING_CHROME_EXECUTABLE:'/home/anan/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',BOOKING_AGE_BINARY:'/mnt/d/coding/business/neuraflow-website-factory/04-shared-tools/003-appointment-booking-system/.local-runtime/backup-tools/age'};
test('app test commands isolate inherited credentials and require each declared native input',()=>{
 const fast=safeEnvironment('fast',{SAFE:'kept',DATABASE_URL:'removed',BOOKING_WORKER_KEY:'removed',PGPASSWORD:'removed',VITE_OTHER:'removed',NODE_OPTIONS:'removed'});assert.equal(fast.SAFE,'kept');for(const name of ['DATABASE_URL','BOOKING_WORKER_KEY','PGPASSWORD','VITE_OTHER','NODE_OPTIONS'])assert.equal(name in fast,false);
 assert.throws(()=>commandPlan('unknown'),/Use fast/);assert.throws(()=>safeEnvironment('release',{}),/owned_isolated_SQL_target/);
 for(const name of ['BOOKING_SQL_TEST_TARGET','BOOKING_CHROME_EXECUTABLE','BOOKING_AGE_BINARY']){const input={...releaseInput};delete input[name];assert.throws(()=>safeEnvironment('release',input),/release_requires/);}
 assert.equal(safeEnvironment('release',releaseInput).BOOKING_LEGACY_SQL_PROOF,'owned');assert.equal(commandPlan('fast').length,5);assert.equal(commandPlan('release',{...releaseInput,ASTRO_TEST_PYTHON:'synthetic-python'})[3].command,'synthetic-python');assert.equal(commandPlan('production').length,1);
});
test('app gate records success, failed dependencies and production limits without executing a test or provider',()=>{
 const results=[],saved=[];let executions=0;const execute=()=>{executions++;return {status:0};},save=(_root,mode,report)=>saved.push({mode,report});
 assert.equal(main('fast',{},execute,save),0);assert.equal(executions,5);assert.equal(saved[0].report.qualification,false);assert.equal(saved[0].report.coverage_measured,false);
 executions=0;assert.equal(main('release',releaseInput,execute,save),0);assert.equal(executions,5);
 executions=0;assert.equal(main('fast',{},()=>{executions++;return {status:1};},save),1);assert.equal(executions,1);assert.equal(saved.at(-1).report.groups.filter(group=>group.status==='not_run').length,4);
 assert.equal(main('production',{},execute,save),0);assert.match(saved.at(-1).report.scope,/unsigned refusals/);
 for(const key of ['BOOKING_CHROME_EXECUTABLE','BOOKING_AGE_BINARY'])assert.throws(()=>main('release',{...releaseInput,[key]:'/does-not-exist'},execute,save),/Native executable missing/);
});
test('public smoke preserves exact read/refusal limits and rejects unsafe origin or misleading responses',async()=>{
 const calls=[],request=async(url,options)=>{const route=new URL(url).pathname;calls.push({url,options});if(route==='/api/health')return Response.json({status:'online'},{headers:{'cache-control':'no-store'}});if(route==='/api/company/control/status')return Response.json({}, {status:401});if(route==='/api/studio/status')return Response.json({}, {status:404});if(route.startsWith('/api/webhooks/'))return Response.json({}, {status:400});return new Response('<html>Local synthetic page</html>',{headers:{'content-type':'text/html'}});};
 const result=await check('https://practice.example.test',request);assert.equal(result.public_pages,7);assert.equal(result.customer_mutations,0);assert.equal(result.provider_dispatches,0);assert.equal(calls.filter(call=>call.options.method==='POST').length,2);assert(calls.every(call=>call.options.redirect==='error'));
 for(const origin of ['http://practice.example.test','https://practice.example.test/path'])await assert.rejects(check(origin,request));
 await assert.rejects(check('https://practice.example.test',async()=>new Response('wrong',{status:503})),/503/);
 const wrongHealth=async(url,options)=>new URL(url).pathname==='/api/health'?Response.json({status:'unknown'}):request(url,options);await assert.rejects(check('https://practice.example.test',wrongHealth));
});
test('Vite owns private asset marking only for browser builds and keeps both required style plugins',()=>{const browser=config({isSsrBuild:false}),server=config({isSsrBuild:true});assert(browser.plugins.length>server.plugins.length);assert(browser.plugins.some(plugin=>plugin.name==='contained-appointment-surfaces'));assert(server.plugins.length>=2);});
