const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),path=require('node:path');
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(path.resolve(__dirname,'../Companion Files/burst-comparison.js'),'utf8'),context);const m=context.window.MIDIR_BURST_COMPARISON;
const real=process.argv[2];
const fixture={arcanaName:'Alchemic Sharpshooter',players:[{rank:2,name:'Rixi',arcanaName:'Alchemic Sharpshooter',sessionName:'Test',startMs:1761000000000,damage:135,hits:4,skills:[{id:59061,name:'Aqua Volley',damage:110,hits:2,observedUses:1,largest:60},{id:21002,name:'Magnum Shot',damage:25,hits:2,observedUses:2,largest:15}],events:[{kind:'hit',t:0,skillId:21002,damage:10,critical:false},{kind:'use',t:500,skillId:59061},{kind:'hit',t:1000,skillId:59061,damage:50,critical:true},{kind:'hit',t:10000,skillId:21002,damage:15,critical:false},{kind:'hit',t:10001,skillId:59061,damage:60,critical:true}]}],windowSeconds:30};
const source=real?fs.readFileSync(real,'utf8'):`<script id="burst-data" type="application/json">${JSON.stringify(fixture)}</script>`;
const data=m.read(source,'real-format.html');assert(data.players.length>0&&data.players.length<=8);assert(data.arcana==='Alchemic Sharpshooter');
for(const p of data.players){
 assert(p.hits.length>0);assert(p.skillStats.every(s=>!s.name.startsWith('Skill ')),'Named 46.b per-skill metadata must resolve');
 assert(p.best10.skills.every(s=>!s.name.startsWith('Skill ')),'Named 10s breakdown must resolve');
 assert(Math.abs(p.derivedTotal-p.recordedTotal)<0.001,`${p.name} export 30s total mismatch`);
 assert(Math.abs(p.skillStats.reduce((s,x)=>s+x.damage,0)-p.recordedTotal)<0.001,`${p.name} skill sum mismatch`);
 const allHits=p.hits;
 const starts=[0,20000,...allHits.flatMap(h=>[Math.max(0,Math.min(20000,h.t)),Math.max(0,Math.min(20000,h.t-9999))])];
 let brute=0;for(const start of starts)brute=Math.max(brute,allHits.filter(h=>h.t>=start&&h.t<start+10000).reduce((s,h)=>s+h.damage,0));
 assert(Math.abs(brute-p.best10.damage)<0.001,`${p.name} rolling 10s mismatch: ${brute} v ${p.best10.damage}`);
 assert(p.best10.start>=0&&p.best10.end<=30000);
 assert(p.hits.every(e=>e.t>=0&&e.t<30000));
 const useMarkerCount=p.uses.length;assert.equal(p.uses.filter(e=>e.t>=0&&e.t<30000).length,useMarkerCount);
}
console.log(`PASS real-format Midir 46.b comparison: ${data.players.length} players, ${data.players.reduce((n,p)=>n+p.hits.length,0)} individual boss hits, ${data.players.reduce((n,p)=>n+p.uses.length,0)} separate use markers, 30s/skill/10s sums and names reconciled`);
