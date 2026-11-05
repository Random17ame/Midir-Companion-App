"""Build 285: fixed half-second Shadow Flare cast progression, scheduler and saved tier compatibility."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
src=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__theta285=()=>({profile,castDuration,buildChart});window.MIDIR_THETA={')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
 page=browser.new_page()
 errors=[]
 page.on('pageerror', lambda e:errors.append(str(e)))
 page.set_content('<div id="theta-root"></div>')
 page.add_script_tag(content=src)
 page.evaluate('MIDIR_THETA.mount()')
 result=page.evaluate('''()=>{
  const a=__theta285(), rows=[];
  for(let i=0;i<=8;i++){
   a.profile.upgrades.vivace=i;
   const flare=a.castDuration('flare'),surge=a.castDuration('surge');
   const chart=a.buildChart(10,false);
   const locks=chart.locks.filter(x=>x.id==='flare');
   rows.push({tier:i,flare,surge,locks:locks.map(x=>x.end-x.start),
    illegal:chart.events.some(e=>['thunder','blight','vortex'].includes(e.id)&&chart.locks.some(l=>l.start<e.t&&e.t<l.end+.10))});
  }
  return rows;
}''')
 for row in result:
  i=row['tier']
  assert abs(row['flare']-(5-.5*i))<1e-9,row
  assert abs(row['surge']-(5-.5*i))<1e-9,row
  assert all(abs(d-row['flare'])<1e-9 for d in row['locks']),row
  assert not row['illegal'],row
 page.evaluate('''()=>{const a=__theta285();a.profile.upgrades.vivace=4;MIDIR_THETA.importState(MIDIR_THETA.exportState());}''')
 assert page.evaluate('MIDIR_THETA.exportState().upgrades.vivace')==4
 assert abs(page.evaluate('__theta285().castDuration("flare")')-3)<1e-9
 assert not errors,errors
 print('PASS Theta285 all nine Shadow Flare cast durations, chart locks, Surge mirrors Flare in build 288, save compatibility')
 browser.close()
