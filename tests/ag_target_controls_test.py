"""AG Target Frames: independent line, enemy-locked Heavy Artillery, ground-placed fields."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import sys
root=Path(sys.argv[1]).resolve()
script=(root/'Companion Files'/'frame-bowling.js').read_text(encoding='utf8')
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1200,'height':900})
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content('<div id="fb-host"></div>')
    page.add_script_tag(content=script)
    page.evaluate("() => {MIDIR_FRAMES.begin('ag'); document.querySelector('#fb-host').innerHTML=MIDIR_FRAMES.view('ag'); MIDIR_FRAMES.bind('ag')}")
    assert page.locator('#fb-line-enabled').is_checked()
    assert not page.locator('#fb-heavy-enabled').is_checked()
    page.locator('#fb-heavy-enabled').check()
    assert page.locator('#fb-stage circle[r="72"]').count()==1
    first=page.locator('#fb-heavy-target option').first.get_attribute('value')
    circles=page.locator(f'#fb-stage [data-fb-target="{first}"] circle')
    cx=float(circles.get_attribute('cx'));cy=float(circles.get_attribute('cy'))
    ring=page.locator('#fb-stage circle[r="72"]')
    assert float(ring.get_attribute('cx'))==cx and float(ring.get_attribute('cy'))==cy
    initial_poly=page.locator('#fb-stage > polygon').first.get_attribute('points')
    page.locator('#fb-angle').fill('72')
    assert page.locator('#fb-stage > polygon').first.get_attribute('points')!=initial_poly
    ring=page.locator('#fb-stage circle[r="72"]')
    assert float(ring.get_attribute('cx'))==cx and float(ring.get_attribute('cy'))==cy, 'Rotation moved heavy target'
    # Set a different live target via the independent selector.
    second=page.locator('#fb-heavy-target option').nth(1).get_attribute('value')
    page.locator('#fb-heavy-target').select_option(second)
    enemy=page.locator(f'#fb-stage [data-fb-target="{second}"] circle')
    assert page.locator('#fb-stage circle[r="72"]').get_attribute('cx')==enemy.get_attribute('cx')
    # Enemies also selectable directly by clicking their circle.
    page.locator(f'#fb-stage [data-fb-target="{first}"] circle').click(force=True)
    assert page.locator('#fb-heavy-target').input_value()==first
    # Field placement is independent of selected enemy and aim.
    heavy_before=page.locator('#fb-stage circle[r="72"]').get_attribute('cx')
    line_before=page.locator('#fb-stage > polygon').first.get_attribute('points')
    page.locator('[data-fb="field"]').click()
    assert 'Cancel field placement' in page.locator('[data-fb="field"]').inner_text()
    stage=page.locator('#fb-stage')
    bbox=stage.bounding_box()
    page.mouse.click(bbox['x']+bbox['width']*.8,bbox['y']+bbox['height']*.85)
    assert page.locator('#fb-stage circle[stroke="#ffce87"]').count()==1
    assert page.locator('#fb-stage circle[r="72"]').get_attribute('cx')==heavy_before
    assert page.locator('#fb-stage > polygon').first.get_attribute('points')==line_before
    page.locator('#fb-line-enabled').uncheck()
    assert page.locator('#fb-stage > polygon').count()==0
    assert page.locator('#fb-stage circle[r="72"]').count()==1
    # When neither attack is enabled, Fire cannot consume a shot.
    page.locator('#fb-heavy-enabled').uncheck()
    assert page.locator('[data-fb="fire"]').is_disabled()
    page.locator('#fb-heavy-enabled').check()
    page.locator('[data-fb="fire"]').click()
    assert 'Shot 1:' in page.locator('#fb-message').inner_text()
    assert not errors,errors
    # AS selector and geometry remain unaffected.
    page.evaluate("() => {MIDIR_FRAMES.begin('as');document.querySelector('#fb-host').innerHTML=MIDIR_FRAMES.view('as');MIDIR_FRAMES.bind('as')}")
    assert page.locator('#fb-attack').count()==1
    assert page.locator('#fb-heavy-enabled').count()==0
    page.locator('#fb-attack').select_option('cone')
    assert page.locator('#fb-stage > polygon').count()==1
    assert not errors,errors
    print('PASS independent AG Heavy Artillery target, line origin/aim, Demolition placement, click targeting, fire gating; AS unchanged')
    browser.close()
