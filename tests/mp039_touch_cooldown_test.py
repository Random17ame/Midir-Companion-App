"""0.3.9: distinct touch skill buttons, fixed Act penalty, independent aim, and EV wave balance."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
source=(root/'Companion Files/mp-rhythm.js').read_text()
ev=(root/'Companion Files/ev-defense.js').read_text()
assert 'if(tier===0&&profile.wave<=2)return profile.wave===1?12:17' in ev
assert "?3:0" in source
assert 'mp-act-bonus' not in source and 'actBonus' not in source
assert 'touch-chorus' in source and 'data-mp-skill' in source
# Test hook is injected into evaluated source, never shipped.
source=source.replace('window.MIDIR_MP_RHYTHM={view,onRender,exportState,importState};',
'''window.__mp_test={state,skillCooldownSeconds,TOUCH_SKILLS,hit};window.MIDIR_MP_RHYTHM={view,onRender,exportState,importState};''')
with sync_playwright() as playwright:
 browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(390,844),(844,390),(1200,850)]:
  mobile=width!=1200
  page=browser.new_page(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile)
  failures=[];page.on('pageerror',lambda exc:failures.append(str(exc)))
  page.set_content('<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#142032;color:white} .card{padding:12px} button{cursor:pointer}</style></head><body><div id="root"></div></body></html>')
  page.add_script_tag(content=source)
  page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  page.evaluate('''()=>{document.querySelector('#root').innerHTML=window.MIDIR_MP_RHYTHM.view();window.MIDIR_MP_RHYTHM.onRender()}''')
  assert page.locator('#mp-act-bonus').count()==0
  assert page.locator('[data-mp-skill]').count()==13
  cd=page.evaluate('''()=>({act7:__mp_test.skillCooldownSeconds(__mp_test.TOUCH_SKILLS.find(s=>s.id==='act7')),downbeat:__mp_test.skillCooldownSeconds(__mp_test.TOUCH_SKILLS.find(s=>s.id==='downbeat')),tempo:__mp_test.skillCooldownSeconds(__mp_test.TOUCH_SKILLS.find(s=>s.id==='tempo')),chorus:__mp_test.skillCooldownSeconds({id:'chorus'})})''')
  assert cd=={'act7':3,'downbeat':4,'tempo':10,'chorus':2},cd
  page.locator('#mp-link').uncheck()
  assert page.evaluate('''()=>__mp_test.skillCooldownSeconds({id:'chorus'})''')==4
  page.locator('#mp-link').check()
  page.locator('#mp-start').click()
  assert page.evaluate('''()=>__mp_test.state.running''')
  # Simulate a live note centered under the aiming finger, just like a real note.
  stage=page.locator('#mp-rhythm-stage')
  box=stage.bounding_box()
  x=box['x']+box['width']*.48;y=box['y']+box['height']*.50
  if mobile:
   page.evaluate('''({x,y})=>{const st=__mp_test.state;st.notes=[{kind:'white',t:st.elapsed,id:333,x:.48,y:.5,done:false}];let el=document.querySelector('#mp-rhythm-stage');st.mobileAimId=7;const r=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:7,pointerType:'touch',clientX:r.left+r.width*.48,clientY:r.top+r.height*.5}));}''',{'x':x,'y':y})
   assert page.evaluate('''()=>__mp_test.state.hit''')==0,'aiming itself scored'
   page.evaluate('''()=>document.querySelector('[data-mp-skill="touch-puppet-7"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:8,pointerType:'touch'}))''')
  else:
   page.mouse.move(x,y)
   page.evaluate('''()=>{const st=__mp_test.state;st.notes=[{kind:'white',t:st.elapsed,id:333,x:.48,y:.5,done:false}]}''')
   page.keyboard.press('1')
  assert page.evaluate('''()=>__mp_test.state.hit''')==1,'first note not hit'
  if mobile:
   assert page.locator('[data-mp-skill="touch-puppet-7"] [data-mp-cd]').inner_text().endswith('s')
   assert page.evaluate('''()=>__mp_test.state.actionReadyAt['touch-puppet-7']-__mp_test.state.elapsed>2500''')
   page.evaluate('''()=>{const st=__mp_test.state;st.notes=[{kind:'white',t:st.elapsed,id:334,x:.48,y:.5,done:false}];document.querySelector('[data-mp-skill="touch-puppet-7"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:9,pointerType:'touch'}))}''')
   assert page.evaluate('''()=>__mp_test.state.hit''')==1,'cooldown allowed repeat'
   page.evaluate('''()=>{const st=__mp_test.state;st.notes=[{kind:'white',t:st.elapsed,id:335,x:.48,y:.5,done:false}];document.querySelector('[data-mp-skill="touch-mp-downbeat"]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:10,pointerType:'touch'}))}''')
   assert page.evaluate('''()=>__mp_test.state.hit''')==2,'separate skill key failed'
   css=page.evaluate('''()=>({aim:getComputedStyle(document.querySelector('#mp-rhythm-stage')).touchAction,panel:getComputedStyle(document.querySelector('.mp-touch-keys')).overflowY,stageH:document.querySelector('#mp-rhythm-stage').getBoundingClientRect().height,panelH:document.querySelector('.mp-touch-keys').getBoundingClientRect().height})''')
   assert css['aim']=='none' and css['panel']=='auto',css
  # Chorus can only be triggered by dedicated button on mobile.
  assert not failures,failures
  print('PASS MP rhythm',width,height,cd)
  page.close()
 browser.close()
