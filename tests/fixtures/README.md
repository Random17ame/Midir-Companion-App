# Companion 276 test fixtures

`companion276-synthetic-backup-v2.json` contains **entirely synthetic** characters, reports, a milestone, and Theta/Vertrag progress, in the existing `midir-companion-backup` version 2 format. It is intentionally not a real user's saved profile.

Reports 1–2 intentionally lack skill observations and canonical boss hits, exercising automatic legacy archival. The other 22 include canonical boss-only damage and observed-use payloads. This gives 3 active pages (10, 10, 2) and 2 archive reports after restore.

The user-provided current-version backup was not available in this session; a real backup restore round-trip must still be performed before claiming production migration compatibility.

Full sample HTML imports are supplied separately by the user and are not duplicated into the release ZIP.

## Midir 49.a ZIP bundle QA (0.3.13)

`Midir-49.a-Companion-Fixtures.zip` is the unchanged supplied producer QA distribution with fictional combat data. It is not an importable nested bundle.

- `python tests/0313_bundle_browser_test.py` extracts it into a temporary directory and exercises the real browser importer/viewer with a storage test double.
- `python -m zipfile -e tests/fixtures/Midir-49.a-Companion-Fixtures.zip /tmp/midir49a` followed by `node tests/0313_bundle_reader_test.js /tmp/midir49a` tests the reader with the supplied ZIPs and adversarial fixtures. Use Node 22+ for native raw DEFLATE.
