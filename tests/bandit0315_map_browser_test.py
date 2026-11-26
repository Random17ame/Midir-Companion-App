"""Bandit Hunt region navigation, permanent outcomes, real wallet losses and responsive encounter controls."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
source=(root/'Companion Files/bb-bandit-flip.js').read_text().replace('window.MIDIR_BB={','window.__bb={board:()=>board,session:()=>session,regions:()=>regions,active:()=>active,respond,resolveTimeout,refresh};window.MIDIR_BB={')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(320,568),(390,844),(844,390),(1200,844)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<900)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<meta name="viewport" content="width=device-width,initial-scale=1"><main id="app"></main>')
  page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  page.evaluate('''()=>{window.balance=100;window.MIDIR_REFORGE={getDucats:()=>balance,addDucats:n=>balance+=n,spendDucats:n=>{if(balance<n)return false;balance-=n;return true}}}''')
  page.add_script_tag(content=source)
  page.evaluate('()=>{document.querySelector("main").innerHTML=MIDIR_BB.view();MIDIR_BB.onRender()}')
  page.locator('#bb-start-hunt').click()
  assert page.locator('[data-bb-flip]').count()==25
  east=page.locator('[data-bb-travel="1,0"]');west=page.locator('[data-bb-travel="-1,0"]')
  assert east.is_disabled()
  page.evaluate('()=>Object.assign(__bb.board()[4],{kind:"free",reward:20,title:"Cache",art:null})')
  page.locator('[data-bb-flip="4"]').click();assert east.is_enabled()
  assert page.evaluate('balance')==120
  assert page.locator('[data-bb-flip="4"]').is_disabled()
  page.wait_for_timeout(1100)
  assert page.locator('[data-bb-flip="4"]').is_disabled()
  old=page.evaluate('()=>__bb.board().map(t=>t.id)')
  east.click();assert page.evaluate('()=>__bb.regions().size')==2 and west.is_enabled()
  assert page.evaluate('()=>__bb.board().map(t=>t.id)')!=old
  west.click();assert page.evaluate('()=>__bb.board().map(t=>t.id)')==old
  assert page.locator('[data-bb-flip="4"]').is_disabled()
  # Wrong response consumes fixed loot and permanently marks neighbors.
  page.evaluate('()=>{for(const t of __bb.board())if(t.state==="hidden")t.reward=5;Object.assign(__bb.board()[12],{kind:"counter",art:null,title:"Bandit"})}')
  page.locator('[data-bb-flip="12"]').click()
  assert page.locator('.bb-map-encounter').is_visible();assert east.is_disabled()
  box=page.locator('.bb-bandit-actions button').last.bounding_box();assert box['x']>=0 and box['x']+box['width']<=w+1 and box['y']+box['height']<=h+1,box
  page.locator('[data-bb-input="charge"]').click()
  assert page.evaluate('balance')==115 and page.evaluate('()=>__bb.session().carriedLost')==5
  assert page.locator('.bb-bandit-tile.stolen').count()==8
  east.click();west.click();assert page.locator('.bb-bandit-tile.stolen').count()==8
  assert page.locator('.bb-bandit-tile.failed').count()==1
  # A timeout cannot reduce the balance below what it was when the hunt started.
  page.evaluate('()=>Object.assign(__bb.board()[0],{kind:"charge",reward:100,art:null})')
  page.locator('[data-bb-flip="0"]').click();page.evaluate('()=>__bb.resolveTimeout()')
  assert page.evaluate('balance')==100 and page.evaluate('()=>__bb.session().ducats')==0
  # Re-enter the tool without ending the run.
  page.evaluate('()=>{document.querySelector("main").innerHTML="";MIDIR_BB.onRender();document.querySelector("main").innerHTML=MIDIR_BB.view();MIDIR_BB.onRender()}')
  assert page.locator('.bb-bandit-tile.stolen').count()==8
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  page.locator('#bb-end-hunt').click();assert page.evaluate('()=>MIDIR_BB.exportState().runs[0].carriedLost')==20
  page.locator('#bb-start-hunt').click();assert page.locator('.bb-bandit-tile.hidden').count()==25
  assert not errors,errors
  print('PASS map exploration, permanent prizes, wallet protection, responsive actions',w,h,flush=True)
  page.close()
 browser.close()
