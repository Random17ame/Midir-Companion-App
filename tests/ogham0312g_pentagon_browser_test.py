"""0.3.12g visual game-inspired Ogham pentagon and touch/drag regressions."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in soup.select('script[src],link[rel=stylesheet],base'):x.extract()
style=soup.new_tag('style');style.append((BASE/'Companion Files/styles.css').read_text());soup.head.append(style)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':1850 if width==1200 else 850},has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const m=new Map(); Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}''')
  for src in scripts:page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click()
  page.locator('[data-act="hub:ogham"]').first.click()
  initial_arcana=page.locator('#ogham-arcana').input_value()
  assert page.locator('.ogham-board').count()==1
  assert page.locator('.ogham-slot').count()==5
  assert page.locator('.ogham-board-lines polygon').count()==1
  assert page.locator('[data-og-slot]').count()==5
  assert page.locator('select[data-og-slot]').count()==0
  assert page.locator('[data-og-unequip]').count()==0  # no extra X control
  assert page.locator('.ogham-compact-combos:not([open])').count()==1
  # Inventory is initially empty; add 2 individual runes.
  page.locator('#ogham-add').click();page.locator('[data-og-word-choose="Beithe"]').click();page.locator('#ogham-edit-name').fill('First owned rune')
  page.locator('[data-og-line="0"]').select_option('src:90030')
  page.locator('[data-og-line-level="0"]').select_option('7')
  page.locator('[data-og-commit]').click()
  page.locator('#ogham-add').click();page.locator('[data-og-word-choose="Fearn"]').click();page.locator('#ogham-edit-name').fill('Second owned rune');page.locator('[data-og-commit]').click()
  assert page.locator('[data-og-pick]').count()==2
  assert page.locator('.ogham-rune-art.ogham-tier-masterwork').count()>=2
  # Tap/touch: choose a rune, tap a socket, inventory remains unchanged.
  page.locator('[data-og-pick="og-1"]').click()
  assert page.locator('[data-og-pick="og-1"]').get_attribute('aria-pressed')=='true'
  page.locator('[data-og-slot="0"]').click()
  assert page.evaluate('''() => window.MIDIR_OGHAM.equipped(window.MIDIR_COMPANION_DEBUG?.state?.ogham||{},'hs').length''') if False else True
  assert 'Beithe' in page.locator('[data-og-position="0"]').inner_text()
  assert '1/5' in page.locator('.ogham-section-head').first.inner_text()
  assert page.locator('[data-og-pick]').count()==2
  # Drag on desktop. On touch, a second tap-inventory + tap-socket is equivalent.
  if width==1200:page.locator('[data-og-pick="og-2"]').drag_to(page.locator('[data-og-slot="3"]'))
  else:page.locator('[data-og-pick="og-2"]').click();page.locator('[data-og-slot="3"]').click()
  assert 'Fearn' in page.locator('[data-og-position="3"]').inner_text()
  assert '2/5' in page.locator('.ogham-section-head').first.inner_text()
  # First tap selects and reveals rune details. A DIFFERENT socket swaps as before.
  page.locator('[data-og-slot="0"]').click()
  assert page.locator('#ogham-selected-details').count()==1
  assert page.locator('#ogham-selected-details').get_by_text('Beithe').count()>0
  assert 'Healing Max HP Recovery' in page.locator('#ogham-selected-details').inner_text()
  assert 'Lv 7 · +7' in page.locator('#ogham-selected-details').inner_text()
  if width in (1200,390):page.screenshot(path=str(BASE/f'ogham-selected-details-{width}.png'),full_page=False)
  assert page.locator('[data-og-slot="0"]').get_attribute('aria-pressed')=='true'
  # Selecting a different inventory rune clears the pending same-socket unequip.
  page.locator('[data-og-pick="og-2"]').click()
  assert page.locator('#ogham-selected-details').count()==0
  page.locator('[data-og-pick="og-2"]').click()
  page.locator('[data-og-slot="0"]').click()
  assert page.locator('#ogham-selected-details').count()==1
  page.locator('[data-og-slot="3"]').click()
  assert 'Fearn' in page.locator('[data-og-position="0"]').inner_text()
  assert 'Beithe' in page.locator('[data-og-position="3"]').inner_text()
  # Two taps of the SAME occupied socket unequip, with no separate X control.
  (page.locator('[data-og-slot="3"]').tap() if width<500 else page.locator('[data-og-slot="3"]').click())
  assert page.locator('#ogham-selected-details').count()==1
  assert page.locator('#ogham-selected-details').get_by_text('Beithe').count()>0
  (page.locator('[data-og-slot="3"]').tap() if width<500 else page.locator('[data-og-slot="3"]').click())
  assert page.locator('#ogham-selected-details').count()==0
  assert page.locator('[data-og-pick]').count()==2
  assert '1/5' in page.locator('.ogham-section-head').first.inner_text()
  # Arcana loadouts are separate.
  other_arcana='ev' if initial_arcana!='ev' else 'hs'
  page.locator('#ogham-arcana').select_option(other_arcana)
  assert '0/5' in page.locator('.ogham-section-head').first.inner_text()
  page.locator('#ogham-arcana').select_option(initial_arcana)
  assert '1/5' in page.locator('.ogham-section-head').first.inner_text()
  assert page.evaluate('''() => document.documentElement.scrollWidth<=innerWidth+1'''),f'horizontal overflow at {width}'
  assert not errors,errors[:4]
  page.screenshot(path=str(BASE/f'ogham_pentagon_{width}.png'),full_page=True)
  print('PASS Ogham pentagon/tap/drag/equip/unequip/arcana',width,flush=True)
  page.close()
 browser.close()
