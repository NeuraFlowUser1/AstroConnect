// Disconnected qualification of exact copied RC3 modules; synthetic facts only.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const manifest=JSON.parse(fs.readFileSync(path.join(process.env.NEUTRAL_MEASUREMENT_ROOT,'manifest.json')));
const load=relative=>import(pathToFileURL(path.join(manifest.copy,relative)).href);
const {createBookingDetails,lookupIdentity,bookingStateLabel}=await load('browser/booking/booking-details.mjs');
const {createBookingDetailsPDF}=await load('browser/booking/booking-details-pdf.mjs');
const {receipt,epoch}=await load('tests/booking-browser-fixture.mjs');
const id='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const keys='acknowledgement_state,amount_paise,appointment_state,booking_revision,captured_paise,currency,ends_at,hold_expires_at,meet_url,meeting_email_state,meeting_mode,meeting_state,order_state,payment_checked_at,payment_evidence_source,payment_state,refunded_paise,request_id,server_now,service_name,starts_at,timezone'.split(',');
function facts(change={}){const value={...receipt(id),appointment_state:'confirmed',booking_revision:1,payment_state:'captured',captured_paise:210000,
 meeting_mode:'internal',acknowledgement_state:'delivered',meeting_email_state:'not_requested',payment_checked_at:null,payment_evidence_source:null,...change};return Object.fromEntries(keys.map(key=>[key,value[key]]));}
function row(request_id=id,change={}){const value=facts({request_id,...change});return Object.fromEntries('appointment_state,booking_revision,ends_at,request_id,service_name,starts_at,timezone'.split(',').map(key=>[key,value[key]]));}
const list=(items=[],next_cursor=null)=>({version:1,kind:'list',items,next_cursor,server_now:facts().server_now});
const detail=(change={})=>{const value=facts(change);return {version:1,kind:'detail',receipt:value,capabilities:{refresh:true,download_pdf:value.appointment_state==='confirmed'}};};
function productFixture(){let value={enabled:true,verified:true,checking:false,activation_epoch:epoch,foreground_revision:1};const listeners=new Set();return {getSnapshot:()=>value,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},change:change=>{value={...value,...change};for(const fn of [...listeners])fn();},listeners};}
function fixture(t,{start=true}={}){
 const product=productFixture(),window=new EventTarget(),calls=[];let reply=()=>list();
 const controller=createBookingDetails({product,fetcher:async(url,options)=>{const body=JSON.parse(options.body);calls.push({url,body,signal:options.signal});const value=await reply(body,options);return value instanceof Response?value:Response.json(value);}});
 let stop=start?controller.start(window):null;t.after(()=>stop?.());
 const identity=()=>{controller.edit('full_name','Synthetic Patient');controller.edit('phone','9876543210');};
 return {controller,product,window,calls,identity,reply:fn=>{reply=fn;},start:()=>{stop=controller.start(window);return stop;},stop:()=>stop?.(),state:()=>controller.getSnapshot()};
}

