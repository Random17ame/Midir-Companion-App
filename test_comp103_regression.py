from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import re, json
folder=Path('/mnt/data/_comp103_work')
html=(folder/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+ (folder/'styles.css').read_text()+'</style>')
html=re.sub(r'<script src="([\w.-]+\.js)"></script>',lambda m:'<script>'+ (folder/m.group(1)).read_text().replace('</script>','<\\/script>')+'</script>',html)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1400,'height':920})
 errors=[]
 page.on('pageerror',lambda err: errors.append(str(err)))
 page.goto('about:blank')
 page.evaluate("""() => { const mem=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k),key:i=>Array.from(mem.keys())[i],get length(){return mem.size}}}); }""")
 page.set_content(html,wait_until='domcontentloaded',timeout=30000)
 page.wait_for_timeout(650)
 assert page.locator('.header-right .tag').inner_text()=='Companion 103 · Offline'
 page.locator('nav [data-page="rotation"]').click()
 arc=page.locator('.rotation-arcana-picker select')
 arc.select_option('bb')
 assert page.locator('[data-act="hub:bb-bandit"]').count()==1
 page.locator('[data-act="hub:bb-bandit"]').click()
 page.locator('#bb-start-hunt').click()
 print('initial card count',page.locator('[data-bb-flip]').count())
 assert page.locator('[data-bb-flip]').count()==81
 # test successful counter / charge / dodge
 for kind,key in [('counter','1'),('charge','2'),('dodge','3')]:
  page.locator(f'.bb-bandit-tile.hidden.{kind}').first.click()
  expect(page.locator(f'.bb-bandit-active.{kind}')).to_be_visible()
  assert page.locator('.bb-encounter-cue').inner_text()
  page.keyboard.press(key)
  assert 'Clean read!' in page.locator('#bb-bandit-status').inner_text(),(kind,page.locator('#bb-bandit-status').inner_text())
  print('success',kind,'ducats',page.evaluate('window.MIDIR_REFORGE.getDucats()'))
  page.wait_for_timeout(1050)
 # test wait success (no input)
 page.locator('.bb-bandit-tile.hidden.wait').first.click()
 expect(page.locator('.bb-bandit-active.wait')).to_be_visible()
 page.wait_for_timeout(2400)
 assert 'Stayed calm!' in page.locator('#bb-bandit-status').inner_text()
 print('success wait', page.evaluate('window.MIDIR_REFORGE.getDucats()'))
 page.wait_for_timeout(1000)
 # test free
 page.locator('.bb-bandit-tile.hidden.free').first.click()
 assert 'for free.' in page.locator('#bb-bandit-status').inner_text()
 page.wait_for_timeout(850)
 # wrong input should not take wallet
 before=page.evaluate('window.MIDIR_REFORGE.getDucats()')
 page.locator('.bb-bandit-tile.hidden.counter').first.click()
 page.keyboard.press('2')
 assert 'Wrong read' in page.locator('#bb-bandit-status').inner_text()
 assert page.evaluate('window.MIDIR_REFORGE.getDucats()')==before
 assert page.locator('.bb-bandit-tile.stolen').count()>=1
 print('wrong input preserved bank; stolen',page.locator('.bb-bandit-tile.stolen').count())
 page.wait_for_timeout(1100)
 page.locator('#bb-end-hunt').click()
 assert page.evaluate('window.MIDIR_BB.exportState().runs.length')==1
 # navigate to Erg, buy potion with enough gold
 page.locator('[data-act="hub:home"]').click()
 arc.select_option('mp')
 page.locator('[data-act="hub:erg"]').click()
 state=page.evaluate('window.MIDIR_REFORGE.getState()')
 state['gold']=1500000
 page.evaluate('(x)=>window.MIDIR_REFORGE.importState(x)',state)
 page.locator('#erg-new').click()
 page.locator('#erg-buy-potion').click()
 assert page.evaluate('window.MIDIR_REFORGE.getPotions()')==1
 print('erg potion bought',page.locator('.erg-wallet').inner_text())
 page.locator('#erg-use-potion').check()
 page.locator('#erg-tap').click()
 assert page.evaluate('window.MIDIR_REFORGE.getPotions()')==0
 print('erg potion consumed',page.evaluate('window.MIDIR_REFORGE.getPotions()'))
 # buy potion through shop; display in storage chest
 page.locator('[data-act="hub:home"]').click()
 arc.select_option('ev')
 page.locator('[data-act="hub:reforge"]').click()
 page.locator('#reforge-buy-potion').click()
 assert page.evaluate('window.MIDIR_REFORGE.getPotions()')==1
 chest=page.locator('.reforge-currency-strip').inner_text()
 assert 'Erg Unlock Assist Potions' in chest and page.locator('.reforge-currency-strip strong').last.inner_text()=='1', chest
 assert page.evaluate('window.MIDIR_REFORGE.exportState().assistPotions')==1
 print('reforge storage chest',chest)
 # no new changes to Dazzling store or limits
 print('tool balance',page.evaluate('window.MIDIR_REFORGE.getDazzlingTools()'),'ducats',page.evaluate('window.MIDIR_REFORGE.getDucats()'))
 page.screenshot(path='/mnt/data/_comp103_work/qa-comp102-chest.png',full_page=True)
 page.locator('[data-act="hub:home"]').click()
 arc.select_option('bb')
 page.locator('[data-act="hub:bb-bandit"]').click()
 page.screenshot(path='/mnt/data/_comp103_work/qa-comp102-bandit.png',full_page=True)
 print('page errors:',errors)
 assert not errors
 browser.close()
