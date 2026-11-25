"""0.3.12: SG extras + Harmonic Saint screenshot-style boosts, interactions and three locales."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(), 'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for node in list(soup.find_all(['script','link','base'])):node.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(1200,850),(390,844),(320,568)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<=390)
  errors=[]
  page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_default_timeout(10000)
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for f in scripts:page.add_script_tag(content=(root/'Companion Files'/f).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('sg')
  page.locator('[data-act="hub:oath"]').click()
  if page.locator('[data-act="sg-stats-later"]').count():page.locator('[data-act="sg-stats-later"]').click()
  assert page.locator('.sg-extra-boost').count()==3
  assert page.locator('.sg-gear-panel .sg-gear-card:not(.sg-title-card)').count()==0
  assert page.locator('[data-sg-extra-toggle="relic"]').count()==1
  assert page.locator('[data-sg-extra-toggle="emblem"]').count()==1
  assert page.locator('[data-sg-extra-toggle="persona"]').count()==1
  assert page.locator('[data-sg-extra-toggle="relic"]').is_checked() is False
  page.locator('[data-sg-extra-toggle="relic"]').check()
  assert page.locator('[data-sg-extra-toggle="relic"]').is_checked()
  page.locator('[data-act="sg-gear-edit:relic"]').click()
  assert page.locator('.sg-boost-dialog').is_visible()
  assert page.locator('[data-sg-relic]').count()==1
  page.locator('[data-sg-relic]').select_option('S')
  assert page.locator('[data-sg-relic]').input_value()=='S'
  assert '+60' in page.locator('[data-sg-extra-card="relic"] .sg-extra-status').inner_text()
  page.locator('[data-act="sg-gear-close"]').last.click()
  page.locator('[data-sg-extra-toggle="relic"]').uncheck()
  page.locator('[data-sg-extra-toggle="relic"]').check()
  assert '+60' in page.locator('[data-sg-extra-card="relic"] .sg-extra-status').inner_text(), 'last rank lost'
  page.locator('[data-act="sg-gear-edit:emblem"]').click()
  assert page.locator('[data-sg-rune="mind"]').count()==1
  page.locator('[data-sg-rune="mind"]').select_option('3')
  assert '+15' in page.locator('[data-sg-extra-card="emblem"] .sg-extra-status').inner_text()
  page.locator('[data-sg-emblem-prep]').check()
  page.locator('[data-sg-emblem-emergency]').select_option('defensive')
  page.locator('[data-act="sg-gear-close"]').last.click()
  assert page.locator('[data-sg-extra-toggle="emblem"]').is_checked()
  page.locator('[data-act="sg-page:quick"]').click()
  assert page.locator('[data-sg-extra-toggle="emblem"]').is_checked(), 'emergency already-equipped selection lost'
  page.locator('[data-sg-extra-toggle="emblem"]').uncheck()
  assert page.locator('[data-sg-extra-toggle="emblem"]').is_checked() is False
  page.locator('[data-act="sg-gear-edit:persona"]').click()
  assert page.locator('[data-act="sg-persona:start"]').count()==1
  page.locator('[data-act="sg-gear-close"]').last.click()
  page.locator('[data-sg-extra-toggle="persona"]').check()
  assert page.locator('[data-sg-extra-toggle="persona"]').is_checked()
  page.locator('[data-sg-extra-toggle="persona"]').uncheck()
  assert not page.locator('[data-sg-extra-toggle="persona"]').is_checked()
  # SG locale-only new labels.
  if w==1200:page.locator('.sg-bonus-grid').screenshot(path='/mnt/data/Midir-0312-SG-Buff-Cards.png')
  page.locator('#companion-language').select_option('ko')
  assert '오필리아의 눈물' in page.locator('.sg-bonus-grid').inner_text()
  page.locator('#companion-language').select_option('es')
  assert 'Lágrimas de Ofelia' in page.locator('.sg-bonus-grid').inner_text()
  page.locator('#companion-language').select_option('en')
  assert "Ophelia's Tears" in page.locator('.sg-bonus-grid').inner_text()
  page.close()
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<=390)
  page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_default_timeout(10000)
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for f in scripts:page.add_script_tag(content=(root/'Companion Files'/f).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('[data-act="hub:litany"]').click()
  # 0.3.12a: nine active boost cards; Pulse is fixed +20% without Edit.
  assert page.locator('.hsl-boost').count()==9
  assert page.locator('.hsl-boostcopy .hsl-boostsummary').count()==9
  assert page.locator('[data-hsl-open="boost:pulse"]').count()==0
  page.locator('[data-hsl-key="boosts.pulse.enabled"]').check()
  assert 'is-on' in (page.locator('.hsl-boost:has([data-hsl-key="boosts.pulse.enabled"])').get_attribute('class') or '')
  assert '+20%' in page.locator('.hsl-boost:has([data-hsl-key="boosts.pulse.enabled"])').inner_text()
  if w==1200:page.locator('.hsl-boostboard').screenshot(path='/mnt/data/Midir-0312-HS-Boost-Cards.png')
  page.locator('#companion-language').select_option('ko')
  assert '추가 효과' in page.locator('#hsl').inner_text()
  page.locator('#companion-language').select_option('es')
  assert 'Bonificaciones' in page.locator('#hsl').inner_text()
  assert page.locator('[data-hsl-open="boost:pulse"]').count()==0
  page.locator('#companion-language').select_option('en')
  assert 'Pulse of Purification' in page.locator('.hsl-boostboard').inner_text()
  assert not any('\uac00'<=c<='\ud7a3' for c in page.locator('#hsl').inner_text())
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),(w,'horizontal overflow')
  assert not errors,(w,errors[:5])
  page.close()
  print('PASS: SG + HS three-language boost cards, behavior and layout',w)
 browser.close()
