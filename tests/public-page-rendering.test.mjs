import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {JSDOM} from 'jsdom';
import {publicPages,origin,metadataFor,structuredGraph,safeJson,escapeHtml,writeMetadata,metadataTags,utilityPaths} from '../src/data/page-metadata.mjs';
const dist=resolve(import.meta.dirname,'../dist');
for(const mode of ['on','off'])for(const [path,expected]of Object.entries(publicPages))test(`${mode} ${path} contains the actual public page and matching safe identity`,()=>{
 const html=readFileSync(resolve(dist,'__booking_display',mode,path==='/'?'index.html':path.slice(1)+'.html'),'utf8');
 const doc=new JSDOM(html).window.document;
 assert.equal(doc.title,expected.title);assert.equal(doc.querySelector('meta[name="description"]').content,expected.description);
 assert.equal(doc.querySelectorAll('link[rel="canonical"]').length,1);assert.equal(doc.querySelector('link[rel="canonical"]').href,origin+path);
 assert.equal(doc.querySelector('meta[name="robots"]').content,'index, follow');
 assert.equal(doc.querySelector('meta[property="og:url"]').content,origin+path);
 assert.equal(doc.querySelector('meta[property="og:image"]').content,origin+'/social/astroadvice-consultations.webp');
 assert.equal(doc.querySelectorAll('main').length,1);assert.equal(doc.querySelectorAll('h1').length,1);
 assert.ok(doc.querySelector('main').textContent.trim().length>200);assert.equal(doc.querySelector('#root').dataset.publicPath,path);
 assert.equal(doc.querySelector('#root').dataset.publicHtml,'1');assert.ok(!doc.querySelector('main').textContent.includes('Loading the page…'));
 for(const form of doc.forms){assert.equal(form.method,'post');assert.equal(form.querySelector('fieldset').disabled,true);}
 const data=JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent);
 assert.equal(data['@graph'].find(n=>n['@type']==='WebPage').url,origin+path);assert.ok(!html.includes('/src/assets/logos/logo2.webp'));
});
test('sitemaps contain fourteen ordinary pages and no booking/receipt utilities',()=>{
 for(const mode of ['on','off']){const xml=readFileSync(resolve(dist,'__booking_display',mode,'sitemap.xml'),'utf8');const doc=new JSDOM(xml,{contentType:'application/xml'}).window.document;
  assert.deepEqual([...doc.querySelectorAll('loc')].map(n=>n.textContent).sort(),Object.keys(publicPages).map(p=>origin+p).sort());
 }
});
test('client navigation replaces all identity tags and clears public graph on utilities',()=>{
 const doc=new JSDOM('<html><head><title>Old</title><script type="application/ld+json">{}</script></head><body></body></html>').window.document;
 writeMetadata('/about',doc);writeMetadata('/services/numerology',doc);
 assert.equal(doc.title,publicPages['/services/numerology'].title);assert.equal(doc.querySelectorAll('meta[name="description"]').length,1);
 assert.equal(doc.querySelectorAll('script[type="application/ld+json"]').length,1);
 for(const path of [...utilityPaths,'/unknown']){writeMetadata(path,doc);assert.equal(doc.querySelector('meta[name="robots"]').content,'noindex, nofollow');assert.equal(doc.querySelector('meta[name="referrer"]').content,'no-referrer');assert.equal(doc.querySelector('link[rel="canonical"]'),null);assert.equal(doc.querySelector('script[type="application/ld+json"]'),null);assert.equal(metadataFor(path).public,false);assert.equal(structuredGraph(path),null);}
 writeMetadata('/',doc);assert.equal(doc.querySelector('link[rel="canonical"]').href,origin+'/');
});
test('HTML and JSON serializers cannot close tags or insert source markup',()=>{
 const attack='</script><img src=x onerror=alert(1)> & \" \u2028 \u2029';
 const serialized=safeJson({attack});assert.ok(!serialized.includes('<'));assert.ok(!serialized.includes('>'));assert.ok(!serialized.includes('&'));assert.equal(JSON.parse(serialized).attack,attack);
 assert.equal(escapeHtml('<a x="x">&'),'&lt;a x=&quot;x&quot;&gt;&amp;');
 assert.ok(!metadataTags('/unknown').includes('og:image'));assert.equal(Object.keys(publicPages).length,14);
});
