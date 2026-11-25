"""0.3.12k live-equipped Set A, initially cloned Set B, overlapping rune and delta comparison."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import unquote,urlparse
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in soup.select('script[src],link[rel=stylesheet],base'):x.extract()
base=soup.new_tag('base');base['href']='https://midir-local.test/Companion%20Files/';soup.head.insert(0,base)
style=soup.new_tag('style');style.append((BASE/'Companion Files/styles.css').read_text());soup.head.append(style)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':850},has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def serve(route):
   file=BASE/unquote(urlparse(route.request.url).path).lstrip('/')
   if file.is_file() and file.suffix=='.png':route.fulfill(path=str(file),content_type='image/png')
   else:route.abort()
  page.route('https://midir-local.test/**',serve)
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}''')
  for src in scripts:page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click()
  page.locator('[data-act="hub:ogham"]').first.click()
  for word in ('Beithe','Fearn'):
   page.locator('#ogham-add').click()
   page.locator(f'[data-og-word-choose="{word}"]').click()
   page.locator('[data-og-commit]').click()
  for idx in range(2):
   page.locator(f'[data-og-pick="og-{idx+1}"]').click()
   page.locator(f'[data-og-slot="{idx}"]').click()
  page.locator('.ogham-compare-panel>summary').click()
  assert page.locator('.ogham-compare-panel').get_attribute('open') is not None
  assert page.locator('.ogham-compare-meta').inner_text().count('2 shared runes')==1
  assert page.locator('.ogham-compare-config>div').nth(0).locator('.ogham-rune-art').count()==2
  assert page.locator('.ogham-compare-config>div').nth(1).locator('.ogham-rune-art').count()==2
  # Using Beithe at a different position in B removes it from its old B socket, not from A.
  page.locator('[data-og-compare-slot="2"]').click()
  page.locator('[data-og-compare-choose="og-1"]').click()
  assert page.locator('.ogham-compare-meta').inner_text().count('2 shared runes')==1
  assert page.locator('[data-og-compare-slot="2"]').get_attribute('class').find('ogham-compare-diff')>=0
  assert page.locator('.ogham-compare-config>div').nth(0).locator('.ogham-rune-art').count()==2
  # Alternate survives rerender/navigation, with actual A untouched.
  page.locator('[data-act="hub:home"]').first.click()
  page.locator('[data-act="hub:ogham"]').first.click()
  if page.locator('.ogham-compare-panel').get_attribute('open') is None:page.locator('.ogham-compare-panel>summary').click()
  assert '2 shared runes' in page.locator('.ogham-compare-meta').inner_text()
  assert page.locator('[data-og-compare-slot="2"]').locator('.ogham-rune-art').count()==1
  # Set B may reuse exactly the same owned rune, while Set A remains equipped.
  page.locator('[data-og-compare-slot="0"]').click()
  page.locator('[data-og-compare-choose="og-1"]').click()
  assert page.locator('[data-og-compare-slot="0"]').get_attribute('class').find('ogham-compare-same')>=0
  page.locator('#ogham-compare-copy').click()
  assert '0 changed slots' in page.locator('.ogham-compare-meta').inner_text()
  page.locator('[data-og-slot="0"]').click();page.locator('[data-og-slot="0"]').click()
  assert '1 changed slots' in page.locator('.ogham-compare-meta').inner_text(),'live Set A updates after unequipping'
  assert page.locator('[data-og-compare-slot="0"]').locator('.ogham-rune-art').count()==1,'B still holds old rune'
  assert not errors, errors[:5]
  assert page.evaluate('''() => document.documentElement.scrollWidth<=innerWidth+2'''), f'Overflow at {width}'
  if width in (1200,390):page.screenshot(path=str(BASE/f'ogham0312k-loadout-compare-{width}.png'),full_page=True)
  print('PASS Ogham equipped-to-alternate diff and shared rune browser',width,flush=True)
  page.close()
 browser.close()
