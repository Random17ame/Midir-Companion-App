"""0.3.12q-r: dense bounded inventories, drag-first organization, scroll preservation and grade-colored tile borders."""
from pathlib import Path
import os
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
  page.evaluate("""()=>{const o=MIDIR_OGHAM,s=window.testOgham=o.init({});const grades=['fine','exquisite','masterwork'];for(let i=0;i<32;i++){o.addRune(s,o.REGULAR[i%o.REGULAR.length],grades[i%3]);}for(let i=0;i<24;i++)o.saveSimulatedRune(s,{word:'Coll',grade:'fine',lines:[{id:'src:90030',level:1}]});o.addRune(s,'Dair','fine');s.runes[s.runes.length-1].grade='';o.mount(s,'ev',()=>{});} """)
  owned=page.locator('[data-og-inventory="owned"]'); sim=page.locator('[data-og-inventory="simulated"]')
  for pane,n in ((owned,33),(sim,24)):
   assert pane.locator('[data-og-pick]').count()==n
   assert pane.evaluate('(e)=>e.scrollHeight>e.clientHeight&&e.clientHeight<=283&&e.scrollWidth<=e.clientWidth+1')
  assert page.locator('[data-og-move],[data-og-group-move]').count()==0
  if width==1200: assert page.locator('.ogham-main-inventory').bounding_box()['height']<=591
  assert owned.locator('.ogham-rune-card').first.bounding_box()['height']<120

  color_expect={"fine":"rgb(110, 168, 255)","exquisite":"rgb(183, 132, 255)","masterwork":"rgb(233, 195, 107)","none":"rgb(136, 153, 170)"}
  samples=[
   owned.locator('.ogham-rune-card').nth(0).locator('.ogham-rune-art'),
   owned.locator('.ogham-rune-card').nth(1).locator('.ogham-rune-art'),
   owned.locator('.ogham-rune-card').nth(2).locator('.ogham-rune-art'),
   owned.locator('.ogham-rune-card').last.locator('.ogham-rune-art')
  ]
  expected=[color_expect['fine'],color_expect['exquisite'],color_expect['masterwork'],color_expect['none']]
  for art,expect in zip(samples,expected):
   assert art.evaluate('(e)=>getComputedStyle(e).borderTopColor')==expect
  assert owned.locator('.ogham-rune-card').nth(1).bounding_box()['x']>owned.locator('.ogham-rune-card').first.bounding_box()['x']
  first=owned.locator('[data-og-pick]').first; second=owned.locator('[data-og-pick]').nth(1)
  id1,id2=first.get_attribute('data-og-pick'),second.get_attribute('data-og-pick')
  if width==1200:
   first.drag_to(owned.locator('.ogham-rune-card').nth(1),target_position={'x':3,'y':35})
   # Moving before its immediate successor is a no-op; move after instead.
   owned.locator(f'[data-og-pick="{id1}"]').drag_to(owned.locator(f'[data-og-rune-id="{id2}"]'),target_position={'x':int(owned.locator(f'[data-og-rune-id="{id2}"]').bounding_box()['width'])-3,'y':35})
   assert owned.locator('[data-og-pick]').first.get_attribute('data-og-pick')==id2
   owned.locator(f'[data-og-pick="{id1}"]').drag_to(owned.locator(f'[data-og-rune-id="{id2}"]'))
   assert owned.locator('.ogham-group-runes [data-og-pick]').count()==2
   owned.locator('.ogham-group-box').hover();owned.locator('[data-og-group-remove]').click()
   assert owned.locator('[data-og-pick]').count()==33
  else:
   owned.locator('[data-og-pick]').first.tap();page.locator('[data-og-slot="0"]').tap()
   assert page.locator('.ogham-socket-occupied').count()==1
  owned.evaluate('(e)=>e.scrollTop=e.scrollHeight')
  last=owned.locator('[data-og-rune-id]').last
  last.locator('[data-og-favorite]').click()
  assert owned.evaluate('(e)=>e.scrollTop>0')
  last.locator('[data-og-edit]').click(); assert page.locator('#ogham-editor').is_visible()
  page.locator('[data-og-cancel]').first.click();assert owned.evaluate('(e)=>e.scrollTop>0')
  page.locator('#ogham-search').fill('Coll');assert owned.evaluate('(e)=>e.scrollTop===0')
  assert owned.locator('.ogham-search-match').count()>0
  page.locator('#ogham-search').fill('')
  page.locator('.ogham-compare-panel > summary').click();page.locator('[data-og-compare-slot="0"]').click()
  pool=page.locator('.ogham-compare-inline-picker .ogham-compare-picker-grid')
  assert pool.locator('[data-og-compare-choose]').count()==57
  assert pool.evaluate('(e)=>e.scrollHeight>e.clientHeight&&e.clientHeight<=283')
  pool.locator('[data-og-compare-choose]').last.click()
  assert page.evaluate("MIDIR_OGHAM.idsFor(testOgham,'ev','alternate')[0]!==null")
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  print('PASS compact inventory, scroll retention and compare',width,flush=True)
  if width==1200 and os.environ.get("MIDIR_PREVIEW"):
   page.locator('.ogham-main-grid').screenshot(path=os.environ["MIDIR_PREVIEW"])
  page.close()
 browser.close()
