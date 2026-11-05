'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const app=fs.readFileSync(require('path').join(__dirname,'../Companion Files/app.js'),'utf8');
const from=app.indexOf('let archiveSelectedArcana='),to=app.indexOf('reportStorageInitialize().finally',from);
assert(from>=0&&to>from,'Archive 277 module not found');
const state={archiveLedger:{version:1,awards:{},skillMedians:{},winners:{},sources:{},collectibles:{}},reports:[],metricMilestones:[],characterName:'Tester'};
const ctxt={state,console,Date,Number,String,Object,Array,Set,Map,Error,JSON,Math,
 hash:s=>require('crypto').createHash('sha256').update(s).digest('hex'),
 rhArcana:v=>v==='Dark Diviner'?'dd':'ag',
 RH_ARCANA:{dd:'Dark Diviner',ag:'Arsenal Gunner'},
 D:{collectibles:[]},reportIsArchived:r=>r.archived===true,
 chosenPlayer:r=>r.players?.find(p=>p.name==='Tester')||null,
 participantStats:()=>({dps:10}),vaultEventsForImport:()=>[],
 rhBuild:()=>({best:{},repeatable:{}}),
 reportIndexEntry:r=>({id:r.id,name:r.name,archived:r.archived}),
 fmt:x=>String(x),esc:x=>String(x),save:()=>true,render:()=>{},message:()=>{},reportDbReady:true,reportStorageBlocked:false,
 reportDbWriteBatch:async()=>{},reportAutoArchive:()=>{},openVaultDb:async()=>{throw Error('not accessed in unit rules')}
};
vm.createContext(ctxt);vm.runInContext(app.slice(from,to)+'\nthis.api={archiveLedger,archiveScore,archiveCredit,archiveMedian,archiveExtract,archiveSkillBaseline,archiveRecoverCredits};',ctxt);
const {archiveLedger,archiveScore,archiveCredit,archiveMedian,archiveExtract,archiveSkillBaseline,archiveRecoverCredits}=ctxt.api;
assert.equal(archiveMedian([115,50,130]),115);
assert.equal(archiveMedian([100,200]),150);
const seq=(arc,mode,seconds,source,hits)=>({arc,mode,seconds,source,title:source,hits});
const summary=(awards,medians,rotations)=>({awards,medians,rotations,collectibles:{'giant-boots':{delta:1,qualified:1}}});
const a={id:'a',name:'Old',archived:true,archiveCompact:true,archiveSummary:summary([{type:'first-clear',title:'First boss clear!',count:2}],{dd:{magnum:{value:115,name:'Magnum'},aqua:{value:450,name:'Aqua'}}},[
 seq('dd','best',10,'a',[{id:'magnum',time:1,count:3},{id:'aqua',time:7,count:1}]),
 seq('dd','repeatable',60,'a',[{id:'aqua',time:12,count:3}])])};
assert.equal(archiveCredit(a),true);
assert.equal(archiveCredit(a),false,'Repeated compaction cannot double-credit');
assert.equal(archiveLedger().awards['first-clear'].count,2);
assert.equal(archiveLedger().collectibles['giant-boots'].qualified,1);
assert.equal(archiveScore(archiveLedger().winners.dd['best:10'],archiveLedger().skillMedians.dd),3*115+450);
const b={id:'b',name:'New',archived:true,archiveCompact:true,archiveSummary:summary([{type:'debuff-variety',title:'Debuff',count:1}],{dd:{magnum:{value:125,name:'Magnum'},water:{value:340,name:'Water'}}},[
 seq('dd','best',10,'b',[{id:'magnum',time:0,count:2},{id:'aqua',time:6,count:2}]),
 seq('dd','repeatable',60,'b',[{id:'water',time:10,count:3}])])};
assert.equal(archiveCredit(b),true);
assert.equal(archiveLedger().skillMedians.dd.magnum.value,125);
assert.equal(archiveLedger().skillMedians.dd.aqua.value,450,'Archived fallback median survives missing newer sample');
assert.equal(archiveLedger().winners.dd['best:10'].source,'b','Both sequences use a shared, updated baseline');
assert.equal(archiveLedger().winners.dd['repeatable:60'].source,'a','Independent cooldown-aware winner');
assert.equal(archiveLedger().awards['first-clear'].count,2,'Rotation comparison cannot award achievements');
assert.equal(archiveCredit(b),false,'No repeated reward or re-scoring for unchanged source');
const changed=structuredClone(b);changed.archiveSummary.medians.dd.magnum.value=130;
assert.equal(archiveCredit(changed),true,'Updated source may refresh medians');
assert.equal(archiveLedger().awards['debuff-variety'].count,1,'Source refresh never duplicates achievements');
assert.equal(archiveLedger().awards['first-clear'].count,2);
const c={id:'c',name:'Arsenal',archived:true,archiveCompact:true,archiveSummary:summary([],{ag:{storm:{value:99,name:'Storm'}}},[seq('ag','best',10,'c',[{id:'storm',count:2}])])};
assert.equal(archiveCredit(c),true);
assert.equal(archiveLedger().winners.ag['best:10'].source,'c');
assert.equal(archiveLedger().winners.dd['best:10'].source,'b','Per-Arcana records remain separate');
state.reports=[a,changed,c];assert.equal(archiveRecoverCredits(),false);
assert.equal(state.metricMilestones.length,0,'Archive rules never create personal milestone entries');
const boss={players:[{name:'Tester',entityId:'p1',arcana:'Dark Diviner',skills:[{skillId:'7',name:'Magnum',hitCount:4,criticalHits:1,nonCriticalDamage:240}]}],damageHitEvents:[{playerId:'p1',skillId:'7',targetId:'boss',critical:false,damage:115},{playerId:'p1',skillId:'7',targetId:'boss',critical:false,damage:50},{playerId:'p1',skillId:'7',targetId:'boss',critical:false,damage:130},{playerId:'p1',skillId:'7',targetId:'trash',critical:false,damage:999}],encounters:[{entityIds:['boss']}]};
assert.equal(archiveSkillBaseline(boss,boss.players[0])['7'].value,115,'Median excludes unrelated targets');
console.log('PASS 277 archive: deduped awards, historical median fallback, shared baseline winner, source revisions, Arcana independence, boss-only samples');
