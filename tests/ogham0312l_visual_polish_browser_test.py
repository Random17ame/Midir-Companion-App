"""Check quality thresholds, independent lock appearance and keyboard/touch behavior."""
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390,320):
  page=browser.new_page(viewport={'width':width,'height':850},has_touch=width<500)
  page.set_content('<html><body><div id="ogham-sim-root" class="ogham-system"></div></body></html>')
  page.add_style_tag(content=(BASE/'Companion Files/styles.css').read_text())
  for src in ('ogham-effect-levels.js','ogham-runes.js'):
   page.add_script_tag(content=(BASE/'Companion Files'/src).read_text())
  page.evaluate('''()=>{window.MIDIR_REFORGE={getGold:()=>1000000};window.MIDIR_HERBS={getState:()=>({counts:{base:99,mana:99,bloody:99,sunlight:99,golden:99}})};window.lang='en';window.MIDIR_I18N={language:()=>lang};window.s=MIDIR_OGHAM.init({});window.sim=MIDIR_OGHAM.simInit(s);const pool=MIDIR_OGHAM.allowed(sim.word,null,s);const a=pool.filter(x=>MIDIR_OGHAM.maxEffectLevel(x)===10),b=pool.filter(x=>MIDIR_OGHAM.maxEffectLevel(x)===20);sim.lines=[{id:a[0].id,level:9},{id:b[0].id,level:18},{id:b[1].id,level:17}];sim.locks=[];MIDIR_OGHAM.mountSim(s,()=>{});}''')
  rows=page.locator('.ogham-sim-line'); locks=page.locator('[data-og-sim-lock]')
  assert rows.count()==3 and page.locator('.ogham-sim-line.is-high').count()==2
  assert page.locator('.ogham-sim-line.is-perfect').count()==0
  assert rows.nth(2).evaluate('(e)=>!e.classList.contains("is-high")')
  before=rows.first.locator('strong').evaluate('(e)=>getComputedStyle(e).color')
  (locks.first.tap() if width<500 else locks.first.click())
  assert locks.first.get_attribute('aria-pressed')=='true'
  assert rows.first.evaluate('(e)=>e.classList.contains("is-locked")&&e.classList.contains("is-high")')
  assert rows.first.locator('strong').evaluate('(e)=>getComputedStyle(e).color')==before
  assert '10,000' in page.locator('#ogham-sim-price').inner_text()
  locks.first.press('Space')
  assert locks.first.get_attribute('aria-pressed')=='false'
  page.evaluate('''()=>{sim.lines[0].level=10;sim.lines[1].level=20;MIDIR_OGHAM.mountSim(s,()=>{})}''')
  assert page.locator('.ogham-sim-line.is-perfect').count()==2
  for lang,expected in [('ko','잠금 해제'),('es','Desbloquear'),('en','Unlock')]:
   page.evaluate('(l)=>{window.lang=l;MIDIR_OGHAM.mountSim(s,()=>{})}',lang)
   locks.first.click();assert expected in locks.first.get_attribute('aria-label');locks.first.click()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  print('PASS quality, lock icons, touch/keyboard and localized lock labels',width,flush=True)
  page.close()
 browser.close()
