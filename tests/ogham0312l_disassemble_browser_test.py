"""Isolated UI: Rune rerolls cannot be edited; Disassemble pays partial chest refund."""
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':850},has_touch=width<500)
  page.set_content('<!doctype html><html><head></head><body><div id="ogham-sim-root"></div></body></html>')
  page.add_style_tag(content=(BASE/'Companion Files/styles.css').read_text())
  for src in ('ogham-effect-levels.js','ogham-runes.js'):
   page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.evaluate('''() => {window.bank={gold:1000000,herbs:{base:100,mana:100,bloody:100,sunlight:100,golden:100}};
    window.MIDIR_REFORGE={getGold:()=>bank.gold,spendGold:(n)=>{if(bank.gold<n)return false;bank.gold-=n;return true},creditGold:(n)=>{bank.gold+=n;return true}};
    window.MIDIR_HERBS={catalog:[{id:'base',name:'Base Herb'}],getState:()=>({counts:bank.herbs}),spendHerbs:(recipe)=>{for(const [k,n] of Object.entries(recipe))if((bank.herbs[k]||0)<n)return false;for(const [k,n] of Object.entries(recipe))bank.herbs[k]-=n;return true},addHerbs:(k,n)=>{bank.herbs[k]=(bank.herbs[k]||0)+n;return n}};
    window.state=window.MIDIR_OGHAM.init({});window.MIDIR_OGHAM.mountSim(state,()=>{});
  }''')
  assert page.locator('[data-og-sim-line], [data-og-sim-level]').count()==0
  assert page.locator('.ogham-sim-line-readout').count()==3
  page.locator('#ogham-sim-roll').click()
  assert 'Rerolls' in page.locator('.ogham-sim-totals').inner_text()
  assert page.locator('.ogham-sim-line-readout strong').first.inner_text()!='Reroll to generate attributes'
  page.locator('#ogham-sim-save').click()
  assert page.locator('#ogham-sim-disassemble').count()==1
  page.locator('#ogham-sim-disassemble').click()
  assert 'Confirm disassemble' in page.locator('#ogham-sim-disassemble').inner_text()
  page.locator('#ogham-sim-disassemble').click()
  assert page.locator('#ogham-sim-disassemble').count()==0
  assert page.evaluate('bank.gold')==995050
  assert page.evaluate('state.simulatedRunes.length')==0
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  print('PASS 0.3.12l Disassemble and auto rolled-line UI',width,flush=True)
  page.close()
 browser.close()
