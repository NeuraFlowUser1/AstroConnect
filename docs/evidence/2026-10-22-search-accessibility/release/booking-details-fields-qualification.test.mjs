// Actual Chrome + exact copied shared React lookup. No provider/customer data.
import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const root=process.env.NEUTRAL_MEASUREMENT_ROOT,manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
const app=process.env.NEUTRAL_MEASUREMENT_APP,dependencies=path.join(app,'node_modules'),require=createRequire(path.join(app,'package.json'));
const {receipt,epoch}=await import(pathToFileURL(path.join(manifest.copy,'tests/booking-browser-fixture.mjs')).href);
let browser,server,origin;
before(async()=>{
 const {build}=await import(pathToFileURL(require.resolve('vite')).href),entry=path.join(app,'__qualification_details_vendor__.mjs');
 const built=await build({root:app,configFile:false,logLevel:'error',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'qualification-vendor',resolveId:id=>id===entry?'\0vendor':undefined,load:id=>id==='\0vendor'?"export * as React from 'react';export {createRoot} from 'react-dom/client';":undefined}],build:{write:false,minify:false,lib:{entry,formats:['es'],fileName:'vendor'},rollupOptions:{output:{inlineDynamicImports:true}}}});
 const vendor=(Array.isArray(built)?built[0]:built).output.find(item=>item.type==='chunk'&&item.isEntry).code;
 const id='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
 const value={...receipt(id),appointment_state:'confirmed',booking_revision:1,payment_state:'captured',captured_paise:210000,meeting_mode:'internal',acknowledgement_state:'delivered',meeting_email_state:'not_requested',payment_checked_at:null,payment_evidence_source:null};
 delete value.next_actions;
 const html=`<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Disconnected booking lookup</title></head><body><main id="root"></main><script type="module">
 import {React,createRoot} from '/vendor.mjs';import {createBookingDetailsFields} from '/browser/booking/booking-details-fields.mjs';
 const listeners=new Set(),base=${JSON.stringify(value)},id=${JSON.stringify(id)},other=${JSON.stringify(other)};let display={enabled:true,verified:true,checking:false,activation_epoch:${JSON.stringify(epoch)},foreground_revision:1};
 const product={getSnapshot:()=>display,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}};
 let scenario='empty',facts=structuredClone(base),active=true,introduction=null,pdfFailure=null,pending=null,pause=false;
 const calls=[];const summary=(request_id,state='confirmed')=>({request_id,booking_revision:1,service_name:'Synthetic '+state+' consultation',starts_at:base.starts_at,ends_at:base.ends_at,timezone:base.timezone,appointment_state:state});
 globalThis.fetch=async(path,options)=>{if(path!=='/api/booking/details')throw Error('Unexpected fixture destination');const body=JSON.parse(options.body);calls.push(body);if(pause)await new Promise(resolve=>pending=resolve);if(scenario==='error')return Response.json({code:'booking_not_found'},{status:404});
  if(body.request_id)return Response.json({version:1,kind:'detail',receipt:{...facts,request_id:body.request_id},capabilities:{refresh:true,download_pdf:facts.appointment_state==='confirmed'}});
  const items=scenario==='empty'?[]:scenario==='one'?[summary(id)]:body.cursor?[summary(other,'cancelled')]:[summary(id),summary(other,'held')];
  return Response.json({version:1,kind:'list',items,next_cursor:scenario==='many'&&!body.cursor?'next-page':null,server_now:base.server_now});};
 const loadPDF=async()=>{if(pdfFailure)throw Error(pdfFailure);const font={getCharacterSet:()=>Array.from({length:10000},(_,i)=>i),widthOfTextAtSize:(s,n)=>s.length*n*.4};return {PDFDocument:{create:async()=>({registerFontkit(){},embedFont:async()=>font,addPage:()=>({drawText(){},node:{set(){}}}),context:{register:x=>x,obj:x=>x},save:async()=>new Uint8Array([37,80,68,70])})},PDFName:{of:x=>x},PDFString:{of:x=>x},fontkit:{},fontBytes:new Uint8Array([1])};};
 const Fields=createBookingDetailsFields(React,{browser:{product},brand:'Synthetic practice',loadPDF,theme:'qualification'}),view=createRoot(document.getElementById('root'));
 const render=()=>view.render(React.createElement(Fields,{active,introduction}));
 window.proof={calls,scenario(value){scenario=value;},mode(value){display={...display,...value};for(const fn of listeners)fn();},props(value){if('active'in value)active=value.active;if('introduction'in value)introduction=value.introduction;render();},facts(value){facts={...facts,...value};},pdfFailure(value){pdfFailure=value;},pause(){pause=true;},release(){pause=false;pending?.();},unmount(){view.unmount();}};render();
 </script></body></html>`;
 server=createServer((req,res)=>{const pathname=new URL(req.url,'http://fixture.invalid').pathname;
  if(pathname==='/'){res.setHeader('content-type','text/html');return res.end(html);}if(pathname==='/vendor.mjs'){res.setHeader('content-type','text/javascript');return res.end(vendor);}
  if(/^\/browser\/[a-z0-9/-]+\.mjs$/.test(pathname)){res.setHeader('content-type','text/javascript');return res.end(fs.readFileSync(path.join(manifest.copy,pathname.slice(1))));}res.writeHead(404);res.end();});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin='http://127.0.0.1:'+server.address().port;
 const {chromium}=await import(pathToFileURL(path.join(dependencies,'playwright-core/index.mjs')).href);browser=await chromium.launch({headless:true,executablePath:process.env.BOOKING_CHROME_EXECUTABLE,args:['--no-sandbox']});
});
after(async()=>{await browser?.close();if(server)await new Promise(resolve=>server.close(resolve));});
async function pageFor(run){const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await context.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());try{await page.goto(origin);await page.getByLabel('Full name',{exact:true}).waitFor();await run(page);assert.deepEqual(errors,[]);}finally{await context.close();}}
async function identity(page){await page.getByLabel('Full name',{exact:true}).fill('Synthetic Patient');await page.getByLabel('Phone number',{exact:true}).fill('9876543210');}
async function search(page){await page.getByRole('button',{name:'View my bookings ↗',exact:true}).click();}
test('lookup fields label identity, focus corrections, switch country hints and keep inactive panels disabled',()=>pageFor(async page=>{
 assert.match(await page.locator('.abs-lookup-intro').innerText(),/saved full name/);await page.getByLabel('Full name',{exact:true}).fill('A');await page.getByLabel('Phone number',{exact:true}).fill('bad');await search(page);
 await page.getByRole('alert').waitFor();assert.equal(await page.getByLabel('Full name',{exact:true}).getAttribute('aria-invalid'),'true');assert.equal(await page.getByLabel('Full name',{exact:true}).evaluate(node=>node===document.activeElement),true);
 await page.getByLabel('Country',{exact:true}).selectOption('international');assert.equal(await page.getByLabel('Phone number',{exact:true}).getAttribute('placeholder'),'+country code and number');
 await page.evaluate(()=>proof.props({active:false,introduction:'Read-only appointment lookup'}));assert.equal(await page.locator('.abs-booking-details').isHidden(),true);
 await page.evaluate(()=>proof.props({active:true}));await page.getByText('Read-only appointment lookup',{exact:true}).waitFor();assert.equal(await page.locator('.abs-lookup-intro').count(),0);
 await page.evaluate(()=>proof.mode({checking:true}));assert.equal(await page.getByRole('button',{name:'View my bookings ↗',exact:true}).isDisabled(),true);
}));
test('empty and several-match results expose a readable list, pagination and deliberate selection',()=>pageFor(async page=>{
 await identity(page);await search(page);await page.getByRole('heading',{name:'No bookings found',exact:true}).waitFor();await page.getByText('Check the name and phone number entered when booking, then search again.',{exact:true}).waitFor();
 await page.evaluate(()=>proof.scenario('many'));await search(page);await page.getByRole('heading',{name:'Your bookings',exact:true}).waitFor();assert.equal(await page.locator('.abs-lookup-list li').count(),2);
 await page.getByRole('button',{name:'Show more bookings',exact:true}).click();await page.waitForFunction(()=>proof.calls.some(body=>body.cursor==='next-page'));
 await page.locator('.abs-lookup-list button').first().click();await page.getByRole('heading',{name:'Your appointment details',exact:true}).waitFor();await page.getByRole('button',{name:'Back to my bookings',exact:true}).click();await page.getByRole('heading',{name:'Your bookings',exact:true}).waitFor();
}));
test('confirmed detail exposes PDF error and ready Blob states; refresh refusal marks stale facts',()=>pageFor(async page=>{
 await page.evaluate(()=>proof.scenario('one'));await identity(page);await search(page);await page.getByRole('heading',{name:'Your appointment details',exact:true}).waitFor();
 await page.evaluate(()=>proof.pdfFailure('pdf_font_unavailable'));await page.getByRole('button',{name:'Download appointment PDF',exact:true}).click();await page.getByText('The PDF cannot display these details correctly. Please use the details on this page.',{exact:true}).waitFor();
 await page.evaluate(()=>proof.pdfFailure(null));await page.getByRole('button',{name:'Download appointment PDF',exact:true}).click();await page.getByRole('link',{name:'Download PDF',exact:true}).waitFor();assert.match(await page.getByRole('link',{name:'Open PDF',exact:true}).getAttribute('href'),/^blob:/);
 await page.evaluate(()=>proof.scenario('error'));await page.getByRole('button',{name:'Refresh details',exact:true}).click();await page.getByText('These are the last details we could read. Refresh before using a meeting link or downloading a PDF.',{exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'Download appointment PDF',exact:true}).isDisabled(),true);assert.equal(await page.getByRole('link',{name:'Open PDF',exact:true}).count(),0);
}));
test('busy lookup, PDF and permission transitions do not restore late or hidden private content',()=>pageFor(async page=>{
 await page.evaluate(()=>{proof.scenario('one');proof.pause();});await identity(page);await search(page);await page.getByRole('button',{name:'Finding your booking…',exact:true}).waitFor();await page.getByText('Checking the saved booking details…',{exact:true}).waitFor();
 await page.evaluate(()=>proof.mode({enabled:false}));await page.evaluate(()=>proof.release());await page.waitForFunction(()=>!document.querySelector('.abs-lookup-results'));assert.equal(await page.getByRole('button',{name:'View my bookings ↗',exact:true}).isDisabled(),true);
 await page.evaluate(()=>proof.mode({enabled:true}));await search(page);await page.getByRole('heading',{name:'Your appointment details',exact:true}).waitFor();
 await page.evaluate(()=>proof.facts({appointment_state:'cancelled'}));await page.getByRole('button',{name:'Refresh details',exact:true}).click();await page.getByText('Cancelled',{exact:true}).first().waitFor();assert.equal(await page.getByRole('button',{name:'Download appointment PDF',exact:true}).count(),0);await page.evaluate(()=>proof.unmount());assert.equal(await page.locator('#root').textContent(),'');
}));
