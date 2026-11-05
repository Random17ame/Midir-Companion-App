'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),{webcrypto}=require('crypto');
const source=fs.readFileSync(path.join(__dirname,'../Companion Files/app.js'),'utf8');
const pick=(a,b)=>{const start=source.indexOf(a),end=source.indexOf(b,start);assert(start>=0&&end>start);return source.slice(start,end)};
const ctx={crypto:webcrypto,console,TextEncoder,Uint8Array,Array,JSON,Set,Map,Number,Math,Date,Object,String,Error,
 state:{reports:[],metricMilestones:[],archiveLedger:{awards:{first:{count:2}},sources:{id1:{awardCredits:{first:2}}}}},reportDbReady:true,reportStorageBlocked:false,
 reportIndexEntry:r=>({id:r.id,name:r.name,archived:r.archived,importedAt:r.importedAt,sourceFingerprint:r.sourceFingerprint,archiveSummary:r.archiveSummary}),
 reportAutoArchive:()=>false,reportIsArchived:r=>r.archived===true,reportDbWriteBatch:async rows=>{ctx.writes.push(...rows)},writes:[],save:()=>true,render:()=>{},messages:[],message:s=>ctx.messages.push(s),
 archiveCompactAll:async()=>{},storeHtml:async()=>{},parseReport:text=>JSON.parse(text),cleanExport:()=>{throw Error('unused')},
 archiveFilePicker:null,archiveRestoreId:null};
vm.createContext(ctx);
vm.runInContext(pick('function archiveIdentityPayload','function reportIndexEntry')+pick('async function archiveRestoreFromFile','archiveFilePicker?.addEventListener')+'\nthis.api={archiveParsedFingerprint,archiveFileFingerprint,archiveRestoreFromFile}',ctx);
(async()=>{
 const report={name:'Original Report.html',provenance:'companion-v1',sessionStart:123,duration:90,
  players:[{entityId:'1',name:'Tester',arcana:'Forbidden Alchemist',skills:[{skillId:35024,name:'Hydra Transmutation',totalDamage:450}]}],targets:[],
  damageHitEvents:[{playerId:'1',skillId:35024,damage:450,relativeMs:1000,targetId:'boss'}]};
 const digest=await ctx.api.archiveParsedFingerprint(report);
 assert.equal(digest.length,64,'Uses SHA-256 hexadecimal fingerprint');
 assert.equal(await ctx.api.archiveParsedFingerprint({...report,id:'changed',archived:true,archiveSummary:{awards:[1]}}),digest,'Mutable Vault fields excluded');
 assert.notEqual(await ctx.api.archiveParsedFingerprint({...report,damageHitEvents:[{...report.damageHitEvents[0],damage:451}]}),digest,'Actual report evidence protected');
 const archived={id:'id1',name:'Original Report.html',archived:true,archiveCompact:true,archiveDigest:digest,sourceFingerprint:'legacy',archiveSummary:{awards:[{type:'first',count:2}]}};
 ctx.state.reports=[archived];
 const forged={...report,damageHitEvents:[{...report.damageHitEvents[0],damage:999}]};
 const file=contents=>({name:'reselected.json',size:Buffer.byteLength(contents),text:async()=>contents});
 await assert.rejects(()=>ctx.api.archiveRestoreFromFile(file(JSON.stringify(forged)),'id1'),/fingerprint does not match/);
 assert.equal(ctx.state.reports[0],archived,'Failed verification leaves archived index intact');
 assert.equal(ctx.writes.length,0,'Failed verification writes no report');
 await ctx.api.archiveRestoreFromFile(file(JSON.stringify(report)),'id1');
 assert.equal(ctx.state.reports[0].id,'id1','Report identity preserved on return');
 assert.equal(ctx.state.reports[0].archived,false);
 assert.equal(ctx.state.reports[0].archiveCompact,false);
 assert.equal(ctx.state.archiveLedger.awards.first.count,2,'Reactivation did not grant an achievement');
 assert.equal(ctx.state.archiveLedger.sources.id1.awardCredits.first,2,'Source identity retained for deduplication');
 console.log('PASS 278 fingerprints: stable SHA-256 evidence digest, mismatches rejected before writes, verified reactivation, awards independent');
})().catch(e=>{console.error(e);process.exitCode=1});
