# Midir Companion 0.3.12o — Ogham Inventory Layout and Socket Refinement

**Baseline:** 0.3.12n cumulative GitHub-ready source. **Date:** November 25, 2026. **Status:** historical revision, retrospectively numbered.

## Current behavior at this revision

1. Place tracked and simulated inventories to the right of the equipped pentagon on desktop; retain stacked mobile flow.
2. Place the Set B selection inventory inline directly beneath both comparison slot rows. Preserve shared Rune identities and independent Arcana loadouts and alternate sets.
3. Remove the extra inner frame on equipped socket runes; refresh shell and art cache identifiers.

## Verification

Prior recorded browser passes at 1200/390/320px; see `VERIFICATION.md` for test scope and remaining limitations:

- `tests/ogham0312l_layout_browser_test.py`
- `tests/ogham0312l_inventory_ev_browser_test.py`
- `tests/ogham0312l_shared_chest_browser_test.py`

Physical-device and hosted PWA verification remain pending.

## Numbered source references

[1] `Companion Files/ogham-runes.js`.
[2] `Companion Files/styles.css`.
[3] `service-worker.js`.
[4] `tests/ogham0312l_layout_browser_test.py`.
[5] `tests/ogham0312l_inventory_ev_browser_test.py`.
[6] `tests/ogham0312l_shared_chest_browser_test.py`.
