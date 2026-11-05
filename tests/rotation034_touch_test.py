"""Touch integration of actual Rotation Crafter UI and key engine, no network."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src') and x['src']!='pwa.js']
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(390,844),(844,390),(1200,850)]:
  mobile=width!=1200
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile)
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  page.set_content(str(soup))
  for src in scripts:
   code=(root/'Companion Files'/src).read_text()
   if src=='app.js':code=code.replace('function craftBind(){', 'window.__craft034={get session(){return craftSession},get profile(){return craftProfile()},touch:()=>craftTouchHotkey,down:craftKeyDown,up:craftKeyUp};function craftBind(){')
   page.add_script_tag(content=code)
  page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  page.locator('nav [data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('as')
  page.locator('[data-act="hub:craft"]').click()
  assert page.locator('.craft-hotbar [data-craft-key]').count()==24
  page.locator('#craft-drawer-toggle').click()
  picks=page.locator('[data-craft-skill]')
  assert picks.count()>1
  selected=picks.first.get_attribute('data-craft-skill')
  page.locator('[data-craft-skill]').first.click()
  page.locator('[data-craft-key]').first.click()
  key=page.locator('[data-craft-key]').first.get_attribute('data-craft-key')
  assert page.locator('[data-craft-key]').first.get_attribute('aria-label') != key+': Empty slot'
  if mobile:
   # Test actual Chrome touch drag from the bottom drawer to a visible hotkey.
   page.locator('[data-craft-key]').nth(1).scroll_into_view_if_needed()
   page.locator('#craft-drawer-toggle').click() if page.locator('#craft-drawer').is_hidden() else None
   pick=page.locator('[data-craft-skill]').nth(1)
   pick_name=pick.locator('strong').inner_text()
   pbox=pick.bounding_box()
   target=page.locator('[data-craft-key]').nth(1)
   tbox=target.bounding_box()
   sx=pbox['x']+pbox['width']/2;sy=pbox['y']+pbox['height']/2
   tx=tbox['x']+tbox['width']/2;ty=tbox['y']+tbox['height']/2
   assert ty<height*.75,(width,ty,height)
   session=page.context.new_cdp_session(page)
   session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':sx,'y':sy,'id':4}]})
   for step in range(1,9):
    x=sx+(tx-sx)*step/8;y=sy+(ty-sy)*step/8
    session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y,'id':4}]})
    page.wait_for_timeout(15)
   session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
   target_label=target.get_attribute('aria-label')
   assert pick_name in target_label,(width,pick_name,target_label)
   page.locator('#craft-drawer-close').click()

  # ensure casting uses same skill and is recorded by the session engine
  if not page.locator('#craft-drawer').is_hidden():page.locator('#craft-drawer-close').click()
  page.locator('#craft-begin').click()
  before=page.locator('#craft-feedback').inner_text()
  if mobile:
   page.locator('[data-craft-key]').first.scroll_into_view_if_needed()
   box=page.locator('[data-craft-key]').first.bounding_box()
   page.touchscreen.tap(box['x']+box['width']/2,box['y']+box['height']/2)
  else:
   page.keyboard.press(key)
  after=page.locator('#craft-feedback').inner_text()
  assert after!=before,(width,selected,before,after)
  if mobile:
   css=page.evaluate('''()=>({cols:getComputedStyle(document.querySelector('.craft-hotbar-row')).gridTemplateColumns.split(' ').length, touch:getComputedStyle(document.querySelector('.craft-slot')).touchAction})''')
   assert css['cols']==6,css
  assert not errors,errors
  print('PASS crafter',width,height,'assigned',selected,'cast',after[:70])
  page.close()
 browser.close()
