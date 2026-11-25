"""0.3.12a: Litany spirit/relic editor, prerequisites, scrolling and three-language layouts."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for tag in list(soup.find_all(['script','link','base'])):tag.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(1200,800),(390,844),(320,568)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<400)
  page.set_default_timeout(10000)
  errors=[]
  page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
   page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for js in scripts:
   page.add_script_tag(content=(root/'Companion Files'/js).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('[data-act="hub:litany"]').click()
  assert page.locator('#hsl').is_visible()
  assert page.locator('[data-hsl-open="boost:pulse"]').count()==0
  assert page.locator('[data-hsl-key="boosts.pulse.enabled"]').count()==1
  page.locator('[data-hsl-open="boost:amulet"]').click()
  assert page.locator('[data-hsl-key="boosts.amulet.heal"] option').count()==13
  assert page.locator('[data-hsl-key="boosts.amulet.party"]').count()==0
  page.locator('[data-hsl-key="boosts.amulet.heal"]').select_option('12')
  page.locator('.hsl-editor [data-hsl-key="boosts.amulet.enabled"]').check()
  page.locator('[data-hsl-close]').first.click()
  page.locator('[data-hsl-open="slot:wand"]').click()
  assert page.locator('[data-hsl-key="darkErgLevel"]').count()==0
  page.locator('[data-hsl-key="wandType"]').select_option('soul')
  page.locator('[data-hsl-key="ergRank"]').select_option('S')
  page.locator('[data-hsl-key="ergLevel"]').select_option('50')
  assert page.locator('[data-hsl-key="darkErgLevel"] option').count()==51
  page.locator('[data-hsl-key="darkErgLevel"]').select_option('50')
  assert page.locator('[data-hsl-key="darkErgPctOverride"]').count()==1
  page.locator('[data-hsl-key="darkErgPctOverride"]').fill('22.5')
  page.locator('[data-hsl-key="darkErgPctOverride"]').dispatch_event('change')
  page.locator('[data-hsl-key="ergLevel"]').select_option('49')
  assert page.locator('[data-hsl-key="darkErgLevel"]').count()==0
  page.locator('[data-hsl-key="ergLevel"]').select_option('50')
  assert page.locator('[data-hsl-key="darkErgLevel"]').count()==1
  assert page.locator('[data-hsl-key="darkErgLevel"]').input_value()=='0'
  page.locator('[data-hsl-close]').first.click()
  page.locator('[data-hsl-open="boost:spirit"]').click()
  assert page.locator('.hsl-augmentgroup').count()==3
  assert page.locator('.hsl-augment').count()==14
  assert page.locator('[data-hsl-key="spirit.attack.training"] option').count()==6
  assert page.locator('[data-hsl-key="spirit.attack.ultimate"] option').count()==2
  assert page.locator('[data-hsl-key="spirit.awakening.buff"] option').count()==6
  assert page.locator('[data-hsl-key="spirit.awakening.acceleration"] option').count()==2
  page.locator('.hsl-editor [data-hsl-key="boosts.spirit.enabled"]').check()
  page.locator('[data-hsl-key="spirit.awakeningActive"]').check()
  page.locator('[data-hsl-key="spirit.awakening.buff"]').select_option('5')
  assert '+25%' in page.locator('.hsl-spirit-metric').inner_text()
  page.locator('[data-hsl-key="spirit.attack.training"]').select_option('5')
  assert page.locator('.hsl-editor-head').is_visible()
  editor=page.locator('.hsl-editor-scroll')
  editor.evaluate('(el)=>el.scrollTop=Math.min(300,el.scrollHeight-el.clientHeight)')
  old=editor.evaluate('(el)=>el.scrollTop')
  page.locator('[data-hsl-key="spirit.exclusive.luckyBlessing"]').select_option('5')
  after=editor.evaluate('(el)=>el.scrollTop')
  assert abs(after-old)<8,(w,old,after,'spirit scroll jump')
  page.locator('[data-hsl-close]').first.click()
  page.locator('[data-hsl-open="boost:relics"]').click()
  assert page.locator('.hsl-relic-slot').count()==3
  assert page.locator('[data-hsl-key="relics.0.level"] option').count()==11
  assert page.locator('[data-hsl-key="relics.1.prefix.selection"]').count()==1
  assert page.locator('[data-hsl-key="relics.2.suffix.selection"]').count()==1
  page.locator('.hsl-editor [data-hsl-key="boosts.relics.enabled"]').check()
  page.locator('[data-hsl-key="relics.0.enabled"]').check()
  page.locator('[data-hsl-key="relics.0.level"]').select_option('10')
  page.locator('[data-hsl-key="relics.0.prefix.selection"]').select_option('custom')
  page.locator('[data-hsl-key="relics.0.prefix.name"]').fill('Custom Prefix')
  page.locator('[data-hsl-key="relics.0.prefix.name"]').dispatch_event('change')
  assert page.locator('[data-hsl-key="relics.0.prefix.name"]').input_value()=='Custom Prefix'
  page.locator('[data-hsl-close]').first.click()
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),('overflow',w)
  if w==1200:page.screenshot(path='/mnt/data/Midir-0312a-litany-desktop.png')
  if w==390:page.screenshot(path='/mnt/data/Midir-0312a-litany-mobile.png')
  for locale,expected in [('ko','무리아스 유물'),('es','Reliquias de Murias'),('en','Relics')]:
   page.locator('#companion-language').select_option(locale)
   assert expected in page.locator('#hsl').inner_text(),(locale,w)
   if locale=='en':assert not any('\uac00'<=c<='\ud7a3' for c in page.locator('#hsl').inner_text())
  assert not errors,(w,errors)
  page.close()
  print('PASS Litany 0.3.12a',w,h,flush=True)
 browser.close()
