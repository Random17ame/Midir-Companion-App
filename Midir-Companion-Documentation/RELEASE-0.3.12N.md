# Midir Companion 0.3.12n — Shared Herb Sprites

**Baseline:** 0.3.12m cumulative GitHub-ready source. **Date:** November 25, 2026. **Status:** historical revision, retrospectively numbered.

## Current behavior at this revision

1. Use the gathering catalog’s eight distinct sprites throughout the shared Reforge/Echostone/Rune Storage Chest and Rune cost, spending and refund displays.
2. Precache all eight original assets. Herb IDs, quantities, gathering mechanics and costs remain unchanged. The inherited White/Golden artwork assignment was subsequently corrected in 0.3.12p.

## Verification

Prior recorded browser passes at 1200/390/320px; see `VERIFICATION.md` for test scope and remaining limitations:

- `tests/0312l_shared_herb_sprites_browser_test.py`
- `tests/ogham0312l_shared_chest_browser_test.py`

Physical-device and hosted PWA verification remain pending.

## Numbered source references

[1] `Companion Files/herb-collection.js`.
[2] `Companion Files/reforge-simulator.js`.
[3] `Companion Files/ogham-runes.js`.
[4] `Companion Files/styles.css`.
[5] `service-worker.js`.
[6] `tests/0312l_shared_herb_sprites_browser_test.py`.
[7] `tests/ogham0312l_shared_chest_browser_test.py`.
