"""0.3.11c Murias Water per-item +1, set override, shared copies, and legacy migration."""
from pathlib import Path
import json
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[el.get('src') for el in soup.select('script[src]')]
for el in list(soup.find_all(['script','link','base'])):el.decompose()

def page_for(browser, w=390, h=844, saved=None):
    p=browser.new_page(viewport={'width':w,'height':h},is_mobile=w<600,has_touch=w<600,device_scale_factor=1)
    errors=[];p.on('pageerror', lambda e:errors.append(str(e)))
    p.set_content(str(soup),wait_until='load')
    if saved is not None:
        p.evaluate("(saved)=>{const db={...saved};window.__db=db;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k]}})}", saved)
    for name in ['styles.css','theta-rhythm.css','vertrag-survival.css']:
        p.add_style_tag(content=(root/'Companion Files'/name).read_text())
    for src in scripts:p.add_script_tag(content=(root/'Companion Files'/src).read_text())
    p.locator('nav button[data-page="rotation"]').click()
    p.locator('#rotation-lab-arcana').select_option('hs')
    p.locator('button[data-act="hub:music-lie"]').click()
    assert not errors,errors
    return p,errors

def edit(p,slot):p.locator(f'[data-music-gear-action="edit"][data-music-gear-slot="{slot}"]').click()
def close(p):p.locator('[data-music-gear-action="close"]').first.click()
def murias(p):
    return p.locator('.music-gear-murias-total').inner_text()
def enable(p,slot):
    edit(p,slot)
    p.locator(f'[data-music-gear-murias="{slot}"]').check()
    close(p)

with sync_playwright() as pw:
    b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for w,h in [(320,568),(390,844),(844,390)]:
        p,errs=page_for(b,w,h)
        assert '+0 / 7 slots' in murias(p), murias(p)
        assert p.locator('[data-music-murias-override]').input_value()==''
        assert p.locator('.music-gear-item').count()==8
        edit(p,'Wings')
        assert p.locator('[data-music-gear-murias]').count()==0
        close(p)
        for slot in ['Accessory 1','Accessory 2','Hat','Body','Boots','Gloves','Instrument']:
            enable(p,slot)
        assert '+7 / 7 slots' in murias(p), murias(p)
        assert 'Applied +7' in murias(p), murias(p)
        # Override remains the authority and does not modify the physical items.
        override=p.locator('[data-music-murias-override]')
        override.fill('2');override.dispatch_event('change')
        assert 'Applied +2' in murias(p)
        assert '+7 / 7 slots' in murias(p)
        override=p.locator('[data-music-murias-override]')
        override.fill('0');override.dispatch_event('change')
        assert 'Applied +0' in murias(p)
        p.locator('[data-music-gear-action="auto-murias"]').click()
        assert 'Applied +7' in murias(p)
        assert not errs, errs
        assert p.evaluate('document.documentElement.scrollWidth <= innerWidth+3'),(w,h)
        print(f'{w}x{h} seven eligible slots, Wing excluded, override zero/reset, no overflow: PASS')
        p.close()

    p,errs=page_for(b,390,844,{'midir-companion-01':json.dumps({})})
    enable(p,'Instrument')
    assert 'Applied +1' in murias(p)
    p.locator('.music-gear-more > summary').click()
    p.locator('[data-music-gear-action="copy-tab"]').click()
    assert 'Applied +1' in murias(p)
    edit(p,'Instrument')
    assert p.locator('[data-music-gear-murias="Instrument"]').is_checked()
    p.locator('[data-music-gear-murias="Instrument"]').uncheck()
    close(p)
    p.locator('[data-music-gear-tab="set-1"]').click()
    assert 'Applied +0' in murias(p), 'Shared item should reflect edit in all tabs'
    p.locator('[data-music-gear-tab]').last.click()
    edit(p,'Instrument')
    p.locator('[data-music-gear-action="copy-item"][data-music-gear-slot="Instrument"]').click()
    p.locator('[data-music-gear-murias="Instrument"]').check()
    close(p)
    assert 'Applied +1' in murias(p)
    p.locator('[data-music-gear-tab="set-1"]').click()
    assert 'Applied +0' in murias(p), 'A physical copy should be independently editable'
    saved=p.evaluate('({...window.__db})')
    p.close()
    p,errs=page_for(b,390,844,saved)
    assert 'Applied +0' in murias(p)
    p.locator('[data-music-gear-tab]').last.click()
    assert 'Applied +1' in murias(p)
    assert not errs,errs
    p.close()
    print('Shared vs copied physical item and simulated save/reload: PASS')

    # Old 0.3.11b state had a global numeric input; do not silently distribute it.
    p,errs=page_for(b,390,844,{'midir-companion-01':json.dumps({'musicBuffLab':{'inputs':{'musicMuriasWater':4}}})})
    assert p.locator('[data-music-murias-override]').input_value()=='4'
    assert 'Applied +4' in murias(p) and '+0 / 7 slots' in murias(p)
    enable(p,'Gloves')
    assert 'Applied +4' in murias(p) and '+1 / 7 slots' in murias(p)
    p.locator('[data-music-gear-action="auto-murias"]').click()
    assert 'Applied +1' in murias(p),murias(p)
    assert not errs,errs
    p.close()
    print('Legacy numeric input migrated visibly, never double-counted: PASS')
    b.close()
