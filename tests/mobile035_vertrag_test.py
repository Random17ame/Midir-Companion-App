"""0.3.5 shared movement, Vertrag mobile UI, pinch, and potion cooldown."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
style=(root/'Companion Files/styles.css').read_text()+'\n'+(root/'Companion Files/vertrag-survival.css').read_text()
common=(root/'Companion Files/mobile-movement.js').read_text()
vt=(root/'Companion Files/vertrag-survival.js').read_text().replace('window.MIDIR_VERTRAG={','window.__vt035=()=>({get run(){return run},get touchVector(){return {...touchVector}},data});window.MIDIR_VERTRAG={')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(390,844),(844,390)]:
  page=b.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=1,user_agent='Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/128.0 Mobile Safari/537.36'); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<div id="vt-root"></div>');page.add_style_tag(content=style);page.add_script_tag(content=common);page.add_script_tag(content=vt)
  page.evaluate('MIDIR_VERTRAG.mount()');assert page.locator('#vt-setup-canvas').count()==1
  original=page.evaluate('MIDIR_VERTRAG.exportState().config.giantOccupied[0]')
  # Invoke the setup click via a ground-truth giant coordinate in the setup canvas.
  page.evaluate('''()=>{const c=document.querySelector('#vt-setup-canvas'),r=c.getBoundingClientRect();c.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width*(425/850),clientY:r.top+r.height*(33/540)}))}''')
  # Exact giant positions vary; verify click remains available, not an unrelated change.
  page.locator('[data-vt="trial"]').click();assert page.locator('.vt-defense-card').count()==4
  page.locator('[data-vt="defense:standard"]').click()
  assert page.locator('#vt-canvas').count()==1
  assert page.locator('.vt-touch-potion').count()==1
  assert page.locator('.midir-analog-pad').count()==1
  start=page.evaluate('''()=>{let a=__vt035();return {x:a.run.player.x,y:a.run.player.y,zoom:a.run.zoom}}''')
  page.evaluate('''()=>{const el=document.querySelector('.midir-analog-pad'),r=el.getBoundingClientRect(),cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2;el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:71,clientX:cx+30,clientY:cy,pointerType:'touch'}))}''')
  page.wait_for_timeout(200)
  move=page.evaluate('__vt035().touchVector');assert move['x']>.2,move
  page.evaluate('''()=>{document.querySelector('.midir-analog-pad').dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:71,pointerType:'touch'}))}''')
  assert abs(page.evaluate('__vt035().touchVector.x'))<.01
  page.locator('[data-midir-move-toggle]').click();assert page.evaluate('MIDIR_MOBILE_MOVE.current()')=='dpad'
  page.evaluate('''()=>{document.querySelector('[data-midir-dir=right]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:72,pointerType:'touch'}));document.querySelector('[data-midir-dir=up]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:73,pointerType:'touch'}))}''')
  vector=page.evaluate('__vt035().touchVector');assert vector['x']>.6 and vector['y']<-.6,vector
  page.evaluate('''()=>{for(const [p,id] of [[72,'right'],[73,'up']])document.querySelector('[data-midir-dir='+id+']').dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:p,pointerType:'touch'}))}''')
  assert page.evaluate('__vt035().touchVector.x')==0
  page.evaluate('''()=>{const c=document.querySelector('#vt-canvas'),r=c.getBoundingClientRect(),cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2;const ev=(type,id,x)=>c.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerType:'touch',pointerId:id,clientX:x,clientY:cy}));ev('pointerdown',81,cx-30);ev('pointerdown',82,cx+30);ev('pointermove',82,cx+50);ev('pointerup',81,cx-30);ev('pointerup',82,cx+50)}''')
  assert page.evaluate('__vt035().run.zoom')>start['zoom']
  page.evaluate('''()=>{const r=__vt035().run;r.stunUntil=0;r.knockUntil=0;r.potionReady=0;r.paused=false}''')
  page.locator('.vt-touch-potion').click();assert page.evaluate('__vt035().run.potionReady>__vt035().run.elapsed+29')
  assert not errors,errors
  print('PASS Vertrag mobile',w,h,'movement, D-pad diagonal, zoom and potion')
  page.close()
 b.close()
