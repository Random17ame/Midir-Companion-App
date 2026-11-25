const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const root=require('path').resolve(__dirname,'..');const cx={window:{}};vm.createContext(cx);vm.runInContext(fs.readFileSync(root+'/Companion Files/burst-comparison.js','utf8'),cx);const m=cx.window.MIDIR_BURST_COMPARISON;
const source={title:'Boss Burst Test',arcana:'Melodic Puppeteer',players:[{username:'Tester',arcana:'Melodic Puppeteer',rank:1,sourceSession:'G3',window:{startMs:1760000000000,totalDamage:100,events:[
 {kind:'hit',relativeMs:0,damage:12,skillId:54151,skillName:'Act 2 AI',critical:false},{kind:'hit',relativeMs:10000,damage:40,skillId:59168,critical:true},{kind:'hit',relativeMs:19999,damage:30,skillId:59168},{kind:'hit',relativeMs:20000,damage:18,skillId:59169},{kind:'use',relativeMs:19999,skillId:59168},{kind:'use',relativeMs:20000,skillId:59169}]}}]};
const html='<html><script type="application/json" id="burst-data">'+JSON.stringify(source)+'</script></html>';
assert(m.isComparison(html));let c=m.read(html,'test-burst.html');assert.equal(c.kind,'midir-burst-comparison');assert.equal(c.players.length,1);assert.equal(c.players[0].derivedTotal,100);assert.equal(c.players[0].uses.length,2);assert.equal(c.players[0].best10.damage,70);assert.equal(c.players[0].best10.hits,2);assert.equal(c.players[0].best10.start,10000);assert.equal(c.players[0].best10.end,20000);assert.equal(c.players[0].best10.skills.reduce((a,x)=>a+x.damage,0),70);
assert(!m.isComparison('<script type="application/json" id="data">{}</script>'));
assert.throws(()=>m.read('<script type="application/json" id="burst-data">'+JSON.stringify({...source,players:[{name:'no events'}]})+'</script>'),/No individual/);
// Starting indices after t>20,000 must not extend a window beyond 30 seconds.
const tail=m.bestWindow([{t:24000,damage:3,skillId:'1'},{t:29999,damage:7,skillId:'1'}]);assert.equal(tail.damage,10);assert.equal(tail.start,20000);assert.equal(tail.end,30000);
// Pet ID 9999 can be separated by recorded pet name without inventing casts.
const petWindow={players:[{username:'Pet owner',events:[{kind:'hit',relativeMs:100,damage:11,skillId:9999,petName:'Pet A'},{kind:'hit',relativeMs:200,damage:12,skillId:9999,petName:'Pet B'}]}]};
const pets=m.read('<script id="burst-data">'+JSON.stringify(petWindow)+'</script>').players[0];assert.equal(pets.skillStats.length,2);assert.equal(pets.best10.skills.length,2);
// A named summary is metadata only, never extra damage.
source.players[0].window.skills=[{skillId:54151,totalDamage:99999}];assert.equal(m.read('<script id="burst-data">'+JSON.stringify(source)+'</script>').players[0].derivedTotal,100);
console.log('PASS 0.3.12b leaderboard adapter: independent evidence, 10s boundary, totals and use separation');
