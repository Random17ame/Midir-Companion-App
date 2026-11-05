"""Theta 284: Seething Mana OFF recovers Dorcha on offensive hits, ON trades it for points."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
src=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__thetaAudit=()=>({run,profile,normalHitDorchaGain,seethingCost,hit,thunderPulse});window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(); errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content('<div id="theta-root"></div>');page.add_script_tag(content=src);page.evaluate('MIDIR_THETA.mount()')
 def attack(mode, skill='thunder', initial=10, hex=False):
  page.evaluate('MIDIR_THETA.mount()')
  page.locator('[data-theta="start"]').click()
  return page.evaluate('''({mode,skill,initial,hex})=>{
   const a=__thetaAudit(),r=a.run;
   cancelAnimationFrame(0);r.start=performance.now()-1000;r.t=1;r.dorcha=initial;r.mp=r.mpMax;
   r.chart.events=[{id:skill,t:1,done:false}];r.seething=mode;
   if(hex)r.hexUntil=10;
   a.hit(skill);if(skill==='thunder')a.thunderPulse(3);
   const result={dorcha:r.dorcha,score:r.score,seethingHits:r.seethingHits};
   return result;
  }''', {'mode':mode,'skill':skill,'initial':initial,'hex':hex})
 off=attack(False);on=attack(True)
 assert abs(off['dorcha']-10.5)<.01,off
 assert abs(on['dorcha']-9.2)<.01,on
 assert on['score']>off['score'],(on,off)
 assert on['seethingHits']==1 and off['seethingHits']==0
 flare=attack(False,'flare');assert abs(flare['dorcha']-9.5)<.01,flare
 hexoff=attack(False,'thunder',10,True);assert abs(hexoff['dorcha']-13.5)<.01,hexoff
 hexon=attack(True,'thunder',10,True);assert abs(hexon['dorcha']-12.2)<.01,hexon
 hexoff_flare=attack(False,'flare',10,True);assert abs(hexoff_flare['dorcha']-10)<.01,hexoff_flare
 hexon_flare=attack(True,'flare',10,True);assert abs(hexon_flare['dorcha']-8.4)<.01,hexon_flare
 assert hexon['score']==on['score'],(hexon,on) # Hexshroud restores resources, not a separate score multiplier
 cap=attack(False,'thunder',14.9);assert cap['dorcha']==15,cap
 assert not errors, errors
 print('PASS Theta284 Seething/Hexshroud independently and together, base and skill costs, score isolation, cap')
 b.close()
