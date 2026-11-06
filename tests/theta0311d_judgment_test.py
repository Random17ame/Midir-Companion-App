"""0.3.11d Theta: on-track geometry, late overlap, on-deck note, and miss-only failure."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
src = (root / 'Companion Files/theta-rhythm.js').read_text().replace(
    'window.MIDIR_THETA={',
    'window.__thetaD=()=>({get run(){return run},profile,start,frame,hit,thetaJudgment,thetaNoteShape,thetaNoteProgress,thetaNoteExitDelay,thetaOnDeck,thetaProject});window.MIDIR_THETA={',
)
order = {'Ok': 1, 'Good': 2, 'Great': 3, 'Perfect': 4}
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, height in [(320, 568), (390, 844), (844, 390)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.set_content('<div id="theta-root"></div>')
        page.add_script_tag(content=src)
        page.evaluate('MIDIR_THETA.mount()')
        checks = page.evaluate('''()=>{
          const a=__thetaD();a.profile.level=1;a.profile.scroll=3;a.start(true);let r=a.run;
          const event={id:'thunder',ix:0,t:10,done:false,seq:0};
          r.chart.events=[event];r.chart.duration=90;
          const atCenter=a.thetaJudgment(event,10);
          const early=a.thetaJudgment(event,9.895), late=a.thetaJudgment(event,10.105);
          const earlyEdge=a.thetaJudgment(event,9.86),lateEdge=a.thetaJudgment(event,10.14);
          if(atCenter!=='Perfect'||early!=='Good'||late!=='Great'||earlyEdge!=='Ok'||lateEdge!=='Good')
             throw Error('Geometric scoring/late advantage incorrect: '+JSON.stringify({atCenter,early,late,earlyEdge,lateEdge}));
          const ring=a.thetaProject(0,.90),shape=a.thetaNoteShape(event,10);
          if(shape.p!==.9||shape.ry>=22||ring.y>=628||shape.y!==ring.y)throw Error('Ring not flat, larger, or on track');
          if(a.thetaJudgment(event,9.6)!==null||a.thetaJudgment(event,10.3)!==null)
             throw Error('Out-of-ring press must not be judged');
          if(a.thetaOnDeck(1)!==event||a.thetaOnDeck(8)!==null)
             throw Error('Future scheduled note should be waiting on deck, not moving early');
          const second={id:'blight',ix:1,t:20,done:false,seq:1};r.chart.events.push(second);
          if(a.thetaOnDeck(8)!==second)throw Error('On-deck future note should remain visible alongside the approaching note');
          r.chart.events.pop();
          const deadline=a.thetaNoteExitDelay();
          if(!(deadline>.4&&deadline<.5)||a.thetaNoteProgress(event,10+deadline)<1.0349)
             throw Error('Note must pass the ring and leave highway before miss');
          // More than five early/incorrect/wrong-lane presses must be harmless.
          r.start=performance.now()-1000;
          for(let i=0;i<9;i++){a.hit('thunder');a.hit('blight');a.hit('mechanic');}
          if(r.overheat!==0||r.counts.Miss!==0||r.counts.Ok!==0)
             throw Error('Unmatched button presses counted as failures');
          // Two genuine expired notes, then three timed successes clear all heat.
          r.chart.events=[
           {id:'thunder',ix:0,t:1,seq:1,done:false},
           {id:'thunder',ix:0,t:2,seq:2,done:false},
           {id:'thunder',ix:0,t:3,seq:3,done:false},
           {id:'thunder',ix:0,t:4.6,seq:4,done:false},
           {id:'thunder',ix:0,t:6.2,seq:5,done:false},
           ...[8,10,12,14,16].map((t,i)=>({id:'thunder',ix:0,t,seq:6+i,done:false}))
          ];
          r.start=performance.now()-2.6*1000;a.frame();
          if(r.overheat!==2||r.counts.Miss!==2)throw Error('Only two passed notes must count as misses');
          for(const t of [3,4.6,6.2]){r.start=performance.now()-t*1000;a.hit('thunder');}
          if(r.overheat!==0||r.streakToCool!==0||r.hits!==3)
             throw Error('Three consecutive hits must wipe the miss stack');
          let observed=[];
          for(const t of [8,10,12,14,16]){
            r.start=performance.now()-(t+deadline+.05)*1000;
            a.frame();
            observed.push(a.run?.overheat??'ended');
          }
          if(observed.join(',')!=='1,2,3,4,ended'||!document.querySelector('.theta-results')?.textContent.includes('Containment overheated'))
             throw Error('Must fail on exactly five accumulated fallen notes: '+observed.join(','));
          if(!document.querySelector('.theta-results')?.textContent.includes('Miss 7'))
             throw Error('Total miss count (including cleared stack) must remain visible');
          return {scoring:[early,late,earlyEdge,lateEdge], ringY:ring.y,deadline,failSequence:observed};
        }''')
        assert not errors, (width, height, errors)
        print('PASS Theta 0.3.11d', f'{width}x{height}', checks)
        page.close()
    browser.close()
