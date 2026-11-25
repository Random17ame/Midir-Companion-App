"""Local HTTP PWA smoke test: all 26 rune PNGs available after fresh shell installation."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(BASE)))
Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
  context=browser.new_context();page=context.new_page()
  page.goto(f'http://127.0.0.1:{server.server_port}/index.html',wait_until='domcontentloaded')
  page.evaluate('''async()=>{await navigator.serviceWorker.register('/service-worker.js');await navigator.serviceWorker.ready}''')
  page.wait_for_function('!!navigator.serviceWorker.controller',timeout=30000)
  paths=['/'+str(x.relative_to(BASE)).replace('\\','/') for x in (BASE/'Companion Files/assets/ogham').glob('*/*.png') if x.parent.name in ('game-reference','provisional')]
  assert len(paths)==26
  context.set_offline(True)
  # First use of the images occurs offline, not after warming the art cache.
  result=page.evaluate('''async paths=>Promise.all(paths.map(async path=>{const r=await fetch(path);return r.ok&&(await r.blob()).size>0}))''',paths)
  assert all(result),result
  print('PASS local HTTP service worker: all 26 precached rune PNGs load offline',flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
