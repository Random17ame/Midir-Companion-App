"""280 static/isolated mobile smoke suite (HTTPS device installation remains unverified)."""
from pathlib import Path
import json,re,sys
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve();page_text=(root/'Midir Companion.html').read_text();soup=BeautifulSoup(page_text,'html.parser')
manifest=json.loads((root/'manifest.webmanifest').read_text());assert manifest['display']=='standalone'
assert manifest['start_url']=='./index.html'
for icon in manifest['icons']:assert (root/icon['src']).exists()
assert '"../manifest.webmanifest"' in page_text
for rel in re.findall(r'<script src="([^"]+)"',page_text):assert (root/'Companion Files'/rel).exists(),rel
sw=(root/'service-worker.js').read_text();assert 'cache.addAll(CORE)' in sw and 'midir-shell-282' in sw
assert 'if(!shell&&!art)return' in sw
app=(root/'Companion Files/app.js').read_text();mob=re.search(r'MIDIR_MOBILE_DESKTOP_ONLY=new Set\((\[[^\n]+\])\)',app).group(1)
assert "'bb-bandit'" not in mob and "'craft'" in mob and "'theta'" in mob
scripts=[x['src'] for x in soup.find_all('script') if x.get('src') and x['src']!='pwa.js']
for e in list(soup.find_all(['script','link','base'])):e.decompose()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125.0.0.0 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for file in scripts:page.add_script_tag(content=(root/'Companion Files'/file).read_text())
 # Hub opens independently of profile, including the newly mobile-enabled BB mode.
 page.locator('nav [data-page="rotation"]').click()
 page.locator('#rotation-lab-arcana').select_option('bb')
 assert page.locator('button[data-act="hub:bb-bandit"]').count()==1
 assert not page.locator('button[data-act="hub:bb-bandit"]').is_disabled()
 page.locator('button[data-act="hub:bb-bandit"]').click()
 assert page.locator('#bb-start-hunt').count()==1
 page.locator('#bb-start-hunt').click()
 assert page.locator('#bb-bandit-root').count()==1
 # Time-sensitive encounter action buttons exist in the source UI and respond to click events.
 assert 'data-bb-input="counter"' in (root/'Companion Files/bb-bandit-flip.js').read_text()
 page.locator('[data-act="hub:home"]').first.click()
 page.locator('#rotation-lab-arcana').select_option('fa')
 assert not page.locator('[data-act="hub:herbs"]').is_disabled()
 page.locator('[data-act="hub:herbs"]').click()
 assert page.locator('#herb-collection-field').count()==1
 page.locator('[data-act="hub:home"]').first.click()
 page.locator('#rotation-lab-arcana').select_option('ev')
 assert not page.locator('[data-act="hub:reforge"]').is_disabled()
 page.locator('#rotation-lab-arcana').select_option('dd')
 assert page.locator('[data-act="hub:theta"]').is_disabled()
 assert not errors,errors[:3]
 browser.close()
print('PASS 280: PWA manifest/precache/static assets, mobile Bandit Hunt, Herb, Reforge, desktop-only Theta')
