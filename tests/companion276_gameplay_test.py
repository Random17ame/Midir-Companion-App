"""Injected Chromium smoke tests for Theta overheat and four-alive Vertrag trial."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for tag in list(soup.find_all(['script','link','base'])):tag.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1400,'height':900})
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_default_timeout(6000)
 page.set_content(str(soup))
 for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
 def hub(a,action):
  page.locator('nav [data-page=rotation]').click()
  if page.locator('button[data-act="hub:home"]').count():page.locator('button[data-act="hub:home"]').first.click()
  page.locator('#rotation-lab-arcana').select_option(a)
  page.locator(f'[data-act="hub:{action}"]').click()
 hub('dd','theta')
 page.locator('[data-theta="start"]').click()
 assert page.locator('#theta-canvas').count()==1
 for _ in range(5):page.keyboard.press('d')
 text=page.locator('#theta-root').inner_text()
 assert 'Containment overheated' in text,text[-600:]
 assert 'Five overheat marks' in text
 assert 'Dark Sigils +0' in text
 hub('sg','vertrag')
 page.locator('[data-vt-setting="giants"]').select_option('0')
 page.locator('[data-vt-setting="mode"]').select_option('trial')
 page.locator('[data-vt="launch"]').click()
 page.wait_for_timeout(120)
 assert page.locator('#vt-canvas').count()==1,'A zero-stomper trial must not end immediately'
 info=page.locator('#vt-bars').inner_text()
 assert 'Giants 4/4' in info,info
 assert 'Stomping 0' in info,info
 assert not errs,errs
 print('PASS Companion 276: Theta five-mark no-reward overheat; Vertrag zero stomps, four alive, no instant clear')
 b.close()
