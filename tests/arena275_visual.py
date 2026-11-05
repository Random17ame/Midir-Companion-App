from pathlib import Path
from urllib.parse import unquote,urlsplit
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path('/mnt/data/comp275'); sub=root/'Companion Files'
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for el in list(soup.find_all(['script','link','base'])):el.decompose()
base=soup.new_tag('base',href='https://vt.local/Companion%20Files/')
soup.head.insert(0,base)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1100})
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 def route_file(route):
  path=unquote(urlsplit(route.request.url).path).removeprefix('/Companion Files/')
  f=(sub/path).resolve()
  if f.is_file() and f.is_relative_to(sub):
   ext=f.suffix.lower();mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2','.css':'text/css'}.get(ext,'application/octet-stream')
   route.fulfill(status=200,body=f.read_bytes(),content_type=mime)
  else:route.fulfill(status=404,body=b'')
 page.route('https://vt.local/**',route_file)
 page.set_content(str(soup))
 page.add_style_tag(content=(sub/'styles.css').read_text())
 page.add_style_tag(content=(sub/'vertrag-survival.css').read_text())
 for src in scripts:page.add_script_tag(content=(sub/src).read_text())
 page.locator('nav [data-page=rotation]').click()
 page.locator('[data-act="hub:vertrag"]').click()
 page.locator('[data-vt="launch"]').click()
 page.wait_for_timeout(900)
 page.locator('canvas#vt-canvas').screenshot(path=str(root/'arena275-preview.png'))
 print('loaded map',page.evaluate('''() => new Promise(resolve=>{const im=new Image; im.onload=()=>resolve([im.width,im.height]); im.onerror=()=>resolve(false); im.src="assets/vertrag/giant-phase-arena.png"})'''))
 print('canvas',page.locator('canvas#vt-canvas').count(),'errors',errs[:5])
 canvas=page.locator('#vt-canvas');box=canvas.bounding_box();page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
 before=page.locator('#vt-zoom').inner_text();page.mouse.wheel(0,-250);page.wait_for_timeout(150);after=page.locator('#vt-zoom').inner_text();assert int(after.split()[1][:-1])>int(before.split()[1][:-1]),(before,after)
 page.mouse.click(box['x']+box['width']*.7,box['y']+box['height']*.6);page.wait_for_timeout(150);assert not errs,errs
 for i in range(24):page.mouse.wheel(0,200)
 page.wait_for_timeout(150);lo=page.locator('#vt-zoom').inner_text();assert int(lo.split()[1][:-1])<100,lo
 for i in range(25):page.mouse.wheel(0,-200)
 page.wait_for_timeout(150);hi=page.locator('#vt-zoom').inner_text();assert int(hi.split()[1][:-1])<=265,hi
 print('PASS camera zoom',before,after,lo,hi,'click-to-move after zoom, no JS errors')
 b.close()
