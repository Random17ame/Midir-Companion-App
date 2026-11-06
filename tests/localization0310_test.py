#!/usr/bin/env python3
from pathlib import Path
import re,sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]
s=(root/'Companion Files/i18n.js').read_text()
for token in ['localization0310','function translateNode','MutationObserver','CanvasRenderingContext2D','const dynamic=s.match','observe();']:
 assert token in s,token
for label in ['POWER STRUGGLE','Time Trial','Destroy the cauldron!','Mana Pressure','Aim','Skill drawer','Containment Initiated']:
 assert label in s,label
for page in ['Midir Companion.html']:
 assert '0.3.11d' in (root/page).read_text()
assert 'midir-shell-311d' in (root/'service-worker.js').read_text()
assert (root/'Midir-Companion-Doccumentation/features/19-LANGUAGE-SUPPORT.md').is_file()
print('Localization legacy + 0.3.11d current-release checks passed')
