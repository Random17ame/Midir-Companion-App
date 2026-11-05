"""Defense mode selector and damage mapping, isolated without changing persistent browser data."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
js=(root/'Companion Files/vertrag-survival.js').read_text()
js=js.replace('window.MIDIR_VERTRAG={','window.__vt300=()=>({get run(){return run},get mode(){return mode},data,baseDamage,damage,init});window.MIDIR_VERTRAG={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [390,1200]:
  page=b.new_page(viewport={'width':width,'height':840});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<div id="vt-root"></div>');page.add_style_tag(content=(root/'Companion Files/vertrag-survival.css').read_text());page.add_script_tag(content=js)
  page.evaluate('MIDIR_VERTRAG.mount()')
  page.locator('[data-vt="trial"]').click()
  assert page.locator('#vt-canvas').count()==0
  assert page.locator('.vt-defense-card').count()==4
  assert page.locator('[data-vt="defense:guardian"]').count()==1
  assert page.locator('[data-vt="defense:defensive"]').count()==1
  assert page.locator('[data-vt="defense:standard"]').count()==1
  assert page.locator('[data-vt="defense:fragile"]').count()==1
  assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1')
  page.locator('[data-vt="tab:menu"]').click()
  assert page.locator('#vt-setup-canvas').count()==1
  page.locator('[data-vt="endless"]').click()
  for choice,expected in [('guardian',.08),('defensive',.52),('standard',1),('fragile',1.6)]:
   val=page.evaluate('''([choice])=>{const a=__vt300();a.data.config.durability=choice;return a.baseDamage('charge')/4400}''',[choice]);assert abs(val-expected)<1e-8,(choice,val)
  page.locator('[data-vt="defense:fragile"]').click()
  assert page.locator('#vt-canvas').count()==1
  assert page.evaluate('MIDIR_VERTRAG.exportState().config.durability')=='fragile'
  assert 'Veteran' in page.locator('.vt-hud').inner_text()
  assert not errors,errors
  page.close()
 print('PASS four defensive tiers, original damage multipliers, back navigation, start, saved state, 390/1200 widths')
 b.close()
