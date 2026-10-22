// Official-origin GETs and unsigned refusals only. No customer action/provider dispatch.
import {writeFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {origin,publicPages,metadataFor,shareImage} from '../../../../src/data/page-metadata.mjs';
const output=new URL('./hosted-readback.json',import.meta.url);
const report={observed_at:new Date().toISOString(),origin,public:[],utilities:[],resources:[],refusals:[],failures:[],customer_actions:0,provider_dispatch:0};
async function read(path){return fetch(new URL(path,origin),{redirect:'manual',signal:AbortSignal.timeout(25000)});}
function check(ok,label){if(!ok)report.failures.push(label);}
for(const path of Object.keys(publicPages)){
 try{
  const response=await read(path),html=await response.text(),d=new JSDOM(html).window.document,m=metadataFor(path);
  const meta=name=>d.querySelector(`meta[name="${name}"]`)?.content;
  const row={path,status:response.status,title:d.title,description:meta('description'),robots:meta('robots'),header_robots:response.headers.get('x-robots-tag'),canonical:d.querySelector('link[rel="canonical"]')?.href,
   main:d.querySelectorAll('main').length,h1:d.querySelectorAll('h1').length,body_text:d.querySelector('#root')?.textContent.trim().length||0,
   graphs:[...d.querySelectorAll('script[type="application/ld+json"]')].length};
  check(row.status===200,path+':http');check(row.title===m.title,path+':title');check(row.description===m.description,path+':description');check(row.canonical===m.canonical,path+':canonical');
  check(row.robots==='index, follow'&&!/noindex/i.test(row.header_robots||''),path+':index');check(row.main===1&&row.h1===1&&row.body_text>180,path+':real_body');
  check(d.querySelectorAll('title').length===1&&d.querySelectorAll('meta[name="description"]').length===1&&d.querySelectorAll('link[rel="canonical"]').length===1,path+':single_metadata');check(row.graphs===1,path+':single_graph');for(const script of d.querySelectorAll('script[type="application/ld+json"]'))JSON.parse(script.textContent);
  check(d.querySelector('meta[property="og:image"]')?.content===shareImage,path+':share');
  check(!/\/src\/assets\//.test(d.head.innerHTML),path+':source_asset');report.public.push(row);
 }catch(error){report.failures.push(path+':'+error.name);}
}
for(const path of ['/booking','/booking?service=1','/booking?service=numerology','/booking/receipt','/booking/access','/booking-help']){
 try{
  const response=await read(path),d=new JSDOM(await response.text()).window.document;
  const row={path,status:response.status,robots:d.querySelector('meta[name="robots"]')?.content,header_robots:response.headers.get('x-robots-tag'),canonical:d.querySelectorAll('link[rel="canonical"]').length,graphs:d.querySelectorAll('script[type="application/ld+json"]').length};
  check(row.status===200,path+':http');check(/noindex/i.test(row.robots||row.header_robots||''),path+':utility_noindex');check(row.canonical===0&&row.graphs===0,path+':utility_no_discovery_graph');report.utilities.push(row);
 }catch(error){report.failures.push(path+':'+error.name);}
}
for(const path of ['/robots.txt','/sitemap.xml',new URL(shareImage).pathname]){
 const response=await read(path),body=await response.text();const row={path,status:response.status,type:response.headers.get('content-type')};
 check(response.status===200,path+':http');if(path==='/sitemap.xml'){
  const d=new JSDOM(body,{contentType:'application/xml'}).window.document,urls=[...d.querySelectorAll('loc')].map(x=>x.textContent);
  row.urls=urls;check(urls.length===14&&urls.every(x=>Object.hasOwn(publicPages,new URL(x).pathname)),path+':exact_public_inventory');
 }
 if(path==='/robots.txt')check(body.includes(origin+'/sitemap.xml')&&!/Disallow:\s*\/\s*(?:\n|$)/i.test(body),path+':crawler_access');
 if(path===new URL(shareImage).pathname)check(/^image\/webp(?:;|$)/i.test(row.type||''),path+':actual_image_type');report.resources.push(row);
}
for(const path of ['/api/health','/api/company/control/status','/api/studio/status','/this-path-does-not-exist-20261022']){
 const response=await read(path);const expected=path==='/api/health'?[200]:path.startsWith('/api/')?[401,404]:[404];
 check(expected.includes(response.status),path+':refusal');report.refusals.push({path,status:response.status});
}
report.passed=report.failures.length===0;writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:report.passed,public:report.public.length,utilities:report.utilities.length,resources:report.resources.length,refusals:report.refusals.length,failures:report.failures}));
process.exitCode=report.passed?0:1;
