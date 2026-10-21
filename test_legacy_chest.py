from playwright.sync_api import sync_playwright
from pathlib import Path
f=Path('/mnt/data/_comp100_work/herb-collection.js').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page()
 page.goto('about:blank')
 page.evaluate("""() => {const mem=new Map([['midir-companion-herb-chest-v1',JSON.stringify({counts:{base:12,mana:5,mandrake:0,sunlight:0,bloody:0,poison:0,white:0,golden:3},total:20})]]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,String(v))}});}""")
 page.add_script_tag(content=f)
 print('Legacy chest:',page.evaluate('window.MIDIR_HERBS.getState().total'))
 print('Legacy item counts:',page.evaluate('window.MIDIR_HERBS.exportState().chest.counts'))
 assert page.evaluate('window.MIDIR_HERBS.getState().total')==20
 print('Import/export:',page.evaluate('window.MIDIR_HERBS.exportState().challenge'))
 b.close()
