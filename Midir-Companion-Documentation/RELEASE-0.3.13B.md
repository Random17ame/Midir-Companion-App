# Midir Companion 0.3.13b — Sacred Guardian Stat-Cap Recommendations

**Baseline:** 0.3.13a cumulative GitHub-ready source. **Scope:** conservative SG preparation calculations and advice; no snapshot-rate changes or new Echostone optimizer.

## Current behavior

1. Extend saved character-sheet setup with optional STR/WILL/INT, preserving observed defensive totals and old profiles. Model ordinary primary gains using shared headroom below 2,450; assume unified hard cap 2,750 for max-Arcana planning. Unknown/at-cap primary bonuses are not projected. Convert incremental STR/WILL per 10 and INT per 20; direct bonuses and frozen snapshots remain independent. [1] `Companion Files/app.js`.
2. Distinguish useful/potential, uncertain/optional, and confirmed Oath-capped advice on ordinary and gear buff cards. Do not discourage a buff merely because primary gain is uncertain. Skip only when all affected positive Oath thresholds are already capped without that candidate in a confirmed profile. [1]; [2] `Companion Files/styles.css`; [3] `Companion Files/i18n.js`.
3. Verify at 1200/390/320px; refresh version and cache namespaces. [4] `tests/sg0313b_caps_browser_test.py`; [5] `service-worker.js`; [6] `Midir Companion.html`.

## Verification

- **PASS:** `tests/sg0313b_caps_browser_test.py` at 1200/390/320px: observed inputs, 2006 WILL / 396 M.DEF, capped INT, exact soft-cap boundary, unknown stats, shared headroom, direct emblem bonuses, incremental conversion, neutral versus skip advice, profile migration and frozen snapshot retention.
- **PASS:** `tests/sg0313a_editor_browser_test.py` at all three widths; `tests/regression_companion.py .` 17/17; `tests/interaction_test.py .` 9/9.
- **Limits:** fixed max-Arcana assumptions chosen by the user, not independently certified game thresholds. Echostone slot optimization and variable Arcana progression not implemented. Browser tests use a localStorage test double; physical devices, actual persisted reload and hosted PWA refresh remain unverified. Older historical utility tests that assume a five-step stat wizard are not part of this fresh run.

## Numbered source references

[1] `Companion Files/app.js` — observed stat setup, shared cap headroom, incremental conversion, advice and persistence.
[2] `Companion Files/styles.css` — neutral recommendation styling.
[3] `Companion Files/i18n.js` — English/Korean/Spanish labels.
[4] `tests/sg0313b_caps_browser_test.py` — integrated regression.
[5] `service-worker.js` — offline cache namespaces.
[6] `Midir Companion.html` — visible release version.
