"""SG Echostone baseline, deltas, optimizer and whole-number UI."""
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
  def enter(values):
   page.locator('[data-act="sg-stats-edit"]').click()
   for value in values:
    page.locator('#sg-stat-entry').fill(str(value));page.locator('#sg-stat-form button[type="submit"]').click()
  def open_echo():page.locator('[data-act="sg-gear-edit:echo"]').click()
  def roll(color,value):page.locator(f'[data-sg-echo-roll="{color}"]').fill(str(value))
  def available(color,value):page.locator(f'[data-sg-echo-available="{color}"]').fill(str(value))
  def submit():page.locator('#sg-echo-form button[type="submit"]').click()
  def close():page.locator('[data-act="sg-gear-close"]').last.click()
  enter([10000,400,70,396,80,2847,2006,2719,2584])
  run('sgPrepByMode.full.clear();sgGear.relicRank="none";sgGear.emblem.equipped=false;sgGear.persona.activeUntil=0;render()')
  open_echo();assert page.locator('[data-sg-echo-roll="red"]').input_value()=='97'
  assert page.locator('#sg-echo-form button[type="submit"]').inner_text()=='Confirm'
  assert page.locator('[data-act="sg-echo-reset"]').count()==0
  roll('red',96);submit();assert not run('sgEcho.confirmed')
  roll('red',97);submit();assert run('sgEcho.confirmed&&sgPlanner.base.str===2847&&sgPlanner.base.def===400')
  assert page.locator('#sg-echo-form button[type="submit"]').inner_text()=='Apply'
  assert page.locator('[data-act="sg-echo-reset"]').count()==1
  roll('silver',85);assert '396 → 405' in page.locator('#sg-echo-preview').inner_text();submit()
  assert run('sgPlanner.base.will===2091&&sgPlanner.base.mdef===404.5')
  assert 'Prepared: 405' in page.locator('.sg-stat-dashboard').inner_text()
  roll('silver',84);submit();assert run('Math.abs(sgPlanner.base.mdef-404.4)<1e-9&&sgDisplay(sgPlanner.base.mdef)===404')
  roll('silver',0);submit();assert run('Math.abs(sgPlanner.base.mdef-396)<1e-9&&sgPlanner.base.will===2006')
  roll('blue',100);roll('black',600);submit();assert run('sgPlanner.base.int===2819&&sgPlanner.base.mprot===85&&sgPlanner.base.hp===10600')
  roll('silver',85);submit();assert run('sgEcho.rolls.silver===0&&sgPlanner.base.will===2006')
  roll('black',0);roll('silver',85);submit();assert run('sgPlanner.base.hp===10000&&sgPlanner.base.mdef===404.5')
  page.locator('[data-sg-echo-reserve="red"]').check();available('blue',120);available('silver',100);available('yellow',150)
  assert 'Suggested setup:' in page.locator('#sg-echo-preview').inner_text()
  page.locator('[data-act="sg-echo-suggest"]').click();assert page.locator('[data-sg-echo-roll="red"]').input_value()=='97'
  assert page.locator('[data-sg-echo-roll="blue"]').input_value()=='120' and page.locator('[data-sg-echo-roll="silver"]').input_value()=='100'
  submit();assert run('sgPlanner.base.int===2839&&sgPlanner.base.mprot===86&&sgPlanner.base.will===2106&&sgPlanner.base.mdef===406')
  assert page.evaluate("()=>{const d=JSON.parse(localStorage.getItem('midir-sg-workshop-state-v1'));return d.playerStats.echo.confirmed&&d.playerStats.echo.rolls.blue===120}")
  close();assert run("(()=>{const x=sgOathExport();sgEchoReset();sgOathImport(x);return sgEcho.confirmed&&sgEcho.rolls.blue===120&&sgPlanner.base.mdef===406})()")
  run('render()');open_echo();page.locator('[data-act="sg-echo-reset"]').click();assert run('!sgEcho.confirmed&&sgPlanner.base.int===2839&&sgPlanner.base.mprot===86&&sgEcho.rolls.blue===89')
  assert page.locator('[data-act="sg-echo-reset"]').count()==0
  roll('blue',120);roll('silver',100);submit();assert run('sgPlanner.base.mdef===406&&sgEcho.confirmed')
  close();page.locator('[data-act="sg-stats-edit"]').click();page.locator('#sg-stat-entry').fill('123');page.locator('#sg-stat-form button[type="submit"]').click();page.locator('[data-act="sg-stats-later"]').click();assert run('sgPlanner.base.hp===10000&&sgEcho.confirmed')
  enter([10000,400,70,396,80,2847,2006,2719,2800]);open_echo();assert page.locator('[data-sg-echo-roll="yellow"]').input_value()=='50' and page.locator('[data-sg-echo-roll="red"]').input_value()=='97'
  assert page.locator('#sg-echo-form button[type="submit"]').inner_text()=='Confirm' and page.locator('[data-act="sg-echo-reset"]').count()==0
  submit();assert run('sgEcho.confirmed&&sgPlanner.base.dex===2800')
  roll('yellow',0);submit();assert run('sgPlanner.base.dex===2750')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
  close();run('sgPlanner.base.str=2800;sgPlanner.base.will=2800;sgPlanner.base.int=2800;sgPlanner.base.dex=2800;sgEchoReset();render()');open_echo();submit();assert not run('sgEcho.confirmed')
  assert 'Only three' in page.locator('#sg-echo-preview').inner_text()
  assert not errors,errors
  print('PASS SG Echostone baseline, deltas, recommendation, reset and layout',w,flush=True)
  page.close()
 browser.close()
