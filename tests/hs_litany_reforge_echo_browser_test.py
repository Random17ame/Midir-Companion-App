"""Litany v3: focused EV-Echostone one-line limit and nonstacking browser assertion."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
 page.set_content(str(soup),wait_until='load')
 for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
 for s in scripts:page.add_script_tag(content=(root/'Companion Files'/s).read_text())
 page.locator('nav button[data-page="rotation"]').click();page.locator('#rotation-lab-arcana').select_option('hs');page.locator('[data-act="hub:litany"]').click()
 page.locator('[data-hsl-open="slot:acc1"]').click();page.locator('input[data-hsl-key="slots.acc1.enabled"]').check();page.locator('select[data-hsl-key="slots.acc1.reforges.0.key"]').select_option('party');page.locator('select[data-hsl-key="slots.acc1.reforges.0.level"]').select_option('3');page.locator('[data-hsl-close]').first.click()
 page.locator('[data-hsl-open="slot:acc2"]').click();page.locator('input[data-hsl-key="slots.acc2.enabled"]').check();page.locator('select[data-hsl-key="slots.acc2.reforges.0.key"]').select_option('party');page.locator('select[data-hsl-key="slots.acc2.reforges.0.level"]').select_option('3');page.locator('[data-hsl-close]').first.click()
 page.locator('[data-hsl-open="slot:echo"]').click();page.locator('input[data-hsl-key="slots.echo.enabled"]').check();page.locator('select[data-hsl-key="slots.echo.reforges.0.key"]').select_option('party');page.locator('select[data-hsl-key="slots.echo.reforges.0.level"]').select_option('20');assert page.locator('select[data-hsl-key="slots.echo.reforges.0.level"] option').count()==21
 assert page.locator('select[data-hsl-key="slots.echo.reforges.1.key"]').count()==0;page.locator('[data-hsl-close]').first.click()
 assert '255' in page.locator('.hsl-resultbar').inner_text(),page.locator('.hsl-resultbar').inner_text()
 assert not errors,errors
 print('PASS Litany v3 browser: accesssory two lines and one-line Echo Lv20',flush=True)
 b.close()
