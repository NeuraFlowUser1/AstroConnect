// Exact copied private journals, deterministic storage faults, no customer data.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const manifest=JSON.parse(fs.readFileSync(path.join(process.env.NEUTRAL_MEASUREMENT_ROOT,'manifest.json')));
const id='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222',zero='00000000-0000-0000-0000-000000000000';
function storage(){const values=new Map();return {values,getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
function staff({scope,locks=true}={}){const localStorage=storage(),window={},navigator=locks?{locks:{request:async(_key,_options,action)=>action()}}:{},configuration=scope===undefined?{installation_id:id,environment:'test',legacy:Object.fromEntries(['client','company','calendar','inbox','enquiry'].map(purpose=>[purpose,['legacy-'+purpose]]))}:scope;
 const context={window,localStorage,navigator,Date:{now:()=>600001},globalThis};
 const code=fs.readFileSync(path.join(manifest.copy,'engine/appointment_system/studio_assets/staff-actions.js'),'utf8').replace('/*STAFF_BROWSER_CONFIGURATION*/null',JSON.stringify(configuration));vm.runInNewContext(code,context);
 return {window,localStorage,navigator,store:purpose=>window.PracticeStaffActions(purpose),key:purpose=>`appointment-system:${id}:test:staff:${purpose}:v1`};}
function company(scope={installation_id:id,environment:'test'}){const sessionStorage=storage(),window={},code=fs.readFileSync(path.join(manifest.copy,'engine/appointment_system/company_assets/command-journal.js'),'utf8').replace('/*COMPANY_BROWSER_CONFIGURATION*/null',JSON.stringify(scope));vm.runInNewContext(code,{window,sessionStorage,globalThis});return {journal:window.PracticeCompanyCommands,sessionStorage,key:purpose=>`appointment-system:${id}:test:company:${purpose}:v1`};}
const command=()=>({operation_id:id,generation:other,revision:'1',enabled:true,reason:'Synthetic mode change'});
test('staff journals validate installation and purpose, cache one owner and retain exact opaque ids only',async()=>{
 for(const scope of [null,{installation_id:zero,environment:'test'},{installation_id:id,environment:'other'}])assert.throws(()=>staff({scope}),/Invalid staff storage configuration/);
 const f=staff();assert.throws(()=>f.store('unknown'),/Invalid staff purpose/);const store=f.store('client');assert.equal(f.store('client'),store);
 await store.remember(id);await store.remember(id);assert.equal(store.get().length,1);assert.equal(store.error,null);assert.deepEqual(Object.keys(store.get()[0]).sort(),['created_at','operation_id']);
 await assert.rejects(store.remember(zero),/Invalid action reference/);await assert.rejects(store.forget('invalid'),/Invalid action reference/);await store.forget(id);assert.equal(store.get().length,0);
});
test('staff journal merges legacy copies at the later age and retires only exact inspected bytes',async()=>{
 const f=staff();f.localStorage.setItem(f.key('client'),JSON.stringify([{operation_id:id,created_at:1}]));f.localStorage.setItem('legacy-client',JSON.stringify([{operation_id:id,created_at:3}]));
 assert.equal(f.store('client').get()[0].created_at,3);await f.store('client').remember(other);assert.equal(f.localStorage.getItem('legacy-client'),null);
 const second=staff(),legacy=JSON.stringify([{operation_id:id,created_at:3}]);second.localStorage.setItem('legacy-client',legacy);const original=second.localStorage.getItem;let reads=0;
 second.localStorage.getItem=name=>name==='legacy-client'&&++reads===2?JSON.stringify([{operation_id:id,created_at:4}]):original(name);
 await second.store('client').remember(other);assert.equal(original('legacy-client'),legacy,'A concurrent legacy writer must not be erased');
});
test('corrupt staff rows, oversized data and overflowing merged journals fail closed while retaining a prior safe snapshot',()=>{
 for(const raw of ['{',JSON.stringify({}),' '.repeat(8193),7,JSON.stringify([null]),JSON.stringify([{operation_id:id,created_at:0,extra:true}]),JSON.stringify([{operation_id:zero,created_at:0}]),JSON.stringify([{operation_id:id,created_at:-1}]),JSON.stringify([{operation_id:id,created_at:0.5}])]){
  const f=staff(),store=f.store('client');f.localStorage.setItem(f.key('client'),JSON.stringify([{operation_id:id,created_at:1}]));assert.equal(store.get().length,1);f.localStorage.setItem(f.key('client'),raw);assert.equal(store.get().length,1);assert.match(store.error,/could not safely save/);
 }
 const f=staff(),rows=Array.from({length:33},(_,index)=>({operation_id:`${String(index+1).padStart(8,'0')}-1111-4111-8111-111111111111`,created_at:1}));f.localStorage.setItem(f.key('client'),JSON.stringify(rows));assert.equal(f.store('client').get().length,0);assert.ok(f.store('client').error);
 const merged=staff();merged.localStorage.setItem(merged.key('client'),JSON.stringify(rows.slice(0,20)));merged.localStorage.setItem('legacy-client',JSON.stringify(rows.slice(20)));assert.equal(merged.store('client').get().length,0);assert.ok(merged.store('client').error);
});
test('staff changes refuse unavailable locks, discarded writes, failed retirement and full storage',async()=>{
 const unlocked=staff({locks:false});await assert.rejects(unlocked.store('client').remember(id),/could not safely save/);
 const discarded=staff();discarded.localStorage.setItem=()=>{};await assert.rejects(discarded.store('client').remember(id),/could not safely save/);
 const retirement=staff();retirement.localStorage.setItem('legacy-client',JSON.stringify([{operation_id:id,created_at:1}]));retirement.localStorage.removeItem=()=>{throw Error('synthetic refusal');};await assert.rejects(retirement.store('client').remember(other),/could not safely save/);
 const full=staff(),rows=Array.from({length:32},(_,index)=>({operation_id:`${String(index+1).padStart(8,'0')}-1111-4111-8111-111111111111`,created_at:1}));full.localStorage.setItem(full.key('client'),JSON.stringify(rows));await assert.rejects(full.store('client').remember(id),/could not safely save/);
});
test('staff check preserves unknown or mismatched outcomes and a recent missing action',async()=>{
 for(const result of [null,{operation_id:other,code:'cancelled'},{operation_id:id,code:'unexpected'}]){const f=staff(),store=f.store('client');await store.remember(id);await assert.rejects(store.check(async()=>result,['cancelled']),/earlier result/);assert.equal(store.get().length,1);}
 const f=staff(),store=f.store('client');await store.remember(id);await assert.rejects(store.check(async()=>({operation_id:id,code:'operation_not_found'}),[]),/still be finishing/);assert.equal(store.get().length,1);
 f.localStorage.setItem(f.key('client'),'bad');await assert.rejects(store.check(async()=>null,[]),/could not safely save/);
});
test('staff checks forget only resolved or mature-missing ids and stop on each loss of current authority',async()=>{
 for(const code of ['cancelled','operation_not_found']){const f=staff(),store=f.store('client');f.localStorage.setItem(f.key('client'),JSON.stringify([{operation_id:id,created_at:0}]));const values=await store.check(async({operation_id})=>({operation_id,code}),['cancelled']);assert.equal(values[0].operation_id,id);assert.equal(store.get().length,0);}
 for(const lossAfter of [0,1,2]){const f=staff(),store=f.store('client');await store.remember(id);let calls=0,authority=0;const result=await store.check(async({operation_id})=>{calls++;return {operation_id,code:'cancelled'};},['cancelled'],()=>authority++<lossAfter);assert.equal(result,null);assert.equal(calls,lossAfter===0?0:1);assert.equal(store.get().length,lossAfter<2?1:0);}
});
test('company journals distinguish mode and business commands without a memory fallback',()=>{
 const f=company();assert.equal(f.journal.read('mode'),null);assert.equal(f.journal.save('mode',command()).operation_id,id);assert.equal(f.journal.read('mode').enabled,true);
 const business={operation_id:other,revision:'2',settings:{timezone:'Asia/Kolkata'},reason:'Synthetic settings change'};assert.equal(f.journal.save('business',business).revision,'2');assert.equal(f.journal.read('business').settings.timezone,'Asia/Kolkata');assert.equal(f.journal.save('mode',null),null);assert.equal(f.journal.read('mode'),null);
 for(const scope of [null,[],{installation_id:zero,environment:'test'},{installation_id:id,environment:'bad'}])assert.throws(()=>company(scope).journal.read('mode'),/storage_unavailable/);assert.throws(()=>f.journal.read('other'),/storage_unavailable/);
});
test('company journal refuses malformed command values, scope, wrappers and oversized or unreadable storage',()=>{
 for(const change of [{operation_id:zero},{revision:1},{revision:'0'},{reason:''},{reason:'x'.repeat(301)},{extra:true},{generation:zero},{enabled:1}])assert.throws(()=>company().journal.save('mode',{...command(),...change}),/storage_unavailable/);
 assert.throws(()=>company().journal.save('business',{operation_id:id,revision:'1',settings:[],reason:'Synthetic change'}),/storage_unavailable/);
 for(const raw of ['{',' '.repeat(65537),7,JSON.stringify([]),JSON.stringify({version:1,installation_id:id,environment:'production',purpose:'mode',command:command()}),JSON.stringify({version:1,installation_id:id,environment:'test',purpose:'business',command:command()})]){const f=company();f.sessionStorage.setItem(f.key('mode'),raw);assert.throws(()=>f.journal.read('mode'),/storage_unavailable/);}
 const f=company();f.sessionStorage.getItem=()=>{throw Error('synthetic storage failure');};assert.throws(()=>f.journal.read('mode'),/storage_unavailable/);
});
test('company journal verifies actual storage writes and removals rather than claiming durable success',()=>{
 const discarded=company();discarded.sessionStorage.setItem=()=>{};assert.throws(()=>discarded.journal.save('mode',command()),/storage_unavailable/);
 const retained=company();retained.journal.save('mode',command());retained.sessionStorage.removeItem=()=>{};assert.throws(()=>retained.journal.save('mode',null),/storage_unavailable/);
 const refused=company();refused.sessionStorage.setItem=()=>{throw Error('synthetic write refusal');};assert.throws(()=>refused.journal.save('mode',command()),/storage_unavailable/);
});
