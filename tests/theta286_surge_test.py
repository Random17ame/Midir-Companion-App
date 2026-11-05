"""286: residual-charge Surge is a free-trigger high damage burst, not a rhythm note."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
src=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__theta286=()=>({get run(){return run},profile,buildChart,hit,toggle,activateSurge,activateUtility});window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<div id="theta-root"></div>');page.add_script_tag(content=src)
 page.evaluate('MIDIR_THETA.mount()')
 r=page.evaluate('''()=>{
  const a=__theta286();a.profile.level=10;a.profile.unlocked=10;
  const chart=a.buildChart(10,false);
  if(chart.events.some(e=>e.id==='surge'))throw Error('Surge must not be mandatory rhythm note');
  document.querySelector('[data-theta="start"]').click();
  const g=a.run; g.start=performance.now()-1000;g.mp=g.mpMax;
  // A successful Seething cast, even at zero Dorcha, charges once (not per hit).
  g.chart.events=[{id:'thunder',ix:0,t:1,done:false,seq:0}];g.seething=true;g.dorcha=0;
  a.hit('thunder');if(g.surgeCharge!==5)throw Error('Seething spell must gain 5%');
  // A missed note, toggle, and Seething-OFF attack cannot charge the gauge.
  a.toggle();g.start=performance.now()-3000;g.chart.events=[{id:'thunder',ix:0,t:3,done:false,seq:1}];a.hit('thunder');
  if(g.surgeCharge!==5)throw Error('Seething OFF must not charge');
  a.toggle();g.surgeCharge=95;g.start=performance.now()-5000;
  g.chart.events=[{id:'thunder',ix:0,t:5,done:false,seq:2}];a.hit('thunder');
  if(g.surgeCharge!==100)throw Error('Must cap at 100');
  g.start=performance.now()-7000;const before=g.score,dorcha=g.dorcha,old=g.chart.duration;
  g.chart.events=[{id:'thunder',ix:0,t:8,done:false,seq:3}];
  if(!a.activateSurge())throw Error('Surge should activate with 100% and cooldown ready');
  if(g.surgeCharge!==0||g.surgeCasts!==1)throw Error('Gauge must consume on Surge');
  if(g.dorcha!==dorcha)throw Error('Surge consumed Dorcha');
  if(g.score-before<1500)throw Error('Surge is not a significant damage burst');
  if(g.chart.events[0].t<=8||g.chart.duration<=old)throw Error('Offensive chart must shift during burst cast');
  if(a.activateSurge())throw Error('Cooldown must block another burst');
  return {burst:g.score-before,dorcha:g.dorcha,charge:g.surgeCharge,casts:g.surgeCasts};
 }''')
 assert not errors,errors
 print('PASS Theta286 charge once per cast, off-state, cap, zero-Dorcha Surge, big score, cooldown and chart protection:',r)
 b.close()
