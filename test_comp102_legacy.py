from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re
folder=Path('/mnt/data/_comp102_work')
html=(folder/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">','<style>'+ (folder/'styles.css').read_text()+'</style>')
html=re.sub(r'<script src="([\w.-]+\.js)"></script>',lambda m:'<script>'+ (folder/m.group(1)).read_text().replace('</script>','<\\/script>')+'</script>',html)
legacy={'category':'Hat','gold':845000,'assistPotions':7,'ducats':97,'dazzlingTools':2,'noLimitRolls':108,'chest':[{'id':'item-1','name':'Hat','category':'Hat','lines':[],'obtainedAttempt':12}],'listings':[],'sales':[],'attempts':108,'nextItemId':2}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1100,'height':800})
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.goto('about:blank')
 page.evaluate('(s)=>{const m=new Map();m.set("midir-reforge-sandbox-v1",JSON.stringify(s));Object.defineProperty(window,"localStorage",{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),key:i=>Array.from(m.keys())[i],get length(){return m.size}}})}',legacy)
 page.set_content(html,wait_until='domcontentloaded')
 page.wait_for_timeout(750)
 state=page.evaluate('window.MIDIR_REFORGE.getState()')
 assert state['assistPotions']==7
 assert state['gold']==845000 and state['ducats']==97 and state['dazzlingTools']==2
 assert len(state['chest'])==1 and state['noLimitRolls']==108
 page.locator('nav [data-page="rotation"]').click()
 page.locator('.rotation-arcana-picker select').select_option('ev')
 page.locator('[data-act="hub:reforge"]').click()
 assert page.locator('.reforge-currency-strip strong').last.inner_text()=='7'
 assert page.evaluate('window.MIDIR_REFORGE.exportState().assistPotions')==7
 print('Companion 101 local saved potion count still intact:',state['assistPotions'])
 print('loaded old chest:',len(state['chest']),'items, gold:',state['gold'],'ducats:',state['ducats'],'dazzling:',state['dazzlingTools'])
 print('errors',errs)
 assert not errs
 b.close()
