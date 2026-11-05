from playwright.sync_api import sync_playwright
from pathlib import Path
from bs4 import BeautifulSoup
import mimetypes
root=Path('/mnt/data/comp272'); folder=root/'Companion Files'
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser');scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
soup.head.insert(0,BeautifulSoup('<base href="https://vt.test/">','html.parser'))
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1400,'height':1000},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 def route(r):
  f=folder/r.request.url.split('https://vt.test/')[-1]
  if f.is_file():r.fulfill(body=f.read_bytes(),content_type=mimetypes.guess_type(str(f))[0] or 'image/png')
  else:r.abort()
 page.route('https://vt.test/**',route)
 page.set_content(str(soup))
 for css in ['styles.css','vertrag-survival.css']:page.add_style_tag(content=(folder/css).read_text())
 for src in scripts:page.add_script_tag(content=(folder/src).read_text())
 page.locator('nav button[data-page="rotation"]').click();page.locator('#rotation-lab-arcana').select_option('sg')
 page.locator('[data-act="hub:vertrag"]').click();page.locator('[data-vt="launch"]').click()
 page.wait_for_timeout(900)
 page.locator('#vt-canvas').screenshot(path=str(root/'camera272-preview.png'))
 print('JS errors:',errors,'canvas:',page.locator('#vt-canvas').count())
 b.close()
