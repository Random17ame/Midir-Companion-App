"""0.3.11 saved state migration, shared-item safety, and reload via localStorage mock."""
from pathlib import Path
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t.get('src') for t in soup.select('script[src]')]
for t in list(soup.find_all(['script','link','base'])):t.decompose()
legacy={'musicBuffLab':{'enchantManual':True,'enchantGear':{'Accessory 1':{'prefix':{'name':'Dynamic','roll':2}}},'inputs':{'musicBuffEnchants':37,'musicInspiringEffect':3,'marchWalkingSpeed':8,'musicInstrumentUpgrades':9,'enduringProtectionReforge':2,'musicKnowledgeReforge':50}}}
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 def load(saved):
  p=b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
  errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.set_content(str(soup),wait_until='load')
  p.evaluate("(saved)=>{const data={...saved};window.__fakeStorage=data;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>delete data[k]}})}",saved)
  for name in scripts:p.add_script_tag(content=(root/'Companion Files'/name).read_text())
  p.locator('nav button[data-page="rotation"]').click();p.locator('#rotation-lab-arcana').select_option('hs');p.locator('button[data-act="hub:music-lie"]').click()
  assert not errors,errors
  return p
 p=load({'midir-companion-01':json.dumps(legacy)})
 # Saved 0.3.11 enchant and flat reforges load, without resurrecting duplicate input.
 assert 'Applied +37' in p.locator('.music-gear-totals').inner_text()
 assert 'Inspiring reforge +3' in p.locator('.music-gear-tier-values').inner_text()
 assert 'Legacy reforges awaiting' in p.locator('.music-gear-unassigned').inner_text()
 assert 'Music Knowledge' not in p.locator('.music-gear-unassigned').inner_text()
 assert 'marchWalkingSpeed' in p.locator('select[data-music-gear-assign]').evaluate_all('(es)=>es.map(e=>e.dataset.musicGearAssign).join(",")')
 p.locator('.music-gear-more > summary').click()
 p.locator('button[data-music-gear-action="copy-tab"]').click()
 # Allocate legacy Inspiring +3 to shared Accessory1; current tab automatically detaches.
 p.locator('select[data-music-gear-assign="musicInspiringEffect"]').select_option('Accessory 1')
 assert 'Inspiring reforge +3' in p.locator('.music-gear-tier-values').inner_text()
 assert p.locator('select[data-music-gear-assign="musicInspiringEffect"]').count()==0
 p.locator('[data-music-gear-tab="set-1"]').click()
 assert 'Inspiring reforge +3' in p.locator('.music-gear-tier-values').inner_text()
 assert p.locator('select[data-music-gear-assign="musicInspiringEffect"]').count()==1, 'Original tab should keep legacy amount without item double count'
 p.locator('[data-music-gear-tab]').last.click()
 assert 'Inspiring reforge +3' in p.locator('.music-gear-tier-values').inner_text()
 p.locator('button[data-music-gear-action="auto"]').click()
 assert 'Applied +2' in p.locator('.music-gear-totals').inner_text()
 saved=p.evaluate('({...window.__fakeStorage})')
 assert 'gearTabs' in json.loads(saved['midir-companion-01'])['musicBuffLab']
 p.close()
 q=load(saved)
 assert q.locator('[data-music-gear-tab]').count()==2
 assert 'Applied +2' in q.locator('.music-gear-totals').inner_text()
 assert 'Inspiring reforge +3' in q.locator('.music-gear-tier-values').inner_text()
 q.locator('[data-music-gear-tab="set-1"]').click()
 assert 'Applied +37' in q.locator('.music-gear-totals').inner_text()
 assert 'Legacy reforges awaiting' in q.locator('.music-gear-unassigned').inner_text()
 assert q.locator('[data-music-input="musicKnowledgeReforge"]').count()==0
 print('MUSIC 0.3.11→0.3.11a MIGRATION + RELOAD: PASS (legacy reforge attribution, shared-item detachment, override, no double count)')
 q.close();b.close()
