"""0.3.12i visual Ogham word-picker, screenshot-backed tiles, and cancel-safe creation."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in soup.select('script[src],link[rel=stylesheet],base'):x.extract()
base=soup.new_tag('base');base['href']='https://midir-local.test/Companion%20Files/'
soup.head.insert(0,base)
style=soup.new_tag('style');style.append((BASE/'Companion Files/styles.css').read_text());soup.head.append(style)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':830},has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def serve_asset(route):
   path=unquote(urlparse(route.request.url).path).lstrip('/')
   asset=BASE/path
   if asset.is_file() and asset.suffix=='.png':route.fulfill(path=str(asset),content_type='image/png')
   else:route.abort()
  page.route('https://midir-local.test/**',serve_asset)
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}''')
  for src in scripts:page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click()
  page.locator('[data-act="hub:ogham"]').first.click()
  assert page.locator('[data-og-pick]').count()==0
  page.locator('#ogham-add').click()
  picker=page.locator('#ogham-word-picker')
  assert picker.count()==1
  assert page.locator('[data-og-word-choose]').count()==26
  assert page.locator('[data-og-word-choose="Fearn"]').count()==1
  assert page.locator('select#ogham-edit-word').count()==0
  imgs=page.locator('#ogham-word-picker img.ogham-game-plate-image')
  assert imgs.count()==26
  assert picker.locator('img[src*="/provisional/"]').count()==10
  for img in imgs.all():
   img.scroll_into_view_if_needed()
   assert img.evaluate('(i)=>i.complete&&i.naturalWidth>0'), img.get_attribute('src')
  assert page.evaluate('''()=>document.documentElement.scrollWidth<=innerWidth+1''')
  # Cancel without committing must leave no owned rune or profile record.
  picker.locator('[data-og-picker-cancel]').first.click()
  assert page.locator('#ogham-word-picker').count()==0
  assert page.locator('[data-og-pick]').count()==0
  # Create from the screenshot-backed special word.
  page.locator('#ogham-add').click()
  (page.locator('[data-og-word-choose="Fearn"]').tap() if width<500 else page.locator('[data-og-word-choose="Fearn"]').click())
  assert page.locator('#ogham-editor').count()==1
  assert page.locator('[data-og-grade]').input_value()=='masterwork'
  assert page.locator('[data-og-grade]').is_disabled()
  assert page.locator('[data-og-pick]').count()==0
  # Change the choice from the editor using the SAME visual picker; cancel there restores editor.
  page.locator('[data-og-change-word]').click()
  assert page.locator('[data-og-word-choose]').count()==26
  page.locator('[data-og-picker-cancel]').last.click()
  assert page.locator('#ogham-editor').count()==1
  assert 'Fearn' in page.locator('#ogham-edit-word').inner_text()
  page.locator('[data-og-change-word]').click()
  page.locator('[data-og-word-choose="Dair"]').click()
  assert page.locator('[data-og-grade]').is_enabled()
  page.locator('[data-og-grade]').select_option('exquisite')
  assert page.locator('[data-og-pick]').count()==0
  # Discard unsaved draft, no phantom inventory.
  page.locator('[data-og-cancel]').last.click()
  assert page.locator('[data-og-pick]').count()==0
  # Complete a real creation and ensure normal socket flow persists.
  page.locator('#ogham-add').click();page.locator('[data-og-word-choose="Sail"]').click()
  page.locator('[data-og-commit]').click()
  assert page.locator('[data-og-pick]').count()==1
  assert page.locator('[data-og-pick="og-1"]').count()==1
  assert 'Sail' in page.locator('[data-og-inventory="owned"]').inner_text()
  page.locator('[data-og-pick="og-1"]').click();page.locator('[data-og-slot="0"]').click()
  page.locator('[data-og-slot="0"]').click();assert page.locator('#ogham-selected-details').count()==1
  page.locator('[data-og-slot="0"]').click();assert page.locator('#ogham-selected-details').count()==0
  assert '0/5' in page.locator('.ogham-section-head').first.inner_text()
  assert page.locator('[data-og-pick]').count()==1
  # Edit an owned rune via the visual selection modal, preserving instance ID.
  page.locator('[data-og-edit="og-1"]').click()
  page.locator('[data-og-change-word]').click()
  page.locator('[data-og-word-choose="Ailm"]').click()
  page.locator('[data-og-commit]').click()
  assert 'Ailm' in page.locator('[data-og-inventory="owned"]').inner_text()
  assert page.locator('[data-og-pick="og-1"]').count()==1
  assert page.evaluate('''()=>document.documentElement.scrollWidth<=innerWidth+1''')
  assert not errors,errors[:3]
  print('PASS 0.3.12i game plates & visual picker, cancel/create/edit/touch',width,flush=True)
  page.close()
 browser.close()
