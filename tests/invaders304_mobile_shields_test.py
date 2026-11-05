"""Crom Invaders 304: Cari shield semantics, all mobile skills, portrait and landscape geometry."""
from pathlib import Path
import sys
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src') and t['src']!='pwa.js']
for t in list(soup.find_all(['script','link','base'])):t.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width,height in [(390,844),(844,390)]:
  page=b.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,device_scale_factor=1,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125 Mobile Safari/537.36')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup))
  page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  for file in scripts:
   script=(root/'Companion Files'/file).read_text()
   if file=='as-chicken-invaders.js':
    script=script.replace('window.MIDIR_AS_INVADERS={','window.__as304={start,refreshShell,damageGlasTarget,world:()=>world,moveEnemiesFrame,skillDefs,cast};window.MIDIR_AS_INVADERS={')
   page.add_script_tag(content=script)
  page.locator('nav [data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('as')
  page.locator('[data-act="hub:as-invaders"]').click()
  assert page.locator('[data-asci-touch]').count()==9
  assert page.locator('[data-asci-touch="urgent"]').count()==1
  assert page.locator('[data-asci-touch="golden"]').count()==1
  assert page.locator('[data-asci-touch="anchor"]').count()==1
  rect=page.evaluate('''()=>{let game=document.querySelector('.asci-game').getBoundingClientRect(),actions=document.querySelector('.asci-touch-actions').getBoundingClientRect(),stick=document.querySelector('.midir-analog-pad').getBoundingClientRect(),orbs=document.querySelector('.asci-stageorbs').getBoundingClientRect();return {game:{x:game.x,y:game.y,right:game.right,bottom:game.bottom},actions:{x:actions.x,y:actions.y,right:actions.right},stick:{x:stick.x,y:stick.y},orbs:{x:orbs.x,y:orbs.y,right:orbs.right}}}''')
  if height>width:
   assert rect['game']['bottom']<=rect['actions']['y']+3,rect
   assert rect['actions']['right']<rect['stick']['x']+10,rect
  else:
   assert rect['actions']['right']<=rect['game']['x']+3,rect
   assert rect['stick']['x']>=rect['game']['right']-5,rect
  assert rect['orbs']['right']<=rect['game']['right']+2,rect
  # Tap-only skills must cast; charge skills retain hold/release behavior.
  taps=page.evaluate('''()=>{
    const api=window.MIDIR_AS_INVADERS;
    api.importState({...api.exportState(),skills:Object.fromEntries(window.__as304.skillDefs.map(d=>[d.id,true]))});
    window.__as304.refreshShell();
    window.__as304.start();
    const instant=document.querySelector('[data-asci-touch="urgent"]');
    const charged=document.querySelector('[data-asci-touch="aqua"]');
    instant.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:60}));
    const instantCast=window.__as304.world().lastCast.urgent;
    instant.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:60}));
    charged.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:61}));
    const charging=!!window.__as304.world().aquaCharge;
    charged.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:61}));
    return {instantCast,charging,after:!!window.__as304.world().aquaCharge};
  }''')
  assert taps['instantCast'] is not None and taps['charging'] and not taps['after'],taps
  # Cari pool: two base 18-damage Magnum shots = 36, irrespective of upgrades.
  outcome=page.evaluate('''()=>{
    window.__as304.start();const w=window.__as304.world();w.t=5;
    const c={x:100,y:100,hp:100,max:100,type:'Frozen Cari',shield:0,waveBorn:0,originX:100,originY:100,phase:0,dir:1};
    const ally={x:140,y:110,hp:100,max:100,type:'Disciple',shield:0,waveBorn:0,originX:140,originY:110,phase:0,dir:1,moveAxis:'x'};
    w.enemies=[c,ally];w.cariShieldTick=0;
    window.__as304.moveEnemiesFrame();
    const before=ally.cariShieldHp;
    window.__as304.damageGlasTarget(ally,18,'fire');const first=[ally.hp,ally.cariShieldHp];
    window.__as304.damageGlasTarget(ally,18,'fire');const second=[ally.hp,ally.cariShieldHp];
    window.__as304.damageGlasTarget(ally,18,'fire');const third=[ally.hp,ally.cariShieldHp];
    // On the next cycle, one large hit penetrates the shield.
    w.t=10;window.__as304.moveEnemiesFrame();const refreshed=ally.cariShieldHp;
    window.__as304.damageGlasTarget(ally,90,'fire');const strong=[ally.hp,ally.cariShieldHp];
    return {before,first,second,third,refreshed,strong};
  }''')
  assert outcome['before']==36,outcome
  assert outcome['first']==[100,18],outcome
  assert outcome['second']==[100,0],outcome
  assert outcome['third']==[82,0],outcome
  assert outcome['refreshed']==36,outcome
  assert outcome['strong']==[28,0],outcome
  assert not errors,errors
  print('PASS',width,'x',height,'portrait/landscape controls, skill coverage, orb corner, Cari baseline-Magnum damage pool',rect,outcome)
  page.close()
 b.close()
