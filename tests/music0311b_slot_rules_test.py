"""0.3.11b music equipment board, canonical reforge pool, slot set effects and link/copy behavior."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t.get('src') for t in soup.select('script[src]')]
for t in list(soup.find_all(['script','link','base'])):t.decompose()

def open_editor(page,slot):
 page.locator(f'button[data-music-gear-action="edit"][data-music-gear-slot="{slot}"]').click()
 assert page.locator('.music-enchant-editor h3').inner_text()==slot

def close_editor(page):page.locator('button[data-music-gear-action="close"]').first.click()

with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
 for (width,height) in ((320,568),(390,844),(844,390)):
  page=b.new_page(viewport={'width':width,'height':height},has_touch=True,is_mobile=width<600,device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
   page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for name in scripts:page.add_script_tag(content=(root/'Companion Files'/name).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('button[data-act="hub:music-lie"]').click()
  assert page.locator('.music-gear-item').count()==9
  assert page.locator('.music-gear-slot-placeholder').count()==0
  assert page.locator('[data-music-input="troubadourSetEffectBuff"]').count()==0
  assert not errors,errors
  if width==320:
   panel=page.locator('.music-gear-panel'); assert panel.evaluate('(e)=>e.scrollWidth<=e.clientWidth+2'), 'gear panel horizontally overflows'
  # The application loaded the canonical Reforge Simulator table and its slot caps.
  rows=page.evaluate('window.MIDIR_REFORGE_TABLE.reforge')
  def rule(name,category):
   return next((r for r in rows if r['name']==name and category in [x.strip() for x in r['type'].split(',')]),None)
  assert rule('Musical Knowledge Inspiring Performance Effect','Accessories')['max']==3
  assert rule('Musical Knowledge Inspiring Performance Effect','Accessories')['limitMax']==4
  assert rule('Musical Knowledge Inspiring Performance Effect','Instruments')['limitMax']==13
  assert rule('Enduring Melody Defense','Handgear')['max']==3
  assert rule('March Song Walking Speed','Footwear')['limitMax']==4
  def stat(key='bo_damage'):
   page.locator('[data-music-input="musicSkillBaseEffectKey"]').select_option(key)
   return float(page.locator('.music-result-strip > div').first.locator('strong').inner_text().replace(',',''))
  # Wings: music effect stat, separately listed inspiring-rate bonus. No reforge option.
  base=stat('bo_damage')
  open_editor(page,'Wings')
  assert page.locator('[data-music-gear-reforge]').count()==0
  page.locator('[data-music-gear-set-effect="Wings"]').select_option('ethereal-chiffon')
  assert 'Inspiring Performance Rate +2' in page.locator('.music-gear-set-editor').inner_text()
  close_editor(page)
  assert stat('bo_damage')==base+1
  assert 'Rate +2' in page.locator('.music-gear-totals').inner_text()
  # Gloves: optional Seraphic BFO +5, not globally inherited by unrelated songs.
  bo=stat('bo_damage')
  enduring=stat('enduring_def')
  open_editor(page,'Gloves')
  page.locator('[data-music-gear-set-effect="Gloves"]').select_option('seraphic-bangles')
  close_editor(page)
  assert stat('bo_damage')==bo+5
  assert stat('enduring_def')==enduring
  # Same-name combination effects never stack: strongest BFO wins, while
  # Troubadour's separate Enduring Melody bonus remains active.
  stacked_bo=stat('bo_damage'); stacked_enduring=stat('enduring_def')
  open_editor(page,'Body')
  page.locator('[data-music-gear-set-effect="Body"]').select_option('troubadour-body')
  close_editor(page)
  assert stat('bo_damage')==stacked_bo, 'Seraphic BFO +5 must override Troubadour BFO +3, not total +8'
  assert stat('bo_crit')>0
  assert stat('enduring_def')==stacked_enduring+3, 'Unrelated Troubadour Enduring +3 must remain'
  open_editor(page,'Gloves')
  page.locator('[data-music-gear-set-effect="Gloves"]').select_option('')
  close_editor(page)
  assert stat('bo_damage')==stacked_bo-2, 'When Seraphic is removed, Troubadour BFO +3 must resume'
  assert stat('enduring_def')==stacked_enduring+3
  # Reforges: limit breaks allowed only up to source cap, duplicate lines absent.
  open_editor(page,'Accessory 1')
  assert page.locator('select[data-music-gear-reforge="0"] option[value="playingInstrumentReforge"]').count()==0
  page.locator('select[data-music-gear-reforge="0"]').select_option('musicInspiringEffect')
  assert page.locator('input[data-music-gear-level="0"]').get_attribute('max')=='4'
  assert page.locator('select[data-music-gear-reforge="1"] option[value="musicInspiringEffect"]').count()==0
  page.locator('input[data-music-gear-level="0"]').fill('4')
  page.locator('input[data-music-gear-level="0"]').dispatch_event('change')
  assert 'LIMIT BREAK ACTIVE' in page.locator('.music-gear-reforge').first.inner_text()
  close_editor(page)
  assert 'Inspiring reforge +4' in page.locator('.music-gear-tier-values').inner_text()
  open_editor(page,'Instrument')
  page.locator('select[data-music-gear-reforge="0"]').select_option('musicInspiringEffect')
  assert page.locator('input[data-music-gear-level="0"]').get_attribute('max')=='13'
  assert page.locator('[data-music-instrument-stat="itemGradeQuality"]').count()==1
  assert page.locator('[data-music-instrument-stat="musicSpecialUpgrades"]').count()==1
  close_editor(page)
  open_editor(page,'Boots')
  assert page.locator('select[data-music-gear-reforge="0"] option[value="musicInspiringEffect"]').count()==0
  assert page.locator('select[data-music-gear-reforge="0"] option[value="marchWalkingSpeed"]').count()==1
  page.locator('[data-music-gear-set-effect="Boots"]').select_option('troubadour-boots')
  close_editor(page)
  assert not errors,errors
  print(f'{width}×{height} equipment board, set rules, source reforge caps & limit breaks: PASS')
  page.close()
 b.close()
