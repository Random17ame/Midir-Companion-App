"""Music 0.3.12c: responsive open-state regression, current enchant rolls and specific upgrade scope."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[e.get('src') for e in soup.select('script[src]')]
for e in list(soup.find_all(['script','link','base'])):e.decompose()
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(1200,800),(390,844),(320,568)]:
  page=browser.new_page(viewport={'width':w,'height':h},has_touch=w<600,is_mobile=w<600)
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(str(soup),wait_until='load')
  for css in ['styles.css','theta-rhythm.css','vertrag-survival.css']:page.add_style_tag(content=(root/'Companion Files'/css).read_text())
  for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text())
  page.locator('nav button[data-page="rotation"]').click()
  page.locator('#rotation-lab-arcana').select_option('hs')
  page.locator('button[data-act="hub:music-lie"]').click()
  # User's screenshots: "Other buff sources & settings" must not collapse each time a value changes.
  extra=page.locator('.music-calc-extra')
  extra.locator('summary').click()
  assert extra.evaluate('(e)=>e.open'),f'{w}: cannot open details'
  control=extra.locator('[data-music-input="musicBuffTitleEffect"]');control.fill('17');control.dispatch_event('change')
  extra=page.locator('.music-calc-extra');assert extra.evaluate('(e)=>e.open'),f'{w}: collapsed on title change'
  control=extra.locator('[data-music-input="homesteadMusicBuffEffect"]');control.fill('10');control.dispatch_event('change')
  assert page.locator('.music-calc-extra').evaluate('(e)=>e.open'),f'{w}: collapsed on homestead change'
  assert page.locator('[data-music-input="musicBuffTitleEffect"]').input_value()=='17'
  assert page.locator('[data-music-input="homesteadMusicBuffEffect"]').input_value()=='10'
  # Gear editor current patch values, actual roll and automatic totals.
  page.locator('[data-music-gear-action="edit"][data-music-gear-slot="Instrument"]').click()
  page.locator('[data-music-enchant-slot="Instrument"][data-music-enchant-side="prefix"]').select_option('Polyphony')
  prefix=page.locator('[data-music-enchant-roll="prefix"]')
  assert [x.get_attribute('value') for x in prefix.locator('option').all()]==['6','7','8','9']
  prefix.select_option('9')
  page.locator('[data-music-enchant-slot="Instrument"][data-music-enchant-side="suffix"]').select_option('Tempo')
  suffix=page.locator('[data-music-enchant-roll="suffix"]')
  assert [x.get_attribute('value') for x in suffix.locator('option').all()]==['4','5']
  suffix.select_option('5')
  page.locator('[data-music-instrument-stat="musicSpecialUpgrades"]').select_option('5.5')
  assert page.locator('[data-music-gear-action="auto-item"][data-music-gear-slot="Instrument"]').count()==0
  # Re-render should preserve the expanded extra section and totals.
  assert page.locator('.music-calc-extra').evaluate('(e)=>e.open'),f'{w}: collapsed on gear edit'
  page.locator('[data-music-gear-action="close"]').first.click() if page.locator('[data-music-gear-action="close"]').count() else page.locator('[data-music-gear-action="next"]').click()
  # Confirm BFO and Vivace benefit, March/Harvest/Enduring/Lullaby do not:
  # comparison is performed against the same configured physical instrument with upgrade off/on.
  def result_for(key):
   page.locator('[data-music-input="musicSkillBaseEffectKey"]').select_option(key)
   return page.locator('.music-result-strip strong').nth(1).inner_text()
  values={k:result_for(k) for k in ['bo_damage','vivace_speed','enduring_def','march_ally','harvest_solo','lullaby_damage']}
  page.locator('[data-music-gear-action="edit"][data-music-gear-slot="Instrument"]').click()
  page.locator('[data-music-instrument-stat="musicSpecialUpgrades"]').select_option('0')
  page.locator('[data-music-gear-action="close"]').first.click() if page.locator('[data-music-gear-action="close"]').count() else page.locator('[data-music-gear-action="next"]').click()
  other={k:result_for(k) for k in values}
  assert values['bo_damage']!=other['bo_damage'],(w,values,other)
  assert values['vivace_speed']!=other['vivace_speed'],(w,values,other)
  for k in ['enduring_def','march_ally','harvest_solo','lullaby_damage']:assert values[k]==other[k],(w,k,values[k],other[k])
  assert page.locator('.music-calc-extra').evaluate('(e)=>e.open'),f'{w}: panel not open after comparison'
  assert not errors,errors[:5]
  print('PASS music 0.3.12c',w,'panel retention / EN UI / instrument roll options / BFO+Vivace scope')
  page.close()
 browser.close()
