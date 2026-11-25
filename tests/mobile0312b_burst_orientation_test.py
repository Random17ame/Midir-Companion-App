"""0.3.12b: imported report rotation, independent leaderboard comparison in mobile Vault."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e['src'] for e in soup.find_all('script') if e.get('src') and e['src']!='pwa.js']
for e in list(soup.find_all(['script','link','base'])):e.decompose()
app=(root/'Companion Files/app.js').read_text()
needle='companionApplyAppearance();\nrender();\n\n})();'
assert needle in app
app=app.replace(needle,"""window.__audit312b={
 setReport(html){state.settings.secretSauce=true;state.reports.push({id:'test312b',name:'Real report',encounter:'Gate 3',players:[],targets:[],duration:100,isHtml:true,htmlSaved:true});__testContent.set('test312b',html);},
 open(){return openMobileReportReader('test312b')},
 openBurst(id){return openBurst(id)},
 inject(file){return filesSelectedVault([file])},
 summary(){return {reports:state.reports.length,comparisons:state.burstComparisons.length}},
 backup(){download=async blob=>{window.__lastBurstBackup=JSON.parse(await blob.text())};return vaultFullBackup()},
 close:closeMobileReportReader
 };
 const __testContent=new Map();storeHtml=async(id,html)=>__testContent.set(id,html);
 readHtml=async id=>__testContent.get(id);removeHtml=async id=>__testContent.delete(id);
 companionApplyAppearance();render();\n\n})();""")
small_html='''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#111823;color:white;font:15px system-ui}svg{width:100%;height:390px;background:#152132}#chart-wrap{position:relative}</style></head><body><h1>Combat Report</h1><div style="height:900px">Metadata and player panels</div><div id="chart-wrap"><svg id="chart" viewBox="0 0 1000 390"><circle cx="500" cy="170" r="14" fill="red"/></svg></div></body></html>'''
comparison={"title":"30s Boss Burst Comparison","arcana":"Melodic Puppeteer","players":[{"username":"Alpha","arcana":"Melodic Puppeteer","rank":1,"sourceSession":"G3","window":{"startMs":1760000000000,"totalDamage":100,"events":[{"kind":"hit","relativeMs":0,"damage":12,"skillId":54151,"skillName":"Act 2"},{"kind":"hit","relativeMs":10000,"damage":40,"skillId":59168,"skillName":"Tempo"},{"kind":"hit","relativeMs":19999,"damage":30,"skillId":59168,"skillName":"Tempo"},{"kind":"hit","relativeMs":20000,"damage":18,"skillId":59169,"skillName":"Showstopper"},{"kind":"use","relativeMs":19999,"skillId":59168,"skillName":"Tempo"}]}},{"username":"Beta","arcana":"Melodic Puppeteer","rank":2,"window":{"totalDamage":20,"events":[{"kind":"hit","relativeMs":2000,"damage":20,"skillId":54151,"skillName":"Act 2"}]}}]}
burst_html='<html><script type="application/json" id="burst-data">'+json.dumps(comparison)+'</script></html>'
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup));page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
 page.evaluate("""()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return m.get(k)||null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})}""")
 for filename in scripts:page.add_script_tag(content=app if filename=='app.js' else (root/'Companion Files'/filename).read_text())
 page.evaluate('h=>__audit312b.setReport(h)',small_html)
 page.evaluate('__audit312b.open()')
 frame=page.frame_locator('.midir-report-reader-frame');frame.locator('#chart').wait_for()
 page.wait_for_timeout(300)
 first=frame.locator('#chart').evaluate('(e)=>e.getBoundingClientRect().width')
 page.locator('[data-report-reader="in"]').click();page.wait_for_timeout(180)
 zoom=frame.locator('#chart').evaluate('(e)=>e.getBoundingClientRect().width')
 assert zoom>first*1.35,(zoom,first)
 page.locator('[data-report-reader="chart"]').click();page.wait_for_timeout(100)
 assert frame.locator('body').evaluate('()=>window.scrollY')>200
 page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(350)
 landscape=frame.locator('#chart').evaluate('(e)=>e.getBoundingClientRect().width')
 assert landscape>zoom*1.3,(landscape,zoom)
 assert page.locator('.midir-report-reader').evaluate('(e)=>e.getBoundingClientRect().height')<=391
 assert page.locator('.midir-report-zoom-label').inner_text()=='150%'
 assert page.locator('[data-report-reader="close"]').is_visible()
 assert page.evaluate('matchMedia("(orientation: landscape)").matches')
 page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(300)
 assert abs(frame.locator('#chart').evaluate('(e)=>e.getBoundingClientRect().width')-zoom)<12
 assert frame.locator('#chart').count()==1
 page.locator('[data-report-reader="close"]').click()
 assert page.locator('.midir-report-reader').count()==0
 print('PASS orientation portrait / landscape / portrait; chart zoom retained, close and scroll interaction retained',round(first),round(zoom),round(landscape))
 page.evaluate('()=>{state.settings.secretSauce=true;render()}') if False else None
 # The app method uses File.text()/slice() just as the real file picker does.
 page.evaluate('async text=>{const f=new File([text],"burst-example.html",{type:"text/html"});await __audit312b.inject(f)}',burst_html)
 assert page.evaluate('__audit312b.summary().comparisons')==1
 assert page.evaluate('__audit312b.summary().reports')==1
 assert page.locator('.burst-entry').count()==1
 page.locator('[data-act^="burst-open:"]').click()
 page.wait_for_selector('#burst-comparison-detail .burst-summary')
 assert '70' in page.locator('.burst-summary').inner_text()
 assert page.locator('.burst-use-track b').count()==1
 page.select_option('#burst-player','1');page.wait_for_timeout(150)
 assert '20' in page.locator('.burst-summary').inner_text()
 assert '60s' in page.locator('#burst-comparison-detail').inner_text()
 page.evaluate('__audit312b.backup()');page.wait_for_function('()=>!!window.__lastBurstBackup')
 assert page.evaluate('()=>Object.keys(__lastBurstBackup.archivedHtml).some(x=>x.startsWith("burst-"))')
 page.select_option('#companion-language','ko');assert '30초' in page.locator('#burst-section-title').inner_text()
 page.select_option('#companion-language','es');assert 'Comparaciones' in page.locator('#burst-section-title').inner_text()
 page.select_option('#companion-language','en');assert 'Boss Burst Comparisons' in page.locator('#burst-section-title').inner_text()
 page.locator('[data-act^="burst-remove:"]').click();assert page.evaluate('__audit312b.summary().comparisons')==0
 assert not errors,errors[:8]
 print('PASS leaderboard comparison import, independent Vault state, player switching, 10s breakdown, markers, removal')
 browser.close()
