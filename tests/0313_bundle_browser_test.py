"""Companion 0.3.13: production importer/viewer in offline Chromium with a storage test double. Real navigation is blocked in the test environment."""
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import sys, tempfile, zipfile, json, hashlib, re
root=Path(__file__).resolve().parents[1]
fixture_temp=tempfile.TemporaryDirectory();fixtures=Path(fixture_temp.name)
with zipfile.ZipFile(root/'tests/fixtures/Midir-49.a-Companion-Fixtures.zip') as z:z.extractall(fixtures)
with zipfile.ZipFile(fixtures/'single.zip') as z:
 manifest=json.loads(z.read('manifest.json'));original=z.read(manifest['sessions'][0]['path']).decode()
for name in ('revision','bad-hash','no-hash','bad-schema','bad-id','unsafe','bad-payload'):
 m=json.loads(json.dumps(manifest));e=m['sessions'][0];html=original
 if name=='revision':
  html=html.replace('"exporterVersion":"49.a"','"exporterVersion":"49.b"',1);m['exporterVersion']='49.b';raw=re.search(r'<script[^>]*id="data"[^>]*>(.*?)</script>',html,re.S).group(1);e['payloadSha256']=hashlib.sha256(raw.encode()).hexdigest();e['fileSha256']=hashlib.sha256(html.encode()).hexdigest();assert html!=original
 elif name=='bad-hash':e['fileSha256']='0'*64
 elif name=='bad-payload':e['payloadSha256']='0'*64
 elif name=='no-hash':del e['fileSha256'];del e['payloadSha256']
 elif name=='bad-schema':m['schemaVersion']=2
 elif name=='bad-id':e['id']='recording-'+'f'*32
 elif name=='unsafe':e['path']='../test.html'
 with zipfile.ZipFile(fixtures/(name+'.zip'),'w',zipfile.ZIP_DEFLATED) as out:out.writestr('manifest.json',json.dumps(m));out.writestr(e['path'],html)
# Keep the original fixture bytes unchanged; this malicious file is a separate security test.
(fixtures/'malicious.html').write_text(original.replace('<head>','<head><img src="https://example.invalid/pixel"><script src="https://example.invalid/remote.js"></script>',1).replace('</body>','<script>try{parent.localStorage.setItem("testEscape","yes")}catch{};fetch("https://example.invalid/fetch").catch(()=>{});setTimeout(()=>location.href="https://example.invalid/navigation",500)</script></body>'))

