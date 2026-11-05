from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
css=(root/'Companion Files/styles.css').read_text()
pig=(root/'Companion Files/ek-pig-pursuit.js').read_text()
ev=(root/'Companion Files/ev-defense.js').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(390,844),(844,390),(1200,850)]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=True,is_mobile=w!=1200)
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.set_content('<div id="root"></div>')
  page.add_style_tag(content=css)
  page.add_script_tag(content=pig)
  page.evaluate("document.querySelector('#root').innerHTML=MIDIR_PIG.view();MIDIR_PIG.bind()")
  assert page.locator('[data-ek-stick="steer"]').count()==1
  assert page.locator('[data-ek-stick="balance"]').count()==1
  page.locator('#ek-pig-start').click()
  assert page.locator('#ek-pig-overlay').is_hidden()
  for name,pid,dx in [('steer',71,32),('balance',72,-28)]:
   page.evaluate('''([name,id,dx])=>{const el=document.querySelector(`[data-ek-stick="${name}"]`),r=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',pointerId:id,clientX:(r.left+r.right)/2+dx,clientY:(r.top+r.bottom)/2}));}''',[name,pid,dx])
  assert page.evaluate("document.querySelector('[data-ek-stick=steer] .ek-stick-knob').style.transform") !='translate(0,0)'
  assert page.evaluate("document.querySelector('[data-ek-stick=balance] .ek-stick-knob').style.transform") !='translate(0,0)'
  for name,pid in [('steer',71),('balance',72)]:
   page.evaluate('''([name,id])=>document.querySelector(`[data-ek-stick="${name}"]`).dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch',pointerId:id}))''',[name,pid])
  page.evaluate('MIDIR_PIG.stop()')
  page.evaluate("document.querySelector('#root').innerHTML=MIDIR_EV_DEFENSE.view();MIDIR_EV_DEFENSE.bind()") if False else None
  page.add_script_tag(content=ev)
  page.evaluate("document.querySelector('#root').innerHTML=MIDIR_EV_DEFENSE.view();MIDIR_EV_DEFENSE.bind()")
  assert page.locator('[data-evtd-mobile-cast]').count()>=8
  assert page.locator('.evtd-patrol-pad [data-evtd]').count()==2
  assert page.locator('[data-evtd-mobile-cd]').count()>=8
  page.locator('.evtd-patrol-pad [data-evtd="patrol-next"]').click()
  page.locator('.evtd-patrol-pad [data-evtd="patrol-back"]').click()
  board=page.locator('#evtd-board')
  page.evaluate('''()=>{const c=document.querySelector('#evtd-board'),r=c.getBoundingClientRect(),cy=(r.top+r.bottom)/2,cx=(r.left+r.right)/2;for(const [type,id,x] of [['pointerdown',41,cx-35],['pointerdown',42,cx+35],['pointermove',42,cx+70],['pointerup',41,cx-35],['pointerup',42,cx+70]])c.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerType:'touch',pointerId:id,clientX:x,clientY:cy,button:0}))}''')
  assert page.locator('#evtd-zoom-label').inner_text()!='100%',page.locator('#evtd-zoom-label').inner_text()
  assert not errors,errors
  print('PASS mobile038 pig+EV',w,h)
  page.close()
 b.close()
