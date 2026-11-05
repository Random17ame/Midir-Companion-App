from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for tag in list(soup.find_all(['script','link','base'])):tag.decompose()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1380,'height':950});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for src in scripts:
  code=(root/'Companion Files'/src).read_text()
  if src=='app.js':
   marker='reportStorageInitialize().finally(()=>render());'
   assert marker in code
   code=code.replace(marker,'window.__archive277={state,render,action,archiveCredit,archiveLedger};\n'+marker)
  page.add_script_tag(content=code)
 page.evaluate('''() => {
  const a=window.__archive277;
  a.state.settings.secretSauce=true;a.state.characterName='Demo';
  const old={id:'archive1',name:'Old 01',encounter:'Bri Leith Gate 3',importedAt:100,archived:true,archiveCompact:true,
    archiveSummary:{playerNames:['Demo'],dps:123,awards:[{type:'first-clear',title:'First boss clear!',count:1}],collectibles:{},
      medians:{dd:{s1:{value:115,name:'Magnum Shot'}}},rotations:[{arc:'dd',mode:'best',seconds:10,source:'archive1',title:'Old Session',hits:[{id:'s1',name:'Magnum Shot',time:1,count:4}]}]}};
  a.state.reports=[old];a.archiveCredit(old);a.render();a.action('report-archive');
 }''')
 assert page.get_by_text('Lifetime archive summary').count()==1
 assert page.locator('#archive-arcana').count()==1
 page.locator('#archive-arcana').select_option('dd')
 assert '460 normalized' in page.locator('.archive-overview').inner_text()
 assert 'Banked achievements / awards' in page.locator('.archive-overview').inner_text()
 assert 'Bri Leith Gate 3' in page.locator('.vault-report-entry').inner_text()
 assert 'Compact archive' in page.locator('.vault-report-entry').inner_text()
 assert page.locator('[data-act="vault-archive:archive1"]').count()==1
 assert page.locator('[data-act="vault-remove:archive1"]').count()==1
 assert page.locator('[data-act="inspect:0"]').count()==0
 assert not errors,errors
 print('PASS Companion 277 archive UI: banked awards, dropdown, rotation winner, compact row, reactivate/delete controls')
 browser.close()
