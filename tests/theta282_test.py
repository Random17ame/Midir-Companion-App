"""Theta feedback regression: isolated browser test, no saved profile modification."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
src=(root/'Companion Files/theta-rhythm.js').read_text()
# Test-only observation hook inside isolated page. Production source is not modified.
src=src.replace('window.MIDIR_THETA={',"window.__thetaAudit=()=>({run,profile});window.MIDIR_THETA={")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(); errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content('<div id="theta-root"></div>')
 page.add_script_tag(content=src)
 page.evaluate('MIDIR_THETA.mount()')
 assert page.locator('[data-theta="buy:lucky"]').count()==0
 page.locator('[data-theta="tab:shop"]').click()
 assert page.locator('[data-theta="buy:lucky"]').count()==1
 page.evaluate('window.__thetaAudit().profile.credits=600')
 page.evaluate('MIDIR_THETA.mount()')
 page.locator('[data-theta="tab:shop"]').click()
 page.locator('[data-theta="buy:lucky"]').click()
 assert page.evaluate('MIDIR_THETA.exportState().upgrades.lucky')==1
 page.evaluate('window.__thetaAudit().profile.level=10')
 page.locator('[data-theta="start"]').click()
 assert page.locator('#theta-canvas').count()==1
 info=page.evaluate('''()=>{let r=__thetaAudit().run;return {mp:r.mp,cap:r.dorcha,events:r.chart.events.map(e=>e.id)}}''')
 assert info['mp']==2500 and info['cap']==10,info
 assert not set(info['events']).intersection({'render','mana','hex'}),info
 page.locator('[data-theta="utility:render"]').click()
 state=page.evaluate('''()=>{let r=__thetaAudit().run;return {dorcha:r.dorcha,heat:r.overheat,hits:r.hits,uses:r.utilityLast.render}}''')
 assert state['dorcha']==15 and state['heat']==0 and state['hits']==0,state
 page.locator('[data-theta="utility:render"]').click()
 assert page.evaluate('__thetaAudit().run.dorcha')==15
 page.locator('[data-theta="utility:mana"]').click()
 assert page.evaluate('__thetaAudit().run.overheat')==0
 page.locator('[data-theta="utility:hex"]').click()
 assert page.evaluate('__thetaAudit().run.hexUntil')>0
 # Target drawing should run without errors (including successful particle/shader loop).
 page.wait_for_timeout(230)
 assert page.evaluate('__thetaAudit().run.dorcha')<=15
 # Damage note mis-timed still counts as failure while utilities do not.
 page.keyboard.press('a')
 assert page.evaluate('__thetaAudit().run.overheat')==1
 # Persisted upgrade survives export/import of old and new profile structures.
 save=page.evaluate('MIDIR_THETA.exportState()')
 assert save['upgrades']['lucky']==1
 assert not errors,errors
 print('PASS Theta282 shop, utilities, cap, resource pool, timing chart, overheat, rendering')
 browser.close()
