'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(path.join(__dirname,'../Companion Files/app.js'),'utf8');
const start=source.indexOf('async function archiveCompactWrite('),end=source.indexOf('async function archiveToggle(',start);
assert(start>0&&end>start);
function makeContext(saveSucceeds){
 const stored={details:new Map(),cold:new Map(),reports:new Map()},trace=[];
 const db={close(){},transaction(names){
  const tx={oncomplete:null,onabort:null,onerror:null,objectStore(name){return {
   put(value,key){stored[name].set(key,value);trace.push(`put-${name}`)},
   delete(key){stored[name].delete(key);trace.push(`del-${name}`)}
  }}};
  queueMicrotask(()=>tx.oncomplete?.());return tx;
 }};
 const full={id:'old',name:'Old gate',archived:true,players:[],targets:[],sourceFingerprint:'v277'};
 const state={settings:{archiveCompactApproved:true},reports:[full],metricMilestones:[{id:'a',reportId:'old'}]};
 stored.details.set('old',full);stored.reports.set('old','<html>original</html>');
 const ctx={state,console,Promise,Date,Error,JSON,Object,Array,Set,Number,String,Map,Math,
  reportDbReady:true,reportStorageBlocked:false,reportIsArchived:r=>r.archived===true,
  reportIndexEntry:r=>({id:r.id,name:r.name,archived:r.archived}),
  archiveParsedFingerprint:async()=>('a'.repeat(64)),archiveRecoverCredits:()=>false,
  archiveExtract:()=>({awards:[{type:'first',count:1}],medians:{},rotations:[],collectibles:{}}),
  archiveCredit:()=>{trace.push('award-credit');return true},
  openVaultDb:async()=>db,
  save:()=>{trace.push('save');return saveSucceeds},
  trace,stored,confirm:()=>{throw Error('Already approved')}
 };
 vm.createContext(ctx);
 vm.runInContext('let archiveBusy=false;'+source.slice(start,end)+'\nthis.api={archiveCompactAll,archiveCompactWrite,archivePurgeRecovery}',ctx);
 return ctx;
}
(async()=>{
 const ok=makeContext(true);await ok.api.archiveCompactAll();
 assert.equal(ok.state.reports[0].archiveCompact,true);
 assert.equal(ok.stored.cold.has('old'),false,'Temporary recovery copy purged after save');
 assert.equal(ok.stored.reports.has('old'),false,'Original HTML purged after save');
 assert.equal(ok.stored.details.get('old').archiveCompact,true,'Compact index remains');
 assert(ok.trace.indexOf('put-cold')<ok.trace.indexOf('put-details'));
 assert(ok.trace.indexOf('save')<ok.trace.indexOf('del-cold'),'Must commit profile before purging recovery');
 assert.equal(ok.state.metricMilestones.length,0,'Source milestones dropped after summary');
 const fail=makeContext(false);
 await assert.rejects(()=>fail.api.archiveCompactAll(),/could not be saved/i);
 assert.equal(fail.stored.cold.has('old'),true,'Failed profile commit must keep full report recoverable');
 assert.equal(fail.stored.reports.has('old'),true,'Failed profile commit must keep HTML');
 assert.equal(fail.trace.includes('del-cold'),false);
 console.log('PASS 278 compaction: transactional staging, profile before purge, no full-data deletion on save failure');
})().catch(e=>{console.error(e);process.exitCode=1});
