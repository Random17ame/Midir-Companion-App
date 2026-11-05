"""Offline Companion DOM regression smoke tests (isolated: local file/HTTP navigation is blocked).
Usage: python regression_companion.py /mnt/data/comp261
"""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys,json
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(encoding='utf8'),'html.parser')
scripts=[tag['src'] for tag in soup.find_all('script') if tag.get('src')]
for tag in list(soup.find_all(['script','link','base'])):tag.decompose()
html=str(soup)
results=[]
def test(name,callback):
 try:
  callback();results.append({'test':name,'status':'PASS'});print('PASS',name,file=sys.stderr,flush=True)
 except Exception as e:
  results.append({'test':name,'status':'FAIL','detail':str(e)[:420]});print('FAIL',name,str(e)[:90],file=sys.stderr,flush=True)

def assert_no_errors(errors):
 assert not errors,repr(errors[:4])
def assert_no_legacy(page):
 assert 'Automaticity Training' not in page.locator('#app').inner_text()
def assert_theta_menu(page):
 assert page.locator('#app button').count()>2
 assert ('Theta' in page.locator('#app').inner_text())
def check_settings(page):
 page.locator('#overview-toggle').click()
 page.locator('[data-overview-page="settings"]').click()
 assert 'Settings' in page.locator('#app').inner_text()

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1400,'height':880})
 page.set_default_timeout(1700)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html)
 for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text(encoding='utf8'))
 def nav(name):page.locator(f'nav button[data-page="{name}"]').click()
 def arcana(name):
  nav('rotation')
  back=page.locator('button[data-act="hub:home"]')
  if back.count():back.first.click()
  page.locator('#rotation-lab-arcana').select_option(name)
 def open_hub(name):page.locator(f'button[data-act="hub:{name}"]').first.click()
 def includes(*txt):
  content=page.locator('#app').inner_text().lower()
  for s in txt:assert s.lower() in content,f'{s!r} absent'
 test('load all 24 modules',lambda: (page.locator('#app').wait_for(),assert_no_errors(errors)))
 test('Vault accessible without Secret Sauce',lambda: (nav('vault'),includes('Achievement Book')))
 test('Achievement Book opens',lambda: (page.locator('button[data-act="achievement-book-open"]').click(),includes('Achievement')))
 test('Debuff Academy loads',lambda: (nav('debuff'),includes('Debuff Academy')))
 test('Debuff missing-status scenario',lambda:(page.locator('button[data-act="acad-mode:missing"]').click(),includes('New Debuff, Who This?')))
 test('DD hub has Theta/Crafter, no legacy drill',lambda: (arcana('dd'),includes('Subject Theta: Containment'),assert_no_legacy(page)))
 test('Theta module opens',lambda:(open_hub('theta'),includes('Containment')))
 test('Theta menu controls available',lambda:assert_theta_menu(page))
 test('DD Rotation Crafter opens',lambda:(arcana('dd'),open_hub('craft'),includes('Rotation Crafter')))
 test('AS Crom Bás Invaders opens',lambda:(arcana('as'),open_hub('as-invaders'),includes('Crom')))
 test('EV Tower Defense opens',lambda:(arcana('ev'),open_hub('ev-defense'),includes('Tower')))
 test('SG Rotation Crafter opens',lambda:(arcana('sg'),open_hub('craft'),includes('Rotation Crafter')))
 test('HS Rotation Crafter opens',lambda:(arcana('hs'),open_hub('craft'),includes('Rotation Crafter')))
 test('FA Rotation Crafter opens',lambda:(arcana('fa'),open_hub('craft'),includes('Rotation Crafter')))
 test('EV Reforge Simulator opens',lambda:(arcana('ev'),open_hub('reforge'),includes('Reforge')))
 test('Settings available from sidebar',lambda:check_settings(page))
 test('No page-level JavaScript errors',lambda:assert_no_errors(errors))
 browser.close()
print(json.dumps({'root':str(root),'passed':sum(r['status']=='PASS' for r in results),'total':len(results),'results':results},indent=2))
if any(r['status']!='PASS' for r in results):sys.exit(1)
