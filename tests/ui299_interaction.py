from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x['src'] for x in soup.find_all('script') if x.get('src')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':980})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup))
 for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
 page.add_style_tag(content=(root/'Companion Files/vertrag-survival.css').read_text())
 page.add_style_tag(content=(root/'Companion Files/theta-rhythm.css').read_text())
 page.locator('nav [data-page=rotation]').click();page.locator('#rotation-lab-arcana').select_option('sg');page.locator('[data-act="hub:vertrag"]').click()
 assert page.locator('#vt-setup-canvas').count()==1
 assert page.locator('[data-vt="start"]').count()==0
 assert page.locator('[data-vt="trial"]').count()==1
 assert page.locator('[data-vt="endless"]').count()==1
 assert page.locator('#vt-setup-state').inner_text().startswith('4 giants')
 bb=page.locator('#vt-setup-canvas').bounding_box()
 # giant 0 sits at clock 1, radius 210: x=530 y=88
 page.locator('#vt-setup-canvas').click(position={'x':bb['width']*530/850,'y':bb['height']*88/540},force=True)
 assert '3 giants may stomp' in page.locator('#vt-setup-state').inner_text(),page.locator('#vt-setup-state').inner_text()
 assert page.evaluate('MIDIR_VERTRAG.exportState().config.giantOccupied[0]') is True
 page.locator('[data-vt="endless"]').click()
 assert page.locator('[data-vt="defense:guardian"]').count()==1
 page.locator('[data-vt="defense:guardian"]').click()
 assert page.locator('#vt-canvas').count()==1
 assert page.locator('[data-vt="potion"]').inner_text().endswith('H')
 # Save/restore with key changes
 page.locator('[data-vt="tab:settings"]').click()
 assert page.locator('[data-vt="bind:potion"]').count()==1
 page.locator('[data-vt="bind:potion"]').click();page.keyboard.press('j')
 assert page.evaluate('MIDIR_VERTRAG.exportState().keys.potion')=='j'
 page.locator('[data-vt="tab:menu"]').first.click()
 page.locator('[data-vt="endless"]').click()
 page.locator('[data-vt="defense:guardian"]').click()
 assert page.locator('[data-vt="potion"]').inner_text().endswith('J')
 assert not errors,errors
 print('PASS Vertrag setup giant toggle, modes, HP rendering, potion default H and rebind, persistence')
 # Theta standalone attach to avoid routing/stale window
 page2=b.new_page();err2=[];page2.on('pageerror',lambda e:err2.append(str(e)))
 page2.set_content('<div id="theta-root"></div>')
 page2.add_script_tag(content=(root/'Companion Files/theta-rhythm.js').read_text())
 page2.evaluate('MIDIR_THETA.mount()')
 assert page2.locator('.theta-guide').count()==1
 assert page2.locator('.theta-full-reference').count()==1
 assert not page2.locator('.theta-full-reference').get_attribute('open')
 page2.evaluate('window.MIDIR_THETA.exportState()')
 page2.locator('[data-theta="start"]').click()
 assert page2.locator('.theta-game-header img.theta-skill-icon').count()>=5
 assert page2.locator('.theta-game-header img[src*="icon_skill"]').count()>=5
 assert page2.evaluate("window.MIDIR_THETA.exportState()!=null")
 assert not err2,err2
 print('PASS Theta icon-first header and collapsible guide')
 b.close()
