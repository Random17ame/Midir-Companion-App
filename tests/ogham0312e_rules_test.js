const fs=require('fs'),vm=require('vm'),assert=require('assert');
const context={window:{},console};vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/../Companion Files/ogham-runes.js','utf8'),context);
const O=context.window.MIDIR_OGHAM;
assert.equal(O.WORDS.length,26);assert.equal(O.RECIPES.length,30);assert.equal(O.ARCANA.length,10);
const p=O.init({});p.awakening.hs=20;
const a=O.addRune(p,'Sail','fine'),b=O.addRune(p,'Óir','fine'),c=O.addRune(p,'Peithe','fine');
assert.equal(a.grade,'masterwork');assert.equal(O.equip(p,'hs',0,a.id),true);
assert.equal(O.equip(p,'hs',1,b.id),true);assert.equal(O.equip(p,'hs',2,c.id),true);
let s=O.combinations(p,'hs')[0];assert.equal(s.points,5);assert.equal(s.ready,true);assert.equal(s.active,true);
O.updateRune(p,b.id,{grade:'masterwork'});assert.equal(O.combinations(p,'hs')[0].points,7);
O.updateRune(p,c.id,{grade:'masterwork'});assert.equal(O.combinations(p,'hs')[0].points,9);
assert.equal(O.combinations(p,'mp')[0].ready,false); // Per-Arcana isolation
assert.equal(O.equip(p,'mp',0,a.id),true);assert.equal(O.equipped(p,'hs').length,3); // per-Arcana loadout retained
assert.equal(O.equip(p,'hs',4,b.id),true);assert.equal(O.equipped(p,'hs').length,3);
assert.equal(p.loadouts.hs[1],null); // no same physical rune in two slots
p.awakening.hs=5;assert.equal(O.equip(p,'hs',4,c.id),false);assert.equal(O.equipped(p,'hs').length,1);
O.removeRune(p,b.id);assert.equal(p.loadouts.hs[4],null);
const future=O.RECIPES.filter(x=>x.upcoming);assert.equal(future.length,10);
const r=O.addRune(p,'Nin','fine');assert.equal(r.grade,'masterwork');
const sim=O.simInit({sim:{word:'Fearn',grade:'masterwork',arcana:'hs',lines:[{id:'heal',level:10},{id:'partyHeal',level:8},{id:'litany',level:7}],locks:[true,true,false],costs:{gold:0,herbs:{}},attempts:0}});
O.rngRoll(sim,()=>0.1);assert.equal(sim.lines[0].id,'heal');assert.equal(sim.lines[0].level,10);assert.equal(sim.lines[1].id,'partyHeal');assert.equal(sim.lines[1].level,8);assert.equal(sim.costs.gold,0);assert.equal(sim.attempts,0);
assert.equal(new Set(sim.lines.map(x=>x.id)).size,3);
// The saved inventory and equipped objects did not change during simulated rerolls.
assert.equal(p.runes.length,3);assert.equal(O.combinations(p,'hs')[0].ready,false);
console.log('PASS Ogham tracker · 26 words, 30 combos, 5 slots, ownership, isolation, reroll locks and costs');
