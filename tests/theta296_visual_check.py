from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path('/mnt/data/midir296').resolve()
html=(root/'Midir Companion.html').read_text()
# use file server not necessary with set_content? but scripts relative. We'll just open file.
import http.server, socketserver, threading, os
os.chdir(root)
PORT=8126
class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
httpd=socketserver.TCPServer(("127.0.0.1",PORT),Handler)
threading.Thread(target=httpd.serve_forever,daemon=True).start()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':960,'height':720})
    page.goto(f'http://127.0.0.1:{PORT}/index.html', wait_until='networkidle')
    page.click('text=Arcana Simulators')
    page.click('text=Subject: Theta Containment')
    page.evaluate('localStorage.clear()')
    page.click('[data-theta="start"]')
    page.screenshot(path='/mnt/data/theta296_start.png')
    # force 4 overheat to inspect critical state
    page.evaluate('''()=>{for(let i=0;i<4;i++)MIDIR_THETA.handleAction('a');}''')
    page.wait_for_timeout(100)
    page.screenshot(path='/mnt/data/theta296_critical.png')
    browser.close()
httpd.shutdown()
print('done')
