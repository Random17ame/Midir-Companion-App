"""287: first Surge lesson note has a deadline, later notes persist."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
source=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__theta287=()=>({get run(){return run},profile,buildChart,start,toggle,activateSurge,surgeNoteState,frame});window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<div id="theta-root"></div>');page.add_script_tag(content=source);page.evaluate('MIDIR_THETA.mount()')
 result=page.evaluate('''()=>{
  const a=__theta287(); a.profile.level=6;a.profile.unlocked=10;
  a.start(false);let g=a.run; if(g.chart.duration<110)throw Error('Lesson too short');
  const thunder=g.chart.events.filter(e=>e.id==='thunder').length;
  if(thunder<32)throw Error('Stage 6 lacks sustained charging opportunities: '+thunder);
  g.surgeCharge=100;g.start=performance.now()-15*1000;
  if(!a.activateSurge())throw Error('First Surge must cast at full charge');
  let due=g.surgeDue,castAt=g.surgeLast;
  if(Math.abs(due-castAt-36)>1e-6)throw Error('Surge note timer must be 36s');
  let n=a.surgeNoteState(due-7);if(n.phase!=='approaching')throw Error('Note should drift toward target');
  n=a.surgeNoteState(due+.1);if(n.phase!=='urgent')throw Error('Stage 6 note should pulse when due');
  n=a.surgeNoteState(due+6.1);if(n.elapsed<=6)throw Error('Stage 6 expiry threshold');
  // Bypass chart events to isolate mandatory lesson timer.
  g.chart.events=[];g.chart.duration=due+30;g.start=performance.now()-(due+6.2)*1000;
  a.frame();if(document.querySelector('.theta-results')===null)throw Error('Missing Surge must automatically end lesson');
  if(!document.querySelector('.theta-results').textContent.includes('Twilight Surge note expired'))throw Error('Failure reason missing');
  a.profile.level=7;a.start(false);g=a.run;g.surgeCharge=100;g.start=performance.now()-10*1000;
  if(!a.activateSurge())throw Error('Stage 7 Surge unavailable');
  const later=g.surgeDue;g.chart.events=[];g.chart.duration=later+50;g.start=performance.now()-(later+15)*1000;
  if(a.surgeNoteState(later+15).phase!=='waiting')throw Error('Later note should wait');
  a.frame();if(document.querySelector('.theta-results'))throw Error('Later levels should not expire Surge note');
  return {thunderNotes:thunder,lessonCooldown:due-castAt,graceSeconds:6,laterNote:'waiting'};
 }''')
 assert not errors,errors
 print('PASS stage 6 timed Surge instruction and later persistent reminder:',result)
 b.close()
