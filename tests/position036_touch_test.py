"""0.3.6 positioning touch contracts in Chromium; free labs and frame challenges."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src') and t['src']!='pwa.js']
for t in list(soup.find_all(['script','link','base'])):t.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(390,844),(844,390),(1200,800)]:
  pg=b.new_page(viewport={'width':w,'height':h},is_mobile=w<1000,has_touch=w<1000)
  errors=[];pg.on('pageerror',lambda e: errors.append(str(e)))
  pg.set_content(str(soup))
  for src in scripts:pg.add_script_tag(content=(root/'Companion Files'/src).read_text())
  pg.locator('nav [data-page="rotation"]').click()
  pg.locator('#rotation-lab-arcana').select_option('ag')
  pg.locator('[data-act="hub:ag-position"]').click()
  assert pg.locator('.position-touch-tools button').count()==2
  assert pg.locator('[data-act="ag-tool:field"]').get_attribute('aria-pressed')=='true'
  # Place field at arbitrary empty region of SVG via touch events: use mouse dispatch as pointer event test.
  pg.locator("#ag-position-arena").scroll_into_view_if_needed()
  x=pg.evaluate('''() => {const svg=document.querySelector('#ag-position-arena');let r=svg.getBoundingClientRect();return [r.left+r.width*.7,r.top+r.height*.25]}''')
  pg.mouse.click(*x)
  assert pg.evaluate('''() => document.querySelector('#ag-position-status').textContent.includes('1/5 fields')''')
  pg.locator('[data-act="ag-tool:artillery"]').click()
  assert pg.locator('[data-act="ag-tool:artillery"]').get_attribute('aria-pressed')=='true'
  # Pick the actual first enemy from SVG CTM, tap it.
  pg.evaluate('''() => {let g=document.querySelector('[data-ag-enemy]'),c=g.querySelector('circle'),svg=document.querySelector('#ag-position-arena'),p=svg.createSVGPoint();p.x=+c.getAttribute('cx');p.y=+c.getAttribute('cy');let s=p.matrixTransform(svg.getScreenCTM());window.__point036=[s.x,s.y];}''')
  pg.locator('[data-ag-enemy]').first.click(force=True)
  assert 'Aiming' in pg.locator('#ag-position-status').text_content() or 'aimed' in pg.locator('#ag-position-status').text_content(),pg.locator('#ag-position-status').text_content()
  # AS: move aim via drag and assert the angle changes.
  pg.close()
  pg=b.new_page(viewport={"width":w,"height":h},is_mobile=w<1000,has_touch=w<1000)
  errors=[];pg.on("pageerror",lambda e:errors.append(str(e)))
  pg.set_content(str(soup))
  for src in scripts:pg.add_script_tag(content=(root/"Companion Files"/src).read_text())
  pg.locator('nav [data-page="rotation"]').click()
  pg.locator('#rotation-lab-arcana').select_option('as')
  pg.locator('[data-act="hub:position"]').click()
  pg.locator('[data-act="pos-begin"]').click()
  pg.locator('#position-arena').scroll_into_view_if_needed()
  pg.evaluate('''() => {let c=document.querySelector('.position-aim-knob'),svg=document.querySelector('#position-arena'),p=svg.createSVGPoint();p.x=+c.getAttribute('cx');p.y=+c.getAttribute('cy');let s=p.matrixTransform(svg.getScreenCTM());window.__point036=[s.x,s.y];}''')
  pt=pg.evaluate('window.__point036'); angle=pg.locator('#pos-angle').input_value()
  pg.mouse.move(*pt);pg.mouse.down();pg.mouse.move(pt[0],pt[1]-34,steps=4);pg.mouse.up()
  assert pg.locator('#pos-angle').input_value()!=angle
  assert not errors,errors
  print('PASS AS/AG free lab touch/pointer',w,h)
  pg.close()
 b.close()
