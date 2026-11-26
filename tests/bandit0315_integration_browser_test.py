"""Actual app and shared Ducat wallet, mobile and desktop Bandit Hunt integration."""
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
   if src=='bb-bandit-flip.js':
    code=code.replace('window.MIDIR_BB={','window.__bbAudit={board:()=>board,session:()=>session};window.MIDIR_BB={')
   if src=='app.js':
    needle='companionApplyAppearance();\nrender();\n\n})();';assert needle in code
    code=code.replace(needle,"window.auditRoute=(arc,view)=>{state.page='rotation';state.arcana=arc;lastHubArcana=arc;rotationView=view;render()};window.auditPage=p=>{state.page=p;render()};window.auditPrefs=(advanced,large)=>{state.settings={...state.settings,secretSauce:advanced,textSize:large?'large':'normal'};render()};\n"+needle)
   page.add_script_tag(content=code)
  # Integrated Bandit Hunt state and actual shared Ducat wallet.
  page.evaluate('()=>auditRoute("bb","bb-bandit")')
  start=page.evaluate('()=>MIDIR_REFORGE.getDucats()')
  page.locator('#bb-start-hunt').click()
  page.evaluate('()=>{Object.assign(__bbAudit.board()[4],{kind:"free",reward:20,art:null});Object.assign(__bbAudit.board()[12],{kind:"counter",reward:5,title:"Horrifying Herbert",cue:"Lunges forward with his jagged polearm",art:"assets/bandit-hunt/herbert-attack.webp"})}')
  page.locator('[data-bb-flip="4"]').click()
  paid=page.evaluate('()=>MIDIR_REFORGE.getDucats()');assert paid>=start+20
  page.locator('[data-bb-flip="12"]').click()
  box=page.locator('.bb-bandit-actions button').last.bounding_box();assert box['x']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=844,box
  if os.getenv('MIDIR_BANDIT_PREVIEW') and w==390:page.screenshot(path='/tmp/midir-bandit-encounter.png')
  page.locator('[data-bb-input="charge"]').click()
  assert page.evaluate('()=>MIDIR_REFORGE.getDucats()')==paid-5
  assert page.locator('.bb-bandit-tile.stolen').count()==8
  if os.getenv('MIDIR_BANDIT_PREVIEW') and w==390:page.screenshot(path='/tmp/midir-bandit-map.png')
  page.locator('#bb-end-hunt').click()
  print(w,'integrated Bandit wallet and encounter PASS',flush=True)

  assert not errors,errors
  page.close()
 browser.close()
