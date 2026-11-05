'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'../Companion Files/app.js'),'utf8');
const arcanaStart=src.indexOf('const RH_ARCANA='),arcanaEnd=src.indexOf('function rhSkillId',arcanaStart);
const tableStart=src.indexOf('const RH_MIN_COOLDOWNS='),tableEnd=src.indexOf('const RH_EXTRA_COOLDOWNS',tableStart);
const canonical=src.slice(src.indexOf('const rhCanonicalName='),src.indexOf('// Only explicit skill-ID metadata',src.indexOf('const rhCanonicalName=')));
const context={state:{characterName:'Tester',arcana:'fa',reports:[]},console,Set,Map,Number,Object,String,Array,Math};vm.createContext(context);
// Arcana detection uses declared minimum-cooldown names only for attribution.
vm.runInContext(src.slice(arcanaStart,arcanaEnd)+src.slice(tableStart,tableEnd)+canonical+`this.api={rhEncounterArcana,rhEligible,rhEncounter};`,context);
const a=context.api;const player={entityId:'p',name:'Tester',arcana:'Forbidden Alchemist',skills:[{skillId:35024,name:'Hydra Transmutation'},{skillId:59001,name:'Echoes of Salvation'},{skillId:59004,name:'Pulse of Purification'},{skillId:22001,name:'Windmill'}],damageEvents:[]};
const report={players:[player],encounters:[
 {label:'Gate 1 Vertrag',start:0,end:80,entityIds:['b1'],phases:[{raceId:7600}]},
 {label:'Gate 2 Bronntanas',start:100,end:180,entityIds:['b2'],phases:[{raceId:7602}]}
],damageHitEvents:[
 {playerId:'p',targetId:'b1',skillId:35024,relativeMs:10000,damage:10},
 {playerId:'p',targetId:'b2',skillId:59001,relativeMs:120000,damage:10},
 {playerId:'p',targetId:'b2',skillId:59004,relativeMs:125000,damage:10}
],skillUseEvents:[],skillObservations:[]};
context.state.reports=[report];
const windows=a.rhEncounter({r:report,p:player});
assert.equal(a.rhEncounterArcana(report,player,windows[0]).arc,'fa');
assert.equal(a.rhEncounterArcana(report,player,windows[1]).arc,'hs');
assert.equal(a.rhEligible('fa').length,1);
assert.equal(a.rhEligible('hs').length,1,'gate 2 is selected despite session Arcana still FA');
assert.equal(a.rhEligible('dd').length,0);
// A shared skill cannot overrule the session label.
report.damageHitEvents=[{playerId:'p',targetId:'b2',skillId:22001,relativeMs:120000,damage:10}];
assert.equal(a.rhEncounterArcana(report,player,windows[1]).arc,'fa');
assert.equal(a.rhEncounterArcana(report,player,windows[1]).evidence,'session-fallback');
// Conflicting exclusive skill types should not silently misassign an encounter.
report.damageHitEvents.push({playerId:'p',targetId:'b2',skillId:59001,relativeMs:121000,damage:10},{playerId:'p',targetId:'b2',skillId:35024,relativeMs:122000,damage:10});
assert.equal(a.rhEncounterArcana(report,player,windows[1]).arc,null);
// Legacy damage-only seconds still establish per-encounter Arcana.
report.damageHitEvents=[];player.damageEvents=[{time:20,skills:[{skillId:35024,hits:2}]},{time:121,skills:[{skillId:59001,hits:2}]}];
assert.equal(a.rhEncounterArcana(report,player,windows[0]).arc,'fa');
assert.equal(a.rhEncounterArcana(report,player,windows[1]).arc,'hs');
console.log('PASS 278 Arcana: gate-specific skill evidence, old damage-only imports, shared fallback, conflicting skills rejected');
