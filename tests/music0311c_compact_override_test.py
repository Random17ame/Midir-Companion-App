"""0.3.11c slot enchant override precedence, shared/copy safety, compact results and persistence."""
from pathlib import Path
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[node.get('src') for node in soup.select('script[src]')]
for tag in list(soup.find_all(['script','link','base'])):tag.decompose()

def launch_page(browser,width,height,saved=None):
 p=browser.new_page(viewport={'width':width,'height':height},is_mobile=width<600,has_touch=width<600,device_scale_factor=1)
 errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.set_content(str(soup),wait_until='load')
 if saved is not None:p.evaluate("(saved)=>{const data={...saved};window.__fakeStorage=data;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>delete data[k]}})}",saved)
 for name in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
  p.add_style_tag(content=(root/'Companion Files'/name).read_text())
 for script in scripts:p.add_script_tag(content=(root/'Companion Files'/script).read_text())
 p.locator('nav button[data-page="rotation"]').click()
 p.locator('#rotation-lab-arcana').select_option('hs')
 p.locator('button[data-act="hub:music-lie"]').click()
 assert not errors,errors
 return p,errors

def edit(page,slot):page.locator(f'button[data-music-gear-action="edit"][data-music-gear-slot="{slot}"]').click()
def close(page):page.locator('button[data-music-gear-action="close"]').first.click()
def applied(page):return page.locator('.music-gear-totals').inner_text()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(844,390)]:
  page,errors=launch_page(browser,width,height)
  assert page.locator('.music-result-dock').count()==1
  assert page.locator('.music-result-dock').is_visible()
  assert page.locator('.music-calc-extra').count()==1
  assert not page.locator('.music-calc-extra').evaluate('(el)=>el.open')
  assert not page.locator('.music-gear-more').evaluate('(el)=>el.open')
  assert page.locator('.music-gear-item-actions button').count()==0, 'Duplicate tile copy/new controls consume extra height'
  assert page.locator('.music-gear-item').count()==8
  metrics=page.evaluate('''()=>({
     screen:innerHeight, width:innerWidth, scrollWidth:document.documentElement.scrollWidth,
     result:(()=>{const r=document.querySelector('.music-result-dock').getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}})(),
     board:(()=>{const r=document.querySelector('.music-gear-equipped').getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}})()
  })''')
  assert metrics['scrollWidth'] <= width+3,metrics
  # Always-visible result strip: sticks to top during downward gear browsing.
  page.evaluate('window.scrollTo(0, Math.min(document.body.scrollHeight, 800))')
  page.wait_for_timeout(100)
  dock_top=page.locator('.music-result-dock').evaluate('(el)=>el.getBoundingClientRect().top')
  assert -1<=dock_top<=25,(width,height,dock_top,metrics)
  page.evaluate('window.scrollTo(0,0)')
  edit(page,'Accessory 1')
  assert page.locator('.music-gear-live-preview').is_visible()
  inp=page.locator('[data-music-gear-item-override="Accessory 1"]')
  assert inp.input_value()==''
  page.locator('select[data-music-enchant-slot="Accessory 1"][data-music-enchant-side="prefix"]').select_option('Dynamic')
  page.locator('select[data-music-enchant-roll="prefix"]').select_option('2')
  assert 'Auto +2' in page.locator('.music-gear-slot-manual').inner_text()
  inp=page.locator('[data-music-gear-item-override="Accessory 1"]')
  inp.fill('9.5');inp.dispatch_event('change')
  assert 'Normal' in page.locator('.music-gear-live-preview').inner_text()
  assert page.locator('[data-music-gear-item-override]').input_value()=='9.5'
  close(page)
  assert 'Applied +9.5' in applied(page),applied(page)
  # Other slots remain normal automatic behavior.
  edit(page,'Accessory 2')
  page.locator('select[data-music-enchant-slot="Accessory 2"][data-music-enchant-side="prefix"]').select_option('Allegro')
  close(page)
  assert 'Applied +12.5' in applied(page),applied(page)
  # Whole-set override is final authority, and clearing it restores summed slot values.
  page.locator('[data-music-gear-override]').fill('41')
  page.locator('[data-music-gear-override]').dispatch_event('change')
  assert 'Applied +41' in applied(page)
  page.locator('[data-music-gear-action="auto"]').click()
  assert 'Applied +12.5' in applied(page)
  edit(page,'Accessory 1')
  page.locator('[data-music-gear-action="auto-item"]').click()
  close(page)
  assert 'Applied +5' in applied(page),applied(page)
  # Typed 0 is a valid intentional override, unlike blank which enables auto.
  edit(page,'Accessory 1')
  inp=page.locator('[data-music-gear-item-override]');inp.fill('0');inp.dispatch_event('change')
  assert page.locator('[data-music-gear-item-override]').input_value()=='0'
  close(page)
  assert 'Applied +3' in applied(page)
  # Named set effects are separate from enchant override, unaffected by manual 0.
  edit(page,'Gloves')
  page.locator('[data-music-gear-set-effect="Gloves"]').select_option('seraphic-bangles')
  close(page)
  assert 'Applied +3' in applied(page)
  assert not errors,errors
  print(f'{width}×{height}: compact dock {metrics["result"]["height"]:.0f}px, board {metrics["board"]["height"]:.0f}px, no horizontal scroll; item and overall overrides PASS')
  page.close()
 # Cross-set link and copy plus simulated local storage save/reload.
 page,errors=launch_page(browser,390,844,{'midir-companion-01':json.dumps({})})
 edit(page,'Instrument')
 i=page.locator('[data-music-gear-item-override]');i.fill('6');i.dispatch_event('change');close(page)
 page.locator('.music-gear-more > summary').click()
 page.locator('button[data-music-gear-action="copy-tab"]').click()
 assert page.locator('[data-music-gear-tab]').count()==2
 edit(page,'Instrument')
 assert page.locator('[data-music-gear-item-override]').input_value()=='6'
 i=page.locator('[data-music-gear-item-override]');i.fill('8');i.dispatch_event('change');close(page)
 page.locator('[data-music-gear-tab="set-1"]').click()
 edit(page,'Instrument');assert page.locator('[data-music-gear-item-override]').input_value()=='8';close(page)
 page.locator('[data-music-gear-tab]').last.click()
 edit(page,'Instrument')
 page.locator('button[data-music-gear-action="copy-item"][data-music-gear-slot="Instrument"]').click()
 assert page.locator('[data-music-gear-item-override]').input_value()=='8'
 i=page.locator('[data-music-gear-item-override]');i.fill('13');i.dispatch_event('change');close(page)
 page.locator('[data-music-gear-tab="set-1"]').click()
 edit(page,'Instrument');assert page.locator('[data-music-gear-item-override]').input_value()=='8';close(page)
 saved=page.evaluate('({...window.__fakeStorage})')
 assert 'gearTabs' in json.loads(saved['midir-companion-01'])['musicBuffLab']
 page.close()
 reload,errors=launch_page(browser,390,844,saved)
 edit(reload,'Instrument');assert reload.locator('[data-music-gear-item-override]').input_value()=='8';close(reload)
 reload.locator('[data-music-gear-tab]').last.click()
 edit(reload,'Instrument');assert reload.locator('[data-music-gear-item-override]').input_value()=='13';close(reload)
 assert not errors,errors
 print('Shared instruments, independent copies, physical-item override and reload: PASS')
 browser.close()
