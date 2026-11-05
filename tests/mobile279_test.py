"""Chromium mobile emulation smoke tests; standalone HTML source, no network origin."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src')]
for t in list(soup.find_all(['script','link','base'])):t.decompose()
errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36')
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for s in scripts:
  content=(root/'Companion Files'/s).read_text()
  if s=='app.js':
   hook = """
window.__mobile279={mode:()=>companionMobileMode(),cap:()=>companionActiveReportLimit(),testCap:()=>{let old=state.reports;state.reports=Array.from({length:14},(_,i)=>({id:'test-'+i,archived:false,skillObservations:[{}],encounters:[{entityIds:['boss']}],damageHitEvents:[{targetId:'boss',damage:1}]}));reportAutoArchive();let out={active:state.reports.filter(x=>!x.archived).length,total:state.reports.length,archived:state.reports.filter(x=>x.archived).length};state.reports=old;return out}};
"""
   content=content.replace('\n})();',hook+'\n})();')
  page.add_script_tag(content=content)
 assert page.evaluate('window.__mobile279.mode()') is True
 assert page.evaluate('window.__mobile279.cap()')==10
 assert page.locator('.mobile-companion-banner').count()==1
 page.locator('[data-act="mobile-sg-checklist"]').click()
 assert page.locator('#sg-check-list').count()==1,'Checklist was blocked by stat wizard'
 assert page.locator('[data-sg-done]').count()>0
 cb=page.locator('[data-sg-done]').first
 cb.check()
 assert cb.is_checked()
 page.locator('[data-act="sg-check-mode:quick"]').click()
 assert page.locator('#sg-check-list').count()==1
 page.locator('[data-act="hub:home"]').click()
 assert page.locator('[data-act="hub:craft"]').first.is_disabled()
 assert 'N/A on mobile' in page.locator('[data-act="hub:craft"]').first.inner_text()
 assert not errors,errors
 # Automatic active cap: no purges are run here; all reports must remain in profile array.
 result=page.evaluate('window.__mobile279.testCap()')
 assert result=={'active':10,'total':14,'archived':4},result
 b.close()
 print('PASS mobile navigation, SG checklist/checks, desktop-only buttons, 10 cap, 14 reports retained, no JS errors')
