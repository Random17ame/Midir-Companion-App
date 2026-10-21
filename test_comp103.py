from pathlib import Path
from playwright.sync_api import sync_playwright
import re
folder=Path('/mnt/data/_comp103_work')
html=(folder/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+ (folder/'styles.css').read_text()+'</style>')
html=html.replace('<head>','<head><base href="https://local.midir.test/">',1)
html=re.sub(r'<script src="([\w.-]+\.js)"></script>',lambda m:'<script>'+ (folder/m.group(1)).read_text().replace('</script>','<\\/script>')+'</script>',html)
errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1280,'height':1000},device_scale_factor=1)
 page.on('pageerror',lambda error:errors.append(str(error)))
 def route_handler(route):
  u=route.request.url
  path=u.removeprefix('https://local.midir.test/')
  dest=folder/path
  if dest.is_file():
   ctype='image/webp' if dest.suffix=='.webp' else 'image/png' if dest.suffix=='.png' else 'application/octet-stream'
   route.fulfill(status=200,body=dest.read_bytes(),content_type=ctype)
  else:route.fulfill(status=404,body='missing')
 page.route('https://local.midir.test/**',route_handler)
 page.goto('about:blank')
 page.evaluate("""() => { const mem = new Map(); Object.defineProperty(window, 'localStorage',{configurable:true,value:{getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k),key:i=>Array.from(mem.keys())[i],get length(){return mem.size}}}); }""")
 page.set_content(html,wait_until='domcontentloaded',timeout=25000)
 page.wait_for_timeout(400)
 page.locator('nav [data-page="rotation"]').click()
 page.locator('.rotation-arcana-picker select').select_option('bb')
 page.locator('[data-act="hub:bb-bandit"]').click()
 assert page.locator('#bb-bandit-root').count()==1
 # Force an unequivocal golem encounter on the new board.
 page.evaluate('Math.random=()=>0.74')
 page.locator('#bb-start-hunt').click()
 page.locator('[data-bb-flip="0"]').click()
 assert page.locator('.bb-bandit-active.dodge.has-art').count()==1, 'Missing golem card'
 portrait=page.locator('.bb-active-portrait img.golem-photo')
 assert portrait.count()==1
 page.wait_for_function("() => document.querySelector('.bb-active-portrait img')?.complete === true",timeout=5000)
 print('Golem portrait:',portrait.get_attribute('src'), 'image loaded:',portrait.evaluate('(img)=>img.naturalWidth>0'))
 print('Golem cue:',page.locator('.bb-encounter-cue').inner_text())
 assert portrait.evaluate('(img)=>img.naturalWidth>0')
 page.screenshot(path='/mnt/data/_comp103_work/qa-comp103-golem.png',full_page=True)
 before=page.evaluate('window.MIDIR_REFORGE.getDucats()')
 page.locator('[data-bb-input="dodge"]').click()
 after=page.evaluate('window.MIDIR_REFORGE.getDucats()')
 assert after>before
 print('Golem Tumble reward:',before,'->',after)
 # Confirm re-render and original character images remain functional.
 page.locator('#bb-end-hunt').click()
 page.evaluate('Math.random=()=>0.25')
 page.locator('#bb-start-hunt').click()
 page.locator('[data-bb-flip="1"]').click()
 bandit=page.locator('.bb-active-portrait img')
 page.wait_for_function("() => document.querySelector('.bb-active-portrait img')?.complete === true",timeout=5000)
 print('Bandit image loaded:',bandit.evaluate('(img)=>img.naturalWidth>0'))
 assert bandit.evaluate('(img)=>img.naturalWidth>0')
 assert page.locator('.bb-bandit-active.counter').count()==1
 page.keyboard.press('1')
 print('Counter reward:',page.evaluate('window.MIDIR_REFORGE.getDucats()'))
 # Golem images exist for all variants
 for name in ['moss','rune','ice','pale','dark']:
  file=folder/f'assets/bandit-hunt/golem-{name}.webp'
  assert file.exists() and file.stat().st_size>5000
 print('JavaScript errors:',errors)
 assert not errors
 b.close()
