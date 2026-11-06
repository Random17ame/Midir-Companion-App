"""0.3.11a mobile EV, music gear-switch and Theta performance acceptance checks."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t.get('src') for t in soup.select('script[src]')]
for t in list(soup.find_all(['script','link','base'])):t.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup),wait_until='load')
 for name in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
  page.add_style_tag(content=(root/'Companion Files'/name).read_text())
 for name in scripts:
  page.add_script_tag(content=(root/'Companion Files'/name).read_text())
 def arc(a):
  page.locator('nav button[data-page="rotation"]').click()
  back=page.locator('button[data-act="hub:home"]')
  if back.count():back.first.click()
  page.locator('#rotation-lab-arcana').select_option(a)
 def hub(id):page.locator(f'button[data-act="hub:{id}"]').first.click()
 # EV: progress through all steps with ordinary DOM/user clicks, including drawer-open finish.
 arc('ev');hub('ev-defense')
 assert page.locator('#evtd-tutorial').is_visible()
 page.locator('[data-evtd="patrol-next"]').last.click()
 assert '2/4' in page.locator('#evtd-tutorial').inner_text()
 page.locator('#evtd-tutorial [data-evtd-tutorial-confirm]').click()
 assert '3/4' in page.locator('#evtd-tutorial').inner_text()
 page.locator('[data-evtd="open-base"]').first.click()
 assert '4/4' in page.locator('#evtd-tutorial').inner_text()
 assert page.locator('#evtd-drawer').is_visible()
 page.locator('#evtd-base-panel [data-evtd-tutorial-confirm]').click()
 assert page.locator('#evtd-tutorial').is_hidden()
 assert page.locator('#evtd-drawer').is_hidden()
 page.locator('[data-evtd="start"]').first.click()
 assert 'Wave 1' in page.locator('#evtd-note').inner_text()
 print('EV full tour: PASS, including step-4 tap while drawer open and Wave 1')
 # Music swap and shared/independent equipment, 3 lines & enchant roll.
 arc('hs');hub('music-lie')
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Accessory 1"]').click()
 page.locator('select[data-music-enchant-slot="Accessory 1"][data-music-enchant-side="prefix"]').select_option('Dynamic')
 page.locator('select[data-music-enchant-roll="prefix"]').select_option('2')
 page.locator('select[data-music-gear-reforge="0"]').select_option('musicInspiringEffect')
 page.locator('input[data-music-gear-level="0"]').fill('3')
 page.locator('input[data-music-gear-level="0"]').dispatch_event('change')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert page.locator('.music-gear-totals').inner_text().count('+2')>=1
 assert page.locator('.music-gear-tier-values').inner_text().find('+3')>=0
 page.locator('.music-gear-more > summary').click()
 page.locator('button[data-music-gear-action="copy-tab"]').click()
 assert page.locator('[data-music-gear-tab]').count()==2
 # Existing cloned set shares the same original item, until explicitly separated.
 assert "Applied +2" in page.locator(".music-gear-totals").inner_text()
 assert "Inspiring reforge +3" in page.locator(".music-gear-tier-values").inner_text()
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Accessory 1"]').click()
 page.locator('button[data-music-gear-action="copy-item"][data-music-gear-slot="Accessory 1"]').click()
 # Replace Dynamic with Cadenza and Inspiring with walking reforge.
 page.locator('select[data-music-enchant-slot="Accessory 1"][data-music-enchant-side="prefix"]').select_option('')
 page.locator('select[data-music-enchant-slot="Accessory 1"][data-music-enchant-side="suffix"]').select_option('Cadenza')
 page.locator('select[data-music-gear-reforge="0"]').select_option('marchWalkingSpeed')
 page.locator('input[data-music-gear-level="0"]').fill('3')
 page.locator('input[data-music-gear-level="0"]').dispatch_event('change')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert "Applied +1" in page.locator(".music-gear-totals").inner_text()
 assert "Inspiring reforge +0" in page.locator(".music-gear-tier-values").inner_text()
 assert "Walking Speed Reforge 3" in page.locator(".music-gear-equipped").inner_text()
 page.locator('[data-music-gear-tab="set-1"]').click()
 assert "Applied +2" in page.locator(".music-gear-totals").inner_text()
 assert "Inspiring reforge +3" in page.locator(".music-gear-tier-values").inner_text()
 assert "Walking Speed Reforge 3" not in page.locator(".music-gear-equipped").inner_text()
 print('Music tabs: PASS, actual accessory swap transfers enchants and reforge together')
 # Explicit instrument sharing across tabs, with independent copy available.
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Instrument"]').click()
 page.locator('select[data-music-enchant-slot="Instrument"][data-music-enchant-side="prefix"]').select_option('Ensemble')
 page.locator('button[data-music-gear-action="close"]').first.click()
 page.locator('[data-music-gear-tab]').last.click()
 assert "Enchants +5" in page.locator(".music-gear-item").last.inner_text()
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Instrument"]').click()
 page.locator('button[data-music-gear-action="copy-item"][data-music-gear-slot="Instrument"]').click()
 page.locator('select[data-music-enchant-slot="Instrument"][data-music-enchant-side="prefix"]').select_option('Allegro')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert "Enchants +3" in page.locator(".music-gear-item").last.inner_text()
 page.locator('[data-music-gear-tab="set-1"]').click()
 assert "Enchants +5" in page.locator(".music-gear-item").last.inner_text()
 # Defense reforge, no mount input. Formula positive on +2 defense.
 assert page.locator('[data-music-input="marchMountSpeed"]').count()==0
 assert page.locator('option[value="march_mount"]').count()==0
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Gloves"]').click()
 page.locator('select[data-music-gear-reforge="0"]').select_option('enduringDefenseReforge')
 page.locator('input[data-music-gear-level="0"]').fill('2')
 page.locator('input[data-music-gear-level="0"]').dispatch_event('change')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert "Defense Reforge 2" in page.locator(".music-gear-item").nth(6).inner_text()
 assert "Enduring Melody · Defense Reforge" in page.locator(".music-gear-item").nth(6).inner_text()
 # per-set manual override and reset.
 page.locator('[data-music-gear-override]').fill('42')
 page.locator('[data-music-gear-override]').dispatch_event('change')
 assert "Applied +42" in page.locator(".music-gear-totals").inner_text()
 page.locator('[data-music-gear-action="auto"]').click()
 assert "Applied +7" in page.locator(".music-gear-totals").inner_text()
 print('Music instrument + defense + override: PASS')
 # Theta low-cost mode, fewer canvas pixels, no changes to logical timing constants.
 arc('dd');hub('theta')
 page.locator('[data-theta="start"]').click()
 canvas=page.locator('#theta-canvas')
 assert canvas.get_attribute('data-performance')=='on'
 assert canvas.evaluate('(e)=>e.width < 1120 && e.height < 690')
 page.wait_for_timeout(1100)
 assert page.locator('#theta-live').inner_text()
 assert page.evaluate('window.MIDIR_THETA.exportState().graphicsMode')=='auto'
 page.locator('[data-theta="end"]').click()
 print('Theta: PASS, mobile optimized renderer starts; game loop and end button responsive')
 assert not errors,errors
 print('0.3.11a HOTFIX BROWSER PASS')
 browser.close()
