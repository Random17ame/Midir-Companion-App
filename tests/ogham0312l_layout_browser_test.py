"""0.3.12l: Ogham desktop/mobile layout placement and inline compare picker."""
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
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':1200},has_touch=width<500)
  def serve(route):
   asset=BASE/unquote(urlparse(route.request.url).path).lstrip('/')
   if asset.is_file() and asset.suffix=='.png':
    route.fulfill(path=str(asset),content_type='image/png')
   else:
    route.abort()
  page.route('https://midir-local.test/**',serve)
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}''')
  for src in scripts:
   page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click();page.locator('[data-act="hub:ogham"]').first.click()
  for word in ('Coll','Fearn'):
   page.locator('#ogham-add').click();page.locator(f'[data-og-word-choose="{word}"]').click();page.locator('[data-og-commit]').click()
  loadout=page.locator('.ogham-main-loadout').bounding_box()
  inv=page.locator('.ogham-main-inventory').bounding_box()
  assert loadout and inv
  if width==1200:
   assert inv['x'] > loadout['x'] + 80, (loadout,inv)
   assert abs(inv['y']-loadout['y']) < 40, (loadout,inv)
  else:
   assert inv['y'] > loadout['y'] + loadout['height'] - 10, (loadout,inv)
  page.locator('.ogham-compare-panel > summary').click()
  page.locator('[data-og-compare-slot="0"]').click()
  picker=page.locator('.ogham-compare-inline-picker')
  assert picker.count()==1
  cfg=page.locator('.ogham-compare-config').bounding_box()
  pickbox=picker.bounding_box()
  assert cfg and pickbox and pickbox['y'] >= cfg['y'] + cfg['height'] - 2, (cfg,pickbox)
  assert page.locator('.ogham-compare-pick-card').count() >= 2
  print('PASS 0.3.12l layout placement + inline compare picker',width,flush=True)
  page.close()
 browser.close()
