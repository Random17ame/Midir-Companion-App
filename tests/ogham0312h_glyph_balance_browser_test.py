"""Ogham 0.3.12i: 26 local images: ten provisional and 16 screenshot-backed stones."""
from pathlib import Path
from playwright.sync_api import sync_playwright
B=Path(__file__).resolve().parents[1]
css=(B/'Companion Files/styles.css').read_text()
js=(B/'Companion Files/ogham-runes.js').read_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':850},device_scale_factor=1,has_touch=width<500)
  issues=[];page.on('pageerror',lambda e:issues.append(str(e)))
  page.set_content('''<html><head></head><body style="margin:0;padding:12px;background:#101d2c;color:#e1eaff"><div class="ogham-system"><h2>Ogham Rune Gallery · 26 words</h2><div id="rune-gallery" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:7px"></div></div></body></html>''')
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  results=page.evaluate('''() => {
   const api=window.MIDIR_OGHAM;
   const el=document.getElementById('rune-gallery');
   const letters=api.WORDS.map(word=>`<div style="background:#182b3a;border-radius:7px;padding:6px 3px;display:grid;justify-items:center;gap:4px;min-width:0"><div class="ogham-rune-art ogham-tier-${api.SPECIAL.includes(word)?'masterwork':'fine'}"><span class="ogham-rune-etched">${api.wordIcon(word)}</span><span class="ogham-rune-facets"></span></div><small style="font-size:10px">${word}</small></div>`).join('');
   el.innerHTML=letters;
   api.fitGlyphs(el);
   const ctx=document.createElement('canvas').getContext('2d');
   ctx.font='80px "Noto Sans Ogham", "Segoe UI Symbol", "DejaVu Sans", serif';
   const entries=[...el.querySelectorAll('.ogham-glyph-svg')].map(svg=>{
     const g=svg.querySelector('text'),m=ctx.measureText(g.textContent),mat=g.transform.baseVal.consolidate().matrix;
     const left=-m.actualBoundingBoxLeft,top=-m.actualBoundingBoxAscent;
     const w=m.actualBoundingBoxLeft+m.actualBoundingBoxRight,h=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;
     return {text:g.textContent,fit:g.dataset.oghamFitted,
       cx:(mat.e+mat.a*(left+w/2)-50)/100,
       cy:(mat.f+mat.d*(top+h/2)-50)/100,
       h:h*mat.a/100,w:w*mat.a/100};
   });
   return {count:entries.length,images:el.querySelectorAll('.ogham-game-plate-image').length,entries,scrollWidth:document.documentElement.scrollWidth,innerWidth};
  }''')
  assert results['count']==0,results['count']
  assert results['images']==26,results['images']
  assert page.locator('img[src*="/provisional/"]').count()==10
  for row in results['entries']:
   assert row['fit']=='1',row
   assert abs(row['cx'])<0.03 and abs(row['cy'])<0.03,row
   assert 0.08<=row['h']<=0.83,row
   assert row['w']<=0.86,row
  assert results['scrollWidth']<=results['innerWidth']+1,results
  assert not issues,issues
  print(f'PASS 10 provisional / 16 game stones at {width}px',flush=True)
  page.close()
 browser.close()
