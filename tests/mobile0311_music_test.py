"""Current 0.3.11b Music Calculator editor regression, supersedes 0.3.11 flat enchant wizard."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t.get('src') for t in soup.select('script[src]')]
for t in list(soup.find_all(['script','link','base'])): t.decompose()
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup),wait_until='load')
 for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text())
 page.locator('nav button[data-page="rotation"]').click()
 page.locator('#rotation-lab-arcana').select_option('hs')
 page.locator('button[data-act="hub:music-lie"]').click()
 assert page.locator('input[data-music-input="musicKnowledgeReforge"]').count()==0
 assert page.locator('[data-music-gear-tab]').count()==1
 assert page.locator('button[data-music-gear-action="edit"][data-music-gear-slot]').count()==8
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Accessory 1"]').click()
 assert page.locator('.music-enchant-editor h3').inner_text()=='Accessory 1'
 assert page.locator('[data-music-gear-equip]').count()==1
 assert page.locator('select[data-music-enchant-slot="Accessory 1"][data-music-enchant-side="prefix"] option').all_text_contents()[1].startswith('Allegro')
 page.locator('select[data-music-enchant-slot="Accessory 1"][data-music-enchant-side="prefix"]').select_option('Dynamic')
 assert page.locator('select[data-music-enchant-roll="prefix"] option').count()==2
 page.locator('select[data-music-enchant-roll="prefix"]').select_option('2')
 page.locator('button[data-music-gear-action="next"]').click()
 assert page.locator('.music-enchant-editor h3').inner_text()=='Accessory 2'
 page.locator('button[data-music-gear-action="next"]').click()
 assert page.locator('.music-enchant-editor h3').inner_text()=='Wings'
 page.locator('button[data-music-gear-action="next"]').click()
 assert page.locator('.music-enchant-editor h3').inner_text()=='Hat'
 assert page.locator('select[data-music-enchant-slot="Hat"][data-music-enchant-side="prefix"] option').count()==1
 page.locator('select[data-music-enchant-slot="Hat"][data-music-enchant-side="suffix"]').select_option('Chorus')
 page.locator('select[data-music-enchant-roll="suffix"]').select_option('3')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert 'Applied +5' in page.locator('.music-gear-totals').inner_text()
 page.locator('[data-music-gear-override]').fill('42')
 page.locator('[data-music-gear-override]').dispatch_event('change')
 assert 'Applied +42' in page.locator('.music-gear-totals').inner_text()
 page.locator('button[data-music-gear-action="auto"]').click()
 assert 'Applied +5' in page.locator('.music-gear-totals').inner_text()
 assert not errors,errors
 print('MUSIC ENCHANT + GEAR TEST: PASS (8 slots, slot restrictions, rolls, wizard, override)')
 b.close()
