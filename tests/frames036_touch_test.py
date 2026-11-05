"""0.3.6 AG/AS Target Frames pointer and tool checks, real browser DOM."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve();soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src') and t['src']!='pwa.js']
for t in list(soup.find_all(['script','link','base'])):t.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(390,844),(844,390),(1200,800)]:
  for arcana in ['ag','as']:
   pg=b.new_page(viewport={'width':w,'height':h},is_mobile=w<1000,has_touch=w<1000)
   errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
   pg.set_content(str(soup))
   for src in scripts:
    code=(root/'Companion Files'/src).read_text()
    if src=='frame-bowling.js':code=code.replace('window.MIDIR_FRAMES={','window.__frames036={sessions,playing};window.MIDIR_FRAMES={')
    pg.add_script_tag(content=code)
   pg.locator('nav [data-page="rotation"]').click()
   pg.locator('#rotation-lab-arcana').select_option(arcana)
   pg.locator(f'[data-act="hub:{"ag-position" if arcana=="ag" else "position"}"]').click()
   if arcana=='as':pg.locator('[data-act="pos-begin"]').click()
   pg.locator(f'[data-fb-enter="{arcana}"]').click()
   assert pg.locator('#fb-stage').count()==1
   assert pg.locator('[data-fb-drag="player"]').count()==1
   assert pg.locator('[data-fb-drag="aim"]').count()==1
   if arcana=='ag':
    before=pg.evaluate('window.__frames036.sessions.ag.heavyTargetId')
    pg.locator('[data-fb-target]').nth(1).click(force=True)
    after=pg.evaluate('window.__frames036.sessions.ag.heavyTargetId')
    assert after!=before,(w,h,before,after)
    pg.locator('[data-fb="field"]').click()
    assert pg.locator('[data-fb="field"]').get_attribute('aria-pressed')=='true'
    pg.locator('[data-fb-target]').first.click(force=True)
    count=pg.evaluate('window.__frames036.sessions.ag.fields.length')
    assert count==1,(w,h,count)
    pg.locator('[data-fb="artillery"]').click()
    assert pg.locator('[data-fb="artillery"]').get_attribute('aria-pressed')=='true'
    pg.locator('[data-fb="fire"]').click()
    assert pg.evaluate('window.__frames036.sessions.ag.shots')==1
   else:
    pg.locator('[data-fb="fire"]').click()
    assert pg.evaluate('window.__frames036.sessions.as.shots')==1
   assert not errors,errors
   print('PASS frame touch',arcana,w,h)
   pg.close()
 b.close()
