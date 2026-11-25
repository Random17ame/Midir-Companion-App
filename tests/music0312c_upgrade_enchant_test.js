const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(require('node:path').resolve(__dirname,'../Companion Files/app.js'),'utf8');
assert(src.includes("'Polyphony',6,9"));assert(src.includes("'Tempo',4,5"));
const context={Number,Math,Object,Array,Map,Set,JSON};vm.createContext(context);
let start=src.indexOf('function musicCalcForKey('),end=src.indexOf('function musicFormat(',start);
assert(start>0&&end>start);
context.musicBaseEffects=Object.fromEntries(Object.entries({bo_damage:.20,bo_crit:.11,vivace_speed:.11,vivace_magic:.11,vivace_alchemy:.11,enduring_def:11,enduring_prot:5,enduring_recovery:4.1,enduring_stamina_recovery:4.1,march_ally:.12,harvest_solo:.25,harvest_party:.35,lullaby_damage:300}).map(([key,value])=>[key,{value}]));
context.values={};context.musicValue=(k)=>context.values[k]||0;context.musicGearSetStat=()=>0;
vm.runInContext(src.slice(start,end),context);
for(const skill of Object.keys(context.musicBaseEffects)){
 context.values={musicSpecialUpgrades:0};const zero=context.musicCalcForKey(skill);
 context.values={musicSpecialUpgrades:5.5};const buffed=context.musicCalcForKey(skill);
 const eligible=skill.startsWith('bo_')||skill.startsWith('vivace_');
 for(const name of ['normal','excellent','inspiring']){
  assert(eligible?buffed[name]>zero[name]:Math.abs(buffed[name]-zero[name])<1e-9,`special-upgrade mismatch for ${skill} / ${name}`);
 }
}
const gearStart=src.indexOf('function musicUpgradeInstrumentEnchantRolls('),gearEnd=src.indexOf('function musicGearTab(',gearStart);
assert(gearStart>0&&gearEnd>gearStart);
context.MUSIC_ENCHANT_SLOTS=['Instrument'];context.MUSIC_INSTRUMENT_STATS=['musicSpecialUpgrades'];context.MUSIC_GEAR_REFORGES=[];
context.musicEnchantKind=s=>s;
context.state={musicBuffLab:{gearTabs:{version:4,nextId:3,active:'tab',tabs:[{id:'tab',slots:{Instrument:'item1'},muriasOverride:null,legacySetEffect:0}],items:{item1:{kind:'Instrument',prefix:{name:'Polyphony',roll:4},suffix:{name:'Tempo',roll:3},enchantOverride:11},item2:{kind:'Instrument',prefix:{name:'Polyphony',roll:7},suffix:{name:'Tempo',roll:2}}}}}};
vm.runInContext(src.slice(gearStart,gearEnd),context);
let gear=context.musicGearState();assert.equal(gear.version,5);assert.equal(gear.items.item1.prefix.roll,6);assert.equal(gear.items.item1.suffix.roll,5);assert.equal(gear.items.item2.prefix.roll,9);assert.equal(gear.items.item2.suffix.roll,4);assert.equal(gear.items.item1.enchantOverride,11);
context.musicGearState();assert.equal(gear.items.item1.prefix.roll,6,'migration must be idempotent');
console.log('PASS music 0.3.12c: 13 skill keys, three tiers, step only BFO/Vivace; Polyphony/Tempo roll migration and override preservation');
