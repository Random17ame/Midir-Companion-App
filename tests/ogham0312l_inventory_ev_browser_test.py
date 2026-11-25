"""0.3.12l: grouped inventory and one Item Type EV selector, touch/mobile checks."""
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
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':900},has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def serve(route):
   asset=BASE/unquote(urlparse(route.request.url).path).lstrip('/')
   if asset.is_file() and asset.suffix=='.png':route.fulfill(path=str(asset),content_type='image/png')
   else:route.abort()
  page.route('https://midir-local.test/**',serve)
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}''')
  for src in scripts:page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click();page.locator('[data-act="hub:ogham"]').first.click()
  # The trimmed editor presents only name/grade/effect+level and visible bonus.
  for word in ['Dair','Cert']:
   page.locator('#ogham-add').click();page.locator('[data-og-word-choose="'+word+'"]').click()
   assert page.locator('#ogham-edit-name').count()==0
   assert page.locator('#ogham-edit-notes').count()==0
   assert page.locator('#ogham-edit-group').count()==0
   assert page.locator('.ogham-line-bonus').count()>=1
   assert page.locator('.ogham-editor').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1')
   page.locator('[data-og-commit]').click()
  assert page.locator('[data-og-inventory="owned"] [data-og-pick]').count()==2
  # A visual container takes one rune by tap selection; dissolving it keeps the rune.
  page.locator('[data-og-group-add="owned"]').click()
  assert page.locator('[data-og-container-id]').count()==1
  page.locator('[data-og-inventory="owned"] [data-og-pick]').first.click()
  assert page.locator('.ogham-group-runes [data-og-pick]').count()==1
  page.locator('.ogham-group-box').hover() if width==1200 else page.locator('.ogham-group-handle').click()
  page.locator('[data-og-group-remove]').click()
  assert page.locator('[data-og-container-id]').count()==0
  assert page.locator('[data-og-inventory="owned"] [data-og-pick]').count()==2
  page.locator('#ogham-open-sim').click()
  assert page.locator('.ogham-ev-tabs').count()==0,'No 3-button top row'
  assert page.locator('#reforge-type').count()==1
  assert page.locator('#reforge-type').input_value()=='Rune'
  assert page.locator('#ogham-sim-word-picker').count()==1
  assert page.locator('#ogham-sim-root #ogham-arcana').count()==0,'No Arcana dropdown on Rune rerolls'
  page.locator('#ogham-sim-word-picker').click()
  assert page.locator('#ogham-word-picker [data-og-word-choose]').count()==26
  imgs=page.locator('#ogham-word-picker img.ogham-game-plate-image')
  assert imgs.count()==26
  assert page.locator('#ogham-word-picker img[src*="/provisional/"]').count()==10
  for img in imgs.all():
   img.scroll_into_view_if_needed()
   assert img.evaluate('(i)=>i.complete&&i.naturalWidth>0'),img.get_attribute('src')
   assert img.evaluate("i=>{const a=i.getBoundingClientRect(),b=i.closest('.ogham-rune-art').getBoundingClientRect();return Math.abs((a.left+a.right-b.left-b.right)/2)<2&&Math.abs((a.top+a.bottom-b.top-b.bottom)/2)<2}")
  page.locator('#ogham-word-picker [data-og-word-choose="Fearn"]').click()
  assert 'Fearn' in page.locator('#ogham-sim-word-picker').inner_text()
  page.locator('#ogham-sim-reset').click()
  assert '5,000' in page.locator('#ogham-sim-price').inner_text()
  assert not page.locator('#ogham-sim-price span').count(),'Zero locks cost Gold only; no herbs displayed'
  page.evaluate('MIDIR_REFORGE.creditGold(100000,true)')
  page.locator('#ogham-sim-reset').click()
  assert page.locator('[data-og-sim-lock]:disabled').count()==3
  page.locator('#ogham-sim-roll').click()
  assert page.locator('[data-og-sim-lock]:enabled').count()==3
  # Max two locks on Masterwork; live reroll price updates from cost table.
  boxes=page.locator('[data-og-sim-lock]')
  if boxes.count()>=2:
   boxes.nth(0).click();assert '10,000' in page.locator('#ogham-sim-price').inner_text()
   assert page.locator('#ogham-sim-price .ogham-herb-list').count()==1,'First lock adds herb cost'
   boxes.nth(1).click();assert '20,000' in page.locator('#ogham-sim-price').inner_text()
  assert boxes.nth(0).get_attribute('aria-pressed')=='true'
  assert boxes.nth(2).is_disabled()
  assert page.locator('.ogham-sim-line.is-locked').count()==2
  boxes.nth(0).click()
  assert '10,000' in page.locator('#ogham-sim-price').inner_text()
  assert boxes.nth(2).is_enabled()
  page.locator('#reforge-type').select_option('Echostone')
  assert page.locator('.ogham-ev-tabs').count()==0
  assert page.locator('#reforge-color').count()==1
  assert page.locator('#reforge-type').input_value()=='Echostone'
  page.locator('#reforge-type').select_option('Rune')
  assert page.locator('#ogham-sim-word-picker').count()==1
  assert 'Fearn' in page.locator('#ogham-sim-word-picker').inner_text()
  page.locator('#reforge-type').select_option('Hat')
  assert page.locator('#reforge-type').input_value()=='Hat'
  assert page.locator('#reforge-roll').count()==1
  assert page.locator('.reforge-current-item .equipment-icon-preview img').count()==1
  assert page.locator('.equipment-icon-preview').count()==1
  assert 'Hat' in page.locator('.reforge-current-name').inner_text()
  page.locator('#reforge-type').select_option('Shoe')
  assert 'Shoe' in page.locator('.reforge-current-name').inner_text()
  assert page.evaluate('''()=>document.documentElement.scrollWidth<=window.innerWidth+1''')
  assert not errors,errors[:6]
  print('PASS 0.3.12l inventory grouping + compact editor + unified Item Type',width,flush=True)
  page.close()
 browser.close()
