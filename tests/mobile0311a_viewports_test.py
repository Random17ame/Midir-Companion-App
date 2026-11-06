"""EV complete onboarding + Theta performance across small portrait, portrait and landscape viewports."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser');scripts=[t.get('src') for t in soup.select('script[src]')]
for e in list(soup.find_all(['script','link','base'])):e.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(320,568),(390,844),(844,390)]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=True,is_mobile=True)
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(str(soup),wait_until='load')
  for name in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/name).read_text())
  for name in scripts:page.add_script_tag(content=(root/'Companion Files'/name).read_text())
  page.locator('nav button[data-page="rotation"]').click();page.locator('#rotation-lab-arcana').select_option('ev');page.locator('button[data-act="hub:ev-defense"]').click()
  patrol=page.locator('.evtd-mobile-controls [data-evtd="patrol-next"]');bb=patrol.bounding_box()
  assert bb['x']>=0 and bb['x']+bb['width']<=w,(w,bb)
  patrol.click()
  page.locator('#evtd-tutorial [data-evtd-tutorial-confirm]').click()
  page.locator('[data-evtd="open-base"]').first.click()
  final=page.locator('#evtd-base-panel [data-evtd-tutorial-confirm]');bb=final.bounding_box()
  assert bb['y']>=0 and bb['y']+bb['height']<=h,(w,h,bb)
  final.click();assert page.locator('#evtd-tutorial').is_hidden() and page.locator('#evtd-drawer').is_hidden()
  page.locator('[data-evtd="start"]').first.click();assert 'Wave 1' in page.locator('#evtd-note').inner_text()
  page.locator('button[data-act="hub:home"]').first.click();page.locator('#rotation-lab-arcana').select_option('dd');page.locator('button[data-act="hub:theta"]').click()
  page.locator('[data-theta="start"]').click()
  canvas=page.locator('#theta-canvas');assert canvas.get_attribute('data-performance')=='on'
  assert canvas.evaluate('(e)=>e.width*e.height')<1120*690
  page.wait_for_timeout(350);assert page.locator('#theta-live').inner_text()
  assert not errs,errs
  print(f'EV + Theta {w}x{h} PASS')
  page.close()
 b.close()
