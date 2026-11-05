"""0.3.9b: all converted Arcana games must be enabled on mobile."""
from pathlib import Path
from bs4 import BeautifulSoup
import sys
from playwright.sync_api import sync_playwright
root=Path(sys.argv[1]).resolve()
source=(root/'Companion Files/app.js').read_text()
assert "const MIDIR_MOBILE_DESKTOP_ONLY=new Set(['drill']);" in source
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t['src'] for t in soup.find_all('script') if t.get('src')]
for tag in list(soup.find_all(['script','link','base'])): tag.decompose()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for width,height in [(390,844),(844,390)]:
   context=browser.new_context(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 13; SM-A516U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36')
   page=context.new_page();errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
   page.set_content(str(soup))
   page.evaluate("""() => { const values={}; Object.defineProperty(window,'localStorage',{ configurable:true, value:{getItem:k=>values[k]??null,setItem:(k,v)=>{values[k]=String(v)},removeItem:k=>{delete values[k]},clear:()=>{Object.keys(values).forEach(k=>delete values[k])}}}); }""")
   for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text())
   page.locator('nav [data-page="rotation"]').click()
   all_ids=set()
   for arc in ['as','dd','ek','hs','sg','ev','ag','fa','mp','bb']:
    page.locator('#rotation-lab-arcana').select_option(arc)
    cards=page.locator('.rotation-shortcuts [data-act^="hub:"]')
    ids=cards.evaluate_all('(cards)=>cards.map(c=>({id:c.dataset.act.slice(4),disabled:c.disabled,text:c.innerText}))')
    assert ids,arc
    for card in ids:
     all_ids.add(card['id'])
     assert card['id']!='drill' or card['disabled'],(arc,card)
     assert card['id']=='drill' or not card['disabled'],(arc,card)
     assert card['id']=='drill' or 'desktop only' not in card['text'].lower(),(arc,card)
   must_have={'vertrag','craft','as-invaders','position','theta','music-lie','rhythm','pig','ag-position','bb-bandit','herbs'}
   assert must_have<=all_ids, must_have-all_ids
   # Explicitly verify route activation for the user-reported disabled activity.
   page.locator('#rotation-lab-arcana').select_option('as')
   page.locator('[data-act="hub:vertrag"]').click()
   assert page.locator('.vt-shell').count()>0,'Vertrag route did not open'
   assert not errors,errors
   print(f'PASS mobile menu {width}x{height}: {len(all_ids)} routes including Vertrag')
   context.close()
  browser.close()
finally: pass
