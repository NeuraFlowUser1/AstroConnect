// Official-origin reads and unsigned refusals; never a booking or provider job.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

export async function check(origin,request=fetch){
 assert.equal(new URL(origin).origin,origin);assert.equal(new URL(origin).protocol,'https:');
 const pages=['/','/about','/services','/contact','/privacy-policy','/terms-and-conditions','/refund-policy'];
 for(const path of pages){
  const response=await request(origin+path,{redirect:'error',signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,path);assert.match(response.headers.get('content-type')||'',/^text\/html/i,path);
 }
 const health=await request(origin+'/api/health',{redirect:'error',signal:AbortSignal.timeout(20000)});
 assert.equal(health.status,200);assert.deepEqual(await health.json(),{status:'online'});
 assert.match(health.headers.get('cache-control')||'',/no-store/i);
 const company=await request(origin+'/api/company/control/status',{redirect:'error',signal:AbortSignal.timeout(20000)});
 assert.equal(company.status,401,'Anonymous company authority must be denied');
 const studio=await request(origin+'/api/studio/status',{redirect:'error',signal:AbortSignal.timeout(20000)});
 assert.ok([401,404].includes(studio.status),'Anonymous staff must be denied; booking OFF may hide its studio');
 for(const path of ['/api/webhooks/razorpay','/api/webhooks/resend']){
  const response=await request(origin+path,{method:'POST',headers:{'content-type':'application/json'},body:'{}',redirect:'error',signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,400,'Unsigned event must be refused: '+path);
 }
 return {origin,passed:true,public_pages:pages.length,safe_api_reads:3,unsigned_refusals:2,customer_mutations:0,
  provider_dispatches:0,booking_on_asserted:false,qualification:false};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
 const profile=JSON.parse(readFileSync(resolve(root,'appointment-settings/project.json'),'utf8'));
 try{console.log(JSON.stringify(await check(profile.origin)));}catch(error){console.error(error.message);process.exitCode=1;}
}
