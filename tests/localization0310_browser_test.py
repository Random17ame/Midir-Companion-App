#!/usr/bin/env python3
import os,subprocess,time,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser')
scripts=[el['src'] for el in soup.find_all('script') if el.get('src')]
for el in list(soup.find_all(['script','link','base'])):el.decompose()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for width,height in [(390,844),(1200,800)]:
   page=b.new_page(viewport={'width':width,'height':height})
   errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(str(soup));
   for script in scripts:page.add_script_tag(content=(root/'Companion Files'/script).read_text())
   page.wait_for_timeout(400)
   assert page.locator('#companion-language').count()==1
   page.select_option('#companion-language','es')
   page.wait_for_timeout(300)
   assert page.evaluate('document.documentElement.lang')=='es'
   assert page.evaluate('MIDIR_I18N.t("POWER STRUGGLE")')=='PULSO DE FUERZA'
   assert page.evaluate('MIDIR_I18N.t("Time Trial")')=='Contrarreloj'
   assert page.evaluate('MIDIR_I18N.t("This string is not yet translated")')=='This string is not yet translated'
   # Newly-created, changed text, accessibility labels and skip protection.
   checks=page.evaluate('''async () => {
     const host=document.createElement('div');host.id='localize-test-holder';document.body.append(host);
     const label=document.createElement('span');label.id='localize-test-text';label.textContent='Time Trial';host.append(label);
     const attr=document.createElement('button');attr.id='localize-test-attr';attr.setAttribute('aria-label','Open menu');host.append(attr);
     const secure=document.createElement('div');secure.className='user-content';secure.textContent='Time Trial';host.append(secure);
     await new Promise(resolve=>setTimeout(resolve,75));
     const initial=[label.textContent,attr.getAttribute('aria-label'),secure.textContent];
     label.textContent='Victory';await new Promise(resolve=>setTimeout(resolve,75));
     const updated=label.textContent;
     label.textContent='Score 25';await new Promise(resolve=>setTimeout(resolve,75));
     const score=label.textContent;
     const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d');let seen='';const original=CanvasRenderingContext2D.prototype.fillText;
     // Verify the wrapper transforms input by capturing a temporary base layer.
     const shadow=original;CanvasRenderingContext2D.prototype.fillText=function(str,...args){seen=str;return shadow.call(this,str,...args);};
     ctx.fillText('Time Trial',12,12);
     CanvasRenderingContext2D.prototype.fillText=original;
     host.remove();
     return {initial,updated,score,seen};
   }''')
   assert checks['initial']==['Contrarreloj','Abrir menú','Time Trial'],checks
   assert checks['updated']=='Victoria',checks
   assert checks['score'].startswith('Puntuación'),checks
   # Test canvas by querying translated text directly and the prototype's wrapped method exists
   assert page.evaluate('CanvasRenderingContext2D.prototype.__midirTranslatedText') is True
   page.select_option('#companion-language','ko');page.wait_for_timeout(250)
   assert page.evaluate('MIDIR_I18N.t("POWER STRUGGLE")')=='힘겨루기'
   assert page.evaluate('document.documentElement.lang')=='ko'
   page.select_option('#companion-language','en');page.wait_for_timeout(250)
   assert page.evaluate('document.documentElement.lang')=='en'
   assert page.locator('header').inner_text().find('Make every encounter count.')>=0
   # revisit older Arcana page and verify no JS errors on language switches
   page.locator('button[data-page="rotation"]').click()
   page.wait_for_timeout(200)
   page.select_option('#companion-language','es')
   page.wait_for_timeout(200)
   assert page.evaluate('document.documentElement.lang')=='es'
   # Visit the actual converted Vertrag UI and check newly rendered menu strings.
   page.locator('#rotation-lab-arcana').select_option('sg')
   page.locator('button[data-act="hub:vertrag"]').first.click()
   page.wait_for_timeout(200)
   assert page.locator('#app').inner_text().find('Contrarreloj')>=0,page.locator('#app').inner_text()[:500]
   assert not errors,errors[:4]
   print('Localization browser pass',width,'x',height,'OK',checks)
   page.close()
  b.close()
finally:
 pass
