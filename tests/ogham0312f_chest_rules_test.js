const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.join(__dirname,'../Companion Files');
const memory=new Map();const storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
const document={querySelector:()=>null};const win={};
const ctx={window:win,document,localStorage:storage,console,Math,Date,performance:{now:()=>0}};vm.createContext(ctx);
function load(name){vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),ctx,{filename:name})}
load('herb-collection.js');load('ogham-runes.js');const O=win.MIDIR_OGHAM,H=win.MIDIR_HERBS;
assert.equal(O.WORDS.length,26);assert.equal(O.RECIPES.length,30);
assert.equal(O.maxLockCount('fine'),0);assert.equal(O.maxLockCount('exquisite'),1);assert.equal(O.maxLockCount('masterwork'),2);
const selected=O.allowed('Beithe','hs');assert(selected.some(a=>a.id==='ignis'),'special rune must see other Arcana effects');
assert(!O.allowed('Cert','hs').some(a=>a.id==='ignis'),'regular rune cannot roll Arcana-specific skills');
const bankroll={gold:1000000};let spentGold=0;
win.MIDIR_REFORGE={getGold:()=>bankroll.gold,spendGold:(n,quiet)=>{assert.equal(quiet,true);if(bankroll.gold<n)return false;bankroll.gold-=n;spentGold+=n;return true},creditGold:n=>{bankroll.gold+=n;spentGold-=n;return true}};
let state=O.init({});let sim=O.simInit(state);sim.word='Beithe';sim.grade='masterwork';sim.arcana='hs';sim.lines=[{id:'heal',level:3},{id:'partyHeal',level:2},{id:'magic',level:9}];sim.locks=[true,true,false];
let before=JSON.stringify(sim.lines);assert.equal(O.canPay(O.herbCost('masterwork',2),O.availableResources()),false);assert.equal(O.purchaseRoll(sim,()=>0.17,state),false);assert.equal(bankroll.gold,1e6);assert.equal(sim.attempts,0);assert.equal(JSON.stringify(sim.lines),before);
for(const [id,count] of Object.entries(O.herbCost('masterwork',2).herbs))for(let i=0;i<count;i++)H.addHerbs(id,1);
assert.equal(O.canPay(O.herbCost('masterwork',2),O.availableResources()),true);assert.equal(O.purchaseRoll(sim,()=>0.17,state),true);assert.equal(bankroll.gold,980000);assert.equal(spentGold,20000);
assert.equal(sim.lines[0].id,'heal');assert.equal(sim.lines[1].id,'partyHeal');assert.equal(sim.lines[0].level,3);assert.equal(sim.attempts,1);
assert.equal(new Set(sim.lines.map(x=>x.id)).size,3);assert.equal(H.getState().total,0);assert.equal(sim.costs.herbs.golden,1);
assert.equal(O.purchaseRoll(sim,()=>0.17,state),false,'should not spend gold if herbs missing');assert.equal(bankroll.gold,980000);
assert.equal(H.spendHerbs({white:1}),false);assert.equal(H.getState().total,0);
// No inherited locks can be applied on a Fine grade.
sim.word='Cert';sim.grade='fine';sim.locks=[true];O.simInit(state);assert.equal(sim.locks.filter(Boolean).length,0);
let independent=O.init({});const rune=O.addRune(independent,'Fearn','masterwork');const old=JSON.stringify(independent.runes);const other=O.simInit(independent);O.rngRoll(other,()=>0.2);assert.equal(JSON.stringify(independent.runes),old);
const imported=O.normalizeCatalog({OghamAbilityList:[{Id:314,GeneralPool:true,Desc:{en:'Sword Power',ko:'검의 힘'},Values:[1.25,2.5,3.75]},{Id:315,GeneralPool:false,Desc:{en:'Pulse Power',ko:'파동 위력'},Values:[1,3]}]});
assert.equal(imported.length,2);assert.equal(imported[0].values[2],3.75);assert.equal(imported[1].general,false);
assert.equal(O.normalizeCatalog({OghamAbilityList:[{Id:1,GeneralPool:true,Desc:{en:'Untranslated'},Values:[1]}]}),null);
assert.equal(JSON.parse(memory.get('midir-companion-herb-chest-v1')).total,0);
console.log('PASS 0.3.12f Ogham · grade/lock eligibility, source-backed pool hook, atomic gold/herb charges, no inventory mutation');
