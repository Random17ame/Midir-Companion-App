"""Isolated real-script UI test when local navigations are blocked by browser policy."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in soup.select('script[src], link[rel=stylesheet],base'):
 x.extract()
style=soup.new_tag('style')
for f in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
 style.append((BASE/'Companion Files'/f).read_text())
soup.head.append(style)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [1200,390,320]:
  page=browser.new_page(viewport={'width':width,'height':840})
  failures=[]
  page.on('pageerror',lambda e:failures.append(str(e)))
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate("""() => {
    const memory = new Map();
    const storage = {getItem: k => memory.has(k) ? memory.get(k) : null,
      setItem: (k,v) => memory.set(String(k), String(v)),
      removeItem: k => memory.delete(k), clear: () => memory.clear(),
      key: i => [...memory.keys()][i] || null,
      get length(){return memory.size;}};
    Object.defineProperty(window, 'localStorage', {configurable:true, value:storage});
  }""")
  for src in scripts:
   page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.wait_for_timeout(220)
  print('width',width,'page title',page.title(),'initial errors',failures[:3],flush=True)
  assert not failures, failures[:5]
  page.locator('[data-page="rotation"]').first.click()
  assert page.locator('[data-act="hub:ogham"]').count()==1, 'Arcana Rune navigation not present'
  page.locator('[data-act="hub:ogham"]').first.click()
  assert page.locator('#ogham-root').count()==1
  assert page.locator('.ogham-slot').count()==5
  assert page.locator('.ogham-combo').count()==3
  page.locator('#ogham-add').click()
  page.locator('[data-og-word-choose="Beithe"]').click()
  assert page.locator('#ogham-editor').count()==1
  page.locator('#ogham-edit-name').fill('First Rune')
  page.locator('[data-og-commit]').click()
  assert 'First Rune' in page.locator('[data-og-inventory="owned"]').inner_text()
  assert page.evaluate("() => window.localStorage.length > 0"), 'profile not saved'
  page.screenshot(path=str(Path('/tmp')/f'ogham_inventory_{width}.png'),full_page=False)
  page.locator('[data-og-pick="og-1"]').click();page.locator('[data-og-slot="0"]').click()
  assert '1/5' in page.locator('.ogham-section-head').first.inner_text()
  page.locator('#ogham-arcana').select_option('ev')
  page.locator('[data-act="hub:home"]').first.click()
  page.locator('#rotation-lab-arcana').select_option('ev')
  page.locator('[data-act="hub:reforge"]').first.click()
  assert page.locator('[data-ogham-ev-mode]').count()==3
  page.locator('[data-ogham-ev-mode="ogham"]').first.click()
  assert page.locator('#ogham-sim-roll').count()==1
  page.evaluate("""() => { window.MIDIR_REFORGE.creditGold(100000,true); for(const [id,n] of Object.entries({base:10,mana:5,bloody:5,sunlight:2,golden:2}))window.MIDIR_HERBS.addHerbs(id,n); window.MIDIR_REFORGE.render(); }""")
  profile_before=page.evaluate("() => Array.from({length:localStorage.length},(_,i)=>localStorage.getItem(localStorage.key(i))).find(v=>v&&v.includes('First Rune')) || ''")
  assert 'First Rune' in profile_before, 'owned rune not persisted'
  assert page.locator('#ogham-sim-roll').is_enabled(), 'shared chest funds should enable rolling'
  before_gold=page.evaluate('() => window.MIDIR_REFORGE.getGold()')
  before_herbs=page.evaluate('() => window.MIDIR_HERBS.getState().total')
  page.locator('#ogham-sim-roll').click()
  assert page.evaluate('() => window.MIDIR_REFORGE.getGold()') == before_gold-5000
  assert page.evaluate('() => window.MIDIR_HERBS.getState().total') == before_herbs-5
  assert '1' in page.locator('.ogham-sim-totals').inner_text()
  profile_after=page.evaluate("() => Array.from({length:localStorage.length},(_,i)=>localStorage.getItem(localStorage.key(i))).find(v=>v&&v.includes('First Rune')) || ''")
  assert 'First Rune' in profile_after, 'simulation modified owned inventory'
  # The shared language selector must localize the standalone EV Ogham mode.
  page.locator('#companion-language').select_option('ko')
  page.wait_for_timeout(60)
  assert '오검' in page.locator('body').inner_text(), 'Korean Ogham UI not localized'
  page.locator('#companion-language').select_option('es')
  page.wait_for_timeout(60)
  assert 'runas' in page.locator('body').inner_text().lower(), 'Spanish Ogham UI not localized'
  page.locator('#companion-language').select_option('en')
  page.wait_for_timeout(60)
  # Optional verified-effect snapshots replace the starter pool and persist with the Ogham profile.
  page.locator('#ogham-catalog-import').set_input_files({'name':'test-catalog.json','mimeType':'application/json','buffer':b'{"abilities":[{"Id":1234,"GeneralPool":true,"Desc":{"en":"Test Ability","ko":"\\uac80\\uc99d"},"Values":[1.25,2.5]}]}'})
  page.wait_for_timeout(60)
  assert page.locator('[data-og-sim-line="0"]').locator('option').count()==2, 'import should replace practice pool with source IDs'
  assert 'Test Ability' in page.locator('[data-og-sim-line="0"]').inner_text()
  assert page.evaluate('() => !!JSON.parse(localStorage.getItem("midir-companion-01")).ogham.catalog'), 'catalog should persist'
  page.screenshot(path=str(Path('/tmp')/f'ogham_browser_{width}.png'),full_page=False)
  print('width',width,'Ogham inventory/equip/EV simulation PASS','errors',failures[:3],flush=True)
  assert not failures,failures[:3]
  page.close()
 browser.close()
