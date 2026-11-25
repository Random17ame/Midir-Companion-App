"""0.3.12l-only correction: Awakening Levels 0–50, no changed slot/synergy rules above 20."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
BASE = Path(__file__).resolve().parents[1]
soup = BeautifulSoup((BASE/'Midir Companion.html').read_text(encoding='utf-8'), 'html.parser')
scripts = [x.get('src') for x in soup.select('script[src]')]
for el in soup.select('script[src],link[rel=stylesheet],base'):
    el.extract()
style = soup.new_tag('style')
style.append((BASE/'Companion Files/styles.css').read_text(encoding='utf-8'))
soup.head.append(style)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (1200, 390, 320):
        page = browser.new_page(viewport={'width':width, 'height':1000}, has_touch=width<500)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.set_content(str(soup),wait_until='domcontentloaded')
        page.evaluate('''() => {const records = new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>records.get(k)||null,setItem:(k,v)=>records.set(k,String(v)),removeItem:k=>records.delete(k),key:i=>[...records.keys()][i]||null,get length(){return records.size}}});}''')
        for src in scripts:
            page.add_script_tag(content=(BASE/'Companion Files'/src).read_text(encoding='utf-8'))
        page.locator('[data-page="rotation"]').first.click()
        page.locator('[data-act="hub:ogham"]').first.click()
        picker = page.locator('#ogham-awaken')
        assert picker.locator('option').count() == 51, f'Awakening options not 0–50 at {width}px'
        assert picker.locator('option').first.get_attribute('value') == '0'
        assert picker.locator('option').last.get_attribute('value') == '50'
        assert picker.input_value() == '20', 'Existing default level must remain unchanged'
        assert page.evaluate('''()=>[0,1,4,5,9,10,14,15,19,20,21,35,50].map(window.MIDIR_OGHAM.slotsAt).join(',')''') == '0,1,1,2,2,3,3,4,4,5,5,5,5'
        for level, unlocked in ((0,0),(1,1),(5,2),(10,3),(15,4),(20,5),(21,5),(35,5),(50,5)):
            page.locator('#ogham-awaken').select_option(str(level))
            assert page.locator('#ogham-awaken').input_value() == str(level)
            assert page.locator('.ogham-socket:not([disabled])').count() == unlocked, (width, level, unlocked)
        # Above 20, equipment and synergy calculations are unchanged.
        assert page.evaluate('''() => {const O=window.MIDIR_OGHAM,s=O.init({awakening:{hs:20}});
          const a=O.addRune(s,'Sail','masterwork'),b=O.addRune(s,'Óir','exquisite'),c=O.addRune(s,'Peithe','fine');
          [a,b,c].forEach((r,i)=>O.equip(s,'hs',i,r.id));
          const result=n=>{s.awakening.hs=n;return JSON.stringify({ids:O.idsFor(s,'hs'),
            recipes:O.combinations(s,'hs').map(x=>[x.points,x.ready,x.active]),
            compare:O.compareRuneSets(s,'hs').changedSlots})};
          const reference=result(20);return [21,35,50].every(x=>result(x)===reference);
        }'''), 'Above-20 equipment/combination behavior changed'
        first_arcana = page.locator('#ogham-arcana').input_value()
        assert page.locator('#ogham-awaken').input_value() == '50'
        alternate = next(v for v in page.locator('#ogham-arcana option').evaluate_all('(els)=>els.map(e=>e.value)') if v != first_arcana)
        page.locator('#ogham-arcana').select_option(alternate)
        assert page.locator('#ogham-awaken').input_value() == '20', 'Other Arcana should keep its own default'
        page.locator('#ogham-awaken').select_option('35')
        page.locator('#ogham-arcana').select_option(first_arcana)
        assert page.locator('#ogham-awaken').input_value() == '50'
        page.locator('#ogham-arcana').select_option(alternate)
        assert page.locator('#ogham-awaken').input_value() == '35'
        # Values also persist to the regular Companion profile (no new storage key).
        saved = page.evaluate('''() => JSON.parse(localStorage.getItem('midir-companion-01')||'{}').ogham?.awakening''')
        assert saved[first_arcana] == 50 and saved[alternate] == 35, saved
        assert page.evaluate('''()=>document.documentElement.scrollWidth<=window.innerWidth+1'''), 'Horizontal overflow'
        assert not errors, errors[:5]
        print(f'PASS 0.3.12l Awakening 0–50 · unchanged 5 socket thresholds · per-Arcana save · {width}px',flush=True)
        page.close()
    browser.close()
