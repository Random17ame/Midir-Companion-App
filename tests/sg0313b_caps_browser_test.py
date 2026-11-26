"""SG conservative primary stat caps and distinct recommendation states."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e.get('src') for e in soup.select('script[src]')]
for e in list(soup.find_all(['script','link','base'])):e.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h in [(1200,850),(390,844),(320,568)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<600)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(str(soup),wait_until='load')
  page.evaluate('''()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i]||null,get length(){return m.size}}})}''')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for src in scripts:
   code=(root/'Companion Files'/src).read_text()
   if src=='app.js':
    needle='companionApplyAppearance();\nrender();\n\n})();';assert needle in code
    code=code.replace(needle,"window.__sgTest=expression=>eval(expression);\n"+needle)
   page.add_script_tag(content=code)
  page.locator('nav button[data-page="rotation"]').click();page.locator('#rotation-lab-arcana').select_option('sg');page.locator('[data-act="hub:oath"]').click()
  if page.locator('[data-act="sg-stats-later"]').count():page.locator('[data-act="sg-stats-later"]').click()
  run=lambda js:page.evaluate("x=>__sgTest(x)",js)
  # Enter all observed fields via real setup; no base reconstruction.
  page.locator('[data-act="sg-stats-edit"]').click()
  for value in [10000,400,70,396,80,2847,2006,2719,2584]:
   page.locator('#sg-stat-entry').fill(str(value));page.locator('#sg-stat-form button[type="submit"]').click()
  assert run('sgPlanner.base.will===2006&&sgPlanner.base.mdef===396&&sgPlanner.base.int===2719')
  run("sgPrepByMode.full.clear();sgPlanner.dynamic.bags={will:100};sgPlanner.dynamic.catering={int:100};render()")
  assert run("sgProjected(new Set(['bags'])).raw.mdef===406&&sgProjected(new Set()).raw.mdef===396")
  assert run("sgBuffWorth('bags').recommend&&!sgBuffWorth('bags').skip")
  assert run("sgProjected(new Set(['catering'])).raw.mprot===80&&sgBuffWorth('catering').uncertain.includes('int')&&!sgBuffWorth('catering').skip&&!sgBuffWorth('catering').recommend")
  assert page.locator('[data-sg-calc-check="catering"]').locator('..').locator('.sg-worth-neutral').count()==1
  run('sgPlanner.base.mprot=151;render()')
  assert run("sgBuffWorth('catering').skip&&!sgBuffWorth('catering').recommend")
  assert page.locator('[data-sg-calc-check="catering"]').locator('..').locator('.sg-no-gain').count()==1
  run('sgPlanner.base.mprot=80;sgPlanner.base.int=2440;sgPlanner.base.will=2435;sgPlanner.dynamic.catering={will:100,int:100};sgPlanner.dynamic.bags={will:100};sgGear.relicRank="EX";sgGear.emblem.equipped=true;sgGear.persona.activeUntil=Date.now()+60000;render()')
  assert run("sgProjected(new Set(['catering','bags'])).raw.mdef===412.5&&sgProjected(new Set(['catering','bags'])).raw.mprot===80.5") # Will 2435 to 2450 gives 1.5; emblem +15; INT net +80 clipped to 10, +0.5
  assert run("sgBuffWorth('catering').recommend")
  run('sgGear.persona.activeUntil=0;sgGear.relicRank="none";sgGear.emblem.equipped=false;sgPlanner.base.int=2400;sgPlanner.dynamic.catering={int:40};render()')
  assert run("sgProjected(new Set(['catering'])).raw.mprot===82")
  run('sgPlanner.base.int=2450;render()');assert run("sgBuffWorth('catering').uncertain.includes('int')&&!sgBuffWorth('catering').skip")
  run('sgPlanner.base.will=null;sgPlanner.base.int=null;render()');assert run("sgBuffWorth('catering').uncertain.includes('int')&&!sgBuffWorth('catering').skip")
  assert run("(()=>{const x=sgOathExport();x.planner.base.will=2006;x.planner.base.int=2719;x.practice.snap.f={bonus:{hp:0,def:23,prot:1,mdef:2,mprot:1},name:'Fateweaver',tree:'F1',foundation:[]};sgOathImport(x);return sgPlanner.base.will===2006&&sgPlanner.base.int===2719&&sg.snap.f.bonus.def===23})()")
  assert run("(()=>{const x=sgOathExport();for(const k of SG_PRIMARY){delete x.planner.base[k];delete x.playerStats.base[k]}sgOathImport(x);return SG_PRIMARY.every(k=>sgPlanner.base[k]===null)&&sgPlanner.base.mdef===396})()")
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
  assert not errors,errors
  print('PASS SG cap eligibility, recommendations, migration and observed stats',w,flush=True)
  page.close()
 browser.close()
