"""Regression: no Time Trial countdown, fastest completed clear, and foreground giant bars."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
source=(root/'Companion Files/vertrag-survival.js').read_text().replace('window.MIDIR_VERTRAG={', '''window.__vt311e=()=>({get run(){return run},get mode(){return mode},get data(){return data},cameraZoom,draw,update,init,recordResult,drawGiantBars});window.MIDIR_VERTRAG={''', 1)
with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(320,568),(390,844),(844,390),(1200,850)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[];page.on('pageerror', lambda error: errors.append(str(error)))
        page.set_content('<div id="vt-root"></div>')
        page.add_style_tag(content=(root/'Companion Files/vertrag-survival.css').read_text())
        page.add_script_tag(content=source)
        page.evaluate('MIDIR_VERTRAG.mount()')
        assert page.locator('[data-vt-setting="trialLength"]').count()==0,'Countdown selector still visible'
        page.locator('[data-vt="trial"]').click()
        page.locator('[data-vt="defense:guardian"]').click()
        assert page.locator('#vt-canvas').count()==1
        assert page.evaluate('''() => {const s=__vt311e();return !isFinite(s.run.remaining)&&s.run.kind==='trial'&&s.data.config.trialLength===90}''')
        assert 'Elapsed' in page.locator('#vt-clock').inner_text()
        # The entire arena is visible at the minimum camera zoom. All four bars
        # must render after clip restoration, including lower giant 5 and 7 o'clock.
        bars=page.evaluate('''() => {
          const a=__vt311e(),r=a.run,ctx=document.querySelector('#vt-canvas').getContext('2d');
          r.zoom=.4;
          let clipDepth=0,saves=[],paint=[];
          const save=ctx.save.bind(ctx),restore=ctx.restore.bind(ctx),clip=ctx.clip.bind(ctx),strokeText=ctx.strokeText.bind(ctx),fillRect=ctx.fillRect.bind(ctx);
          ctx.save=()=>{saves.push(clipDepth);return save()};
          ctx.restore=()=>{const ans=restore();clipDepth=saves.pop()??0;return ans};
          ctx.clip=(...args)=>{clipDepth++;return clip(...args)};
          ctx.strokeText=(text,x,y,...rest)=>{if(/^G[1-4]/.test(text))paint.push({text,x,y,clipDepth});return strokeText(text,x,y,...rest)};
          let fills=[];ctx.fillRect=(x,y,w,h)=>{if(w===82&&h===11)fills.push({x,y,fill:ctx.fillStyle});return fillRect(x,y,w,h)};
          a.draw();
          ctx.save=save;ctx.restore=restore;ctx.clip=clip;ctx.strokeText=strokeText;ctx.fillRect=fillRect;
          return {paint,fills,depth:clipDepth,width:850,height:540};
        }''')
        assert len(bars['paint'])==4,bars
        assert all(x['clipDepth']==0 and 0<=x['x']<=850 and 0<=x['y']<=540 for x in bars['paint']),bars
        assert len(bars['fills'])==8,bars
        # A 50% giant shows a half bar; a defeated giant shows none.
        fills=page.evaluate('''() => {
          const a=__vt311e(),r=a.run,ctx=document.querySelector('#vt-canvas').getContext('2d');
          r.giants[0].progress=4.5;r.giants[1].alive=false;
          const widths=[];const fillRect=ctx.fillRect.bind(ctx);
          ctx.fillRect=(x,y,w,h)=>{if(h===11&&w>0&&w<=82)widths.push(w);return fillRect(x,y,w,h)};
          a.draw();ctx.fillRect=fillRect;return widths;
        }''')
        assert any(abs(x-41)<.1 for x in fills),fills
        # The old 60-180s limit is deliberately ignored; no countdown auto-loss.
        outcome=page.evaluate('''() => {
          const a=__vt311e(),r=a.run;
          a.data.config.trialLength=60;
          r.elapsed=190;r.stompTimer=1e6;r.attackTimer=1e6;
          r.boss.mode='chargeWindup';r.boss.until=1e6;
          r.hp=r.maxHP=1e9;
          a.update(.05);
          return {mode:a.mode,remaining:r.remaining,clock:document.querySelector('#vt-clock').textContent};
        }''')
        assert outcome['mode']=='play' and outcome['remaining']==float('inf'),outcome
        # Completed time trials use minimum clear elapsed, failure never writes one.
        outcome=page.evaluate('''() => {
           const a=__vt311e();let r=a.run;
           r.elapsed=91.23;a.recordResult(true);
           a.init('trial');a.run.elapsed=73.17;a.recordResult(true);
           a.init('trial');a.run.elapsed=107.89;a.recordResult(true);
           a.init('trial');a.run.elapsed=30.15;a.recordResult(false);
           return {bests:a.data.trialBests,legacy:a.data.survivalBests};
        }''')
        assert len(outcome['bests'])==1 and 73.1<next(iter(outcome['bests'].values()))<73.2,outcome
        assert not errors,errors
        print('PASS Vertrag 0.3.11e',f'{width}x{height}', 'no countdown, 4 visible foreground bars, drain, fastest successful clears')
        page.close()
    browser.close()