test('lookup normalizes valid saved phones and rejects malformed identity without any read',()=>{
 assert.deepEqual(lookupIdentity({full_name:'  Synthetic Patient ',phone:'98765 43210',country:'+91'}),{full_name:'  Synthetic Patient ',phone:'+919876543210'});
 assert.equal(lookupIdentity({full_name:'Synthetic Patient',phone:'+44 (1234) 567890',country:'international'}).phone,'+441234567890');
 for(const input of [{full_name:'A'},{full_name:'a'.repeat(101)},{full_name:'Name\u007f'},{full_name:9},{phone:'abc'},{phone:'+000000000'},{phone:'9'.repeat(33)},{country:'international'},{country:'bad'}])
  assert.throws(()=>lookupIdentity({full_name:'Synthetic Patient',phone:'9876543210',country:'+91',...input}),error=>error.code==='invalid_request'&&error.fields.length>0);
 assert.equal(lookupIdentity({full_name:'Synthetic\tPatient',phone:'9876543210',country:'+91'}).full_name,'Synthetic\tPatient');
 for(const state of ['held','expired','confirmed','cancelled','payment_review','unknown'])assert.ok(bookingStateLabel(state).length>0);
});
test('inactive, stopped, checking and duplicate actions never read or retain customer facts',async t=>{
 const f=fixture(t,{start:false});f.identity();await f.controller.search();assert.equal(f.calls.length,0);const stop=f.start();assert.equal(f.start(),stop);
 f.controller.setActive(false);await f.controller.search();assert.equal(f.calls.length,0);f.controller.setActive(true);
 f.product.change({checking:true});await f.controller.search();assert.equal(f.calls.length,0);f.product.change({checking:false});
 const pending=deferred();f.reply(()=>pending.promise);const task=f.controller.search();await tick();await f.controller.search();await f.controller.more();assert.equal(f.calls.length,1);
 pending.resolve(list());await task;assert.equal(f.state().status,'empty');f.stop();await f.controller.search();assert.equal(f.calls.length,1);
});
test('invalid fields focus the first correction and unknown edits do not change the lookup',async t=>{
 const f=fixture(t),before=f.state();f.controller.edit('credential','secret');assert.equal(f.state(),before);
 await f.controller.search();assert.equal(f.calls.length,0);assert.deepEqual(f.state().fields,['full_name','phone']);assert.equal(f.state().focusTarget,'full_name');
 f.controller.edit('full_name','Synthetic Patient');await f.controller.search();assert.deepEqual(f.state().fields,['phone']);assert.equal(f.state().focusTarget,'phone');
});
test('list pagination deduplicates owned rows and an empty continuation asks for a new search',async t=>{
 const f=fixture(t);f.identity();let page=0;f.reply(()=>++page===1?list([row()], 'page-2'):page===2?list([row(),row(other)],'page-3'):list());
 let notices=0;const unsubscribe=f.controller.subscribe(()=>notices++);await f.controller.search();assert.equal(f.state().status,'list');assert.equal(f.state().receipt,null);
 await f.controller.more();assert.deepEqual(f.state().items.map(item=>item.request_id),[id,other]);assert.equal(f.calls[1].body.cursor,'page-2');
 await f.controller.more();assert.match(f.state().error,/list changed/);assert.equal(f.state().nextCursor,null);await f.controller.more();assert.equal(f.calls.length,3);
 assert.ok(notices>0);unsubscribe();
});
test('a unique result opens read-only details, refreshes, returns to its list and cannot open a foreign id',async t=>{
 const f=fixture(t);f.identity();f.reply(body=>body.request_id?detail():list([row()]));await f.controller.search();
 assert.equal(f.state().status,'detail');assert.equal(f.state().receipt.request_id,id);assert.equal(f.calls.length,2);
 assert.ok(f.calls.every(call=>call.url==='/api/booking/details'&&!('secret' in call.body)&&!('credential' in call.body)));
 await f.controller.refresh();assert.equal(f.calls.length,3);f.controller.back();assert.equal(f.state().receipt,null);assert.equal(f.state().status,'list');
 await f.controller.open(other);assert.equal(f.calls.length,3);await f.controller.open(id);assert.equal(f.calls.length,4);
});
test('several matches require deliberate selection and rejected detail stays stale',async t=>{
 const f=fixture(t);f.identity();f.reply(body=>body.request_id?new Response(JSON.stringify({code:'booking_not_found'}),{status:404,headers:{'content-type':'application/json'}}):list([row(),row(other)]));
 await f.controller.search();assert.equal(f.calls.length,1);await f.controller.open(id);assert.equal(f.state().receipt,null);assert.equal(f.state().stale,true);assert.match(f.state().error,/could not find/);
 await assert.rejects(f.controller.refresh(),error=>error.code==='access_unavailable');
});
test('read errors present bounded corrections and never reveal an arbitrary server message',async t=>{
 for(const [code,message]of [['invalid_request','check your full name'],['invalid_name','full name saved'],['invalid_cursor','list has changed'],['please_wait','wait 7 seconds'],['other','could not check']]){
  const f=fixture(t);f.identity();f.reply(()=>new Response(JSON.stringify({code,fields:['phone','unknown'],retry_after:7,message:'PRIVATE UNTRUSTED'}),{status:429,headers:{'content-type':'application/json','retry-after':'7'}}));
  await f.controller.search();assert.match(f.state().error,new RegExp(message));assert.doesNotMatch(f.state().error,/PRIVATE/);assert.equal(f.state().busy,false);
 }
});
test('list validation refuses extra fields, duplicate rows, invalid cursor, time zone and interval',async t=>{
 const changes=[value=>({...value,extra:true}),value=>({...value,version:2}),value=>({...value,items:[row(),row()]}),value=>({...value,next_cursor:'!'}),
  value=>({...value,items:[row(id,{timezone:'not-a-zone'})]}),value=>({...value,items:[row(id,{ends_at:facts().starts_at})]}),
  value=>({...value,items:[row('00000000-0000-0000-0000-000000000000')]}),value=>({...value,items:[row(id,{booking_revision:0})]}),
  value=>({...value,items:[row(id,{service_name:''})]}),value=>({...value,items:[row(id,{appointment_state:'other'})]}),value=>({...value,items:null}),value=>({...value,server_now:'bad'})];
 for(const change of changes){const f=fixture(t);f.identity();f.reply(()=>change(list()));await f.controller.search();assert.equal(f.state().receipt,null);assert.match(f.state().error,/could not check/);}
});
test('detail validation refuses unsupported capability, extra facts and revision or identity confusion',async t=>{
 const changes=[value=>({...value,extra:true}),value=>({...value,capabilities:{refresh:false,download_pdf:true}}),value=>({...value,capabilities:{refresh:true,download_pdf:false}}),
  value=>({...value,receipt:{...value.receipt,extra:true}}),value=>({...value,receipt:{...value.receipt,booking_revision:0}}),value=>({...value,receipt:{...value.receipt,meeting_mode:'other'}}),
  value=>({...value,receipt:{...value.receipt,request_id:other}})];
 for(const change of changes){const f=fixture(t);f.identity();f.reply(body=>body.request_id?change(detail()):list([row()]));await f.controller.search();assert.equal(f.state().receipt,null);assert.match(f.state().error,/could not check/);}
});
test('permission, activation, foreground, page hide and persisted return erase previous private details',async t=>{
 for(const event of ['off','epoch','foreground','hide','return']){
  const f=fixture(t);f.identity();f.reply(body=>body.request_id?detail():list([row()]));await f.controller.search();assert.ok(f.state().receipt);
  if(event==='off')f.product.change({enabled:false});else if(event==='epoch')f.product.change({activation_epoch:other});else if(event==='foreground')f.product.change({foreground_revision:2});
  else {const signal=new Event(event==='hide'?'pagehide':'pageshow');signal.persisted=event==='return';f.window.dispatchEvent(signal);}
  assert.equal(f.state().receipt,null);assert.equal(f.state().status,'idle');assert.equal(f.state().input.full_name,event==='hide'||event==='return'?'':'Synthetic Patient');
 }
});
test('a late list or detail cannot restore private content after a new lookup, inactive panel or OFF',async t=>{
 for(const kind of ['list','detail'])for(const clear of ['edit','inactive','off']){
  const f=fixture(t),pending=deferred();f.identity();f.reply(body=>kind==='list'||body.request_id?pending.promise:list([row()]));const task=f.controller.search();await tick();
  if(clear==='edit')f.controller.edit('phone','9123456789');else if(clear==='inactive')f.controller.setActive(false);else f.product.change({enabled:false});
  pending.resolve(kind==='list'?list([row()]):detail());await task;assert.equal(f.state().receipt,null);assert.equal(f.state().status,'idle');assert.equal(f.state().busy,false);
 }
});
test('refresh abort signals and a pending read prevent overlapping PDF/detail reads',async t=>{
 const f=fixture(t);f.identity();f.reply(body=>body.request_id?detail():list([row()]));await f.controller.search();
 const pending=deferred();f.reply(()=>pending.promise);const abort=new AbortController(),task=f.controller.refresh({signal:abort.signal});await tick();
 await assert.rejects(f.controller.refresh(),error=>error.code==='request_cancelled');abort.abort();pending.resolve(detail());await task.catch(()=>{});
 assert.equal(f.state().busy,false);const stopped=new AbortController();stopped.abort();await f.controller.refresh({signal:stopped.signal}).catch(()=>{});assert.equal(f.state().busy,false);
});

