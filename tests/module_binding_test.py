"""Regression: standalone Arcana views attach their own controls exactly once."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys

root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(encoding='utf8'),'html.parser')
scripts=[s['src'] for s in soup.find_all('script') if s.get('src')]
for el in list(soup.find_all(['script','link','base'])):el.decompose()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page()
    page.set_default_timeout(2500)
    errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    page.set_content(str(soup))
    for src in scripts:page.add_script_tag(content=(root/'Companion Files'/src).read_text(encoding='utf8'))
    page.evaluate('''() => {
      window.bindingCounts={ev:0,crom:0,frames:0};
      for(const [api,key] of [[window.MIDIR_EV_DEFENSE,'ev'],[window.MIDIR_AS_INVADERS,'crom'],[window.MIDIR_FRAMES,'frames']]){
        const prior=api.bind;api.bind=function(...args){window.bindingCounts[key]++;return prior.apply(this,args)};
      }
    }''')
    def open_view(arc,view):
        page.locator('nav button[data-page="rotation"]').click()
        back=page.locator('[data-act="hub:home"]')
        if back.count():back.first.click()
        page.locator('#rotation-lab-arcana').select_option(arc)
        page.locator(f'[data-act="hub:{view}"]').first.click()
    def counts():return page.evaluate('window.bindingCounts')
    open_view('ev','ev-defense')
    assert counts()=={'ev':1,'crom':0,'frames':0},counts()
    open_view('as','as-invaders')
    assert counts()=={'ev':2,'crom':1,'frames':0},counts()
    open_view('as','position')
    print('at as position',counts());assert page.locator('[data-fb-enter="as"]').count()==1
    assert counts()=={'ev':2,'crom':2,'frames':0},counts()
    page.locator('[data-fb-enter="as"]').click()
    assert counts()['frames']==1,counts()
    open_view('ag','ag-position')
    assert page.locator('[data-fb-enter="ag"]').count()==1
    page.locator('[data-fb-enter="ag"]').click()
    assert counts()['frames']==3,counts()
    assert not errors,errors
    print('PASS route-specific EV, Crom and AS/AG frame binding, no duplicates and no page errors')
    browser.close()
