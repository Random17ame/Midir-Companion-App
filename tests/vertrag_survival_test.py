"""Injected-document smoke tests for Vertrag survival, so local-file navigation is unnecessary."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve();soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser');scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']);page=b.new_page(viewport={'width':1400,'height':900});page.set_default_timeout(4500)
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.set_content(str(soup))
 for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
 def arc(a):
  page.locator('nav [data-page=rotation]').click()
  if page.locator('button[data-act="hub:home"]').count():page.locator('button[data-act="hub:home"]').first.click()
  page.locator('#rotation-lab-arcana').select_option(a)
 arc('sg');assert page.locator('[data-act="hub:vertrag"]').count()==1
 page.locator('[data-act="hub:vertrag"]').click();assert page.locator('[data-vt="endless"]').count()==1 and page.locator('[data-vt="trial"]').count()==1
 assert page.locator('[data-vt="select:8"]').count()==0
 page.locator('[data-vt="tab:settings"]').click();page.locator('[data-vt-setting="warning"]').fill('1.2');page.locator('[data-vt-setting="warning"]').press('Tab');assert page.locator('[data-vt-setting="warning"]').input_value()=='1.2'
 page.locator('[data-vt="bind:left"]').click();page.keyboard.press('z');assert 'Z' in page.locator('[data-vt="bind:left"]').inner_text()
 page.locator('[data-vt="tab:menu"]').first.click();page.locator('[data-vt="endless"]').click();page.locator('[data-vt="defense:standard"]').click();assert page.locator('canvas#vt-canvas').count()==1
 page.wait_for_timeout(350);before=page.evaluate('window.__verBefore=document.querySelector("#vt-canvas")!==null');assert before
 page.keyboard.down('z');page.wait_for_timeout(260);page.keyboard.up('z')
 page.locator('[data-vt="pause"]').click();assert 'Resume' in page.locator('[data-vt="pause"]').inner_text();page.locator('[data-vt="pause"]').click();assert 'Pause' in page.locator('[data-vt="pause"]').inner_text()
 page.locator('[data-vt="quit"]').click();assert 'Endless' in page.locator('#vt-root').inner_text()
 page.locator('[data-vt="tab:menu"]').first.click();page.locator('[data-vt="tab:records"]').click();assert 'Records & awards' in page.locator('#vt-root').inner_text()
 page.locator('[data-vt="tab:menu"]').first.click();page.locator('button[data-act="hub:home"]').click();assert page.locator('#vt-root').count()==0
 arc('dd');assert page.locator('[data-act="hub:vertrag"]').count()==1
 page.locator('[data-act="hub:vertrag"]').click();assert page.locator('[data-vt="endless"]').count()==1 and page.locator('[data-vt="trial"]').count()==1
 assert not errs, errs
 print('PASS Vertrag: cross-Arcana entry, controls, keybind, timing settings, launch, pause, results, records, exit, no JS errors')
 b.close()
