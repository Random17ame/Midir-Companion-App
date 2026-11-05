"""Ensure delegated actions behave like build 261 after rerenders and dynamic insertion."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
soup=BeautifulSoup((root/'Midir Companion.html').read_text(encoding='utf-8'),'html.parser')
scripts=[tag['src'] for tag in soup.find_all('script') if tag.get('src')]
for tag in list(soup.find_all(['script','link','base'])):tag.decompose()
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page()
    page.set_default_timeout(2000)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(str(soup))
    for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text(encoding='utf-8'))
    page.locator('nav button[data-page="debuff"]').click()
    # Clicking a button dynamically inserted after bind() must dispatch correctly.
    page.evaluate("""() => {const b=document.createElement('button');b.id='dynamic-action';b.dataset.act='acad-mode:rotation';b.textContent='Go to lesson';document.querySelector('#app').append(b)}""")
    page.locator('#dynamic-action').click()
    assert 'Build the Debuff Opening' in page.locator('#app').inner_text()
    # Must be handled exactly once, even after several full DOM rebuilds.
    for _ in range(3):
        page.locator('button[data-act="acad-next"]').click()
        page.locator('button[data-act="acad-prev"]').click()
    page.locator('button[data-act="acad-reviewed"]').click()
    page.locator('button[data-act="acad-mode:home"]').click()
    txt=page.locator('#app').inner_text()
    assert '1 practice rounds completed' in txt,repr(txt[-850:])
    # Test an injected button with a nested child, as in icon-rich buttons.
    page.evaluate("""() => {const b=document.createElement('button');b.dataset.act='acad-mode:missing';b.id='dynamic-nested';b.innerHTML='<span>Open</span>';document.querySelector('#app').append(b)}""")
    page.locator('#dynamic-nested span').click()
    assert 'New Debuff, Who This?' in page.locator('#app').inner_text()
    assert not errors,repr(errors)
    print('PASS dynamically added buttons, nested targets, rerenders, single dispatch and no page errors')
    browser.close()
