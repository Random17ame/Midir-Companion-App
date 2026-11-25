"""Wrapper: the current Litany v3 integration test includes desktop and mobile."""
from pathlib import Path
exec((Path(__file__).with_name('hs_litany_v3_browser_test.py')).read_text())
