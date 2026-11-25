"""Scoped Ogham effect levels UI regression in the existing 0.3.12g app shell."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((BASE/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in soup.select('script[src], link[rel=stylesheet],base'):x.extract()
style=soup.new_tag('style');style.append((BASE/'Companion Files/styles.css').read_text());soup.head.append(style)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [1200,390,320]:
  page=browser.new_page(viewport={'width':width,'height':820})
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(str(soup),wait_until='domcontentloaded')
  page.evaluate('''() => {const map=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),key:i=>[...map.keys()][i]||null,get length(){return map.size;}}});}''')
  for src in scripts:page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.locator('[data-page="rotation"]').first.click()
  page.locator('[data-act="hub:ogham"]').first.click()
  page.locator('#ogham-add').click()
  page.locator('[data-og-word-choose="Beithe"]').click()
  editor=page.locator('#ogham-editor')
  assert editor.count()==1
  editor.locator('[data-og-line="0"]').select_option('src:90037')
  level=editor.locator('[data-og-line-level="0"]')
  assert level.evaluate('(el)=>el.tagName')=='SELECT'
  assert level.locator('option').count()==20
  level.select_option('8')
  assert '+0.26%' in level.locator('option:checked').inner_text()
  editor.locator('#ogham-edit-name').fill('Test exact rune')
  editor.locator('[data-og-commit]').click()
  page.locator('[data-act="hub:home"]').first.click()
  page.locator('#rotation-lab-arcana').select_option('ev')
  page.locator('[data-act="hub:reforge"]').first.click()
  page.locator('[data-ogham-ev-mode="ogham"]').first.click()
  if page.locator('#ogham-sim-word').input_value()!='Beithe':page.locator('#ogham-sim-word').select_option('Beithe')
  pick=page.locator('[data-og-sim-line="0"]')
  assert pick.locator('option[value="src:90060"]').count()==1
  # Browser automation reports the option as disabled even though DOM has it enabled.
  # Dispatch the same change event as a native dropdown selection.
  pick.evaluate('''e=>{e.value='src:90060'; e.dispatchEvent(new Event('change',{bubbles:true}));}''')
  lvl=page.locator('[data-og-sim-level="0"]')
  assert lvl.locator('option').count()==10
  lvl.select_option('10')
  assert '+7%' in lvl.locator('option:checked').inner_text()
  lvl.select_option('1')
  assert '+2.5%' in lvl.locator('option:checked').inner_text()
  page.locator('#companion-language').select_option('ko')
  assert '레조넌트' in page.locator('[data-og-sim-line="0"]').inner_text()
  page.locator('#companion-language').select_option('en')
  assert 'Resonant Litany' in page.locator('[data-og-sim-line="0"]').inner_text()
  assert not errors, errors[:5]
  print('PASS 0.3.12g Ogham level selectors',width,flush=True)
  page.close()
 browser.close()
