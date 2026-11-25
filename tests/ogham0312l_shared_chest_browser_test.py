"""0.3.12l: Rune rerolls render the same live Storage Chest used by reforges.
No dead reforge-only purchase/withdraw buttons in Rune mode. Balances refresh
immediately after a purchase or Disassemble refund, including small screens.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
FILE=BASE/'Companion Files'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':900},has_touch=width<500)
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<!doctype html><html><head></head><body><div id="reforge-sim-root"></div><div id="ogham-sim-root" class="ogham-system"></div></body></html>')
  page.add_style_tag(content=(FILE/'styles.css').read_text())
  for src in ('reforge-data.js','reforge-simulator.js','ogham-effect-levels.js','ogham-runes.js','herb-collection.js'):
   page.add_script_tag(content=(FILE/src).read_text())
  page.evaluate('''() => {
   MIDIR_HERBS.importState({chest:{counts:Object.fromEntries(MIDIR_HERBS.catalog.map(h=>[h.id,15]))}});
   MIDIR_REFORGE.importState({gold:100000,ducats:123456,chest:[{id:8,category:'Hat',name:'Saved Hat',lines:[],obtainedAttempt:4}]});
   window.oghamState=MIDIR_OGHAM.init({});
   MIDIR_OGHAM.mountSim(oghamState,()=>{});
  }''')
  root=page.locator('#ogham-sim-root')
  assert root.locator('[data-storage-chest="shared"]').count()==1
  assert root.locator('.reforge-inventory-header h3').inner_text()=='Storage Chest'
  assert root.locator('.reforge-inventory-slot').count()>=11
  assert 'Saved Hat' in root.locator('.reforge-chest-panel').first.text_content()
  assert root.locator('#reforge-buy-dazzling, [data-reforge-withdraw], [data-erg-transfer], [data-special-transfer]').count()==0
  def quantity(name):
   return root.locator('.reforge-inventory-slot').filter(has=page.locator(f'small:text-is("{name}")')).locator('strong').inner_text()
  assert quantity('Gold')=='100,000'
  assert quantity('Ducats')=='123,456'
  assert quantity('Base Herb')=='15'
  root.locator('#ogham-sim-roll').click()
  assert quantity('Gold')=='95,000',quantity('Gold')
  assert quantity('Base Herb')=='15'   # zero-lock only Gold
  # One lock consumes Gold and herbs, both reflected immediately.
  root.locator('[data-og-sim-lock]').first.click()
  root.locator('#ogham-sim-roll').click()
  assert quantity('Gold')=='85,000'
  assert quantity('Base Herb')=='11'
  assert root.locator('#ogham-sim-disassemble').count()==1
  root.locator('#ogham-sim-disassemble').click()
  root.locator('#ogham-sim-disassemble').click()
  assert quantity('Gold')=='85,150' # 1% of 15000 cumulative spending
  assert quantity('Base Herb')=='12' # ceil(1% of 4 herbs)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  # Switching back to regular reforges uses the same chest, not a duplicate balance.
  page.evaluate('document.getElementById("ogham-sim-root").remove()')
  page.evaluate('MIDIR_REFORGE.render()')
  assert page.locator('#reforge-sim-root [data-storage-chest="shared"]').count()==1
  assert '85,150' in page.locator('#reforge-sim-root .reforge-inventory-slots').inner_text()
  assert not errors,errors[:5]
  print('PASS shared Rune / Reforge Storage Chest and live reroll+refund balances',width,flush=True)
  page.close()
 browser.close()
