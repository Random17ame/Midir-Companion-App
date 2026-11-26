"""Direct SG Enduring Melody values, legacy state, live navigation and persona override."""
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
  assert page.locator('.sg-gear-panel,.sg-stat-breakdown,[data-sg-slider]').count()==0
  assert page.locator('[data-act="sg-bonus-edit:catering"],[data-act="sg-bonus-edit:bags"],[data-act="sg-bonus-edit:link"],[data-act="sg-bonus-edit:transform"]').count()==4
  # Legacy values migrate exactly once; titles are ignored, but frozen snapshots are kept.
  page.evaluate("x=>__sgTest(x)",'''(()=>{const old=MIDIR_SG_OATH.exportState();delete old.planner.melodyValues;old.planner.melodyFromLab=false;old.planner.melodyManual=true;old.planner.customMelody=17.25;old.gear.title1={equipped:true,bonuses:'Defense +999'};old.checklist.order.full.unshift('title1','title2');old.checklist.done.full=['title1'];old.practice.snap.f={bonus:{hp:0,def:23,prot:1,mdef:2,mprot:1},name:'Fateweaver',tree:'F1',foundation:[]};MIDIR_SG_OATH.importState(old);render()})()''')
  assert page.evaluate("x=>__sgTest(x)",'sgMelodyAmount()')=={'def':17.25,'prot':17.25,'mdef':17.25,'mprot':17.25}
  assert page.evaluate("x=>__sgTest(x)","sgProjected(new Set()).raw.def===sgPlanner.base.def&&sg.snap.f.bonus.def===23&&!sgChecklistVisible('full').includes('title1')&&!sgChecklistVisible('full').includes('title2')")
  page.locator('[data-act="sg-gear-edit:melody"]').click()
  for k,v in {'prot':12.5,'def':42.75,'mdef':55,'mprot':8.25}.items():page.locator(f'[data-sg-melody="{k}"]').fill(str(v))
  page.locator('#sg-melody-form button[type="submit"]').click()
  expected={'prot':12.5,'def':42.75,'mdef':55,'mprot':8.25}
  assert page.evaluate("x=>__sgTest(x)",'sgMelodyAmount()')==expected
  assert page.evaluate("x=>__sgTest(x)",'''(()=>{const a=sgProjected(new Set(['melody'])).raw,b=sgProjected(new Set()).raw;return ['prot','def','mdef','mprot'].every(k=>Math.abs(a[k]-b[k]-sgMelodyAmount()[k])<1e-9)&&a.hp===b.hp})()''')
  assert page.evaluate('''()=>{const x=JSON.parse(localStorage.getItem('midir-sg-workshop-state-v1'));return x.planner.melodyValues}''')==expected
  page.locator('[data-act="sg-music-source"]').click()
  assert page.evaluate("x=>__sgTest(x)","sgMelodyAmount().def===musicCalcForKey('enduring_def').inspiring&&sgMelodyAmount().prot===musicCalcForKey('enduring_prot').inspiring")
  page.locator('[data-act="sg-music-open"]').click()
  assert page.locator('.music-calculator-body').is_visible()
  assert page.locator('[data-music-input="musicSkillBaseEffectKey"]').input_value()=='enduring_def'
  page.locator('.music-calc-extra summary').click()
  el=page.locator('[data-music-input="musicBuffTitleEffect"]');el.fill('19');el.dispatch_event('change')
  result=page.evaluate("x=>__sgTest(x)","musicCalcForKey('enduring_def').inspiring")
  page.locator('[data-act="sg-music-return"]').click()
  assert page.locator('#sg-melody-form').is_visible()
  assert float(page.locator('[data-sg-melody="def"]').input_value())==result
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
  page.locator('[data-act="sg-gear-close"]').last.click()
  persona=page.locator('[data-sg-extra-toggle="persona"]');persona.check();persona.uncheck();assert persona.is_disabled()
  page.locator('[data-act="sg-gear-edit:persona"]').click();page.locator('[data-act="sg-persona:override"]').click();assert persona.is_checked()
  assert page.evaluate("x=>__sgTest(x)",'sgGear.persona.activeUntil>Date.now()&&sgGear.persona.sharedReadyAt>sgGear.persona.activeUntil')
  page.locator('[data-act="sg-gear-close"]').last.click()
  page.locator('[data-act="sg-page:quick"]').click();page.locator('[data-act="sg-gear-edit:melody"]').click();assert page.locator('#sg-melody-form').is_visible()
  page.locator('[data-act="sg-gear-close"]').last.click();page.locator('[data-act="sg-page:checklist"]').click();assert not page.evaluate("x=>__sgTest(x)","sgChecklistVisible('quick').includes('title1')")
  assert not errors,errors
  print('PASS SG direct melody, migration, navigation, override and checklist',w,flush=True)
  page.close()
 browser.close()
