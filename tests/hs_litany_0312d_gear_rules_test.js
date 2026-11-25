/* 0.3.12d focused: no fabricated water/enchant effects, whole-number gear rolls,
 * migrated saves, named Murias Gift exception and party-recovery isolation. */
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const root=process.argv[2]||'.';const ctx={window:{MIDIR_I18N:{language:()=> 'en'}},document:{}};vm.createContext(ctx);
for(const f of ['reforge-data.js','hs-litany-lab.js'])vm.runInContext(fs.readFileSync(`${root}/Companion Files/${f}`,'utf8'),ctx);
const api=ctx.window.MIDIR_HS_LITANY;
const a=api.initial();assert.equal(a.version,6);
a.slots.hat.enabled=true;a.slots.hat.prefix.name='Test Prefix';
a.slots.hat.prefix.heal=8.9;a.slots.hat.prefix.magicAttack=17.7;
a.slots.hat.suffix.name='Test Suffix';a.slots.hat.suffix.heal=4.2;a.slots.hat.suffix.magicAttack=2.2;
a.slots.hat.murias.enabled=true;a.slots.hat.murias.pct=9.7;
let v=api.calc(a);
assert.equal(v.state.slots.hat.prefix.heal,9);assert.equal(v.state.slots.hat.prefix.magicAttack,18);
assert.equal(v.state.slots.hat.suffix.heal,4);assert.equal(v.state.slots.hat.suffix.magicAttack,2);
assert.equal(v.state.slots.hat.murias.pct,10);assert.equal(v.enchantMagicAttack,20);
assert.equal(v.healing[1],(106+13)*1.1);assert.equal(v.party[1],227*1.1);
// Previously serialized unsupported bonuses must be dropped during migration.
const legacy=api.initial();legacy.version=5;legacy.slots.hat.enabled=true;
Object.assign(legacy.slots.hat.prefix,{name:'Keep me',heal:5,party:300,pct:400});
Object.assign(legacy.slots.hat.suffix,{name:'Also keep',heal:7,party:200,pct:500});
Object.assign(legacy.slots.hat.murias,{enabled:true,pct:3,heal:80,party:70});
v=api.calc(legacy);
assert.equal(v.state.version,6);assert.equal(v.state.slots.hat.prefix.name,'Keep me');
assert.equal(v.state.slots.hat.suffix.name,'Also keep');assert.equal(v.state.slots.hat.prefix.heal,5);
assert(!Object.hasOwn(v.state.slots.hat.prefix,'party'));
assert(!Object.hasOwn(v.state.slots.hat.prefix,'pct'));
assert(!Object.hasOwn(v.state.slots.hat.murias,'heal'));
assert(!Object.hasOwn(v.state.slots.hat.murias,'party'));
assert.equal(v.healing[1],(106+12)*1.03);assert.equal(v.party[1],227*1.03);
legacy.slots.hat.murias.pct=99;assert.equal(api.calc(legacy).state.slots.hat.murias.pct,10);
legacy.slots.hat.murias.pct=0;assert.equal(api.calc(legacy).state.slots.hat.murias.pct,1);
legacy.slots.hat.murias.enabled=false;assert.equal(api.calc(legacy).state.slots.hat.murias.pct,0);
// Named Gift remains a known relic-specific +5% potency enchant. Unverified
// generic relic enchant potency/party fields do not enter generic recovery.
const r=api.initial();r.boosts.relics.enabled=true;r.relics[0].enabled=true;
Object.assign(r.relics[0].prefix,{selection:'custom',heal:3.9,magicAttack:21.8,party:99,pct:99});
v=api.calc(r);assert.equal(v.healing[1],110);assert.equal(v.party[1],227);assert.equal(v.pPct,0);assert.equal(v.enchantMagicAttack,22);
r.relics[0].suffix.selection='Gift';assert.equal(api.calc(r).hPct,5);
// Gear controls accept whole overrides. Calculated 2.5/level EV Party Healing
// remains exact (input precision != formula precision).
const wand=api.initial();wand.wandType='soul';wand.gradeOverride=95.8;wand.ergRank='S';wand.ergLevel=50;wand.darkErgLevel=1;wand.darkErgPctOverride=3.7;wand.slots.wand.reforges[0]={key:'party',level:1};
v=api.calc(wand);assert.equal(v.state.gradeOverride,96);assert.equal(v.state.darkErgPctOverride,4);assert.equal(v.reforge.wandParty,2.5);
const html=api.view(api.initial());const cells=[...html.matchAll(/data-hsl-open="slot:([a-z0-9]+)"/g)].map(x=>x[1]);
assert.deepEqual(cells,['acc1','hat','acc2','wand','body','offhand','gloves','shoes','robe','echo']);
for(const code of ['en','ko','es']){ctx.window.MIDIR_I18N.language=()=>code;const page=api.view(api.initial());
 if(code==='en')assert(!/[\uac00-\ud7a3]/.test(page));
 if(code==='ko')assert(page.includes('에코스톤'));if(code==='es')assert(page.includes('Piedra eco'));
}
console.log('PASS 0.3.12d Litany whole-number gear, Murias, enchants, migration, relocations and locales');
