"""Verify Bri Leith naming without changing importer/storage identifiers."""
from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
sources = [p for p in (root / 'Companion Files').rglob('*') if p.suffix in {'.js', '.html', '.json', '.md'}]
for path in sources:
    content = path.read_text(encoding='utf-8', errors='replace')
    for match in re.finditer(r'\bBri\s+L[a-z]+\b', content, re.IGNORECASE):
        assert match.group().lower() == 'bri leith', (path, match.group())

app = (root / 'Companion Files' / 'app.js').read_text(encoding='utf-8')
analysis = (root / 'Companion Files' / 'analysis.js').read_text(encoding='utf-8')
data = (root / 'Companion Files' / 'data.js').read_text(encoding='utf-8')
assert 'Clockwork' in app and 'Bri Leith gate' in app
assert 'Bri Leith · Gate 1' in analysis
assert all(f'Bri Leith Gate {n}' in data for n in (1,2,3))
assert all(f"'bri-g{n}'" in app or f"'bri-g{n}'" in analysis for n in (1,2,3))
print('PASS Bri Leith source names, importer labels, achievement copy, and stable group keys')
