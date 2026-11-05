"""Build 290: verified charge/cast/hit accounting, progression, UI and toggled cosmetic visuals."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
s=(root/'Companion Files/theta-rhythm.js').read_text().replace('window.MIDIR_THETA={','window.__audit290=()=>({get run(){return run},profile,start,activateIce,icePulse,shop,cosmeticsPanel,cosmeticChoice,effectColor,drawCosmeticEffect});window.MIDIR_THETA={')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<div id="theta-root"></div>')
 page.add_script_tag(content=s);page.evaluate('MIDIR_THETA.mount()')
 result=page.evaluate('''()=>{
 const a=__audit290(), u=a.profile.upgrades; a.profile.credits=99999;
 if(!a.shop().includes('Arcane Aesthetics'))throw Error('Cosmetic purchase absent');
 if(a.shop().includes('Containment Aura'))throw Error('Old particle cosmetic still sold');
 document.querySelector('[data-theta="tab:shop"]').click();
 document.querySelector('[data-theta="buy:iceBolt"]').click();
 for(let i=0;i<3;i++)document.querySelector('[data-theta="buy:show"]').click();
 if(u.show!==3)throw Error('Cosmetic tiers');
 let field=document.querySelector('[data-theta-cosmetic="thunder"]');if(!field)throw Error('Missing cosmetic studio');field.value='black';field.dispatchEvent(new Event('change',{bubbles:true}));
 field=document.querySelector('[data-theta-cosmetic="flare"]');field.value='void';field.dispatchEvent(new Event('change',{bubbles:true}));
 field=document.querySelector('[data-theta-cosmetic="vortex"]');field.value='autumn';field.dispatchEvent(new Event('change',{bubbles:true}));
 if(a.cosmeticChoice('thunder')!=='black'||a.cosmeticChoice('flare')!=='void'||a.cosmeticChoice('vortex')!=='autumn')throw Error('Theme selection');
 const enabled=document.querySelector('[data-theta-cosmetic="enabled"]');enabled.checked=false;enabled.dispatchEvent(new Event('change',{bubbles:true}));if(a.cosmeticChoice('thunder')!=='default')throw Error('Disable cosmetic does not revert');enabled.checked=true;enabled.dispatchEvent(new Event('change',{bubbles:true}));
 if(a.profile.cosmetics.thunder!=='black')throw Error('Theme not stored in profile');
 a.profile.level=10;a.start(true);let r=a.run;r.start=performance.now()-1000;r.chart.events=[];r.chart.duration=90;r.seething=true;r.dorcha=10;r.hexUntil=10;
 if(!a.activateIce())throw Error('Ice Bolt refused');if(r.iceHits.length!==5)throw Error('Number of casts');
 const expected=r.iceHits[0];r.iceHits.forEach((v,i)=>{if(Math.abs(v-(expected+i*.3))>1e-6)throw Error('Cast schedule '+i+': '+v)});
 if(Math.abs(r.castLockUntil-(expected+1.2))>1e-6)throw Error('Wrong cast lock');
 a.icePulse(3.5);if(r.iceHits.length||r.surgeCharge!==25||Math.abs(r.dorcha-10.5)>1e-6)throw Error('Five hits/casts not accounted independently');
 // A full Hexshroud volley cannot push Dorcha beyond the hard cap.
 a.start(true);r=a.run;r.start=performance.now()-1000;r.chart.events=[];r.chart.duration=90;r.dorcha=14.9;r.hexUntil=15;r.seething=false;
 if(!a.activateIce())throw Error('Cap volley refused');a.icePulse(4);if(r.dorcha!==15)throw Error('Dorcha exceeded 15 cap: '+r.dorcha);
 // Cosmetic effects render on a real canvas without changing simulation.
 const canvas=document.getElementById('theta-canvas'),ctx=canvas.getContext('2d');for(const id of ['thunder','flare','vortex'])a.drawCosmeticEffect(ctx,{id,seed:37},4,.35);
 return {chargeSeconds:1,releaseGapSeconds:.3,releaseWindowSeconds:1.2,surgePercent:25,hexDorcha:10.5,styles:['black','void','autumn'],cosmeticsToggle:true};
}''')
 assert not errors,errors
 print('PASS',result)
 b.close()