soup=BeautifulSoup((root/'Midir Companion.html').read_text(),'html.parser');scripts=[e['src'] for e in soup.find_all('script') if e.get('src') and e['src']!='pwa.js']
for e in list(soup.find_all(['script','link','base'])):e.decompose()
app=(root/'Companion Files/app.js').read_text(); needle='const reportStorageReady=reportStorageInitialize().finally(()=>render());'; assert needle in app
mock='''const __stores={details:new Map(),reports:new Map(),cold:new Map()};
openVaultDb=async()=>({close(){},transaction(names,mode){const tx={oncomplete:null,onerror:null,onabort:null,objectStore(name){const map=__stores[name];return {put(v,k){map.set(k,structuredClone(v))},delete(k){map.delete(k)},get(k){const req={result:map.get(k)};queueMicrotask(()=>req.onsuccess?.());return req},count(){const req={result:map.size};queueMicrotask(()=>req.onsuccess?.());return req}}}};setTimeout(()=>tx.oncomplete?.(),0);return tx}});
'''
app=app.replace(needle,mock+needle)
needle='companionApplyAppearance();\nrender();\n\n})();'; assert needle in app
app=app.replace(needle,'''window.__bundleAudit={ready:reportStorageReady,readHtml,open: viewReportInline,records:()=>state.reports,archive:archiveToggle,run:filesSelectedVault,stores:__stores,action,save,hydrate:reportStorageInitialize,profile:()=>state,render,parseReport,reloadIndex:async()=>{const saved=JSON.parse(localStorage.getItem(storeKey));state.reports=saved.reports;state.reportStorage=saved.reportStorage;await reportStorageInitialize()}};\n'''+needle)
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 def boot(width=1200):
  pg=b.new_page(viewport={'width':width,'height':900},is_mobile=width<600,has_touch=width<600,user_agent='Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/125.0 Mobile Safari/537.36' if width<600 else None);errors=[];pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('dialog',lambda d:d.accept());pg.set_content(str(soup));pg.add_style_tag(content=(root/'Companion Files/styles.css').read_text());pg.evaluate("""()=>{const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>{if(window.__failNextProfileSave&&k==='midir-companion-01'){window.__failNextProfileSave=false;throw Error('simulated quota failure')}m.set(k,String(v))},removeItem:k=>m.delete(k),clear:()=>m.clear(),key:i=>[...m.keys()][i]||null,get length(){return m.size}}});}""")
  for src in scripts:pg.add_script_tag(content=app if src=='app.js' else (root/'Companion Files'/src).read_text())
  pg.evaluate('()=>__bundleAudit.ready');pg.context.set_offline(True);pg.evaluate('()=>{__bundleAudit.profile().settings.secretSauce=true;__bundleAudit.render()}');return pg,errors
 pg,errors=boot();print('loaded',errors,flush=True)
 def imp(pg,name,counts=None):
  # Actual chooser dispatch; wait for summary after progress. Read each file via real browser File API.
  pg.evaluate("document.querySelector('#notice').textContent=''")
  pg.locator('#reports-picker').set_input_files(str(fixtures/name));pg.wait_for_function("document.querySelector('#notice')?.textContent.includes('rejected') && !document.querySelector('#notice')?.textContent.match(/\\.zip: \\d+\\//)",timeout=120000);note=pg.locator('#notice').inner_text();print(name,note,pg.evaluate('__bundleAudit.records().length'),flush=True)
  if counts: assert note.startswith(counts),(note,counts)
 imp(pg,'single.zip','1 imported · 0 duplicates');assert pg.evaluate('__bundleAudit.records().length')==1
 rid=pg.evaluate('__bundleAudit.records()[0].id');assert pg.evaluate('(id)=>__bundleAudit.readHtml(id)',rid)==(fixtures/'individual.html').read_text()
 imp(pg,'individual.html','0 imported · 1 duplicates');assert pg.evaluate('__bundleAudit.records().length')==1
 imp(pg,'overlap-a.zip','1 imported · 1 duplicates');imp(pg,'overlap-b.zip','1 imported · 1 duplicates');assert pg.evaluate('__bundleAudit.records().length')==3
 imp(pg,'standard.zip','0 imported · 3 duplicates');imp(pg,'store.zip','0 imported · 3 duplicates');assert pg.evaluate('__bundleAudit.records().length')==3
 imp(pg,'one-player.zip','0 imported · 0 duplicates · 0 revisions · 1 scope variants');assert pg.evaluate('__bundleAudit.records().length')==3
 imp(pg,'revision.zip','0 imported · 0 duplicates · 1 revisions');imp(pg,'revision.zip','0 imported · 1 duplicates');imp(pg,'no-hash.zip','0 imported · 1 duplicates');assert pg.evaluate('__bundleAudit.records().length')==3
 assert pg.evaluate('__bundleAudit.records()[0].bundleHistory.length')==3
 pg.evaluate('()=>__bundleAudit.reloadIndex()');assert pg.evaluate('__bundleAudit.records()[0].bundleHistory.length')==3
 for n in ('bad-hash.zip','bad-schema.zip','bad-id.zip','unsafe.zip','bad-payload.zip'):imp(pg,n,'0 imported · 0 duplicates · 0 revisions · 0 scope variants · 0 unsupported · 1 rejected')
 imp(pg,'retired-49-json.zip','0 imported · 0 duplicates · 0 revisions · 0 scope variants · 3 unsupported');imp(pg,'legacy.zip');
 assert pg.evaluate('(id)=>__bundleAudit.readHtml(id)',rid)==(fixtures/'individual.html').read_text()
 pg.evaluate('(id)=>__bundleAudit.open(id)',rid);fr=pg.frame_locator('.vault-report-frame');fr.locator('#chart').wait_for();print('viewer',fr.locator('#title').inner_text(),fr.locator('#view-select option').count(),flush=True)
 print('view opts',fr.locator('#view-select option').all_text_contents(),flush=True);print('enc options',fr.locator('#encounter option').all_text_contents(),flush=True)
 if fr.locator('#view-select option').count()>1:fr.locator('#view-select').select_option(index=1)
 assert fr.locator('#chart').count()==1
 fr.locator('.player-panel summary').first.click() if fr.locator('.player-panel').first.get_attribute('open') is None else None
 fr.locator('.skill-select').first.click();assert fr.locator('#skill-highlight-label').is_visible();assert 'recorded hits' in fr.locator('#skill-highlight-label').inner_text()
 fr.locator('#skill-highlight-clear').click();assert not fr.locator('#skill-highlight').is_visible()
 if fr.locator('#chart .dot').count():
  fr.locator('#chart .dot').first.hover();assert fr.locator('#tip').is_visible()
 pg.evaluate('(id)=>__bundleAudit.archive(id)',rid);assert pg.evaluate('(id)=>__bundleAudit.readHtml(id)',rid)==(fixtures/'individual.html').read_text();assert not errors,errors
 # Scope order independence, 128 batch and retained HTML after automatic archive.
 pg.close();pg,errors=boot(390);imp(pg,'one-player.zip','1 imported');imp(pg,'single.zip','0 imported · 0 duplicates · 0 revisions · 1 scope variants');assert pg.evaluate('__bundleAudit.records()[0].bundleIdentity.scope.playerId') is None
 rid=pg.evaluate('__bundleAudit.records()[0].id');assert pg.evaluate('(id)=>__bundleAudit.readHtml(id)',rid)==(fixtures/'individual.html').read_text()
 pg.evaluate('(id)=>__bundleAudit.open(id)',rid);fr=pg.frame_locator('.midir-report-reader-frame');fr.locator('#chart').wait_for();pg.locator('[data-report-reader="in"]').click();assert pg.locator('.midir-report-zoom-label').inner_text()=='150%';pg.locator('[data-report-reader="close"]').click()
 pg.close();pg,errors=boot(390);imp(pg,'legacy.zip','1 imported');pg.close();pg,errors=boot(390);imp(pg,'large.zip','128 imported');print('large',pg.evaluate('({count:__bundleAudit.records().length,html:__bundleAudit.stores.reports.size,archived:__bundleAudit.records().filter(r=>r.archived).length,compact:__bundleAudit.records().filter(r=>r.archiveCompact).length})'),flush=True);assert pg.evaluate('__bundleAudit.records().length')==128;assert pg.evaluate('__bundleAudit.stores.reports.size')==128;assert not pg.evaluate('__bundleAudit.records().some(r=>r.archiveCompact)');assert not errors,errors
 # Deliberate localStorage quota failure: neither a new record nor original HTML remains committed.
 pg.close();pg,errors=boot();pg.evaluate('window.__failNextProfileSave=true');imp(pg,'single.zip','0 imported · 0 duplicates · 0 revisions · 0 scope variants · 0 unsupported · 1 rejected');assert pg.evaluate('__bundleAudit.records().length')==0;assert pg.evaluate('__bundleAudit.stores.reports.size')==0;assert pg.evaluate('__bundleAudit.stores.details.size')==0
 # Actual drag/drop event through Vault, with the same File API bytes.
 import base64
 data=base64.b64encode((fixtures/'single.zip').read_bytes()).decode();pg.evaluate('document.querySelector("#notice").textContent=""');pg.evaluate('''data=>{const dt=new DataTransfer();dt.items.add(new File([Uint8Array.from(atob(data),x=>x.charCodeAt(0))],'single.zip'));document.querySelector('#drop').dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}))}''',data);pg.wait_for_function("document.querySelector('#notice')?.textContent.startsWith('1 imported')");assert pg.evaluate('__bundleAudit.records().length')==1
 # Viewer CSP: observe remote requests and sandbox access; stored original is never edited.
 pg.close();pg,errors=boot();requests=[];failures=[];routes=[];logs=[];pg.on('request',lambda req:requests.append(req.url));pg.on('requestfailed',lambda req:failures.append((req.url,req.failure)));pg.route('https://example.invalid/**',lambda route:(routes.append(route.request.url),route.abort()));pg.on('console',lambda msg:logs.append(msg.text));imp(pg,'malicious.html','1 imported');rid=pg.evaluate('__bundleAudit.records()[0].id');pg.evaluate('(id)=>__bundleAudit.open(id)',rid);pg.wait_for_timeout(900);assert not routes,routes;assert all((u,'csp') in failures for u in requests if 'example.invalid' in u),failures;assert pg.evaluate('localStorage.getItem("testEscape")') is None;assert any('Content Security Policy' in msg for msg in logs),logs;assert pg.evaluate('(id)=>__bundleAudit.readHtml(id)',rid)==(fixtures/'malicious.html').read_text()
 print('PASS storage rollback, drag/drop, viewer CSP; DONE',flush=True);b.close()
