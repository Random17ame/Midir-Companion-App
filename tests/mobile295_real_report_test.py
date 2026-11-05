"""Smoke check against an actual Midir export at desktop and phone sizes."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e['src'] for e in soup.find_all('script') if e.get('src') and e['src']!='pwa.js']
for e in list(soup.find_all(['script','link','base'])):e.decompose()
app=(root/'Companion Files/app.js').read_text();needle='companionApplyAppearance();\nrender();\n\n})();'
app=app.replace(needle,"""window.__audit295={setReport(html){state.settings.secretSauce=true;state.reports.push({id:'real',name:'Sample Export 2.html',encounter:'Crom Bas',players:[],targets:[],duration:500,isHtml:true,htmlSaved:true});readHtml=async()=>html;},open(){return openMobileReportReader('real')}};companionApplyAppearance();render();})();""")
html=Path('/mnt/data/Sample Export 2.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(390,844),(320,700)]:
  pg=b.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36')
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(str(soup));pg.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  pg.evaluate("""()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return m.get(k)||null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})}""")
  for script in scripts:pg.add_script_tag(content=app if script=='app.js' else (root/'Companion Files'/script).read_text())
  # Visual identity: the mobile shell inherits the same colors/fonts/borders.
  styles=pg.evaluate("""()=>{const b=getComputedStyle(document.body),button=getComputedStyle(document.querySelector('button')),root=getComputedStyle(document.documentElement);return {bg:root.getPropertyValue('--bg').trim(),accent:root.getPropertyValue('--accent').trim(),text:root.getPropertyValue('--text').trim(),font:b.fontFamily,buttonRadius:button.borderRadius}}""")
  assert styles['bg']=='#0c111b' and styles['accent']=='#5ad2c3' and styles['text']=='#f0f4fb',styles
  pg.evaluate('(h)=>__audit295.setReport(h)',html)
  pg.evaluate('__audit295.open()')
  frame=pg.frame_locator('.midir-report-reader-frame')
  frame.locator('#chart').wait_for(state='attached',timeout=30000)
  pg.wait_for_timeout(800)
  title=frame.locator('#chart-heading').inner_text(timeout=3000)
  assert 'Damage Scatter' in title,title
  svg=frame.locator('#chart')
  assert svg.count()==1
  assert frame.locator('#view-select').count()==1
  assert frame.locator('#chart-instructions').count()==1
  pg.locator('[data-report-reader="chart"]').click()
  pg.wait_for_timeout(130)
  pg.locator('[data-report-reader="in"]').click()
  pg.wait_for_timeout(160)
  width_zoom=svg.evaluate('(e)=>e.getBoundingClientRect().width')
  pg.locator('[data-report-reader="fit"]').click()
  pg.wait_for_timeout(160)
  width_fit=svg.evaluate('(e)=>e.getBoundingClientRect().width')
  assert width_zoom>width_fit*1.3,(width_zoom,width_fit)
  # Report controls are the real export's own elements, accessible from the full-size iframe.
  assert frame.locator('#view-select').is_visible()
  assert not errors,errors[:3]
  print('PASS real export',width,styles,'chart width',round(width_fit),'→',round(width_zoom))
  pg.screenshot(path=f'/mnt/data/midir295-report-{width}.png')
  pg.close()
 b.close()