function pdfFixture(t,{loadPDF}={}){
 const product=productFixture(),listeners=new Set(),revoked=[];let value={receipt:facts(),stale:false},reads=0,refresh=async()=>{reads++;return value.receipt;};
 const controller={getSnapshot:()=>value,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},refresh:options=>refresh(options)};
 const font={getCharacterSet:()=>Array.from({length:10000},(_,index)=>index),widthOfTextAtSize:(text,size)=>text.length*size*.4};
 const pdfLibrary=()=>({PDFDocument:{create:async()=>({registerFontkit(){},embedFont:async()=>font,addPage:()=>({drawText(){},node:{set(){}}}),context:{register:value=>value,obj:value=>value},save:async()=>new Uint8Array([37,80,68,70])})},PDFName:{of:value=>value},PDFString:{of:value=>value},fontkit:{},fontBytes:new Uint8Array([1])});
 const pdf=createBookingDetailsPDF({controller,product,brand:'Synthetic practice',loadPDF:loadPDF||pdfLibrary,urls:{createObjectURL:()=> 'blob:synthetic',revokeObjectURL:value=>revoked.push(value)}});
 const stop=pdf.start();t.after(stop);return {pdf,product,controller,revoked,reads:()=>reads,stop,pdfLibrary,refresh:fn=>{refresh=fn;},set:change=>{value={...value,...change};for(const fn of [...listeners])fn();}};
}
test('lookup PDF reads twice, exposes an owned Blob, reuses only matching facts and revokes on loss',async t=>{
 const f=pdfFixture(t);assert.equal(f.pdf.start(),f.stop);assert.equal(f.pdf.canOpen(),false);let notifications=0;const unsubscribe=f.pdf.subscribe(()=>notifications++);
 await f.pdf.pdf();assert.equal(f.reads(),2);assert.equal(f.pdf.canOpen(),true);assert.match(f.pdf.getSnapshot().filename,/appointment-/);assert.match(f.pdf.getSnapshot().message,/ready/);
 await f.pdf.pdf();assert.equal(f.reads(),4);assert.ok(f.revoked.length>0);f.product.change({checking:true});assert.equal(f.pdf.canOpen(),false);assert.equal(f.pdf.getSnapshot().pdfURL,null);
 await f.pdf.pdf();assert.equal(f.reads(),4);assert.ok(notifications>0);unsubscribe();
});
test('lookup PDF cannot survive changed receipt facts, absent receipt, stale detail or nonconfirmed status',async t=>{
 for(const change of [{receipt:facts({booking_revision:2})},{receipt:null},{stale:true},{receipt:facts({appointment_state:'cancelled'})}]){
  const f=pdfFixture(t);await f.pdf.pdf();f.set(change);assert.equal(f.pdf.canOpen(),false);assert.equal(f.pdf.getSnapshot().pdfURL,null);
 }
});
test('PDF failures explain font, changed receipt and generic refusal without exposing raw messages',async t=>{
 for(const [error,expected]of [['pdf_font_unavailable',/cannot display/],['receipt_changed',/appointment changed/],['PRIVATE PROVIDER FAILURE',/could not prepare/]]){
  const f=pdfFixture(t,{loadPDF:()=>{throw Error(error);}});await f.pdf.pdf();assert.match(f.pdf.getSnapshot().error,expected);assert.equal(f.pdf.getSnapshot().pdfURL,null);assert.equal(f.pdf.getSnapshot().busy,false);
 }
});
test('PDF double clicks share work and disposal or a changed selection discards late generated bytes',async t=>{
 for(const end of ['dispose','selection','epoch']){
  const pending=deferred(),f=pdfFixture(t,{loadPDF:()=>pending.promise});const task=f.pdf.pdf();await tick();await f.pdf.pdf();assert.equal(f.reads(),1);
  if(end==='dispose')f.stop();else if(end==='selection')f.set({receipt:facts({request_id:other})});else f.product.change({activation_epoch:other});
  pending.resolve(f.pdfLibrary());await task;assert.equal(f.pdf.canOpen(),false);assert.equal(f.pdf.getSnapshot().pdfURL,null);
 }
});
