"""Player-centered camera, wheel limits, and click-to-move screen/world mapping."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve(); soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for x in list(soup.find_all(['script','link','base'])): x.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1500,'height':1000})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
 page.locator('nav [data-page=rotation]').click();page.locator('#rotation-lab-arcana').select_option('sg')
 page.locator('[data-act="hub:vertrag"]').click();page.locator('[data-vt="endless"]').click();page.locator('[data-vt="defense:standard"]').click()
 page.wait_for_timeout(200)
 # Read the camera matrix from a separate final redraw. It should follow the player exactly.
 page.evaluate('''() => { const c=document.querySelector('#vt-canvas'),ctx=c.getContext('2d'); window.vtMatrixHistory=[];let previous=ctx.setTransform.bind(ctx);ctx.setTransform=(...v)=>{window.vtMatrixHistory.push(v);return previous(...v)}; }''')
 def transform():
  return page.evaluate('''() => {let m=window.vtMatrixHistory.filter(v=>v.length===6&&v[0]!==1);return m.at(-1)}''')
 def zlabel():return page.locator('#vt-zoom').inner_text()
 canvas=page.locator('#vt-canvas'); bb=canvas.bounding_box()
 page.wait_for_timeout(120);t0=transform();assert t0 and 1.3<t0[0]<1.4,t0
 page.keyboard.down('d');page.wait_for_timeout(260);page.keyboard.up('d');page.wait_for_timeout(80)
 t1=transform();assert abs(t0[0]-t1[0])<1e-6 and abs(t0[4]-t1[4])>12,(t0,t1)
 # Wheel zoom in and zoom out, respecting both caps.
 canvas.hover();page.mouse.wheel(0,-100);page.wait_for_timeout(100)
 t2=transform();assert t2[0]>t1[0] and 'Zoom' in zlabel(),(t2,t1,zlabel())
 for _ in range(30):page.mouse.wheel(0,-80)
 page.wait_for_timeout(80);tmax=transform();assert 2.60<=tmax[0]<=2.65+1e-3,tmax
 for _ in range(45):page.mouse.wheel(0,80)
 page.wait_for_timeout(80);tmin=transform();assert .4<tmin[0]<1,tmin
 # Shift back to useful zoom and test click-to-move far enough to change camera offset.
 for _ in range(9):page.mouse.wheel(0,-70)
 page.wait_for_timeout(100)
 m0=transform();canvas.click(position={'x':bb['width']*.75,'y':bb['height']*.50},force=True)
 page.wait_for_timeout(260);m1=transform();assert abs(m1[4]-m0[4])>4,(m0,m1)
 assert not errors,errors
 print('PASS player lock, WASD following, scroll zoom in/out, min/max zoom, transformed click-to-move')
 b.close()
