"""0.3.12d: real browser Litany gear-editor validation, locale, layout and scroll."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for node in list(soup.find_all(['script','link','base'])):node.decompose()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width,height in ((1200,850),(390,844),(320,568)):
  page=b.new_page(viewport={'width':width,'height':height},has_touch=width<500)
  page.set_default_timeout(10000)
  errors=[];page.on('pageerror',lambda ex:errors.append(str(ex)))
  page.set_content(str(soup),wait_until='load')
  for css in ('styles.css','theta-rhythm.css','vertrag-survival.css'):
   page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for file in scripts:
   page.add_script_tag(content=(root/'Companion Files'/file).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('[data-act="hub:litany"]').click()
  cells=page.locator('#hsl .hsl-board .hsl-gear-cell')
  assert cells.count()==10
  assert [cells.nth(i).get_attribute('data-hsl-open') for i in range(10)]==[f'slot:{i}' for i in ['acc1','hat','acc2','wand','body','offhand','gloves','shoes','robe','echo']]
  # The third row is Gloves, Boots, Robe; Echo is directly under Robe.
  boxes={id:page.locator(f'[data-hsl-open="slot:{id}"]').bounding_box() for id in ('gloves','shoes','robe','echo')}
  assert abs(boxes['robe']['y']-boxes['gloves']['y'])<3 and abs(boxes['robe']['y']-boxes['shoes']['y'])<3,boxes
  assert boxes['echo']['y']>boxes['robe']['y'] and abs(boxes['echo']['x']-boxes['robe']['x'])<3,boxes
  page.locator('[data-hsl-open="slot:hat"]').click()
  assert page.locator('[data-hsl-key="slots.hat.prefix.heal"]').count()==1
  assert page.locator('[data-hsl-key="slots.hat.prefix.magicAttack"]').count()==1
  assert page.locator('[data-hsl-key="slots.hat.suffix.magicAttack"]').count()==1
  for key in ('slots.hat.prefix.party','slots.hat.prefix.pct','slots.hat.suffix.party','slots.hat.suffix.pct','slots.hat.murias.heal','slots.hat.murias.party'):
   assert page.locator(f'[data-hsl-key="{key}"]').count()==0,key
  assert page.locator('[data-hsl-key="slots.hat.murias.pct"]').count()==0
  for key in ('slots.hat.prefix.heal','slots.hat.prefix.magicAttack','slots.hat.sharedPct','slots.hat.healFlat'):
   control=page.locator(f'[data-hsl-key="{key}"]')
   assert control.get_attribute('step')=='1',key
   assert control.get_attribute('inputmode')=='numeric',key
  # Enabling water reveals exactly one selector, 1–10% with no 'flat' controls.
  page.locator('[data-hsl-key="slots.hat.murias.enabled"]').check()
  choices=page.locator('[data-hsl-key="slots.hat.murias.pct"] option')
  assert choices.count()==10
  assert [choices.nth(i).get_attribute('value') for i in range(10)]==[str(i) for i in range(1,11)]
  # Whole-number rolls, a real edit, and modal scroll preservation.
  page.locator('[data-hsl-key="slots.hat.enabled"]').check()
  page.locator('[data-hsl-key="slots.hat.murias.pct"]').select_option('7')
  scroll=page.locator('.hsl-editor-scroll')
  scroll.evaluate('(el)=>el.scrollTop=Math.min(165,Math.max(0,el.scrollHeight-el.clientHeight))')
  before=scroll.evaluate('(el)=>el.scrollTop')
  healing=page.locator('[data-hsl-key="slots.hat.prefix.heal"]')
  healing.fill('4.6');healing.dispatch_event('change')
  assert page.locator('[data-hsl-key="slots.hat.prefix.heal"]').input_value()=='5'
  assert abs(scroll.evaluate('(el)=>el.scrollTop')-before)<6
  page.locator('[data-hsl-key="slots.hat.prefix.magicAttack"]').fill('16')
  page.locator('[data-hsl-key="slots.hat.prefix.magicAttack"]').dispatch_event('change')
  assert page.locator('[data-hsl-key="slots.hat.prefix.magicAttack"]').input_value()=='16'
  page.locator('[data-hsl-close]').first.click()
  assert '118.77' in page.locator('.hsl-resultbar').inner_text(),page.locator('.hsl-resultbar').inner_text() # (106+5)*1.07
  page.locator('[data-hsl-open="slot:hat"]').click()
  assert page.locator('[data-hsl-key="slots.hat.murias.pct"]').input_value()=='7'
  page.locator('[data-hsl-close]').first.click()
  page.locator('[data-hsl-open="slot:echo"]').click()
  assert page.locator('[data-hsl-key="slots.echo.murias.enabled"]').count()==0
  assert page.locator('[data-hsl-key="slots.echo.prefix.magicAttack"]').count()==0
  page.locator('[data-hsl-close]').first.click()
  for locale,magic in [('ko','마법 공격력'),('es','Ataque mágico'),('en','Magic Attack')]:
   page.locator('#companion-language').select_option(locale)
   page.locator('[data-hsl-open="slot:robe"]').click()
   assert magic in page.locator('.hsl-editor').inner_text(),(locale,page.locator('.hsl-editor').inner_text())
   page.locator('[data-hsl-close]').first.click()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),width
  assert not errors,errors
  print('PASS Litany 0.3.12d equipment UI',width,height,flush=True)
  page.close()
 b.close()
