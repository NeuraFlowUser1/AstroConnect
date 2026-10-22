// Actual app-owned scanner/proxy, with isolated command/filesystem replies.
import test from 'node:test';import assert from 'node:assert/strict';import {registerHooks} from 'node:module';import {fileURLToPath,pathToFileURL} from 'node:url';import path from 'node:path';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../..'),scanner=pathToFileURL(path.join(app,'scripts/check-tracked-secrets.mjs')).href;
let sequence=0;
async function scan({files=['safe.txt','image.png','missing.js'],contents={'safe.txt':'Ordinary synthetic content'},history=false,grep='',grepError=null}={}){
 const logs=[],errors=[],prior={argv:process.argv,exit:process.exit,log:console.log,error:console.error},commands=[];
 globalThis.__astroScannerFixture={execFileSync:(command,args)=>{commands.push({command,args});assert.equal(command,'git');if(args[0]==='ls-files')return Buffer.from(files.join('\0'));if(args[0]==='rev-list')return 'one\ntwo\n';if(args[0]==='grep'){if(grepError)throw Object.assign(Error('Synthetic git failure'),{status:grepError});return grep;}throw Error('Unexpected synthetic command');},readFileSync:file=>{const name=path.relative(app,file);if(!(name in contents))throw Error('Synthetic unreadable file');return contents[name];}};
 const hooks=registerHooks({resolve(specifier,context,next){if(context.parentURL?.startsWith(scanner)&&['node:child_process','node:fs'].includes(specifier)){const name=specifier==='node:fs'?'readFileSync':'execFileSync';return {url:'data:text/javascript,'+encodeURIComponent(`export const ${name}=(...args)=>globalThis.__astroScannerFixture.${name}(...args);`),shortCircuit:true};}return next(specifier,context);}});
 process.argv=history?[...prior.argv,'--history']:prior.argv.filter(value=>value!=='--history');process.exit=code=>{throw Object.assign(Error('Synthetic scanner exit'),{scannerExit:code});};console.log=(...args)=>logs.push(args.join(' '));console.error=(...args)=>errors.push(args.join(' '));
 let exit=0;
 try{await import(scanner+'?qualification='+ ++sequence);}catch(error){if(error.scannerExit)exit=error.scannerExit;else throw error;}
 finally{hooks.deregister();process.argv=prior.argv;process.exit=prior.exit;console.log=prior.log;console.error=prior.error;delete globalThis.__astroScannerFixture;}
 return {exit,logs,errors,commands};
}
test('deployable-tree scanner skips nontext and unreadable files and never prints file content',async()=>{const result=await scan();assert.equal(result.exit,0);assert.match(result.logs.join('\n'),/3 current files/);assert.equal(result.errors.length,0);assert.equal(result.commands.length,1);});
test('scanner refuses forbidden names and every credential signature while printing only file names/kinds',async()=>{
 const contents={'.env':'synthetic setting','key.txt':'-----BEGIN '+'PRIVATE KEY-----','razor.txt':'rzp_live_'+'a'.repeat(14),'resend.txt':'re_'+'b'.repeat(20),'google.txt':'"private_key":'+'"-----BEGIN','database.txt':['postgresql','//synthetic','password@local.invalid/db'].join(':')};
 const result=await scan({files:Object.keys(contents),contents});assert.equal(result.exit,1);for(const name of Object.keys(contents))assert(result.errors.some(line=>line.includes(name)));for(const value of Object.values(contents))assert(!result.errors.join('\n').includes(value));
});
test('history scanner accepts an actual no-match exit and reports only bounded revision counts',async()=>{const result=await scan({history:true,grepError:1});assert.equal(result.exit,0);assert.equal(result.commands.length,3);assert.match(result.logs.join('\n'),/2 revisions/);});
test('history scanner refuses matching history without printing credential content or duplicate findings',async()=>{const result=await scan({history:true,grep:'one:synthetic.txt\none:synthetic.txt\ntwo:another.txt'});assert.equal(result.exit,1);assert.equal(result.errors.filter(line=>line.includes('one:synthetic.txt')).length,1);});
test('history scanner never disguises a command failure as a clean history',async()=>{await assert.rejects(scan({history:true,grepError:2}),/Synthetic git failure/);});
test('receiving proxy retains supported general-asset routing and refuses a foreign host without an outward read',async()=>{
 const saved={};for(const name of Object.keys(process.env))if(name.startsWith('BOOKING_')){saved[name]=process.env[name];delete process.env[name];}
 const previous=globalThis.fetch;globalThis.fetch=()=>{throw Error('An asset/refusal check must never read a provider');};
 try{const {default:proxy}=await import(pathToFileURL(path.join(app,'proxy.js')).href);const allowed=await proxy(new Request('https://astroadvicebykundansingh.com/social/astroadvice-consultations.webp'));assert.equal(allowed.status,200);const refused=await proxy(new Request('https://not-owned.example.test/social/astroadvice-consultations.webp'));assert.equal(refused.status,421);}
 finally{globalThis.fetch=previous;for(const[name,value]of Object.entries(saved))process.env[name]=value;}
});
