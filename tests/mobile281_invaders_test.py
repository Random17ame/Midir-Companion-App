"""281 isolated mobile Invaders controller smoke test (real-device PWA still pending)."""
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
 page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for file in scripts:
  script=(root/'Companion Files'/file).read_text()
  if file=='as-chicken-invaders.js':
   script=script.replace('window.MIDIR_AS_INVADERS={','window.__as281={start,refreshShell,phase:()=>phase,touch:()=>({...touchMove}),world:()=>world,resetTouch};window.MIDIR_AS_INVADERS={')
  page.add_script_tag(content=script)
 page.locator('nav [data-page="rotation"]').click()
 page.locator('#rotation-lab-arcana').select_option('as')
 btn=page.locator('[data-act="hub:as-invaders"]')
 assert btn.count()==1 and not btn.is_disabled()
 btn.click()
 assert page.locator('.asci-mobile-layout').count()==1
 assert page.locator('.asci-joystick').count()==1
 assert page.locator('[data-asci-touch]').count()==9
 assert page.evaluate('(()=>{let c=document.querySelector("#asci-canvas");return c.width/c.height})()')==800/620
 # Unlock using normal importState: no save-format changes.
 page.evaluate("window.MIDIR_AS_INVADERS.importState({...window.MIDIR_AS_INVADERS.exportState(),skills:{aqua:true,terra:true,anchor:true}})")
 page.evaluate('window.__as281.refreshShell()')
 page.evaluate('window.__as281.start()')
 page.evaluate('window.MIDIR_AS_INVADERS.bind()')
 # Simulate simultaneous separate touches: joystick moves and Aqua charges until release.
 result=page.evaluate('''()=>{
 const j=document.querySelector('.asci-joystick'),r=j.getBoundingClientRect();
 j.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:21,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));
 j.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:21,clientX:r.right,clientY:r.top+r.height/2}));
 const a=document.querySelector('[data-asci-touch="aqua"]');
 a.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:22}));
 const during={phase:window.__as281.phase(),disabled:a.disabled,skill:window.MIDIR_AS_INVADERS.exportState().skills.aqua,move:window.__as281.touch().x,charging:!!window.__as281.world().aquaCharge};
 a.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:22}));
 j.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:21}));
 return {...during,moveAfter:window.__as281.touch().x,chargingAfter:!!window.__as281.world().aquaCharge};
 }''')
 assert result['move']>.9 and result['charging'] and result['moveAfter']==0 and not result['chargingAfter'],result
 page.evaluate('window.__as281.resetTouch()')
 assert not errors,errors
 b.close()
print('PASS 281 mobile Invaders enabled, fixed aspect, independent joystick/hold-release, no JS exceptions')
