# Midir Companion 0.3.15 — Bandit Hunt Exploration

**Baseline:** 0.3.14a cumulative GitHub-ready source. New exploration and prize-loss mechanics; no changes to unrelated calculators or combat data interpretation.

## Current behavior

- A 5×5 map region begins at Camp. Resolve an edge location to travel outward; previously visited adjacent regions are always available. Cleared, swept and stolen locations persist for the active hunt. New hunt resets the map.
- Preserve all four reaction rules, named encounters, existing timing curve, luck and streak payout tiers. Use a compact map and centered encounter dialog instead of a long fixed board. Collapse help and records.
- Wrong reads lose current and adjacent hidden prizes; timeouts lose the current prize. Either can also remove up to the encounter's base reward from current-hunt net earnings already credited to Storage Chest, bounded by the starting chest balance. Existing completed-run ducats are protected. Finished hunt records use net earnings.
- Preserve prior saved balances and records, no new persistent profile schema. Active region state survives in-app navigation but not full reloads.

## Verification

- **PASS:** `tests/bandit0315_map_browser_test.py` at 320×568, 390×844, 844×390 and 1200×844: edge unlock, stable IDs on return, no card recycling, wrong-response and timeout loss, starting-wallet floor, re-entering the tool, response bounds, reset on new hunt. Deterministic encounter fixture and wallet test double.
- **PASS:** `tests/bandit0315_integration_browser_test.py` at 320, 390 and 1200px: actual application rendering, original encounter art, viewport-bounded controls, shared Reforge Ducat credit/debit and eight permanently stolen adjacent prizes; uses local storage test double. `tests/mobile0311_layout_test.py` seven gameplay layouts passed.
- **PASS:** all 109 offline CORE paths resolve, including 28 encounter artworks; JavaScript syntax.
- **PASS:** `tests/mobile0314a_presentation_test.py` 119 route/state checks with no overflow or page errors; `tests/regression_companion.py .` 17/17 and `tests/interaction_test.py .` 9/9. Existing prior test limitations remain.
- **Limits:** active map state is in memory only; full reload ends the active exploration (already credited ducats remain). Real device reaction timing, actual browser restart storage, Safari/Firefox and hosted PWA refresh remain unverified. Region-local chain and pressure do not cross region boundaries.

## Numbered source references

[1] `Companion Files/bb-bandit-flip.js` — region and prize mechanics.
[2] `Companion Files/reforge-simulator.js` — bounded wallet debit.
[3] `Companion Files/styles.css` — responsive map and encounter dialog.
[4] `Companion Files/i18n.js` — new controls.
[5] `service-worker.js` — versioned caches and artwork.
[6] `tests/bandit0315_map_browser_test.py` — focused regression.
[7] `tests/mobile0314a_presentation_test.py` — cumulative layout audit.
[8] `tests/bandit0315_integration_browser_test.py` — actual shared-wallet and rendered encounter regression.
