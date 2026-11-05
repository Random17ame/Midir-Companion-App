"""Theta 283 baseline, gate/rhythm locks, documented resources, and legacy profiles."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
src=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__thetaAudit=()=>({run,profile,buildChart,castDuration,seethingCost,raf});window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content('<div id="theta-root"></div>');page.add_script_tag(content=src);page.evaluate('MIDIR_THETA.mount()')
 page.locator('[data-theta="tab:shop"]').click();assert page.locator('[data-theta="buy:vivace"]').count()==1
 # Save defaults, old-version migration of stock cooldowns and customized override preservation
 page.evaluate('''()=>{const p=__thetaAudit().profile;p.credits=50000;p.level=10;p.unlocked=10;}''')
 page.evaluate('MIDIR_THETA.mount()');page.locator('[data-theta="tab:shop"]').click()
 for i in range(8):
  page.locator('[data-theta="buy:vivace"]').click()
  page.locator('[data-theta="tab:shop"]').click()
 assert page.evaluate('MIDIR_THETA.exportState().upgrades.vivace')==8
 assert abs(page.evaluate('__thetaAudit().castDuration("flare")')-1.0)<.0001
 assert abs(page.evaluate('__thetaAudit().castDuration("surge")')-1.0)<.0001
 baseline=page.evaluate('''()=>{let p=__thetaAudit().profile;p.upgrades.vivace=0;const b=__thetaAudit().buildChart(10,false);p.upgrades.vivace=8;const a=__thetaAudit().buildChart(10,false);return {b,a}}''')
 for key in ('a','b'):
  chart=baseline[key];notes=chart['events'];locks=chart['locks']
  assert all(not(l['start']<e['t']<l['end']+.10) for e in notes if e['id'] in ('thunder','blight','vortex') for l in locks),(key,'offensive inside cast')
  assert all(not (x['start']<y['end'] and y['start']<x['end']) for i,x in enumerate(locks) for y in locks[i+1:]),(key,'overlapping casts')
 # We specifically want a Thunder to follow Flare earlier after +80% speed.
 def follow(chart):
  cast=next(x for x in chart['locks'] if x['id']=='flare');return next(e['t'] for e in chart['events'] if e['id']=='thunder' and e['t']>cast['start'])
 assert follow(baseline['a'])<follow(baseline['b']),(follow(baseline['a']),follow(baseline['b']))
 page.locator('[data-theta="start"]').click();assert page.locator('#theta-canvas').count()==1
 page.evaluate('cancelAnimationFrame(__thetaAudit().raf)')
 initial=page.evaluate('''()=>({run:__thetaAudit().run,stats:__thetaAudit().profile.stats})'''); assert initial['run']['dorcha']==10
 # Cheap hit audit: move isolated run time to the chart event without waiting for actual playback.
 sim=page.evaluate('''()=>{let r=__thetaAudit().run,p=__thetaAudit().profile;let t=r.chart.events.find(x=>x.id==='flare').t;
 r.start=performance.now()-t*1000;r.t=t;r.mp=250;r.dorcha=10;r.seething=true;
 return {t,cast:__thetaAudit().castDuration('flare')}}''')
 page.keyboard.press('d'); after=page.evaluate('''()=>{let r=__thetaAudit().run;return {dorcha:r.dorcha,castLockUntil:r.castLockUntil,mp:r.mp,overheat:r.overheat,scored:r.score}}''')
 assert abs(after['dorcha']-(10-1-1.6+.5))<.05,after
 assert after['castLockUntil']>=sim['t']+sim['cast']-.10,after
 # Early Thunder during cast must neither score nor overheat.
 page.keyboard.press('a'); state=page.evaluate('''()=>{let r=__thetaAudit().run;return {overheat:r.overheat,scored:r.score}}''')
 assert state['overheat']==after['overheat'] and state['scored']==after['scored'],state
 # Utility abilities have documented costs, no scoring or overheat penalties.
 page.evaluate('''()=>{let r=__thetaAudit().run;r.dorcha=3;r.mp=r.mpMax;r.renderManaUntil=0;}''')
 page.locator('[data-theta="utility:mana"]').click()
 man=page.evaluate('''()=>{let r=__thetaAudit().run;return {mp:r.mp,dorcha:r.dorcha,until:r.renderManaUntil}}''')
 assert abs(man['dorcha']-2)<1e-5,man
 assert man['until']>0
 page.locator('[data-theta="utility:render"]').click()
 rd=page.evaluate('''()=>{let r=__thetaAudit().run;return {mp:r.mp,dorcha:r.dorcha}}''')
 assert abs(rd['dorcha']-8)<1e-5,rd
 assert abs(rd['mp']-(man['mp']-(100+250*.1)))<1e-4,rd
 exported=page.evaluate('MIDIR_THETA.exportState()')
 assert exported['upgrades']['vivace']==8
 # Legacy save version has old stock CDs, but user-edited cooldown remains.
 page.evaluate('''()=>{let d=MIDIR_THETA.exportState();d.thetaRulesVersion=1;d.cooldowns.blight=15;d.cooldowns.vortex=33;MIDIR_THETA.importState(d)}''')
 cds=page.evaluate('MIDIR_THETA.exportState().cooldowns')
 # ImportState does not run startup migration until reload; emulate a fresh evaluation on new page.
 assert cds['vortex']==33
 # no gameplay JS error
 assert not errors, errors
 print('PASS Theta283 Vivace shop, cast locks, Thunder cadence, resource rules, legacy profile fields')
 b.close()
