"""Mobile 294: sidebar Secret Sauce, chaptered Achievement Book, and shared music page."""
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
from bs4 import BeautifulSoup
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e['src'] for e in soup.find_all('script') if e.get('src') and e['src']!='pwa.js']
for e in list(soup.find_all(['script','link','base'])):e.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(390,844),(320,700)]:
  pg=b.new_page(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Mobile Safari/537.36')
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.set_content(str(soup))
  pg.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
  pg.evaluate("""() => {const m = new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return m.has(k)?m.get(k):null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})}""")
  for script in scripts:pg.add_script_tag(content=(root/'Companion Files'/script).read_text())
  pg.wait_for_timeout(100)
  # Menu is truly usable via the hamburger, not only a homepage shortcut.
  pg.locator('#overview-toggle').click()
  assert pg.locator('#overview-sidebar').is_visible(), 'Sidebar did not open'
  assert pg.locator('[data-overview-page="settings"]').count()==1, 'Settings missing in menu'
  pg.locator('[data-overview-page="settings"]').click()
  assert pg.locator('#companion-secret-sauce').count()==1,'Secret Sauce missing in Settings'
  assert not pg.locator('#companion-secret-sauce').is_checked()
  pg.locator('#companion-secret-sauce').click()
  assert pg.locator('#companion-secret-sauce').is_checked()
  pg.locator('#overview-toggle').click()
  assert pg.locator('[data-overview-page="settings"]').is_visible()
  pg.locator('[data-overview-page="settings"]').click()
  assert pg.locator('#companion-secret-sauce').is_checked(),'Secret Sauce not saved'
  pg.locator('#companion-secret-sauce').click()
  assert not pg.locator('#companion-secret-sauce').is_checked()
  # Book visible without Secret Sauce, all pages interactable.
  pg.locator('nav [data-page="vault"]').click()
  pg.locator('[data-act="achievement-book-open"]').click()
  assert pg.locator('.achievement-book-dialog').is_visible()
  assert pg.locator('.achievement-book-footer').is_visible()
  assert pg.locator('.achievement-book-footer').count()==1
  prev=pg.locator('[data-act="achievement-book-prev"]');nxt=pg.locator('[data-act="achievement-book-next"]')
  assert prev.is_disabled()
  assert nxt.is_enabled()
  pg.locator('.achievement-book-entry').first.click()
  assert pg.locator('.achievement-book-detail-page h3').count()==1,'Achievement detail failed'
  pg.locator('[data-act="achievement-book-next"]').click()
  assert 'Page 2 of' in pg.locator('.achievement-book-footer').inner_text(),'Next page failed'
  pg.locator('[data-act="achievement-book-prev"]').click()
  assert 'Page 1 of' in pg.locator('.achievement-book-footer').inner_text(),'Previous page failed'
  # On narrow phones, all chapter navigation stays in the viewport while book scrolls.
  rect=pg.locator('.achievement-book-footer').bounding_box()
  assert rect and rect['y']>=0 and rect['y']+rect['height']<=height+2,('Footer clipped',rect)
  pg.locator('.achievement-book-spread').evaluate('(e)=>{e.scrollTop=e.scrollHeight}')
  rect=pg.locator('.achievement-book-footer').bounding_box()
  assert rect and rect['y']+rect['height']<=height+2, 'Footer moves offscreen when turning'
  pg.locator('[data-act="achievement-book-close"]').click()
  assert pg.locator('.achievement-book-overlay').count()==0,'Book did not close'
  # With Secret Sauce ON, importer-derived chapter pages become available.
  pg.locator('#overview-toggle').click();pg.locator('[data-overview-page="settings"]').click()
  pg.locator('#companion-secret-sauce').click()
  pg.locator('nav [data-page="vault"]').click()
  pg.locator('[data-act="achievement-book-open"]').click()
  pg.locator('.achievement-book-footer').evaluate('(e)=>e.scrollIntoView()')
  total_label=pg.locator('.achievement-book-footer span').inner_text()
  total=int(total_label.rsplit(' ',1)[-1])
  assert total>2, ('Expected extended catalogue with Secret Sauce', total_label)
  for n in range(2,total+1):
   pg.locator('[data-act="achievement-book-next"]').click()
   assert f'Page {n} of {total}' in pg.locator('.achievement-book-footer').inner_text()
   assert pg.locator('.achievement-book-entry').count()>0
  assert pg.locator('[data-act="achievement-book-next"]').is_disabled()
  for n in range(total-1,0,-1):
   pg.locator('[data-act="achievement-book-prev"]').click()
   assert f'Page {n} of {total}' in pg.locator('.achievement-book-footer').inner_text()
  pg.locator('[data-act="achievement-book-close"]').click()
  # Unified rate page: Begin is disabled but calculator active.
  pg.locator('[data-act="mobile-tool:music-calc"]').click()
  assert pg.locator('#music-calculator').count()==1
  assert pg.locator('#music-calculator').get_attribute('open') is not None
  assert pg.locator('#music-begin').is_disabled()
  pg.locator('[data-music-input="musicNormalEffect"]').fill('28.5')
  pg.locator('[data-music-input="musicNormalEffect"]').dispatch_event('change')
  assert pg.locator('[data-music-input="musicNormalEffect"]').input_value()=='28.5'
  assert pg.locator('.music-sim-card').is_visible(),'Performance gag removed'
  assert not errors, errors
  print('PASS',width,'menu+secret sauce+book+same page music')
  pg.close()
 b.close()
