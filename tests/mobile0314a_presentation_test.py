"""Responsive route smoke audit: actual views, all Arcana hubs, narrow and desktop widths."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import os
from urllib.parse import urlparse,unquote
import mimetypes
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e.get('src') for e in soup.select('script[src]')]
for e in list(soup.find_all(['script','link','base'])):e.decompose()
base=soup.new_tag('base',href='https://midir-local.test/Companion%20Files/');soup.head.insert(0,base)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (320,390,1200):
  page=browser.new_page(viewport={'width':w,'height':844},has_touch=w<600,is_mobile=w<600,user_agent=('Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125 Mobile Safari/537.36' if w<600 else None))
  def serve(route):
   asset=root/unquote(urlparse(route.request.url).path).lstrip('/')
   if asset.is_file() and asset.suffix.lower() in ('.png','.jpg','.jpeg','.gif','.webp','.svg'):
    route.fulfill(path=str(asset),content_type=mimetypes.guess_type(asset)[0])
   else:route.abort()
  page.route('https://midir-local.test/**',serve)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup));page.evaluate('''()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}})}''')
  for name in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/name).read_text())
  for src in scripts:
   code=(root/'Companion Files'/src).read_text()
   if src=='app.js':
    needle='companionApplyAppearance();\nrender();\n\n})();';assert needle in code
    code=code.replace(needle,"window.auditRoute=(arc,view)=>{state.page='rotation';state.arcana=arc;lastHubArcana=arc;rotationView=view;render()};window.auditPage=p=>{state.page=p;render()};window.auditPrefs=(advanced,large)=>{state.settings={...state.settings,secretSauce:advanced,textSize:large?'large':'normal'};render()};\n"+needle)
   page.add_script_tag(content=code)
  fails=[];checked=0
  def check(name):
   global checked
   checked+=1
   if os.getenv('MIDIR_PRESENTATION_SCREENSHOTS') and w==390:
    page.screenshot(path='/tmp/midir-presentation-'+name.replace(':','-')+'.png',animations='disabled')
   d=page.evaluate('''()=>({w:document.documentElement.scrollWidth,inner:innerWidth,over:[...document.querySelectorAll('#app *')].filter(e=>{const b=e.getBoundingClientRect();return b.width&&b.right>innerWidth+2&&getComputedStyle(e).position!=='fixed'&&!e.closest('svg,canvas')}).slice(0,8).map(e=>[e.tagName,e.id,typeof e.className==='string'?e.className:'',Math.round(e.getBoundingClientRect().right)])})''')
   if d['w']>w+1: fails.append((name,d))
  for p in ('vault','debuff','settings'):
   page.evaluate('p=>auditPage(p)',p);check(p)
  seen=set()
  for arc in ('as','dd','ek','hs','sg','ev','ag','fa','mp','bb'):
   page.evaluate('a=>auditRoute(a,"reference")',arc);check(arc+':hub')
   routes=page.locator('.rotation-shortcut[data-act^="hub:"]').evaluate_all('(es)=>es.filter(e=>!e.disabled).map(e=>e.dataset.act.slice(4))')
   for route in routes:
    if route in seen:continue
    seen.add(route)
    page.evaluate('([a,r])=>auditRoute(a,r)',[arc,route]);check(arc+':'+route)
  page.evaluate('()=>auditRoute("hs","music-calc")');check('hs:music-calc')
  page.evaluate('()=>auditRoute("sg","oath")')
  if page.locator('[data-act="sg-stats-later"]').count():page.locator('[data-act="sg-stats-later"]').click()
  check('sg:dashboard')
  page.locator('[data-act="sg-gear-edit:echo"]').click();check('sg:echo-editor')
  page.locator('[data-act="sg-gear-close"]').last.click()
  page.evaluate('()=>auditPrefs(true,true)');page.evaluate('()=>auditPage("vault")');check('vault:advanced-large')
  if w<600:
   notes=page.locator('.mobile-report-notes');assert notes.count()==1 and notes.get_attribute('open') is None
   notes.locator('summary').click();assert notes.get_attribute('open') is not None;check('vault:expanded-guidance')
  for lang in ('ko','es'):
   page.evaluate('l=>MIDIR_I18N.set(l)',lang)
   page.evaluate('()=>auditRoute("hs","reference")');check(lang+':hs-hub-large')
   page.evaluate('()=>auditPage("settings")');check(lang+':settings-large')
  page.evaluate('()=>MIDIR_I18N.set("en")')
  print(w,checked,'views', 'overflow',fails,'errors',errors,flush=True)
  if not os.getenv('MIDIR_AUDIT_ONLY'):assert not errors,errors
  if not os.getenv('MIDIR_AUDIT_ONLY'):assert not fails,fails
  page.close()
 browser.close()
