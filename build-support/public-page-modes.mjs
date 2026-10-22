import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import project from '../appointment-settings/project.json' with {type:'json'};
import publicAssets from '../appointment-settings/public-assets.json' with {type:'json'};
import {generateModes} from '../appointment-system/tools/build/page-modes.mjs';
import {writeSurfaceManifest} from '../appointment-system/tools/build/surfaces.mjs';
import {publicPages,utilityPages,utilityPaths,metadataTags,escapeHtml} from '../src/data/page-metadata.mjs';
const root=resolve(import.meta.dirname,'..'),dist=resolve(root,'dist');
const shell=readFileSync(resolve(dist,'index.html'),'utf8');
// The renderer is a build artifact outside the deployable output. All public imports resolve before renderToString.
await build({root,configFile:resolve(root,'vite.config.js'),build:{ssr:resolve(root,'src/entry-server.jsx'),outDir:resolve(root,'.public-renderer'),ssrEmitAssets:true,emptyOutDir:true,rollupOptions:{output:{entryFileNames:'entry.mjs'}}}});
const {renderPublicPage}=await import(pathToFileURL(resolve(root,'.public-renderer/entry.mjs')).href);
const bookingPaths=[...utilityPaths];
const manifest=writeSurfaceManifest({dist,publicDirectory:resolve(root,'public'),project,publicPaths:Object.keys(publicPages),bookingPaths,backendPaths:['/studio','/studio/calendar','/enquiries-studio'],publicAssets});
const cleanHead=html=>html.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta\s+(?:name|property)=["'](?:description|robots|googlebot|referrer|og:[^"']+|twitter:[^"']+)["'][^>]*>/g,'').replace(/<link\s+rel=["']canonical["'][^>]*>/g,'').replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/g,'');
const pageEvidence=[];
generateModes({dist,shell,pages:{...publicPages,...utilityPages},project,manifest,brand:project.label,
 renderPage:({path,mode,booking,html})=>{
  if(booking)return html;
  const body=renderPublicPage(path,mode);
  pageEvidence.push({path,mode,bodyBytes:Buffer.byteLength(body),h1:(body.match(/<h1(?: |>|\n)/g)||[]).length});
  return cleanHead(html).replace('</head>',metadataTags(path)+'</head>').replace('<html lang="en">','<html lang="en" data-public-bound="false">').replace('<div id="root"></div>',`<div id="root" data-public-html="1" data-public-path="${escapeHtml(path)}">${body}</div>`);
 }});
mkdirSync(resolve(root,'docs/evidence/2026-10-22-search-accessibility'),{recursive:true});
writeFileSync(resolve(root,'docs/evidence/2026-10-22-search-accessibility/public-html-build.json'),JSON.stringify(pageEvidence,null,2)+'\n');
console.log('Generated actual public React HTML in both unverified display modes; no protected data read.');
