"""Mobile 295: expanded report reader, viewer-only chart magnification and app shell stability."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e['src'] for e in soup.find_all('script') if e.get('src') and e['src']!='pwa.js']
for e in list(soup.find_all(['script','link','base'])):e.decompose()
app=(root/'Companion Files/app.js').read_text()
needle='companionApplyAppearance();\nrender();\n\n})();'
assert needle in app
app=app.replace(needle,"""window.__audit295={setReport(html){state.settings.secretSauce=true;state.reports.push({id:'test295',name:'Test report',encounter:'Crom Bas',players:[],targets:[],duration:45,isHtml:true,htmlSaved:true});readHtml=async()=>html;},open(){return openMobileReportReader('test295')},close:closeMobileReportReader,viewing:mobileReportViewingHtml};
companionApplyAppearance();
render();

})();""")
small_html='''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#111823;color:white;font:15px system-ui;}svg{width:100%;height:390px;background:#152132;touch-action:none}#chart-wrap{position:relative}</style></head><body><h1>Combat Report</h1><div style="height:1100px">Metadata and player panels</div><div id="chart-wrap"><svg id="chart" viewBox="0 0 1000 390"><circle cx="500" cy="170" r="14" fill="red"/></svg></div><script>window.chartReady=true;</scr'''+'''ipt></body></html>'''
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(390,844),(320,700)]:
  pg=b.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36')
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(str(soup));pg.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  pg.evaluate("""()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return m.get(k)||null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})}""")
  for script in scripts:
   content=app if script=='app.js' else (root/'Companion Files'/script).read_text()
   pg.add_script_tag(content=content)
  pg.evaluate('html=>__audit295.setReport(html)',small_html)
  pg.evaluate('__audit295.open()')
  pg.wait_for_selector('.midir-report-reader-frame')
  frame=pg.frame_locator('.midir-report-reader-frame')
  frame.locator('#chart').wait_for(state='attached')
  assert frame.locator('#midir-mobile-report-style').count()==1, 'Viewer-only mobile CSS not injected'
  assert frame.locator('#midir-mobile-report-helper').count()==1, 'Chart helper missing'
  pg.wait_for_function("()=>document.querySelector('.midir-report-reader-frame')?.getBoundingClientRect().height>300")
  for _ in range(30):
   if frame.locator('#chart').evaluate('(svg)=>svg.getBoundingClientRect().width')>100:break
   pg.wait_for_timeout(100)
  before=frame.locator('#chart').evaluate('(svg)=>svg.getBoundingClientRect().width')
  pg.locator('[data-report-reader="in"]').click()
  pg.wait_for_timeout(200)
  after=frame.locator('#chart').evaluate('(svg)=>svg.getBoundingClientRect().width')
  assert after>before*1.3,(before,after)
  assert pg.locator('.midir-report-zoom-label').inner_text()=='150%'
  pg.locator('[data-report-reader="chart"]').click()
  pg.wait_for_timeout(70)
  scroll=frame.locator('body').evaluate('()=>window.scrollY')
  assert scroll>100,scroll
  pg.locator('[data-report-reader="fit"]').click()
  pg.wait_for_timeout(70)
  restored=frame.locator('#chart').evaluate('(svg)=>svg.getBoundingClientRect().width')
  assert abs(restored-before)<3,(before,restored)
  bounding=pg.locator('[data-report-reader="close"]').bounding_box()
  assert bounding and bounding['x']>=0 and bounding['x']+bounding['width']<=width+1
  pg.locator('[data-report-reader="close"]').click()
  assert pg.locator('.midir-report-reader').count()==0
  assert not pg.evaluate('document.body.classList.contains("midir-report-reading")')
  assert not errors,errors
  print('PASS',width,'zoom',round(before),'to',round(after),'jump',scroll,'fit',round(restored),'close')
  pg.close()
 b.close()
