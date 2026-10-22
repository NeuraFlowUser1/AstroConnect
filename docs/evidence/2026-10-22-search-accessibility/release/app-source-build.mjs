// Ignored disconnected build of unchanged receiving source, never deployable.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const here=path.dirname(fileURLToPath(import.meta.url)),app=path.resolve(here,'../../../..'),output=path.join(app,'verification-results/app-source-coverage-rc3'),site=path.join(output,'compiled'),dist=path.join(site,'dist');fs.mkdirSync(site,{recursive:true});
const require=createRequire(path.join(app,'package.json')),{createInstrumenter}=require('istanbul-lib-instrument'),{createCoverageMap}=require('istanbul-lib-coverage');
const {build}=await import(pathToFileURL(require.resolve('vite')).href);
const files=[];for(const shelf of ['src','scripts','build-support'])walk(path.join(app,shelf));for(const name of ['vite.config.js','proxy.js'])if(fs.existsSync(path.join(app,name)))files.push(path.join(app,name));files.sort();
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isSymbolicLink())throw Error('Working source link refused');if(item.isDirectory())walk(file);else if(/\.(?:mjs|js|jsx|ts|tsx)$/.test(item.name))files.push(file);}}
const owners={},baseline=createCoverageMap({});
function instrument(){return createInstrumenter({esModules:true,compact:false,produceSourceMap:true,parserPlugins:['jsx'],coverageVariable:'__astroCoverage__',coverageGlobalScope:'globalThis',coverageGlobalScopeFunc:false});}
for(const file of files){const raw=fs.readFileSync(file,'utf8');if(/(?:istanbul|c8|v8)\s+ignore/.test(raw))throw Error('Unreviewed exclusion');const instance=instrument();instance.instrumentSync(raw,file);baseline.addFileCoverage(instance.lastFileCoverage());owners[file]={sha256:createHash('sha256').update(raw).digest('hex'),relative:path.relative(app,file)};}
fs.writeFileSync(path.join(output,'owners.json'),JSON.stringify(owners));fs.writeFileSync(path.join(output,'baseline.json'),JSON.stringify(baseline.toJSON()));
fs.mkdirSync(path.join(output,'pools'),{recursive:true});
const plugin={name:'exact-003-source-qualification',enforce:'pre',transform(code,id){const file=id.split('?')[0];if(!owners[file])return;const raw=fs.readFileSync(file,'utf8');assert.equal(code,raw,'Original source must precede every transform');const instance=instrument();return {code:instance.instrumentSync(raw,file),map:instance.lastSourceMap()};}};
await build({root:app,configFile:path.join(app,'vite.config.js'),plugins:[plugin],build:{outDir:dist,emptyOutDir:true,minify:false}});
await build({root:app,configFile:path.join(app,'vite.config.js'),plugins:[plugin],build:{ssr:path.join(app,'src/entry-server.jsx'),outDir:path.join(output,'ssr'),emptyOutDir:true,copyPublicDir:false,minify:false,rollupOptions:{output:{entryFileNames:'entry.mjs'}}}});
const {publicPages,utilityPages,utilityPaths,metadataTags,escapeHtml}=await import(pathToFileURL(path.join(app,'src/data/page-metadata.mjs')).href);
const {generateModes}=await import(pathToFileURL(path.join(app,'appointment-system/tools/build/page-modes.mjs')).href);
const {writeSurfaceManifest}=await import(pathToFileURL(path.join(app,'appointment-system/tools/build/surfaces.mjs')).href);
const project=JSON.parse(fs.readFileSync(path.join(app,'appointment-settings/project.json'))),publicAssets=JSON.parse(fs.readFileSync(path.join(app,'appointment-settings/public-assets.json')));
const surface=writeSurfaceManifest({dist,publicDirectory:path.join(app,'public'),project,publicPaths:Object.keys(publicPages),bookingPaths:[...utilityPaths],backendPaths:['/studio','/studio/calendar','/enquiries-studio'],publicAssets});
const previous=globalThis.fetch;globalThis.fetch=()=>{throw Error('Public qualification rendering must not make a provider read');};
try{
 const {renderPublicPage}=await import(pathToFileURL(path.join(output,'ssr/entry.mjs')).href),shell=fs.readFileSync(path.join(dist,'index.html'),'utf8');let rendered=0;
 const cleanHead=html=>html.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta\s+(?:name|property)=["'](?:description|robots|googlebot|referrer|og:[^"']+|twitter:[^"']+)["'][^>]*>/g,'').replace(/<link\s+rel=["']canonical["'][^>]*>/g,'').replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/g,'');
 generateModes({dist,shell,pages:{...publicPages,...utilityPages},project,manifest:surface,brand:project.label,renderPage:({path,mode,booking,html})=>{if(booking)return html;const body=renderPublicPage(path,mode);assert.equal((body.match(/<h1(?: |>|\n)/g)||[]).length,1);rendered++;return cleanHead(html).replace('</head>',metadataTags(path)+'</head>').replace('<html lang="en">','<html lang="en" data-public-bound="false">').replace('<div id="root"></div>',`<div id="root" data-public-html="1" data-public-path="${escapeHtml(path)}">${body}</div>`);}});
 fs.writeFileSync(path.join(output,'pools/server.json'),JSON.stringify(globalThis.__astroCoverage__||{}));fs.writeFileSync(path.join(output,'server-result.json'),JSON.stringify({passed:true,documents:rendered,sourceOwners:files.length,providerCalls:0}));
}finally{globalThis.fetch=previous;}
const dependencies=path.join(site,'node_modules');if(!fs.existsSync(dependencies))fs.symlinkSync(path.join(app,'node_modules'),dependencies,'dir');
for(const [file,owner]of Object.entries(owners))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),owner.sha256);
console.log(JSON.stringify({output,site,workingOwners:files.length,providerCalls:0,sourceUnchanged:true}));
