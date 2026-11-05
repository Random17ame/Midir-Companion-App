from pathlib import Path
import http.server,threading,functools,sys
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
class Server(http.server.ThreadingHTTPServer):daemon_threads=True
handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root))
server=Server(('127.0.0.1',0),handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  context=browser.new_context(service_workers='allow')
  page=context.new_page()
  base=f'http://127.0.0.1:{server.server_address[1]}'
  page.goto(base+'/index.html',timeout=25000)
  page.wait_for_timeout(1500)
  print('title',page.title(),'sw',page.evaluate("navigator.serviceWorker.getRegistration().then(r=>r?.active?.state||'none')"))
  print('cache',page.evaluate('caches.keys()'))
  page.context.set_offline(True)
  page.reload(timeout=10000)
  print('offline reload',page.title())
  browser.close()
finally:server.shutdown()
