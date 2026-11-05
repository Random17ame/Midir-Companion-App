"""Mobile Rate Isn't a Lie regression: actual Chrome pointer and timer engine."""
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
   if src=='app.js':code=code.replace('function musicBuffBind(){', 'window.__music037={get session(){return musicBuffSession},get slots(){return state.musicBuffLab.slots},get selected(){return musicBuffSelected}};function musicBuffBind(){')
   page.add_script_tag(content=code)
  page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  page.locator('nav [data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('[data-act="hub:music-lie"]').click()
  assert page.locator('[data-music-key]').count()==24
  assert page.locator('#music-begin').is_enabled()
  page.locator('#music-drawer-toggle').click()
  first=page.locator('[data-music-skill]').first
  skill=first.get_attribute('data-music-skill')
  first.click()
  page.locator('[data-music-key]').first.click()
  key=page.locator('[data-music-key]').first.get_attribute('data-music-key')
  assert page.evaluate('window.__music037.slots')[key]==skill
  if mobile:
   if page.locator('#music-drawer').is_hidden():page.locator('#music-drawer-toggle').click()
   pick=page.locator('[data-music-skill]').nth(1)
   pbox=pick.bounding_box();target=page.locator('[data-music-key]').nth(1);tbox=target.bounding_box()
   sx=pbox['x']+pbox['width']/2;sy=pbox['y']+pbox['height']/2
   tx=tbox['x']+tbox['width']/2;ty=tbox['y']+tbox['height']/2
   session=page.context.new_cdp_session(page)
   session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':sx,'y':sy,'id':4}]})
   for step in range(1,9):
    session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':sx+(tx-sx)*step/8,'y':sy+(ty-sy)*step/8,'id':4}]})
    page.wait_for_timeout(15)
   session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
   assert page.evaluate('window.__music037.slots')[target.get_attribute('data-music-key')]==pick.get_attribute('data-music-skill')
  if not page.locator('#music-drawer').is_hidden():page.locator('#music-drawer-close').click()
  page.locator('#music-begin').click()
  assert page.evaluate('!!window.__music037.session')
  if mobile:
   el=page.locator('[data-music-key]').first
   el.scroll_into_view_if_needed();b=el.bounding_box();page.touchscreen.tap(b['x']+b['width']/2,b['y']+b['height']/2)
  else:page.keyboard.press(key)
  result=page.evaluate('''()=>({ready:window.__music037.session.ready,playing:window.__music037.session.playing})''')
  assert skill in result['ready'] and result['ready'][skill]>0,result
  assert result['playing']==skill,result
  assert page.locator('[data-music-cool]').first.inner_text().endswith('s')
  if mobile:
   css=page.evaluate('''()=>({cols:getComputedStyle(document.querySelector('.music-sim-layout .craft-hotbar-row')).gridTemplateColumns.split(' ').length,touch:getComputedStyle(document.querySelector('.music-sim-layout .craft-slot')).touchAction})''')
   assert css['cols']==6 and css['touch']=='none',css
  assert not errors,errors
  page.locator('#music-finish').click()
  print('PASS music simulator',width,height,skill)
  page.close()
 browser.close()
