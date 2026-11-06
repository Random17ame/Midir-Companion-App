"""0.3.11f: synthetic Storage realm exercises ephemeral saves, purchases, and scheduling."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
base=(root/'Companion Files')
setup='''(active)=>{
 const local=Object.create(Storage.prototype),session=Object.create(Storage.prototype),disk=new Map(),tab=new Map();
 const stores=new WeakMap([[local,disk],[session,tab]]);
 Storage.prototype.getItem=function(key){const map=stores.get(this);return map?.has(String(key))?map.get(String(key)):null};
 Storage.prototype.setItem=function(key,value){stores.get(this).set(String(key),String(value))};
 Storage.prototype.removeItem=function(key){stores.get(this).delete(String(key))};
 Storage.prototype.key=function(n){return [...stores.get(this).keys()][n]||null};
 Object.defineProperty(Storage.prototype,'length',{get(){return stores.get(this)?.size||0},configurable:true});
 Object.defineProperty(window,'localStorage',{value:local,configurable:true});
 Object.defineProperty(window,'sessionStorage',{value:session,configurable:true});
 window.__testDisk=disk;window.__testTab=tab;
 disk.set('midir-companion-01',JSON.stringify({characterName:'Baseline',reports:[],metricMilestones:[]}));
 disk.set('midir-theta-rhythm-v1',JSON.stringify({credits:123,unlocked:1,upgrades:{power:0}}));
 disk.set('midir-vertrag-survival-v1',JSON.stringify({points:0}));
 disk.set('midir-as-crom-invaders-v1',JSON.stringify({fragments:6,chunks:5}));
 if(active)tab.set('midir-runtime-scope-v1','qa-token');
}'''
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(844,390)]:
  page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<div id="vt-root"></div><div id="theta-root"></div>')
  page.evaluate(setup,True)
  page.add_script_tag(content=(base/'runtime-profile.js').read_text().replace('location.reload();','window.__testReload=(window.__testReload||0)+1;'))
  assert page.evaluate('MIDIR_RUNTIME_SCOPE.active')
  assert page.evaluate("JSON.parse(localStorage.getItem('midir-theta-rhythm-v1')).credits")==10**12
  assert page.evaluate("JSON.parse(localStorage.getItem('midir-as-crom-invaders-v1')).fragments")==10**12
  assert page.evaluate("JSON.parse(localStorage.getItem('midir-vertrag-survival-v1')).points")==10**12
  assert page.evaluate("JSON.parse(__testDisk.get('midir-companion-01')).characterName")=='Baseline'
  for fn in ['special-upgrade.js','reforge-simulator.js','vertrag-survival.js','theta-rhythm.js','as-chicken-invaders.js']:
   page.add_script_tag(content=(base/fn).read_text())
  page.evaluate('MIDIR_VERTRAG.mount()');page.locator('#vt-root [data-vt="tab:shop"]').click()
  before=page.evaluate('MIDIR_SPECIAL_UPGRADE.exportState().stones.red||0')
  page.locator('#vt-root [data-vt="buy:red"]').click()
  assert page.evaluate('MIDIR_SPECIAL_UPGRADE.exportState().stones.red||0')==before+1
  assert page.evaluate("JSON.parse(__testDisk.get('midir-vertrag-survival-v1')).points")==0
  page.evaluate('MIDIR_THETA.mount()');page.locator('#theta-root [data-theta="tab:shop"]').click()
  power=page.locator('#theta-root [data-theta="buy:power"]')
  assert power.inner_text()=='Enable'
  power.click();assert page.locator('#theta-root [data-theta="buy:power"]').inner_text()=='Disable'
  page.locator('#theta-root [data-theta="buy:power"]').click()
  assert page.locator('#theta-root [data-theta="buy:power"]').inner_text()=='Enable'
  assert page.evaluate("JSON.parse(__testDisk.get('midir-theta-rhythm-v1')).credits")==123
  # Crom shop skill unlocks are developer toggles rather than permanent purchases.
  page.evaluate("document.body.insertAdjacentHTML('beforeend', MIDIR_AS_INVADERS.view());MIDIR_AS_INVADERS.bind()")
  page.locator('.asci-wrap [data-asci="shop"]').first.click()
  skill=page.locator('.asci-wrap [data-asci-unlock]').first
  skill_id=skill.get_attribute('data-asci-unlock')
  assert skill.inner_text()=='Enable'
  skill.click()
  assert page.evaluate('(id)=>!!MIDIR_AS_INVADERS.getProgress().skills[id]',skill_id)
  skill=page.locator('.asci-wrap [data-asci-unlock]').first
  assert skill.inner_text()=='Disable'
  skill.click()
  assert not page.evaluate('(id)=>!!MIDIR_AS_INVADERS.getProgress().skills[id]',skill_id)
  assert page.evaluate("JSON.parse(__testDisk.get('midir-as-crom-invaders-v1')).fragments")==6
  # Shadowed game changes remain only in tab storage; clearing returns the original value.
  page.evaluate("MIDIR_RUNTIME_SCOPE.leave('Ordinary')")
  assert page.evaluate("JSON.parse(__testDisk.get('midir-theta-rhythm-v1')).credits")==123
  # Crom shop skill unlocks are developer toggles rather than permanent purchases.
  page.evaluate("document.body.insertAdjacentHTML('beforeend', MIDIR_AS_INVADERS.view());MIDIR_AS_INVADERS.bind()")
  page.locator('.asci-wrap [data-asci="shop"]').first.click()
  skill=page.locator('.asci-wrap [data-asci-unlock]').first
  skill_id=skill.get_attribute('data-asci-unlock')
  assert skill.inner_text()=='Enable'
  skill.click()
  assert page.evaluate('(id)=>!!MIDIR_AS_INVADERS.getProgress().skills[id]',skill_id)
  skill=page.locator('.asci-wrap [data-asci-unlock]').first
  assert skill.inner_text()=='Disable'
  skill.click()
  assert not page.evaluate('(id)=>!!MIDIR_AS_INVADERS.getProgress().skills[id]',skill_id)
  assert page.evaluate("JSON.parse(__testDisk.get('midir-as-crom-invaders-v1')).fragments")==6
  assert page.evaluate("JSON.parse(__testDisk.get('midir-companion-01')).characterName")=='Ordinary'
  assert page.evaluate("[...__testTab.keys()].filter(x=>x.startsWith('midir-runtime-')).length")==0, page.evaluate("[...__testTab.keys()]")
  assert not errors,errors
  print('PASS isolated test wallet and purchase/unlock behavior',width,height)
  page.close()
 # Theta scheduling with the actual buildChart code, including the S50 Thunder cast variant.
 source=(base/'theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__thetaPlan=()=>({buildChart,castDuration,profile});window.MIDIR_THETA={')
 page=browser.new_page();page.set_content('<div id="theta-root"></div>');page.add_script_tag(content=source)
 for s50 in (0,1):
  result=page.evaluate('''(s50)=>{let p=__thetaPlan();p.profile.upgrades.ergS50=s50;p.profile.cooldowns.blight=17;
   const chart=p.buildChart(10,false),up=chart.events.filter(e=>e.id==='blight'),th=chart.events.filter(e=>e.id==='thunder'),d=p.castDuration('thunder');
   for(const x of up)for(const y of th){if(y.t<x.t+.52 && y.t+d+.12>x.t-.22)throw Error('Thunder overlaps blight: '+JSON.stringify({x,y,d}));}
   return {upkeep:up.length,thunder:th.length,thunderCast:d};}''',s50)
  assert result['upkeep']>=2 and result['thunder']>0,result
  print('PASS Thunderblight reserved before Thunder',s50,result)
 page.close();browser.close()
