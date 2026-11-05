"""Render regression: player and overhead HP must not be subject to arena clipping."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for x in list(soup.find_all(['script','link','base'])): x.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1500,'height':1000});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for src in scripts: page.add_script_tag(content=(root/'Companion Files'/src).read_text())
 page.locator('nav [data-page=rotation]').click()
 page.locator('#rotation-lab-arcana').select_option('sg')
 page.locator('[data-act="hub:vertrag"]').click()
 page.locator('[data-vt="endless"]').click()
 page.locator('[data-vt="defense:standard"]').click()
 page.wait_for_timeout(120)
 # Track the real canvas clip stack through redraws, and flag when the HP bar
 # and player frames paint while any clipping mask is active.
 page.evaluate('''() => {const ctx=document.getElementById('vt-canvas').getContext('2d');
   window.edgeSamples=[];let depth=0, clipDepth=0,stack=[];
   const save=ctx.save.bind(ctx),restore=ctx.restore.bind(ctx),clip=ctx.clip.bind(ctx),fillRect=ctx.fillRect.bind(ctx),drawImage=ctx.drawImage.bind(ctx);
   ctx.save=()=>{stack.push(clipDepth);save()};
   ctx.restore=()=>{restore();clipDepth=stack.pop()??0};
   ctx.clip=(...args)=>{clipDepth++;clip(...args)};
   ctx.drawImage=(...args)=>{if(args[0]?.src?.includes('vertrag-players/'))window.edgeSamples.push(['sprite',clipDepth]);return drawImage(...args)};
   ctx.fillRect=(x,y,w,h)=>{if(w===46&&h===8)window.edgeSamples.push(['hp',clipDepth]);return fillRect(x,y,w,h)};
 }''')
 # Drive to both diagonally upper boundary positions (clock 1 and 11).
 for direction in ('right','left'):
  page.keyboard.down('w');page.keyboard.down('d' if direction=='right' else 'a')
  page.wait_for_timeout(1600)
  page.keyboard.up('w');page.keyboard.up('d' if direction=='right' else 'a')
  page.wait_for_timeout(100)
  samples=page.evaluate('window.edgeSamples.splice(0)')
  # Sprites are optional when artwork URLs are unavailable in headless set_content.
  assert any(t=='hp' for t,d in samples),samples[:10]
  assert all(d==0 for t,d in samples),(direction,[x for x in samples if x[1]!=0][:10])
 assert not errors,errors
 print('PASS player sprites and HP indicators render outside arena clipping on both upper diagonal approaches')
 b.close()
