'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const app=fs.readFileSync(path.join(__dirname,'../Companion Files/app.js'),'utf8');
const segment=app.slice(app.indexOf('const RH_MIN_COOLDOWNS='),app.indexOf('\nfunction rhBuild(){'));
const context={window:{MIDIR_SKILL_USES:{ruleFor:(id)=>({cooldown:0,maxHits:id==='59041'?45:1,hitWindow:id==='59041'?16:2})}},Map,Set};
vm.createContext(context);
vm.runInContext(segment+'\nthis.audit=rhCooldownEvidence;this.shapes=RH_SKILL_SHAPES;',context);
function damage(time,id='59041'){return {time,id,hits:1,precise:true}}
function evaluate(events, uses=[],name='Thunderblight',arcana='dd'){
 const part={events,useEvents:uses};
 return context.audit(part,new Map([[String(events[0].id),name]]),arcana,()=>null,e=>e.hits);
}
// 4-second repeat of 15-second Thunderblight must be rejected, without
// rejecting ongoing ticks of the original application.
{
 const events=[damage(0),damage(4),damage(8),damage(15.5),damage(18)];
 const r=evaluate(events,[{skillId:'59041',relativeMs:0},{skillId:'59041',relativeMs:4000},{skillId:'59041',relativeMs:18000}]);
 assert.equal(r.credits.get(events[0]).credit,1);
 assert.equal(r.credits.get(events[1]).credit,1);
 assert.equal(r.credits.get(events[2]).credit,1); // ongoing DoT from first legal use
 assert.equal(r.credits.get(events[4]).credit,1);
}
// Old damage-only logs remain scoreable; successive DoT ticks belong to
// one inferred skill use instead of requiring skill observation packets.
{
 const events=[damage(0),damage(1),damage(10),damage(18)];
 const r=evaluate(events);
 assert.deepEqual(events.map(e=>r.credits.get(e).credit),[1,1,1,1]);
}
// A skill without any documented shape treats each boss hit as a provisional
// use rather than silently merging separate hits under the generic 2s window.
{
 const events=[damage(1,'99998'),damage(1.5,'99998')];
 const r=evaluate(events,[],'Unmapped Rotation Skill','dd');
 assert.deepEqual(events.map(e=>r.credits.get(e).credit),[1,1]);
}
// Different gate/attempt data sets have independently reset skill budgets.
{
 const first=evaluate([damage(0),damage(1)]);
 const second=evaluate([damage(0)]);
 assert.equal([...first.credits.values()].filter(e=>e.credit).length,2);
 assert.equal([...second.credits.values()].filter(e=>e.credit).length,1);
}
const a=app.indexOf('const reportPageSize=10;'),b=app.indexOf('\nasync function reportDbWriteBatch',a);
const archive=app.slice(a,b);
const ctxt={state:{reports:[]},Set};vm.createContext(ctxt);
vm.runInContext(archive+'\nthis.autoArchive=reportAutoArchive;this.isFull=reportIsFull;this.isArchived=reportIsArchived;',ctxt);
const good=i=>({id:String(i),encounters:[{entityIds:['boss']}],damageHitEvents:[{targetId:'boss',damage:1}],skillObservations:[{opcode:31014}]});
ctxt.state.reports=Array.from({length:35},(_,i)=>good(i));
assert.equal(ctxt.autoArchive(),true);
assert.equal(ctxt.state.reports.filter(r=>!r.archived).length,30);
assert.equal(ctxt.state.reports.filter(r=>r.archived).length,5);
// Newest reports remain active.
assert.equal(ctxt.state.reports[0].archived,true);
assert.equal(ctxt.state.reports[34].archived,undefined);
ctxt.state.reports.push({id:'legacy',encounters:[],skillObservations:[]});
assert.equal(ctxt.autoArchive(),true);
assert.equal(ctxt.state.reports.at(-1).archiveReason,'legacy-incomplete');
console.log('PASS Companion 276: cooldown conflict, DoT continuity, damage-only inference, gate reset, legacy archival, 30-active limit');
