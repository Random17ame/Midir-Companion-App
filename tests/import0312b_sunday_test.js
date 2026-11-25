const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=require('node:path').resolve(__dirname,'..'),app=fs.readFileSync(root+'/Companion Files/app.js','utf8');
const begin=app.indexOf('function decodeObservationFieldTypes('),end=app.indexOf('async function filesSelected(');assert(begin>0&&end>begin);
const context={console,atob:s=>Buffer.from(s,'base64').toString('latin1'),safeNum:n=>Number.isFinite(Number(n))?Number(n):null};
vm.createContext(context);vm.runInContext(app.slice(begin,end)+'\nthis.parseReport=parseReport',context);
const filename='/mnt/data/test export sunday 4.html',text=fs.readFileSync(filename,'utf8'),t=Date.now(),r=context.parseReport(text,'test export sunday 4.html');
assert.equal(r.provenance,'companion-v1');assert.equal(r.encounters.length,7);assert.equal(r.players.length,6);assert.equal(r.skillUseEvents.length,1774);assert.equal(r.damageHitEvents.length,20020);assert.equal(r.skillObservations.length,99603);
assert.equal(r.encounters.filter(x=>x.completion==='observed-zero-hp').length,3);assert(r.players.some(p=>p.arcana==='Melodic Puppeteer'));assert(r.players.some(p=>p.arcana==='Harmonic Saint'));
console.log('PASS 0.3.12b real 47MB combat report:',JSON.stringify({ms:Date.now()-t,encounters:r.encounters.length,players:r.players.length,uses:r.skillUseEvents.length,hits:r.damageHitEvents.length,observations:r.skillObservations.length,heapMB:Math.round(process.memoryUsage().heapUsed/1048576)}));
