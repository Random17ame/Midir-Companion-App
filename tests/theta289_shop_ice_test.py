"""Build 289: removed shop perks, five automatic bolt casts and cross-game transfers."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve(); files=root/'Companion Files'
s=(files/'theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__audit289=()=>({get run(){return run},profile,start,activateIce,icePulse,seethingCost,shop});window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<div id="theta-root"></div><div id="su-root"></div><div id="erg-sim-root"></div>')
 for name in ['reforge-simulator.js','special-upgrade.js','erg-simulator.js']:
  page.add_script_tag(content=(files/name).read_text())
 page.add_script_tag(content=s);page.evaluate('MIDIR_THETA.mount()')
 result=page.evaluate('''()=>{
 const a=__audit289(),u=a.profile.upgrades;a.profile.credits=6000;
 for(const n of ['Mana Reservoir','Dark Economy','Hexshroud Extension','Ritual Precision'])if(a.shop().includes(n))throw Error('Retired upgrade shown: '+n);
 if(!a.shop().includes('Arcane Aesthetics')||!a.shop().includes('Ice Bolt'))throw Error('Shop missing items');
 if(a.seethingCost('ice')!==.9||a.seethingCost('thunder')!==1.3)throw Error('Cost tier');
 document.querySelector('[data-theta="tab:shop"]')?.click();
 let btn=document.querySelector('[data-theta="buy:iceBolt"]');if(!btn)throw Error('No purchase button');btn.click();if(!u.iceBolt)throw Error('No Ice Bolt unlocked');
 a.profile.level=10;a.start(true);let r=a.run;r.start=performance.now()-1e3;r.chart.events=[];r.chart.duration=100;r.seething=true;r.dorcha=10;r.surgeCharge=0;r.mp=200;
 if(!a.activateIce())throw Error('No Ice volley');if(r.iceHits.length!==5)throw Error('Not five queued');
 let orig=r.score; a.icePulse(6.01);if(r.iceHits.length)throw Error('Not all shots processed');
 if(r.surgeCharge!==25)throw Error('Five casts must charge 25%: '+r.surgeCharge);
 if(Math.abs(r.dorcha-8)>1e-7)throw Error('5*(+0.5 -0.9) expected Dorcha 8: '+r.dorcha);
 if(r.score<=orig)throw Error('No bolt points');if(r.iceSlowUntil<2)throw Error('No slowdown');
 a.start(true);r=a.run;r.start=performance.now()-1000;r.chart.events=[];r.seething=true;r.hexUntil=20;r.dorcha=5;a.activateIce();a.icePulse(6.1);
 if(Math.abs(r.dorcha-5.5)>1e-7)throw Error('Hex 5 hits should net +0.5: '+r.dorcha);
 // Supply transfer uses the same inventories as the actual games.
 MIDIR_THETA.mount();a.profile.credits=9000;document.querySelector('[data-theta="tab:shop"]')?.click();
 let stones=MIDIR_SPECIAL_UPGRADE.exportState().stones.red||0;
 if(!document.querySelector('[data-theta="exchange:stoneRed"]'))throw Error('No exchange after mount '+document.getElementById('theta-root').innerHTML.slice(0,500));document.querySelector('[data-theta="exchange:stoneRed"]').click();
 if((MIDIR_SPECIAL_UPGRADE.exportState().stones.red||0)!==stones+1)throw Error('Stone not delivered');
 const pot=MIDIR_REFORGE.getPotions();document.querySelector('[data-theta="exchange:ergPotion"]').click();
 if(MIDIR_REFORGE.getPotions()!==pot+1)throw Error('Potion not delivered');
 return {iceCasts:5,residualCharge:25,hexNet:'+0.5',stonesAdded:1,potionsAdded:1,remainingSigils:a.profile.credits};
}''')
 assert not errors,errors
 print('PASS',result)
 b.close()
