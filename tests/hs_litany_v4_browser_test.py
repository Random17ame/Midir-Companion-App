"""Litany v4 layout and interactions: wand-only controls, offhand, buttons and scroll."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(1200,800),(390,844),(320,568)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<400)
  page.set_default_timeout(10000)
  errors=[]
  page.on('pageerror', lambda ex:errors.append(str(ex)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
   page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for script in scripts:
   page.add_script_tag(content=(root/'Companion Files'/script).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('[data-act="hub:litany"]').click()
  assert page.locator('#hsl .hsl-board .hsl-gear-cell').count()==10
  assert page.locator('#hsl .hsl-weapon').count()==0
  assert page.locator('#hsl .hsl-head [data-hsl-reset]').count()==1
  assert page.locator('#hsl .hsl-footer [data-hsl-reset]').count()==0
  assert page.locator('[data-hsl-key="wandType"]').count()==0, 'Wand controls leaked out of wand slot'
  assert not any('\uac00'<=c<='\ud7a3' for c in page.locator('#hsl').inner_text())
  page.locator('[data-hsl-open="slot:wand"]').click()
  assert page.locator('.hsl-wand-controls [data-hsl-key="wandType"]').count()==1
  assert page.locator('[data-hsl-key="slots.wand.setPoints"]').count()==0
  page.locator('[data-hsl-key="wandType"]').select_option('nightbringer')
  assert page.locator('.hsl-wand-controls [data-hsl-key="gradeTier"] option').count()==5
  assert '200.34' in page.locator('.hsl-editor-head').inner_text()
  page.locator('[data-hsl-key="gradeTier"]').select_option('common')
  assert '124.02' in page.locator('.hsl-editor-head').inner_text()
  page.locator('[data-hsl-key="wandType"]').select_option('soul')
  assert page.locator('[data-hsl-key="gradeTier"] option').count()==1
  assert '235.32' in page.locator('.hsl-editor-head').inner_text()
  page.locator('[data-hsl-key="gradeOverride"]').fill('100')
  page.locator('[data-hsl-key="gradeOverride"]').dispatch_event('change')
  assert '222.6' in page.locator('.hsl-editor-head').inner_text()
  page.locator('[data-hsl-key="ergRank"]').select_option('S')
  page.locator('[data-hsl-key="ergLevel"]').select_option('50')
  assert '243.8' in page.locator('.hsl-editor-head').inner_text()
  assert page.locator('[data-hsl-key="slots.wand.reforges.0.key"]').count()==1
  assert page.locator('[data-hsl-key="slots.wand.murias.enabled"]').count()==1
  assert page.locator('[data-hsl-key="slots.wand.prefix.name"]').count()==1
  assert page.locator('[data-hsl-key="slots.wand.suffix.name"]').count()==1
  # Scroll preservation on repeated wand changes (editor has enough sections to scroll).
  scroll='.hsl-editor-scroll'
  page.locator(scroll).evaluate('(el)=>el.scrollTop=Math.min(260,el.scrollHeight-el.clientHeight)')
  old=page.locator(scroll).evaluate('(el)=>el.scrollTop')
  page.locator('[data-hsl-key="slots.wand.reforges.0.key"]').select_option('party')
  after=page.locator(scroll).evaluate('(el)=>el.scrollTop')
  assert abs(after-old)<5,('wand editor scroll reset',old,after,w)
  page.locator('[data-hsl-close]').first.click()
  assert page.locator('#hsl [data-hsl-open="slot:wand"] small').inner_text()=='Soul Liberator Healing Wand'
  # Offhand: only relevant inputs and no healing-reforge lines.
  page.locator('[data-hsl-open="slot:offhand"]').click()
  assert page.locator('[data-hsl-key="slots.offhand.type"]').count()==1
  page.locator('[data-hsl-key="slots.offhand.type"]').select_option('shield')
  assert page.locator('[data-hsl-key="slots.offhand.gradeTier"] option').count()==5
  assert page.locator('[data-hsl-key="slots.offhand.gradePct"]').count()==1
  assert page.locator('[data-hsl-key="slots.offhand.reforges.0.key"]').count()==0
  assert page.locator('[data-hsl-key="slots.offhand.prefix.name"]').count()==1
  assert page.locator('[data-hsl-key="slots.offhand.suffix.name"]').count()==1
  assert page.locator('[data-hsl-key="slots.offhand.murias.enabled"]').count()==1
  assert page.locator('[data-hsl-key="slots.offhand.setPoints"]').count()==1
  page.locator('[data-hsl-key="slots.offhand.gradeTier"]').select_option('masterwork')
  page.locator('[data-hsl-key="slots.offhand.gradePct"]').fill('10')
  page.locator('[data-hsl-key="slots.offhand.gradePct"]').dispatch_event('change')
  assert '254.4' in page.locator('.hsl-editor-head').inner_text()
  page.locator('[data-hsl-key="slots.offhand.type"]').select_option('spellbook')
  assert 'Spellbook' in page.locator('.hsl-editor').inner_text()
  page.locator('[data-hsl-close]').first.click()
  assert page.locator('[data-hsl-open="slot:offhand"] small').inner_text()=='Spellbook'
  # Buttons below equipment should be interactive and visibly respond to checkboxes.
  page.locator('[data-hsl-key="boosts.pulse.enabled"]').check()
  assert 'is-on' in (page.locator('.hsl-boost:has([data-hsl-key="boosts.pulse.enabled"])').get_attribute('class') or '')
  assert page.locator('[data-hsl-open="boost:pulse"]').count()==0
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),('horizontal overflow',w)
  page.locator('#companion-language').select_option('ko')
  assert '음파의 세례' in page.locator('#hsl').inner_text()
  page.locator('[data-hsl-open="slot:offhand"]').click()
  assert '보조 장비 종류' in page.locator('.hsl-editor').inner_text()
  assert '마법서' in page.locator('.hsl-editor').inner_text()
  assert '등급 보너스' in page.locator('.hsl-editor').inner_text()
  assert 'Offhand type' not in page.locator('.hsl-editor').inner_text()
  page.locator('[data-hsl-close]').first.click()
  page.locator('#hsl .hsl-head [data-hsl-reset]').click()
  assert '보조 장비' in page.locator('#hsl').inner_text()
  assert page.locator('#hsl [data-hsl-open="slot:offhand"] small').inner_text()=='없음'
  assert not errors,errors
  if w==1200:page.screenshot(path='/mnt/data/hs_v4_desktop.png',full_page=False)
  if w==390:page.screenshot(path='/mnt/data/hs_v4_mobile.png',full_page=False)
  print('PASS Litany v4',w,h,flush=True)
  page.close()
 browser.close()
