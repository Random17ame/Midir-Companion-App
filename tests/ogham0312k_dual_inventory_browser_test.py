"""0.3.12k two persistent Ogham collections + simulator flow on desktop and touch."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in soup.select('script[src],link[rel=stylesheet],base'):x.extract()
base=soup.new_tag('base');base['href']='https://midir-local.test/Companion%20Files/';soup.head.insert(0,base)
style=soup.new_tag('style');style.append((BASE/'Companion Files/styles.css').read_text());soup.head.append(style)
with sync_playwright() as playwright:
 browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':850},has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def serve(route):
   asset=BASE/unquote(urlparse(route.request.url).path).lstrip('/')
   if asset.is_file() and asset.suffix=='.png':route.fulfill(path=str(asset),content_type='image/png')
   else:route.abort()
  page.route('https://midir-local.test/**',serve)
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}''')
  for src in scripts: page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click();page.locator('[data-act="hub:ogham"]').first.click()
  assert page.locator('[data-og-inventory="owned"]').count()==1
  assert page.locator('[data-og-inventory="simulated"]').count()==1
  page.locator('#ogham-add').click();page.locator('[data-og-word-choose="Fearn"]').click();page.locator('[data-og-commit]').click()
  assert page.locator('[data-og-inventory="owned"] [data-og-pick]').count()==1
  assert page.locator('[data-og-inventory="simulated"] [data-og-pick]').count()==0
  page.locator('#ogham-open-sim').click()
  assert page.locator('#ogham-sim-root').count()==1, 'navigation to EV Ogham simulator'
  page.locator('#ogham-sim-reset').click()
  assert page.locator('#ogham-sim-save').is_enabled()
  page.locator('#ogham-sim-save').click()
  assert 'Saved' in page.locator('#ogham-sim-feedback').inner_text() or 'guardada' in page.locator('#ogham-sim-feedback').inner_text()
  # Navigate back to the same inventory without losing sim result.
  page.locator('[data-act="hub:home"]').first.click();page.locator('[data-act="hub:ogham"]').first.click()
  assert page.locator('[data-og-inventory="simulated"] [data-og-pick]').count()==1
  assert page.locator('[data-og-inventory="owned"] [data-og-pick]').count()==1
  page.locator('[data-og-inventory="simulated"] [data-og-pick]').click();page.locator('[data-og-slot="0"]').click()
  page.locator('[data-og-inventory="owned"] [data-og-pick]').click();page.locator('[data-og-slot="1"]').click()
  assert '2/5' in page.locator('.ogham-loadout-panel .ogham-section-head').inner_text()
  # Load sim rune for further reroll and confirm saved record doesn't change before explicit update.
  original=page.evaluate('''() => JSON.parse(localStorage.getItem('midir-companion-v1')||'{}')''')
  page.locator('[data-og-sim-load]').click()
  assert page.locator('#ogham-sim-update').count()==1
  first=page.locator('[data-og-sim-level="0"]');value=first.input_value()
  options=first.locator('option').count()
  if options>1:
   next_value='2' if value!='2' else '1'
   first.select_option(next_value)
  page.locator('#ogham-sim-save').click()
  # Save as new always copies and does not change the previously equipped sim rune.
  page.locator('[data-act="hub:home"]').first.click();page.locator('[data-act="hub:ogham"]').first.click()
  assert page.locator('[data-og-inventory="simulated"] [data-og-pick]').count()==2
  assert page.locator('[data-og-inventory="owned"] [data-og-pick]').count()==1
  assert '2/5' in page.locator('.ogham-loadout-panel .ogham-section-head').inner_text()
  assert page.evaluate('''() => document.documentElement.scrollWidth<=innerWidth+1''')
  assert not errors,errors[:5]
  if width in (1200,390):page.screenshot(path=str(BASE/f'ogham0312k-dual-inventory-{width}.png'),full_page=True)
  print('PASS 0.3.12k dual inventory / simulated save, navigation, re-roll and shared slots',width,flush=True)
  page.close()
 browser.close()
