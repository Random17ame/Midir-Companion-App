"""Migrated 0.3.11a global set bonus competes under the same BFO effect name."""
from pathlib import Path
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[t.get('src') for t in soup.select('script[src]')]
for t in list(soup.find_all(['script','link','base'])):t.decompose()
legacy={'musicBuffLab':{'inputs':{'troubadourSetEffectBuff':5}}}
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(str(soup),wait_until='load')
 page.evaluate("(saved)=>{const data={'midir-companion-01':JSON.stringify(saved)};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>delete data[k]}})}",legacy)
 for name in scripts:page.add_script_tag(content=(root/'Companion Files'/name).read_text())
 page.locator('nav button[data-page="rotation"]').click()
 page.locator('#rotation-lab-arcana').select_option('hs')
 page.locator('button[data-act="hub:music-lie"]').click()
 def stat(key):
  page.locator('[data-music-input="musicSkillBaseEffectKey"]').select_option(key)
  return float(page.locator('.music-result-strip > div').first.locator('strong').inner_text().replace(',',''))
 baseline_bo=stat('bo_damage');baseline_enduring=stat('enduring_def')
 assert 'Legacy Battlefield Overture' in page.locator('.music-gear-unassigned').inner_text()
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Body"]').click()
 page.locator('select[data-music-gear-set-effect="Body"]').select_option('troubadour-body')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert stat('bo_damage')==baseline_bo, 'Legacy +5 wins against Troubadour +3'
 assert stat('enduring_def')==baseline_enduring+3, 'Troubadour Enduring continues independently'
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Gloves"]').click()
 page.locator('select[data-music-gear-set-effect="Gloves"]').select_option('seraphic-bangles')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert stat('bo_damage')==baseline_bo, 'Seraphic +5 and legacy +5 do not stack'
 page.locator('[data-music-gear-action="clear-legacy-set"]').click()
 assert stat('bo_damage')==baseline_bo, 'Without legacy Seraphic still supplies +5'
 page.locator('button[data-music-gear-action="edit"][data-music-gear-slot="Gloves"]').click()
 page.locator('select[data-music-gear-set-effect="Gloves"]').select_option('')
 page.locator('button[data-music-gear-action="close"]').first.click()
 assert stat('bo_damage')==baseline_bo-2, 'Removing Seraphic restores Troubadour BFO +3'
 assert stat('enduring_def')==baseline_enduring+3
 assert not errors,errors
 print('Legacy same-name set-bonus migration precedence: PASS')
 b.close()
