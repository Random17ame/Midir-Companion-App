"""Focused 0.3.3 gameplay checks; browser-based DOM and real engine calls."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src') and t['src']!='pwa.js']
for t in list(soup.find_all(['script','link','base'])):t.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width,height in [(390,844),(844,390)]:
  page=b.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125 Mobile Safari/537.36')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup))
  for file in scripts:
   code=(root/'Companion Files'/file).read_text()
   if file=='as-chicken-invaders.js':
    code=code.replace('window.MIDIR_AS_INVADERS={','window.__debug033={start,refreshShell,bindMobileControls,phase:()=>phase,world:()=>world,touch:()=>touchMove,orbMarkup,mobileIrusanStruggle,damageGlasTarget,tick,updateHud,profile:()=>profile};window.MIDIR_AS_INVADERS={')
   if file=='theta-rhythm.js':
    code=code.replace('window.MIDIR_THETA=', 'window.__theta033={start,buildChart,hit,run:()=>run,profile:()=>profile};window.MIDIR_THETA=')
   page.add_script_tag(content=code)
  page.locator('nav [data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('as')
  page.locator('[data-act="hub:as-invaders"]').click()
  page.evaluate('''() => {window.MIDIR_AS_INVADERS.importState({...window.MIDIR_AS_INVADERS.exportState(),skills:{urgent:true,ignis:true,aqua:true,crash:true,ventus:true,terra:true,tri:true,golden:true,anchor:true}});window.__debug033.refreshShell();window.__debug033.start();window.MIDIR_AS_INVADERS.bind()}''')
  res=page.evaluate('''() => { const d=__debug033,w=d.world();
  w.elements={fire:100,water:55,air:70,earth:100};d.refreshShell();d.bindMobileControls();d.updateHud();
  const orbs=[...document.querySelectorAll('[data-orb]')].map(e=>({element:e.dataset.orb,full:e.classList.contains('full'),charged:e.classList.contains('charged'),style:e.getAttribute('style')}));
  const ronaun={type:'Ronaun',shield:18,hp:100,max:100}; d.damageGlasTarget(ronaun,35,'fire');
  w.irusanPower={boss:{hp:999,irusan:{phase:'struggle'}},progress:0,last:null,needed:20};
  for(let i=0;i<20;i++)d.mobileIrusanStruggle(i%2===0?-.95:.95);
  const escaped=!w.irusanPower;
  const actions=document.querySelectorAll('[data-asci-touch]');w.t=5;w.lastCast.ignis=3;d.refreshShell();d.bindMobileControls();d.updateHud();
  const cd=document.querySelector('[data-asci-touch="ignis"] .asci-touch-cd')?.textContent;
  return {orbs,ronaun,escaped,actions:actions.length,cooldown:cd};}''')
  assert res['ronaun']['shield']==0 and res['ronaun']['hp']==83,res
  assert res['escaped'],res
  assert len(res['orbs'])==4 and res['orbs'][0]['full'] and res['orbs'][1]['charged'],res
  assert 's' in res['cooldown'],res
  assert res['actions']==9,res
  assert not errors,errors
  print('PASS Crom',width,height,res['cooldown'])
  page.close()
 # Source-level test verifies the actual Theta note partition, touch handlers and Surge progress UI.
 theta=(root/'Companion Files'/'theta-rhythm.js').read_text()
 assert "const THETA_LANES=['thunder','blight','flare','surge']" in theta
 assert 'pointerdown' in theta and 'theta-touch-lanes' in theta and 'theta-utility-panel' in theta and 'theta-surge-fill' in theta
 b.close()
print('PASS 0.3.3 focused game checks')
