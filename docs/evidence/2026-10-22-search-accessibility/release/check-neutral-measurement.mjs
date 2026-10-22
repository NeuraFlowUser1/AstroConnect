// Independent conservative readback of the local, disposable measurement only.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {acceptCounters} from './neutral-counter-contract.mjs';
const evidence=path.dirname(fileURLToPath(import.meta.url)),app=path.resolve(evidence,'../../../..');
const root=process.argv[2];
if(!root?.startsWith('/tmp/astro-neutral-measurement-')||path.dirname(root)!=='/tmp')throw Error('Explicit disposable measurement path required');
const require=createRequire(path.join(app,'package.json')),{createInstrumenter}=require('istanbul-lib-instrument'),{createCoverageMap}=require('istanbul-lib-coverage');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'))),baseline=JSON.parse(fs.readFileSync(path.join(root,'baseline.json'))),run=JSON.parse(fs.readFileSync(path.join(root,'summary.json')));
if(manifest.source!==path.resolve(app,'../releases/standard-qualification')||manifest.original_release!=='1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f')throw Error('Frozen source identity differs');
const files=[];for(const shelf of ['browser','worker','hosting','engine','tools'])walk(path.join(manifest.source,shelf));
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','__pycache__','.wrangler'].includes(item.name))continue;const file=path.join(dir,item.name);if(item.isSymbolicLink())throw Error('Source link refused');if(item.isDirectory())walk(file);else if(/\.(?:mjs|js)$/.test(item.name))files.push(file);}}
if(JSON.stringify(files.sort())!==JSON.stringify(Object.keys(manifest.files).sort())||JSON.stringify(files.sort())!==JSON.stringify(Object.keys(baseline).sort()))throw Error('Working-source denominator differs');
const rebuilt=createCoverageMap({});
for(const file of files){const raw=fs.readFileSync(file,'utf8');if(createHash('sha256').update(raw).digest('hex')!==manifest.files[file].sha256)throw Error('Original owner changed');const instrument=createInstrumenter({esModules:true,compact:false,produceSourceMap:false,coverageVariable:'__neutralCoverage__',coverageGlobalScope:'globalThis',coverageGlobalScopeFunc:false});instrument.instrumentSync(raw,file);const actual=instrument.lastFileCoverage();if(JSON.stringify(actual)!==JSON.stringify(baseline[file]))throw Error('Baseline is not the untouched original source map');rebuilt.addFileCoverage(actual);}
let observations=0;const rejections=[];
for(const file of fs.readdirSync(path.join(root,'counters'))){if(!/^\d+\.json$/.test(file))throw Error('Unexpected counter record');const result=JSON.parse(fs.readFileSync(path.join(root,'counters',file)));const checked=acceptCounters(result.coverage,baseline,manifest.files);rejections.push(...result.rejections,...checked.rejections);observations+=result.observations;rebuilt.merge(checked.accepted);}
const owners=rebuilt.files().map(file=>({file:path.relative(manifest.source,file),...rebuilt.fileCoverageFor(file).toSummary().toJSON()}));
const result={release_digest:manifest.original_release,measurement_root:root,run_exit:run.run_exit,all_working_js_files:files.length,source_unchanged:true,baseline_reconstructed:true,counter_observations:observations,rejections,summary:rebuilt.getCoverageSummary().toJSON(),owners,provider_actions:0,customer_actions:0,qualification_complete:false};
fs.writeFileSync(path.join(root,'strict-joined.json'),JSON.stringify(rebuilt.toJSON()));fs.writeFileSync(path.join(root,'strict-report.json'),JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(path.join(evidence,'neutral-js-strict-pointer.json'),JSON.stringify({root,report:result},null,2)+'\n');
console.log(JSON.stringify({root,run_exit:result.run_exit,files:files.length,observations,rejections,summary:result.summary}));
process.exitCode=result.run_exit===0&&rejections.length===0?0:1;
