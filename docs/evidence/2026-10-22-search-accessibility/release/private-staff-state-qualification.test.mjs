// Native private-page refusal/cleanup cases around the exact copied shared UI.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const manifest=JSON.parse(fs.readFileSync(path.join(process.env.NEUTRAL_MEASUREMENT_ROOT,'manifest.json')));
const {staffFixture,id,other,waitText,within}=await import(pathToFileURL(path.join(manifest.copy,'tests/staff-page-fixture.mjs')).href);
const record=()=>({code:'ok',reference:id,claim_id:other,revision:2,name:'Synthetic Patient',service:'Synthetic consultation',state:'confirmed',starts_at:'2031-04-04T10:30:00Z',can_cancel:true,can_reschedule:true,policy_guidance:'staff_review',email:'fixture@example.test',phone:'+919999999999',unresolved_payments:0,payments:[{payment_id:'pay_fixture',status:'captured',amount_paise:100,refunded_paise:0,observed_at:'2031-04-01T10:30:00Z'}]});
async function lookup(page,state,value=record()){state.handlers.set('/api/studio/appointments/lookup',({reply})=>reply(value));state.handlers.set('/api/studio/appointments/detail',({reply})=>reply(value));await page.fill('#booking-reference',id);await page.locator('#booking-lookup button').click();await page.locator('#booking-support').waitFor();}
async function open(page,state){await lookup(page,state);await page.click('#booking-support-manage');await page.locator('#appointment-cancel').waitFor();}
test('all private appointment triggers refuse overlapping calendar or appointment work and a non-client role',()=>staffFixture(async(page,state)=>{
 const before=state.calls.filter(call=>call.path.startsWith('/api/studio/appointments/')).length;
 for(const flag of ['busy','calendar','appointment','none']){
  await page.evaluate(flag=>{busy=flag==='busy';calendarPending=flag==='calendar'?{operation_id:'synthetic'}:null;appointmentPending=flag==='appointment'?{operation_id:'synthetic'}:null;
   document.dispatchEvent(new CustomEvent('studio-appointment',{detail:'22222222-2222-4222-8222-222222222222'}));
   if(flag==='none')return;
   for(const name of ['booking-lookup','appointment-cancel','appointment-reschedule','booking-support-change'])document.getElementById(name).dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
   document.dispatchEvent(new CustomEvent('studio-booking-reference',{detail:'11111111-1111-4111-8111-111111111111'}));
  },flag);
  if(flag==='none')break;
 }
 // The final deliberate detail trigger is allowed; the overlapping triggers above are not.
 await page.waitForFunction(()=>!busy);assert.equal(state.calls.filter(call=>call.path.startsWith('/api/studio/appointments/')).length,before+1);
 await page.evaluate(()=>{document.dispatchEvent(new CustomEvent('studio-role',{detail:'staff'}));for(const name of ['booking-lookup','appointment-cancel','appointment-reschedule','booking-support-change'])document.getElementById(name).dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.dispatchEvent(new CustomEvent('studio-appointment',{detail:'22222222-2222-4222-8222-222222222222'}));document.dispatchEvent(new CustomEvent('studio-booking-reference',{detail:'11111111-1111-4111-8111-111111111111'}));});
 assert.equal(state.calls.filter(call=>call.path.startsWith('/api/studio/appointments/')).length,before+1);
}));
test('booking shortcuts preserve absent contacts and timeless payment observations without inventing permissions',()=>staffFixture(async(page,state)=>{
 const value={...record(),email:null,contact_email_required:false,claim_id:null,payments:[{payment_id:'pay_a',status:'pending',amount_paise:100,refunded_paise:0,observed_at:null},{payment_id:'pay_b',status:'captured',amount_paise:100,refunded_paise:0,observed_at:'invalid-time'}]};
 state.handlers.set('/api/studio/appointments/lookup',({reply})=>reply(value));await page.evaluate(reference=>document.dispatchEvent(new CustomEvent('studio-booking-reference',{detail:reference})),id);await page.locator('#booking-support').waitFor();
 assert.match(await page.locator('#booking-support-content').textContent(),/Email: Not provided/);assert.equal(await page.locator('#support-email').getAttribute('required'),null);assert.equal(await page.locator('#booking-support-manage').isHidden(),true);
 assert.match(await page.locator('#booking-support-content').textContent(),/pay_a/);assert.doesNotMatch(await page.locator('#booking-support-content').textContent(),/Invalid Date/);
 // The existing change event must retain optional-email semantics.
 await page.locator('#support-action').dispatchEvent('change');assert.equal(await page.locator('#support-email').getAttribute('required'),null);
}));
test('no starting time and a late practice-time resolution cannot submit a move after permission loss',()=>staffFixture(async(page,state)=>{
 await open(page,state);await page.locator('#appointment-reschedule').evaluate(form=>form.dispatchEvent(new Event('submit',{cancelable:true})));assert.equal(state.calls.filter(call=>call.path.endsWith('/reschedule')).length,0);
 const received=Promise.withResolvers();state.handlers.set('/api/studio/calendar/resolve-time',({reply})=>received.resolve(()=>reply({code:'ok',local:'2031-04-05T17:00',timezone:'Asia/Kolkata',instant:'2031-04-05T11:30:00Z'})));
 await page.fill('#appointment-start','2031-04-05T17:00');await page.fill('#appointment-move-reason','Synthetic time request');await page.locator('#appointment-reschedule button').click();const finish=await within(received.promise);
 await page.evaluate(()=>document.dispatchEvent(new CustomEvent('studio-role',{detail:null})));finish();await page.waitForTimeout(50);assert.equal(state.calls.filter(call=>call.path.endsWith('/reschedule')).length,0);assert.equal(await page.locator('#appointment-summary').textContent(),'');
}));
test('a known support rejection cannot erase its uncertain marker when browser storage fails during cleanup',()=>staffFixture(async(page,state)=>{
 await lookup(page,state);await page.fill('#support-payment','pay_fixture');await page.fill('#support-reason','Synthetic verified evidence');await page.check('#support-verified');
 state.handlers.set('/api/studio/appointments/support',async({reply})=>{await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Synthetic cleanup failure');};});reply({code:'support_verification_unavailable'},409);});
 await page.locator('#booking-support-change button').click();await waitText(page,'#appointment-status','could not safely save');assert.equal(await page.evaluate(()=>window.PracticeStaffActions('client').get().length),1);assert.equal(state.calls.filter(call=>call.path.endsWith('/appointments/support')).length,1);
}));
