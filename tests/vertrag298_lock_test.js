const fs=require('fs'),vm=require('vm'),assert=require('assert');
let src=fs.readFileSync(__dirname+'/../Companion Files/vertrag-survival.js','utf8');
const suffix='window.__vtTest={getRun:()=>run,init,moveBoss,attackHits,stompingGiants,giantQuietRadius,draw,data,ARENA};\n})();';
assert(src.endsWith('})();\n'));src=src.slice(0,-6)+suffix;
const elements={'vt-root':{innerHTML:''},'vt-canvas':{focus(){}},'vt-announcement':{textContent:''}};
const context={window:{addEventListener(){}},document:{getElementById:id=>elements[id]||null,querySelector:()=>null,addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},performance:{now:()=>0},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},Image:function(){},console};
vm.createContext(context);vm.runInContext(src,context);const t=context.window.__vtTest;
t.init('endless');const r=t.getRun(),b=r.boss;
b.mode='chargeWindup';b.x=250;b.y=240;b.start={x:b.x,y:b.y};b.target={x:500,y:360};b.angle=Math.atan2(120,250);b.until=.85;
r.player.x=500;r.player.y=360;r.elapsed=.9;t.moveBoss(.016);
assert.equal(b.mode,'chargeMove');assert.equal(b.target.x,500);assert.equal(b.target.y,360);
assert(Math.abs(b.dashDuration-Math.hypot(250,120)/475)<.01);
r.player.x=400;r.player.y=220; // Dodge the *locked* destination.
r.elapsed=b.until+.01;t.moveBoss(.016);
assert.equal(b.mode,'uppercut');assert(Math.abs(b.x-500)<.01&&Math.abs(b.y-360)<.01);
const rad=t.data.config.stompRadius;assert(Math.abs(t.giantQuietRadius()-rad*2*1.2)<1e-6);
console.log('PASS Vertrag298 dash reaches previously locked target across arena; player movement does not retarget; quiet radius +20%');
