from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src')]
for t in list(soup.find_all(['script','link','base'])): t.decompose()
class QuietHandler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 13; SM-A516U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 page.evaluate("""() => { const values={}; Object.defineProperty(window,'localStorage',{ configurable:true, value:{getItem:k=>values[k]??null,setItem:(k,v)=>{values[k]=String(v)},removeItem:k=>{delete values[k]},clear:()=>{Object.keys(values).forEach(k=>delete values[k])}}}); }""")
 for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text())
 banner=page.locator('.mobile-companion-banner')
 assert banner.count()==1,'Mobile banner not shown'
 default=banner.inner_text()
 for forbidden in ['Import downloaded','reports','Archive','compaction','HTML files','Open Settings','Additional Features']:
  assert forbidden.lower() not in default.lower(),f'Disclosure in default banner: {forbidden} — {default}'
 assert 'SG Oath checklist' in default and 'Erg Simulator' in default
 assert 'Importer-specific achievements' not in page.locator('#app').inner_text()
 # Toggle through actual settings checkbox, then return to the Vault.
 page.locator("#overview-toggle").click();page.locator("[data-overview-page=settings]").click()
 box=page.locator('#companion-secret-sauce');assert box.count()==1
 page.evaluate("document.querySelector('#companion-secret-sauce').click()")
 page.locator("nav [data-page=vault]").click()
 text=page.locator('.mobile-companion-banner').inner_text()
 assert 'Import downloaded Discord HTML exports' in text,text
 assert '/ 10 active detailed reports on mobile' in text,text
 assert 'original HTML files' in text,text
 page.locator("#overview-toggle").click();page.locator("[data-overview-page=settings]").click()
 page.evaluate("document.querySelector('#companion-secret-sauce').click()")
 page.locator("nav [data-page=vault]").click()
 reverted=page.locator('.mobile-companion-banner').inner_text()
 assert 'reports' not in reverted.lower() and 'Archive' not in reverted,reverted
 assert not errors,errors
 print('PASS Secret Sauce OFF -> ON -> OFF: no default importer disclosure, advanced guidance appears only when enabled')
 browser.close()

server.shutdown()
