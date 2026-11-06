"""Blue Echostone single-line reforge precedence and music gear migration."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in list(soup.find_all(['script','link','base'])): x.decompose()
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in ((320,568),(390,844),(844,390)):
  page=b.new_page(viewport={'width':w,'height':h},has_touch=True,is_mobile=w<600)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('button[data-act="hub:music-lie"]').click()
  assert page.locator('.music-gear-item').count()==9
  assert page.locator('.music-gear-slot-placeholder').count()==0
  assert page.locator('.music-gear-item[data-music-slot="Blue Echostone"]').count()==1
  assert page.locator('.music-gear-panel').evaluate('(e)=>e.scrollWidth<=e.clientWidth+2')
  def editor(slot):page.locator(f'[data-music-gear-action="edit"][data-music-gear-slot="{slot}"]').click()
  def close():page.locator('[data-music-gear-action="close"]').first.click()
  def roll(slot, key, level):
   editor(slot);page.locator('[data-music-gear-reforge="0"]').select_option(key)
   page.locator('[data-music-gear-level="0"]').fill(str(level))
   page.locator('[data-music-gear-level="0"]').dispatch_event('change');close()
  roll('Accessory 1','musicInspiringEffect',4)
  roll('Accessory 2','musicInspiringEffect',3)
  roll('Instrument','musicInspiringEffect',3)
  assert 'Inspiring reforge +10' in page.locator('.music-gear-tier-values').inner_text()
  editor('Blue Echostone')
  assert page.locator('[data-music-gear-reforge]').count()==1
  assert page.locator('[data-music-gear-murias]').count()==0
  assert page.locator('[data-music-enchant-slot]').count()==0
  assert page.locator('[data-music-gear-item-override]').count()==0
  page.locator('[data-music-gear-reforge="0"]').select_option('musicInspiringEffect')
  assert int(page.locator('[data-music-gear-level="0"]').get_attribute('max'))>=10
  page.locator('[data-music-gear-level="0"]').fill('10');page.locator('[data-music-gear-level="0"]').dispatch_event('change');close()
  assert 'Inspiring reforge +10' in page.locator('.music-gear-tier-values').inner_text()
  editor('Blue Echostone');page.locator('[data-music-gear-level="0"]').fill('5');page.locator('[data-music-gear-level="0"]').dispatch_event('change');close()
  assert 'Inspiring reforge +5' in page.locator('.music-gear-tier-values').inner_text(), 'Echo 5 exceeds each gear roll (4,3,3) and replaces the group'
  editor('Blue Echostone');page.locator('[data-music-gear-level="0"]').fill('3');page.locator('[data-music-gear-level="0"]').dispatch_event('change');close()
  assert 'Inspiring reforge +10' in page.locator('.music-gear-tier-values').inner_text(), 'Echo 3 does not exceed strongest 4'
  editor('Blue Echostone');page.locator('[data-music-gear-reforge="0"]').select_option('playingInstrumentReforge');close()
  assert 'Inspiring reforge +10' in page.locator('.music-gear-tier-values').inner_text()
  # The physical Echostone is shared by a duplicated set, unless copied.
  page.locator('details.music-gear-more summary').click()
  page.locator('[data-music-gear-action="copy-tab"]').click()
  assert page.locator('.music-gear-tabs button').count()==2
  editor('Blue Echostone')
  assert page.locator('[data-music-gear-reforge="0"]').input_value()=='playingInstrumentReforge'
  page.locator('[data-music-gear-action="copy-item"]').click()
  page.locator('[data-music-gear-reforge="0"]').select_option('musicInspiringRateReforge')
  close()
  page.locator('.music-gear-tabs button').first.click()
  editor('Blue Echostone')
  assert page.locator('[data-music-gear-reforge="0"]').input_value()=='playingInstrumentReforge'
  close()
  assert not errors,errors
  print(w,h,'PASS')
  page.close()
 b.close()
