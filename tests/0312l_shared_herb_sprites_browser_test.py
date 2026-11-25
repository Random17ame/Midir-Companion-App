"""Use real gathering and EV modules; verify the same eight local assets across views."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse,unquote
import mimetypes
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.select('script[src]')]
for x in soup.select('script[src],link[rel=stylesheet],base'):x.extract()
base=soup.new_tag('base',href='https://midir-local.test/Companion%20Files/');soup.head.insert(0,base)
style=soup.new_tag('style');style.append((BASE/'Companion Files/styles.css').read_text());soup.head.append(style)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':900},has_touch=width<500)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  def serve(route):
   asset=BASE/unquote(urlparse(route.request.url).path).lstrip('/')
   if asset.is_file():route.fulfill(path=str(asset),content_type=mimetypes.guess_type(asset)[0] or 'application/octet-stream')
   else:route.abort()
  page.route('https://midir-local.test/**',serve)
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}})}''')
  for src in scripts:page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.evaluate('MIDIR_HERBS.importState({chest:{counts:{...Object.fromEntries(MIDIR_HERBS.catalog.map(h=>[h.id,20])),white:31,golden:23}}}); MIDIR_REFORGE.creditGold(100000,true)')
  catalog={h['id']:h['asset'] for h in page.evaluate('MIDIR_HERBS.catalog')}
  assert len(catalog)==8 and len(set(catalog.values()))==8
  assert catalog['white']=='assets/herbs/white.png'
  assert catalog['golden']=='assets/herbs/golden.gif'
  assert (BASE/'Companion Files'/catalog['white']).read_bytes().startswith(b'\x89PNG\r\n\x1a\n')
  assert (BASE/'Companion Files'/catalog['golden']).read_bytes().startswith(b'GIF89a')
  initial=page.evaluate("MIDIR_HERBS.getState().counts")
  assert initial['white']==31 and initial['golden']==23
  cache=(BASE/'service-worker.js').read_text()
  assert all(asset in cache for asset in catalog.values())
  assert 'assets/herbs/white.gif' not in cache and 'assets/herbs/golden.png' not in cache
  def route(arc,hub):
   page.locator('nav button[data-page="rotation"]').click()
   back=page.locator('button[data-act="hub:home"]')
   if back.count():back.first.click()
   page.locator('#rotation-lab-arcana').select_option(arc)
   page.locator(f'button[data-act="hub:{hub}"]').first.click()
  def check_icons(selector,expected):
   nodes=page.locator(selector+' [data-herb-id]')
   assert nodes.count()==len(expected),(selector,nodes.count(),expected)
   assert {node.get_attribute('data-herb-id') for node in nodes.all()}==set(expected)
   for node in nodes.all():
    id=node.get_attribute('data-herb-id');img=node.locator('img')
    assert img.get_attribute('src')==catalog[id]
    img.scroll_into_view_if_needed()
    img.evaluate("i=>{i.loading='eager'}")
    page.wait_for_function("i=>i.complete&&i.naturalWidth>0",arg=img.element_handle(),timeout=5000)
    assert img.evaluate('i=>i.getBoundingClientRect().width>0&&i.getBoundingClientRect().height>0')
  route('fa','herbs')
  check_icons('.herb-collection-chest',catalog)
  pick=page.locator('#herb-pick');id=pick.locator('[data-herb-id]').get_attribute('data-herb-id')
  check_icons('#herb-pick',[id]);pick.click()
  count=page.evaluate(f'MIDIR_HERBS.getState().counts.{id}');assert count==initial[id]+1
  page.locator('#herb-mode-challenge').click();check_icons('.herb-field-prompt',['base'])
  route('ev','reforge');check_icons('[data-storage-chest="shared"]',catalog)
  assert page.locator(f'[data-storage-chest="shared"] .reforge-inventory-slot:has([data-herb-id="{id}"]) strong').inner_text()==str(count)
  page.locator('#reforge-type').select_option('Echostone');check_icons('[data-storage-chest="shared"]',catalog)
  # Enter Rune through the inventory action; ordinary Reforge's own rerenders
  # currently omit the app-level Rune option (separate, pre-existing UI issue).
  route('ev','ogham');page.locator('#ogham-open-sim').click();check_icons('[data-storage-chest="shared"]',catalog)
  page.locator('#ogham-sim-reset').click();assert page.locator('#ogham-sim-price img').count()==0
  page.locator('#ogham-sim-roll').click();page.locator('[data-og-sim-lock]').first.click()
  check_icons('#ogham-sim-price',['base','mana','bloody','sunlight'])
  page.locator('#ogham-sim-roll').click()
  check_icons('.ogham-sim-totals',['base','mana','bloody','sunlight']);check_icons('.ogham-disassemble-preview',['base','mana','bloody','sunlight'])
  page.locator('[data-og-sim-lock]').nth(1).click();check_icons('#ogham-sim-price',['base','mana','bloody','golden'])
  before=page.evaluate('MIDIR_HERBS.getState().counts')
  page.locator('#ogham-sim-roll').click()
  spent=page.evaluate('MIDIR_HERBS.getState().counts')
  assert spent['golden']==before['golden']-1 and spent['white']==before['white']
  check_icons('.ogham-sim-totals',['base','mana','bloody','sunlight','golden'])
  check_icons('.ogham-disassemble-preview',['base','mana','bloody','sunlight','golden'])
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  page.locator('#ogham-sim-disassemble').click();page.locator('#ogham-sim-disassemble').click()
  check_icons('[data-storage-chest="shared"]',catalog)
  after=page.evaluate('MIDIR_HERBS.getState().counts')
  assert after['golden']==spent['golden']+1 and after['white']==spent['white']
  route('fa','herbs');check_icons('.herb-collection-chest',catalog)
  assert page.evaluate('MIDIR_HERBS.getState().counts')==after
  assert not errors,errors
  print('PASS gathering, storage, Reforge/Echostone/Rune, costs, spent, refunds, actual assets and balances',width,flush=True)
  page.close()
 browser.close()
