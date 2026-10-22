// Credit only fresh passing exact-source pools; retain every original domain.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';
import {acceptCounters} from './neutral-counter-contract.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),app=path.resolve(here,'../../../..'),require=createRequire(path.join(app,'package.json'));
const {createCoverageMap}=require('istanbul-lib-coverage'),{createInstrumenter}=require('istanbul-lib-instrument');
const roots=process.argv.slice(2);if(!roots.length||new Set(roots).size!==roots.length)throw Error('Distinct current pools required');
const initial=JSON.parse(fs.readFileSync(path.join(roots[0],'manifest.json'))),baseline=JSON.parse(fs.readFileSync(path.join(roots[0],'baseline.json'))),map=createCoverageMap(structuredClone(baseline)),provenance=[];
const sha=value=>createHash('sha256').update(value).digest('hex');
if(initial.original_release!=='1bb6cb1cc00a2ead7cec70de052ea78330005d7644dfc0d2e2a40ea7c287b31f')throw Error('Frozen RC3 required');
for(const [file,owner]of Object.entries(initial.files)){
 const raw=fs.readFileSync(file,'utf8');if(sha(raw)!==owner.sha256)throw Error('Original working source differs');
 const instrument=createInstrumenter({esModules:true,compact:false,produceSourceMap:false,coverageVariable:'__neutralCoverage__',coverageGlobalScope:'globalThis',coverageGlobalScopeFunc:false});instrument.instrumentSync(raw,file);
 if(JSON.stringify(instrument.lastFileCoverage())!==JSON.stringify(baseline[file]))throw Error('Original map differs');
}
for(const root of roots){
 if(!root.startsWith('/tmp/astro-neutral-measurement-')||path.dirname(root)!=='/tmp')throw Error('Isolated pool required');
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));if(JSON.stringify(manifest.files)!==JSON.stringify(initial.files)||manifest.source!==initial.source||manifest.original_release!==initial.original_release)throw Error('Pool source identity differs');
 const poolBaseline=JSON.parse(fs.readFileSync(path.join(root,'baseline.json')));
 if(JSON.stringify(Object.keys(poolBaseline).sort())!==JSON.stringify(Object.keys(baseline).sort())||Object.keys(baseline).some(file=>JSON.stringify(poolBaseline[file])!==JSON.stringify(baseline[file])))throw Error('Pool baseline differs');
 const summaryFile=path.join(root,'summary.json'),summary=fs.existsSync(summaryFile)?JSON.parse(fs.readFileSync(summaryFile)):JSON.parse(fs.readFileSync(path.join(root,'run-exit.json')));
 if((summary.run_exit??summary.exit)!==0)throw Error('Failed pool cannot be credited');
 const log=fs.readFileSync(path.join(root,'run.log'),'utf8'),pass=log.match(/ℹ pass (\d+)/),fail=log.match(/ℹ fail (\d+)/),skip=log.match(/ℹ skipped (\d+)/);if(!pass||fail?.[1]!=='0'||skip?.[1]!=='0')throw Error('Actual non-skipped case completion required');
 let observations=0;
 for(const name of fs.readdirSync(path.join(root,'counters'))){
  const data=JSON.parse(fs.readFileSync(path.join(root,'counters',name))),checked=acceptCounters(data.coverage,baseline,manifest.files);
  if(data.rejections.length||checked.rejections.length)throw Error('Counter rejection in '+root);observations+=data.observations;map.merge(checked.accepted);
 }
 provenance.push({root,passed:Number(pass[1]),failures:0,skipped:0,observations,log_sha256:sha(log),release_digest:manifest.original_release});
}
const domains={},inventory={};
for(const file of map.files()){
 const relative=path.relative(initial.source,file),domain=relative.startsWith('engine/')?'staff-company-control':relative.startsWith('browser/booking/')?'booking-payments':relative.startsWith('browser/enquiry/')?'enquiries':relative.startsWith('browser/')?'shared-browser':relative.startsWith('worker/')?'worker-projection':relative.startsWith('hosting/')||relative.startsWith('tools/')?'hosting-installation':null;
 if(!domain)throw Error('Unassigned working owner');inventory[relative]=domain;(domains[domain]??=createCoverageMap({})).addFileCoverage(map.fileCoverageFor(file));
}
const grouped=Object.fromEntries(Object.entries(domains).map(([key,value])=>[key,value.getCoverageSummary().toJSON()]));
const result={release_digest:initial.original_release,all_working_js_owners:map.files().length,source_unchanged:true,original_maps_reconstructed:true,exclusions:[],provenance,inventory,domains:grouped,totals:map.getCoverageSummary().toJSON(),all_original_domains_meet_90_statements_and_branches:Object.values(grouped).every(value=>value.statements.pct>=90&&value.branches.pct>=90),provider_actions:0,customer_actions:0,qualification_complete:false};
fs.writeFileSync(path.join(here,'neutral-js-qualified-counters.json'),JSON.stringify(map.toJSON()));fs.writeFileSync(path.join(here,'neutral-js-qualified-summary.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({all_owners:result.all_working_js_owners,all_domains_pass:result.all_original_domains_meet_90_statements_and_branches,domains:grouped,totals:result.totals}));
