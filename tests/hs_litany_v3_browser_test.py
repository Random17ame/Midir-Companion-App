"""Litany v3 feature compatibility under the v4 per-slot wand controls."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[x.get('src') for x in soup.select('script[src]')]
for x in list(soup.find_all(['script','link','base'])):x.decompose()
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for w,h in [(1200,800),(390,844),(320,568)]:
  page=b.new_page(viewport={'width':w,'height':h},has_touch=w<=390)
  page.set_default_timeout(10000)
  errors=[];page.on('pageerror',lambda exc:errors.append(str(exc)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('[data-act="hub:litany"]').click()
  assert page.locator('#hsl .hsl-board .hsl-gear-cell').count()==10
  assert not any('\uac00'<=c<='\ud7a3' for c in page.locator('#hsl').inner_text())
  page.locator('[data-hsl-open="slot:wand"]').click()
  page.locator('select[data-hsl-key="wandType"]').select_option('nightbringer')
  assert page.locator('select[data-hsl-key="gradeTier"] option').count()==5
  assert '200.34' in page.locator('.hsl-editor-head').inner_text()
  page.locator('select[data-hsl-key="gradeTier"]').select_option('common')
  assert '124.02' in page.locator('.hsl-editor-head').inner_text()
  page.locator('select[data-hsl-key="wandType"]').select_option('soul')
  assert page.locator('select[data-hsl-key="gradeTier"] option').count()==1
  assert '235.32' in page.locator('.hsl-editor-head').inner_text()
  page.locator('input[data-hsl-key="gradeOverride"]').fill('100')
  page.locator('input[data-hsl-key="gradeOverride"]').dispatch_event('change')
  assert '222.6' in page.locator('.hsl-editor-head').inner_text()
  page.locator('select[data-hsl-key="ergRank"]').select_option('S')
  page.locator('select[data-hsl-key="ergLevel"]').select_option('50')
  assert '243.8' in page.locator('.hsl-editor-head').inner_text(),page.locator('.hsl-editor-head').inner_text()
  assert page.locator('[data-hsl-key="slots.wand.setPoints"]').count()==0
  page.locator('[data-hsl-close]').first.click()
  page.locator('[data-hsl-output="dissonance"]').click()
  assert '0.81' in page.locator('.hsl-resultbar').inner_text()
  page.locator('select[data-hsl-key="stacks"]').select_option('1')
  assert '0.81' in page.locator('.hsl-resultbar').inner_text()
  page.locator('[data-hsl-output="healing"]').click()
  # Equipment editor: focus and scroll must survive full app render after any selection.
  page.locator('[data-hsl-open="slot:body"]').click()
  assert page.locator('#hsl-modal .hsl-editor-scroll').count()==1
  assert page.locator('select[data-hsl-key="slots.body.setPoints"] option').count()==11
  scroll='.hsl-editor-scroll'
  page.locator(scroll).evaluate('(el)=>el.scrollTop=280')
  old=page.locator(scroll).evaluate('(el)=>el.scrollTop')
  page.locator('select[data-hsl-key="slots.body.setPoints"]').select_option('5')
  after=page.locator(scroll).evaluate('(el)=>el.scrollTop')
  assert abs(after-old)<4,('scroll reset',old,after,w)
  page.locator('input[data-hsl-key="slots.body.enabled"]').check()
  page.locator('[data-hsl-close]').first.click()
  page.locator('[data-hsl-open="slot:hat"]').click()
  page.locator('input[data-hsl-key="slots.hat.enabled"]').check()
  page.locator('select[data-hsl-key="slots.hat.setPoints"]').select_option('5')
  page.locator('[data-hsl-close]').first.click()
  assert '10/10' in page.locator('.hsl-section-title').first.inner_text()
  page.locator('[data-hsl-open="slot:echo"]').click()
  assert page.locator('[data-hsl-key="slots.echo.reforges.1.key"]').count()==0
  assert page.locator('input[data-hsl-key="slots.echo.prefix.name"]').count()==0
  page.locator('[data-hsl-close]').first.click()
  assert page.locator('[data-hsl-open="boost:pulse"]').count()==0
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),('horizontal overflow',w)
  page.locator('#companion-language').select_option('ko')
  assert '음파의 세례' in page.locator('#hsl').inner_text()
  assert '힐링 원드' in page.locator('#hsl').inner_text()
  assert 'Korean' not in page.locator('#hsl').inner_text()
  page.locator('[data-hsl-open="slot:body"]').click()
  assert '접두' in page.locator('.hsl-editor').inner_text()
  assert '접미' in page.locator('.hsl-editor').inner_text()
  assert '세공' in page.locator('.hsl-editor').inner_text()
  page.locator('[data-hsl-close]').first.click()
  assert not errors, errors
  print('PASS Litany v3 compatibility',w,h,flush=True)
  if w==1200:page.screenshot(path='/mnt/data/hs_litany_work/hs_litany_v3_desktop.png')
  if w==390:page.screenshot(path='/mnt/data/hs_litany_work/hs_litany_v3_mobile.png')
  page.close()
 b.close()
