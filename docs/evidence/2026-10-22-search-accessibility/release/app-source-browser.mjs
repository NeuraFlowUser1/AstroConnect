// Actual local app pages and controls; external destinations are always blocked.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const here=path.dirname(fileURLToPath(import.meta.url)),app=path.resolve(here,'../../../..'),out=path.join(app,'verification-results/app-source-coverage-rc3'),site=path.join(out,'compiled'),require=createRequire(path.join(app,'package.json'));
const {createCoverageMap}=require('istanbul-lib-coverage'),map=createCoverageMap({});
const {chromium}=await import(pathToFileURL(path.join(app,'node_modules/playwright-core/index.mjs')).href),{displayProof}=await import(pathToFileURL(path.join(app,'appointment-system/tools/checks/website-display.mjs')).href),{publicPages}=await import(pathToFileURL(path.join(app,'src/data/page-metadata.mjs')).href);
const browser=await chromium.launch({headless:true,executablePath:'/home/anan/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',args:['--no-sandbox']}),observations=[],proofs=[];
async function collect(page){map.merge(await page.evaluate(()=>globalThis.__astroCoverage__||{}));}
async function prepare(context,proof){await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!==proof.origin)return route.abort();if(url.pathname==='/api/contact/policy')return route.fulfill({contentType:'application/json',body:'{"version":1,"receipt_key_id":"current"}'});return route.continue();});}
async function settled(page){await page.waitForFunction(()=>document.documentElement.dataset.publicBound==='true');await page.waitForTimeout(100);}
async function scroll(page){for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=700){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(20);}await page.evaluate(()=>scrollTo(0,0));}
async function publicControls(page,route,width){
 if(route==='/'){
  const choices=page.locator(width<1024?'.home-service-tabs-mobile button':'.home-services-desktop button[aria-pressed]');for(let i=0;i<await choices.count();i++){await choices.nth(i).click();await page.waitForTimeout(50);}
  const pause=page.locator('.home-reviews-phone-control');if(await pause.isVisible()){await pause.click();await pause.click();}
 }
 if(route==='/about'){const dots=page.getByRole('button',{name:/^Go to certificate /});for(let i=0;i<await dots.count();i++)await dots.nth(i).click();}
 if(route==='/services/numerology'){
  const cards=page.locator('.number-reveal-toggle');for(let i=0;i<await cards.count();i++){await cards.nth(i).scrollIntoViewIfNeeded();await cards.nth(i).hover();await cards.nth(i).click();await cards.nth(i).press('Enter');await page.mouse.move(1,1);}
 }
 if(route==='/services/vedic-astrology'){
  const choices=page.locator('button[aria-controls="vedic-benefit-detail"]');for(let i=0;i<await choices.count();i++){await choices.nth(i).click();await choices.nth(i).focus();}await page.mouse.move(1,1);await page.locator('body').click({position:{x:2,y:2}});
 }
 if(route==='/services/laal-kitaab'){
  const tabs=page.getByRole('tab');for(let i=0;i<await tabs.count();i++)await tabs.nth(i).click();for(const key of ['Home','End','ArrowLeft','ArrowRight','Enter',' '])await page.keyboard.press(key);assert.equal(await page.getByRole('tab',{selected:true}).count(),1);
 }
 if(route==='/testimonials'){
  await page.getByRole('button',{name:'Next Testimonial',exact:true}).click();await page.getByRole('button',{name:'Previous Testimonial',exact:true}).click();const dots=page.getByRole('button',{name:/^Go to testimonial /});for(let i=0;i<await dots.count();i++)await dots.nth(i).click();
  const filters=page.locator('button[aria-controls="testimonials-review-results"]');for(let i=0;i<await filters.count();i++)await filters.nth(i).click();await page.getByRole('link',{name:'Explore the stories',exact:false}).click();
 }
 if(route==='/contact'){
  const faqs=page.locator('button[aria-expanded]');for(let i=0;i<await faqs.count();i++){if(await faqs.nth(i).isVisible()){await faqs.nth(i).click();await faqs.nth(i).click();}}
  await page.locator('.contact-message-form button[type=submit]').click();await page.locator('#email').fill('bad');await page.locator('#phone').fill('bad');assert.equal(await page.locator('#phone').inputValue(),'bad');assert.equal(await page.locator('#phone').evaluate(node=>node===document.activeElement),true,'Live correction must not steal typing focus');
 }
}
try{
 for(const enabled of [true,false]){
  const proof=await displayProof(app,site,{enabled});proofs.push(proof);
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});await prepare(context,proof);
   for(const route of Object.keys(publicPages)){
    const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(proof.origin+route);await settled(page);await scroll(page);await publicControls(page,route,width);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);await collect(page);observations.push({route,width,enabled,reduced:true,errors:0});await page.close();
   }
   await context.close();
  }
 }
 // Normal motion, visibility changes and navigation cleanup use real events.
 const proof=proofs[0],context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});await prepare(context,proof);const page=await context.newPage();
 for(const route of ['/','/about','/services/vedic-astrology','/testimonials']){
  await page.goto(proof.origin+route);await settled(page);await scroll(page);await page.waitForTimeout(route==='/about'?4500:3300);
  await page.mouse.move(300,300);await page.mouse.move(900,500);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'hidden',{value:false,configurable:true});document.dispatchEvent(new Event('visibilitychange'));window.dispatchEvent(new Event('resize'));});await collect(page);observations.push({route,width:1440,enabled:true,reduced:false,visibilityAndResize:true});
 }
 await page.goto(proof.origin+'/');await settled(page);const desktop=page.locator('#desktop-services-trigger');await desktop.hover();await desktop.click();await desktop.press('ArrowDown');await page.keyboard.press('Escape');await page.locator('body').click({position:{x:2,y:2}});await collect(page);
 await context.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true,isMobile:true});await prepare(mobile,proof);const phone=await mobile.newPage();await phone.goto(proof.origin+'/');await settled(phone);await phone.getByRole('button',{name:'Open menu',exact:true}).click();await phone.locator('#mobile-services-trigger').click();await phone.keyboard.press('Escape');await phone.keyboard.press('Escape');await phone.getByRole('button',{name:'Open menu',exact:true}).click();await phone.locator('#mobile-navigation').getByRole('link',{name:'About',exact:true}).click();await phone.waitForURL('**/about');await collect(phone);await mobile.close();
 fs.writeFileSync(path.join(out,'pools/browser.json'),JSON.stringify(map.toJSON()));fs.writeFileSync(path.join(out,'browser-result.json'),JSON.stringify({passed:true,observations,providerCalls:0,externalCallsBlocked:true},null,2));console.log(JSON.stringify({passed:true,observations:observations.length,owners:map.files().length,providerCalls:0}));
}finally{await browser.close();for(const proof of proofs)await proof.close();}
