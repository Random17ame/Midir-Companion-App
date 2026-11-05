"""0.3.3 focused Irusan joystick, touch skill cooldown, Ronaun pool, basic ranged cadence and Theta touch UI."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
inv=(root/'Companion Files/as-chicken-invaders.js').read_text().replace('window.MIDIR_AS_INVADERS={','window.__inv033={start,refreshShell,phase:()=>phase,world:()=>world,damageGlasTarget,updateHud,tick,ir us:ir usanStruggleInput};window.MIDIR_AS_INVADERS={'.replace('ir us:ir usanStruggleInput','struggle:irusanStruggleInput'))
theta=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__theta033={start,profile,buildChart,hit,run:()=>run,activateVortex};window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 13; SM-A516U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<style>'+ (root/'Companion Files/styles.css').read_text()+'</style><div id="inv"></div><div id="theta-root"></div>')
 page.add_script_tag(content=(root/'Companion Files/mobile-movement.js').read_text())
 page.add_script_tag(content=inv)
 result=page.evaluate('''()=>{
  document.querySelector('#inv').innerHTML=MIDIR_AS_INVADERS.view();MIDIR_AS_INVADERS.bind();__inv033.start();
  let w=__inv033.world();w.enemies=[];w.irusanPower={boss:{hp:200,irusan:{}},progress:0,last:null,needed:20};
  const j=document.querySelector('.midir-analog-pad'),r=j.getBoundingClientRect(),cx=(r.left+r.right)/2,cy=(r.top+r.bottom)/2;
  j.dispatchEvent(new PointerEvent('pointerdown',{pointerId:10,bubbles:true,clientX:cx,clientY:cy}));
  for(let i=0;i<10;i++)j.dispatchEvent(new PointerEvent('pointermove',{pointerId:10,bubbles:true,clientX:cx+(i%2?-40:40),clientY:cy}));
  let progress=w.irusanPower?.progress; j.dispatchEvent(new PointerEvent('pointerup',{pointerId:10,bubbles:true,clientX:cx,clientY:cy}));
  const ronaun={hp:100,max:100,type:'Ronaun',shield:18};__inv033.damageGlasTarget(ronaun,34,null);
  w.irusanPower=null;w.lastCast.urgent=w.t-3;__inv033.updateHud();
  const button=document.querySelector('[data-asci-touch="urgent"]');
  w.enemies=[{type:'Gwallgof',x:w.hero.x+95,y:w.hero.y,hp:9999,max:9999,shield:0,phase:0,dir:1,moveAxis:'none',originX:w.hero.x+95,originY:w.hero.y,waveBorn:w.t}];
  w.wraithDue=1e8;w.lastAuto=w.t;w.lastCloseAuto=w.t;w.moveTick=w.t+50;
  __inv033.tick(1.01);const closeAt95=w.lastCloseAuto,magnumAt95=w.lastAuto;
  w.enemies[0].x=w.hero.x+145;w.enemies[0].originX=w.enemies[0].x;
  __inv033.tick(1.01);const closeAt145=w.lastCloseAuto,magnumAt145=w.lastAuto;
  return {progress,ronaunHp:ronaun.hp,ronaunShield:ronaun.shield,cd:button?.querySelector('.asci-touch-cd')?.textContent,range:document.querySelector('.midir-analog-pad')!==null,closeAt95,magnumAt95,closeAt145,magnumAt145};
 }''')
 assert result['progress']==10,result
 assert result['ronaunHp']==84 and result['ronaunShield']==0,result
 # Urgent may be locked in clean profile, so label is LOCK in that case.
 assert result['cd'] in ('LOCK','7.0s'),result
 assert result['closeAt95']==result['magnumAt95'] and result['closeAt95']>0,result
 assert result['closeAt145']==result['closeAt95'] and result['magnumAt145']>result['magnumAt95'],result
 print('Crom verified:',result)
 page.set_content('<div id="theta-root"></div>')
 page.add_script_tag(content=theta)
 page.evaluate('MIDIR_THETA.mount()')
 result=page.evaluate('''()=>{
 const a=__theta033;a.profile.level=9;a.profile.unlocked=10;a.start(true);
 const chart=a.run().chart.events,skills=new Set(chart.filter(x=>x.ix>=0).map(x=>x.id));
 const c=document.getElementById('theta-canvas');
 return {skills:[...skills],buttons:[...document.querySelectorAll('.theta-touch-lanes [data-theta]')].map(x=>x.dataset.theta),utility:document.querySelectorAll('.theta-utility-panel [data-theta]').length,canvas:!!c,lanes:[...document.querySelectorAll('.theta-touch-lanes button')].length};
 }''')
 assert set(result['skills'])<= {'thunder','blight','flare'},result
 assert result['lanes']==5 and result['utility']>=6,result
 assert not errors,errors
 print('Theta verified:',result)
 b.close()
