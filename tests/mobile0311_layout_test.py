from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t.get('src') for t in soup.select('script[src]')]
for t in list(soup.find_all(['script','link','base'])):t.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup),wait_until='load')
 page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
 page.add_style_tag(content=(root/'Companion Files/vertrag-survival.css').read_text())
 for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text())
 def nav(x):page.locator(f'nav button[data-page="{x}"]').click()
 def arc(x):
  nav('rotation')
  back=page.locator('button[data-act="hub:home"]')
  if back.count():back.first.click()
  page.locator('#rotation-lab-arcana').select_option(x)
 def hub(x):page.locator(f'button[data-act="hub:{x}"]').first.click()
 # Vertrag
 arc('as');hub('vertrag')
 page.locator('#vt-setup-canvas').wait_for()
 canvas=page.locator('#vt-setup-canvas').bounding_box();controls=page.locator('.vt-preview-center').bounding_box()
 assert controls['y']>=canvas['y']+canvas['height']-2,(canvas,controls)
 assert page.locator('[data-vt="trial"]').count()>0
 print('VERTRAG: PASS setup modes below clickable giants')
 # Pig
 arc('ek');hub('pig')
 page.locator('#ek-pig-start').wait_for()
 o=page.locator('#ek-pig-overlay').bounding_box();btn=page.locator('#ek-pig-start').bounding_box()
 assert btn['y']>=o['y'] and btn['y']+btn['height']<=o['y']+o['height']+1,(o,btn)
 print('PIG: PASS launch button fits overlay')
 # Bandit
 arc('bb');hub('bb-bandit')
 page.locator('#bb-start-hunt').click()
 # Need start a tile; game selects tile by tapping
 page.locator('[data-bb-flip]').first.click()
 page.locator('.bb-bandit-actions button').first.wait_for()
 assert page.locator('.bb-bandit-actions button .bb-action-caption').first.evaluate('(el)=>getComputedStyle(el).display')=='none'
 print('BANDIT: PASS icon-only response buttons')
 # MP
 arc('mp');hub('rhythm')
 stage=page.locator('#mp-rhythm-stage').bounding_box();bank=page.locator('.mp-touch-keys').bounding_box()
 assert bank['y']>=stage['y']+stage['height']-4
 assert bank['height']<390,(stage,bank)
 assert page.locator('.mp-touch-keys .mp-touch-skill').count()==13
 assert page.locator('.mp-touch-keys').evaluate('(el)=>getComputedStyle(el).overflowY')!='auto'
 print('MP: PASS no internally scrolling key bank, 13 skills visible in compact panel')
 # AG
 arc('ag');hub('ag-position')
 fire=page.locator('button[data-act="ag-fire"]').bounding_box();ag=page.locator('#ag-position-arena').bounding_box()
 assert fire['y']+fire['height']<=ag['y']+3,(fire,ag)
 assert page.locator('button[data-act="ag-tool:field"]').count() and page.locator('button[data-act="ag-tool:artillery"]').count()
 print('AG: PASS action toolbar above diagram')
 # Herb
 arc('fa');hub('herbs')
 image=page.locator('#herb-pick img').bounding_box();hitbox=page.locator('#herb-pick').bounding_box()
 assert image['width']>=30 and hitbox['width']-image['width']<10,(image,hitbox)
 print('HERBS: PASS target within 10px of enlarged sprite')
 # EV
 arc('ev');hub('ev-defense')
 panel=page.locator('#evtd-tutorial')
 assert panel.is_visible()
 button=page.locator('[data-evtd-tutorial-confirm]')
 assert button.count()==1
 b=button.bounding_box();pr=panel.bounding_box()
 assert b['y']>=pr['y']-1 and b['y']+b['height']<=pr['y']+pr['height']+2,(b,pr)
 print('EV: PASS tutorial button remains within visible help panel')
 assert not errors,errors
 browser.close()
