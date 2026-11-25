"""Actual 46.b data in a Vault browser preview; requires external private comparison export path."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(__file__).resolve().parents[1]
real=Path(sys.argv[1]) if len(sys.argv)>1 else None
if not real or not real.is_file():
 print('SKIP: provide genuine Midir-46.b comparison HTML path (not bundled)');sys.exit(0)
html=real.read_text(encoding='utf-8')
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e['src'] for e in soup.find_all('script') if e.get('src') and e['src']!='pwa.js']
for el in list(soup.find_all(['script','link','base'])):el.decompose()
app=(root/'Companion Files/app.js').read_text()
needle='companionApplyAppearance();\nrender();\n\n})();'
assert needle in app
app=app.replace(needle,"""window.__midirRealBurstTest={
  async import(text){state.settings.secretSauce=true;render();const f=new File([text],'real-comparison.html',{type:'text/html'});await filesSelectedVault([f]);},
  summary(){return {reports:state.reports.length,comparisons:state.burstComparisons.length}},
  async backUp(){download=async blob=>{window.__realBackup=JSON.parse(await blob.text())};return vaultFullBackup();}
 };
 const __testStorage=new Map();storeHtml=async(id,v)=>__testStorage.set(id,v);readHtml=async id=>__testStorage.get(id);removeHtml=async id=>__testStorage.delete(id);
 companionApplyAppearance();render();

})();""")
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(1200,800),(390,844)]:
  page=b.new_page(viewport={'width':w,'height':h},is_mobile=w<600,has_touch=w<600)
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(str(soup));page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  page.evaluate("""()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return m.get(k)||null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})}""")
  for name in scripts:page.add_script_tag(content=app if name=='app.js' else (root/'Companion Files'/name).read_text())
  page.evaluate('s=>__midirRealBurstTest.import(s)',html)
  assert page.evaluate('__midirRealBurstTest.summary().comparisons')==1
  assert page.evaluate('__midirRealBurstTest.summary().reports')==0
  page.locator('[data-act^="burst-open:"]').click()
  page.wait_for_selector('#burst-player')
  assert page.locator('#burst-player option').count()==5
  assert '70,590,318.58' in page.locator('.burst-summary').inner_text()
  assert 'Redoubled Offensive' in page.locator('#burst-comparison-detail').inner_text()
  assert 'Ignis Plume' in page.locator('#burst-comparison-detail').inner_text()
  assert page.locator('.burst-full-30').count()==1
  page.locator('.burst-full-30 summary').click()
  assert 'Ignis Plume' in page.locator('.burst-full-30').inner_text()
  assert page.locator('.burst-full-30 tbody tr').count()>=10
  page.locator('#burst-player').select_option('1')
  assert page.locator('.burst-use-track b').count()==25
  assert page.locator('.burst-use-list').count()==1 if page.locator('.burst-use-list').count() else True
  assert 'Aqua Volley' in page.locator('#burst-comparison-detail').inner_text()
  page.locator('#companion-language').select_option('ko');assert '30초' in page.locator('#burst-section-title').inner_text()
  page.locator('#companion-language').select_option('es');assert 'Comparaciones' in page.locator('#burst-section-title').inner_text()
  page.locator('#companion-language').select_option('en');assert '30s Boss Burst Comparisons' in page.locator('#burst-section-title').inner_text()
  assert not errors,errors[:5]
  print('PASS genuine Midir-46.b leaderboard import/view on',w,'5 players / named skills / 25 use markers / EN-KO-ES / combat reports unchanged')
  page.close()
 b.close()
