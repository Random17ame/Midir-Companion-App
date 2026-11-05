from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for el in list(soup.find_all(['script','link','base'])):el.decompose()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125.0.0.0 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('dialog',lambda dialog:dialog.accept())
 page.set_content(str(soup))
 for file in scripts:page.add_script_tag(content=(root/'Companion Files'/file).read_text())
 # Enable existing optional analysis tools via same settings action as desktop.
 page.locator('[data-act="mobile-open-settings"]').click()
 toggle=page.locator('[data-setting="secretSauce"]')
 print('Settings secret toggle',toggle.count())
 if toggle.count():toggle.click(no_wait_after=True,timeout=3000)
 page.locator('nav [data-page="vault"]').click()
 page.locator('#reports-picker').set_input_files('/mnt/data/Sample Export 2.html')
 page.wait_for_timeout(3000)
 print('notice',page.locator('#notice').inner_text()[:350]);print('archived',page.locator('button[data-act="report-archive"]').count())
 print('errors',errors[:3])
 assert not errors
 browser.close()
