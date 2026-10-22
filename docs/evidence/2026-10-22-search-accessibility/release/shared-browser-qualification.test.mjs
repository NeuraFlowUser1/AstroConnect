// Exact copied browser modules and a disconnected DOM; no service/provider read.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const manifest=JSON.parse(fs.readFileSync(path.join(process.env.NEUTRAL_MEASUREMENT_ROOT,'manifest.json'))),app=process.env.NEUTRAL_MEASUREMENT_APP;
const load=relative=>import(pathToFileURL(path.join(manifest.copy,relative)).href),require=createRequire(path.join(app,'package.json')),{JSDOM}=require('jsdom');
const {bindVisibility}=await load('browser/visibility.mjs');
const {localDate,money,appointmentLabel,timeLabel,dateRange}=await load('browser/display-formatting.mjs');
const {startWhenBookingOn}=await load('browser/conditional-work.mjs');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(){const dom=new JSDOM('<html><body><div data-booking-only>Booking action</div><span data-booking-on="Book now" data-booking-off="Contact us"></span></body></html>'),listeners=new Set();let snapshot={enabled:false,verified:true,checking:false},observer,starts=0,stops=0;
 const state={getSnapshot:()=>snapshot,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);},refresh:()=> 'synthetic-refresh',start:(window,document,{profile})=>{assert.equal(profile,'public');starts++;return()=>stops++;}};
 class Observer{constructor(fn){this.fn=fn;observer=this;}observe(root,options){assert.equal(root,dom.window.document.documentElement);assert.deepEqual(options,{childList:true,subtree:true});}disconnect(){this.disconnected=true;}}
 return {window:dom.window,document:dom.window.document,state,Observer,observer:()=>observer,starts:()=>starts,stops:()=>stops,change:value=>{snapshot={...snapshot,...value};for(const fn of listeners)fn();},listeners};}
test('explicit visibility lifetime shares one owner, updates text only as needed and releases every listener',()=>{
 const f=fixture(),events=[];f.window.addEventListener('booking:visibility',event=>events.push(event.detail.enabled));
 const dispose=bindVisibility({state:f.state,windowObject:f.window,documentObject:f.document,Observer:f.Observer});assert.equal(bindVisibility({state:f.state,windowObject:f.window,documentObject:f.document,Observer:f.Observer}),dispose);assert.equal(f.starts(),1);
 assert.equal(f.document.querySelector('[data-booking-only]').hidden,true);assert.equal(f.document.querySelector('[data-booking-only]').inert,true);assert.equal(f.document.querySelector('span').textContent,'Contact us');assert.equal(f.window.bookingVisibility.enabled(),false);assert.equal(f.window.bookingVisibility.refresh(),'synthetic-refresh');
 f.change({enabled:true});assert.equal(f.document.documentElement.dataset.bookingState,'on');assert.equal(f.document.querySelector('[data-booking-only]').hidden,false);assert.equal(f.document.querySelector('span').textContent,'Book now');f.observer().fn();assert.deepEqual(events,[false,true,true]);
 dispose();dispose();assert.equal(f.stops(),1);assert.equal(f.listeners.size,0);assert.equal(f.observer().disconnected,true);assert.equal('bookingVisibility'in f.window,false);f.window.close();
});
test('disposing an older visibility binding never deletes a newer window-owned view',()=>{const f=fixture(),dispose=bindVisibility({state:f.state,windowObject:f.window,documentObject:f.document,Observer:f.Observer}),newer={enabled:()=>false};f.window.bookingVisibility=newer;dispose();assert.equal(f.window.bookingVisibility,newer);f.window.close();});
test('shared display formatting handles default and explicit time zones, paise and date horizons',()=>{
 assert.match(localDate(),/^\d{4}-\d\d-\d\d$/);assert.equal(localDate('2026-10-03T23:30:00Z','Asia/Kolkata'),'2026-10-04');
 assert.match(money(100),/1/);assert.match(money(150),/1\.50/);assert.ok(appointmentLabel('2026-10-03T05:00:00Z').length>0);assert.ok(timeLabel('2026-10-03T05:00:00Z').length>0);
 assert.deepEqual(dateRange({server_now:'2026-10-03T05:00:00Z',policy:{timezone:'Asia/Kolkata',horizon_days:2}}),{first_date:'2026-10-03',last_date:'2026-10-05',timezone:'Asia/Kolkata'});
});
test('optional browser loading rejects stale imports and can retry a failed import only after a new state signal',async()=>{
 const listeners=new Set();let snapshot={enabled:true,verified:true,checking:false,activation_epoch:'synthetic'},loads=0,starts=0,stops=0,resolve;
 const state={getSnapshot:()=>snapshot,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn);}};
 const notify=change=>{snapshot={...snapshot,...change};for(const fn of listeners)fn();};
 const end=startWhenBookingOn(()=>{loads++;if(loads===1)return Promise.reject(Error('synthetic unavailable'));return new Promise(done=>{resolve=done;});},{state});await tick();assert.equal(loads,1);assert.equal(starts,0);
 notify({enabled:true});await tick();assert.equal(loads,2);notify({enabled:false});resolve(()=>{starts++;return()=>stops++;});await tick();assert.equal(starts,0);end();assert.equal(listeners.size,0);assert.equal(stops,0);
});
