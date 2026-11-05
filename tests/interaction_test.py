from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys,json
root=Path(sys.argv[1]).resolve();soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser');scripts=[s['src'] for s in soup.find_all('script') if s.get('src')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()

def assert_no_errors(errors):
 assert not errors,repr(errors[:4])

with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page();page.set_default_timeout(1800);page.set_content(str(soup))
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text())
 checks=[]
 def check(name,fn):
  try:fn();checks.append((name,'PASS'))
  except Exception as e:checks.append((name,'FAIL '+str(e).splitlines()[0][:140]))
 def route(arc,hub):
  page.locator('nav button[data-page="rotation"]').click()
  back=page.locator('button[data-act="hub:home"]')
  if back.count():back.click()
  page.locator('#rotation-lab-arcana').select_option(arc)
  page.locator('button[data-act="hub:'+hub+'"]').first.click()
 def theta():route('dd','theta')
 def game_start():
  theta();page.locator('button[data-theta="start"]').click();assert page.locator('#theta-canvas').count()==1
 def pause_toggle():
  page.locator('button[data-theta="pause"]').click();assert page.locator('button[data-theta="pause"]').inner_text()=='Resume'
  page.locator('button[data-theta="pause"]').click();assert page.locator('button[data-theta="pause"]').inner_text()=='Pause'
 def seething_toggle():
  before=page.locator('button[data-theta="toggle"]').inner_text();page.locator('button[data-theta="toggle"]').click();after=page.locator('button[data-theta="toggle"]').inner_text();assert before!=after
 def sound_toggle():
  before=page.locator('button[data-theta="sound"]').inner_text();page.locator('button[data-theta="sound"]').click();after=page.locator('button[data-theta="sound"]').inner_text();assert before!=after
 def end_game():
  page.locator('button[data-theta="end"]').click();assert page.locator('#theta-canvas').count()==0
 def theta_tabs():
  theta()
  for tab in ['levels','keys','shop','awards']:
   page.locator(f'button[data-theta="tab:{tab}"]').click()
   assert page.locator('#theta-root').count()==1
 def profile_export():
  out=page.evaluate('window.MIDIR_THETA.exportState()');assert 'unlocked' in out and 'keys' in out and 'upgrades' in out
 def profile_import_guard():
  result=page.evaluate('(()=>{try{window.MIDIR_THETA.importState({bad:1});return false}catch(e){return true}})()');assert result
 check('Theta start',game_start)
 check('Theta pause/resume',pause_toggle)
 check('Seething Mana state feedback',seething_toggle)
 check('Sound toggle state feedback',sound_toggle)
 check('End Theta run',end_game)
 check('Theta tabs',theta_tabs)
 check('Theta export API',profile_export)
 check('Theta rejects malformed imports',profile_import_guard)
 check('No JavaScript exceptions',lambda:assert_no_errors(errors))
 print(json.dumps({'version':root.name,'checks':checks,'passed':sum(c[1]=='PASS' for c in checks)},indent=2));b.close()
 if any(c[1]!='PASS' for c in checks):sys.exit(1)