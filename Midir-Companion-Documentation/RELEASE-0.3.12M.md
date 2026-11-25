# Midir Companion 0.3.12m — Rune and Reforge Visual Polish

**Baseline:** 0.3.12l cumulative GitHub-ready source. **Date:** November 25, 2026. **Status:** historical revision, retrospectively numbered.

## Current behavior at this revision

1. Rounded read-only Rune result cards, accessible open/closed lock buttons, gold text at 90% or higher and a subtle perfect-roll outline. Locked rows retain readable text.
2. Center all 26 stone tiles; bundle ten provisional local images (including orange Beithe), preserving sixteen game-reference files. Move the Reforge/Echostone item image and name into a single bordered action panel.
3. Correct the combined inventory/EV test to roll before locking, and refresh the offline cache. No changes to calculations or saved identities.

## Verification

Prior recorded browser passes at 1200/390/320px; see `VERIFICATION.md` for test scope and remaining limitations:

- `tests/ogham0312l_visual_polish_browser_test.py`
- `tests/ogham0312l_inventory_ev_browser_test.py`
- `tests/ogham0312i_word_picker_browser_test.py`

Physical-device and hosted PWA verification remain pending.

## Numbered source references

[1] `Companion Files/ogham-runes.js`.
[2] `Companion Files/styles.css`.
[3] `Companion Files/reforge-simulator.js`.
[4] `Companion Files/assets/ogham/provisional/`.
[5] `service-worker.js`.
[6] `tests/ogham0312l_visual_polish_browser_test.py`.
[7] `tests/ogham0312l_inventory_ev_browser_test.py`.
[8] `tests/ogham0312i_word_picker_browser_test.py`.
