/* 0.3.12l: Arcana-independent rune rerolls, gold-only zero lock, per-Arcana equipment. */
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const base=path.resolve(__dirname,'../Companion Files'),window={};const ctx={window,console};vm.createContext(ctx);
for(const name of ['ogham-effect-levels.js','ogham-runes.js'])vm.runInContext(fs.readFileSync(path.join(base,name),'utf8'),ctx,{filename:name});
const O=window.MIDIR_OGHAM,state=O.init({sim:{arcana:'hs'}});
const sim=O.simInit(state);
assert.equal(Object.hasOwn(sim,'arcana'),false,'old simulator Arcana field must be migrated out');
for(const grade of ['fine','exquisite','masterwork']){
 assert.equal(O.herbCost(grade,0).gold,5000);
 assert.equal(Object.keys(O.herbCost(grade,0).herbs).length,0,'unlocked rune must have no herbs');
}
assert.equal(O.herbCost('exquisite',1).gold,10000);
assert(Object.keys(O.herbCost('exquisite',1).herbs).length);
assert.equal(O.herbCost('masterwork',2).gold,20000);
assert(Object.keys(O.herbCost('masterwork',2).herbs).length);
assert(!O.herbCost('fine',1));
let gold=20000,spent=0;window.MIDIR_REFORGE={getGold:()=>gold,spendGold:(n,quiet)=>{assert.equal(quiet,true);if(gold<n)return false;gold-=n;spent+=n;return true},creditGold:n=>{gold+=n;spent-=n;return true}};
sim.word='Beithe';sim.grade='masterwork';sim.lines=[];sim.locks=[];
assert.equal(O.canPay(O.herbCost('masterwork',0),O.availableResources()),true,'gold-only roll must not require Herb Collection plugin');
assert.equal(O.purchaseRoll(sim,()=>0.3,state),true);
assert.equal(gold,15000);
assert.equal(spent,5000);
assert.equal(sim.costs.gold,5000);
assert.equal(Object.keys(sim.costs.herbs).length,0);
const special=O.allowed('Beithe',null,state),regular=O.allowed('Dair',null,state);
assert(special.length>regular.length,'special effects are based on word, not Arcana');
assert(special.some(e=>!e.general));assert(regular.every(e=>e.general));
sim.locks=[true,false,false];assert.equal(O.canPay(O.herbCost('masterwork',1),O.availableResources()),false,'locked roll must require herb chest');
assert.equal(O.purchaseRoll(sim,()=>0.3,state),false);assert.equal(gold,15000);
const a=O.addRune(state,'Dair','fine'),b=O.addRune(state,'Beithe','masterwork');
assert(O.equip(state,'hs',0,a.id));assert(O.equip(state,'dd',0,b.id));
assert.equal(O.equipped(state,'hs')[0].id,a.id);assert.equal(O.equipped(state,'dd')[0].id,b.id);
assert.equal(O.allRunes(state).length,2);
assert(O.equip(state,'dd',1,a.id),'same physical rune may be planned in another Arcana loadout');
assert.equal(O.equipped(state,'hs')[0].id,a.id);
assert.equal(O.equipped(state,'dd')[1].id,a.id);
console.log('PASS 0.3.12l: gold-only unlocked rerolls, herbs required for locks, independent Arcana equipment, shared rune inventory');
