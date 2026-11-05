"""Build 293: touch-first utility navigation, interactive calculator, SG data entry and simulators."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125 Mobile Safari/537.36')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
 scripts=[x['src'] for x in soup.find_all('script') if x.get('src') and x['src']!='pwa.js']
 for x in list(soup.find_all(['script','link','base'])):x.decompose()
 page.set_content(str(soup))
 page.add_style_tag(content=(root/'Companion Files/styles.css').read_text())
 for x in scripts:page.add_script_tag(content=(root/'Companion Files'/x).read_text())
 page.wait_for_timeout(300)
 assert page.locator('.mobile-companion-banner').count()==1
 selectors=['sg-full','sg-quick','music-calc','special','erg']
 for x in selectors: assert page.locator(f'[data-act="mobile-tool:{x}"]').count()==1,x
 page.locator('[data-act="mobile-tool:music-calc"]').click()
 assert page.locator('#music-calculator').count()==1 and page.locator('#music-begin').is_disabled()
 inp=page.locator('[data-music-input="musicNormalEffect"]')
 inp.fill('34.5');inp.dispatch_event('change')
 assert page.locator('[data-music-input="musicNormalEffect"]').input_value()=='34.5'
 assert page.locator('.music-result-strip').count()==1
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'), 'music page horizontal overflow'
 page.locator('nav [data-page="vault"]').click()
 page.locator('[data-act="mobile-tool:special"]').click()
 assert page.locator('#su-root').count()==1
 page.locator("details.su-add summary").click()
 page.locator('#su-create').click()
 assert page.locator('.su-weapons button').count()>0
 # An actual first-step upgrade, not merely rendering the forge.
 page.evaluate("MIDIR_REFORGE.importState({...MIDIR_REFORGE.exportState(),gold:100000});MIDIR_SPECIAL_UPGRADE.reward('red',1);MIDIR_SPECIAL_UPGRADE.render()")
 assert page.locator('#su-upgrade').is_enabled()
 page.locator('#su-upgrade').click()
 assert 'R1' in page.locator('.su-forge-slot').first.inner_text()
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'), 'special upgrade horizontal overflow'
 page.locator('nav [data-page="vault"]').click()
 page.locator('[data-act="mobile-tool:erg"]').click()
 assert page.locator('#erg-sim-root').count()==1
 page.locator('#erg-weapon-type').select_option('Staff')
 page.locator('#erg-new').click()
 assert page.locator('#erg-tap').is_enabled()
 page.locator('#erg-tap').click()
 assert page.locator('.erg-notice').count()==1
 page.locator('#erg-save').click()
 assert page.locator('.erg-stored').count()>=1
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'), 'erg horizontal overflow'
 page.locator('nav [data-page="vault"]').click()
 page.locator('[data-act="mobile-tool:sg-full"]').click()
 if page.locator('[data-act="sg-stats-begin"]').count():page.locator('[data-act="sg-stats-begin"]').click()
 for i,value in enumerate([10000,900,65,1100,99]):
  page.locator('#sg-stat-entry').fill(str(value))
  page.locator('#sg-stat-form button[type="submit"]').click()
 assert page.locator('[data-act="sg-page:quick"]').count()==1
 assert page.locator('#sg-stat-entry').count()==0
 # Oath-max setup has editable equipment, runes and gear, independent of the checklist.
 assert page.locator('[data-sg-rune="mind"]').count()==1
 page.locator('[data-sg-rune="mind"]').dispatch_event('change')
 assert page.locator('[data-sg-gear-check]').count()>=1
 page.locator('[data-act="sg-page:quick"]').click()
 assert page.locator('.sg-emergency-note').count()==1
 # The emergency sequence editor has touch buttons for adding / moving casts.
 page.locator('.sg-emergency-editor summary').click()
 previous=page.locator('.sg-emergency-row').count()
 page.locator('[data-act="sg-seq-add:f"]').click()
 assert page.locator('.sg-emergency-row').count()==previous+1
 page.locator('[data-act="sg-page:checklist"]').click()
 assert page.locator('#sg-check-list').count()==1
 cb=page.locator('[data-sg-done]').first;cb.check();assert cb.is_checked()
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'), 'SG horizontal overflow'
 assert not errors,errors
 print('PASS mobile 293 music calculator edit, Special Upgrade create, Erg create/tap/save, SG stat wizard/full/emergency/checklist and no overflow')
 b.close()
