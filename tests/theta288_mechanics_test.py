"""288: Seething by magic category, six individual Thunder hits, S50 chest trade, vortex pulses."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
theta=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={', 'window.__audit288=()=>({get run(){return run},profile,hit,start,castDuration,seethingCost,thunderPulse,vortexPulse,buildChart,activateSurge});window.MIDIR_THETA={')
erg=(root/'Companion Files/erg-simulator.js').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<div id="theta-root"></div><div id="erg-sim-root"></div>')
 page.add_script_tag(content=erg)
 page.add_script_tag(content=theta)
 page.evaluate('MIDIR_THETA.mount()')
 results=page.evaluate('''()=>{
 const a=__audit288();a.profile.level=9;a.profile.unlocked=10;a.profile.upgrades.vivace=8;
 if(a.castDuration('flare')!==1||a.castDuration('surge')!==1||a.castDuration('thunder')!==1.3)throw Error('Cast time mismatch');
 if(a.seethingCost('thunder')!==1.3||a.seethingCost('flare')!==1.6)throw Error('base category');
 a.profile.upgrades.efficiency=6;if(a.seethingCost('thunder')!==1.3||a.seethingCost('flare')!==1.6)throw Error('retired economy must not change costs');a.profile.upgrades.efficiency=0;
 const test=(id,hex=false,on=true)=>{
  a.start(true);let r=a.run;r.start=performance.now()-1000;r.chart.events=[{id,t:1,done:false,ix:0}];r.dorcha=10;r.seething=on;if(hex)r.hexUntil=6;a.hit(id);a.thunderPulse(2);return {dorcha:r.dorcha,score:r.score,charge:r.surgeCharge,remaining:r.thunderHits.length};
 };
 let thunder=test('thunder',true,true);if(Math.abs(thunder.dorcha-12.2)>.001)throw Error('Thunder + Hex net is not +2.2: '+JSON.stringify(thunder));
 if(thunder.charge!==5||thunder.remaining!==0)throw Error('one cast, 6 hits');
 let plain=test('thunder',false,true);if(Math.abs(plain.dorcha-9.2)>.001)throw Error('Thunder no hex: '+JSON.stringify(plain));
 let off=test('thunder',false,false);if(off.dorcha!==10.5)throw Error('OFF gains Magic +0.5');
 let flare=test('flare',false,true);if(Math.abs(flare.dorcha-7.9)>.001)throw Error('Flare cost: '+JSON.stringify(flare));
 a.start(true);let v=a.run;v.start=performance.now()-1000;v.vortexUntil=11;v.vortexTick=2;v.hexUntil=8;v.dorcha=5;v.seething=true;
 a.vortexPulse(5);if(v.score!==4*31||v.dorcha!==7)throw Error('Vortex ticks: '+JSON.stringify({score:v.score,dorcha:v.dorcha}));
 const saved=[{id:'good',type:'Staff',route:'S',level:50,saved:true,lines:[]},{id:'bad',type:'Staff',route:'A',level:50,saved:true,lines:[]}];
 const state=MIDIR_ERG.getState();state.weapons=saved;MIDIR_ERG.importState(state);
 if(MIDIR_ERG.getSavedS50Staffs().length!==1||MIDIR_ERG.consumeSavedS50Staff('bad'))throw Error('bad sacrifice accepted');
 const before=MIDIR_ERG.getState().weapons.length;
 if(!MIDIR_ERG.consumeSavedS50Staff('good')||MIDIR_ERG.getState().weapons.length!==before-1)throw Error('no consumption');
 if(MIDIR_ERG.consumeSavedS50Staff('good'))throw Error('duplicate consumption');
 a.profile.upgrades.ergS50=1;
 if(a.castDuration('thunder')!==1||a.castDuration('flare')!==1)throw Error('S50 timing or Vivace conflict');
 return {thunder,plain,off,flare,vortexScore:v.score,s50:'consumed once'};
}''')
 assert not errors,errors
 print('PASS Theta 288 resource, cast timing, vortex and stored S50 redemption:',results)
 b.close()
