"""Gear editor retains internal scroll position and numeric focus after live recalculation."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(320,568),(390,844),(844,390)]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=True,is_mobile=w<600)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('button[data-act="hub:music-lie"]').click()
  page.locator('[data-music-gear-action="edit"][data-music-gear-slot="Instrument"]').click()
  editor='.music-enchant-editor'
  assert page.locator(editor).evaluate('(e)=>e.scrollHeight>e.clientHeight+100'), 'test requires scrollable dialog'
  page.locator(editor).evaluate('(e)=>e.scrollTop=240')
  old=page.locator(editor).evaluate('(e)=>e.scrollTop')
  assert old>=200,(w,h,old)
  # A reforge selection replaces the editor DOM, but must not reset its scroll.
  page.locator('[data-music-gear-reforge="0"]').select_option('playingInstrumentReforge')
  new=page.locator(editor).evaluate('(e)=>e.scrollTop')
  assert abs(new-old)<3, ('reforge scroll reset',w,h,old,new)
  number=page.locator('[data-music-gear-level="0"]')
  number.fill('5')
  before_level=page.locator(editor).evaluate('(e)=>e.scrollTop')
  number.dispatch_event('change')
  latest=page.locator(editor).evaluate('(e)=>e.scrollTop')
  assert abs(latest-before_level)<3,('level scroll reset',w,h,before_level,latest)
  assert page.locator('[data-music-gear-level="0"]').input_value()=='5'
  assert page.locator('[data-music-gear-level="0"]').evaluate('(e)=>document.activeElement===e')
  assert not errors,errors
  print(w,h,'PASS')
  page.close()
 b.close()
