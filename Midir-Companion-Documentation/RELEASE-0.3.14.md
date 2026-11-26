# Midir Companion 0.3.14 — Sacred Guardian Echostone Planning

**Baseline:** 0.3.13b cumulative GitHub-ready source. **Scope:** SG Oath Max and Emergency Oath Echostone editor, equipment baseline and recommendations. Existing snapshot rates, unrelated simulators, and combat evidence interpretation remain unchanged.

## Current behavior

1. **Echostone setup:** Edit beneath Oath thresholds. Optional DEX alongside observed STR/WILL/INT; values above 2750 infer minimum Red/Silver/Blue/Yellow rolls. Black is manual. Maximum three unique colors, zero means empty, integer rolls. [1] `Companion Files/app.js`; [2] `Companion Files/styles.css`.
2. **Confirm / Apply / Reset:** Initial Confirm records equipped stones already reflected in observed stats without adding them again. Apply adds/removes only the exact difference in primary and associated defensive values, bypassing the caps. Reset keeps current stats and returns to inferred minima and Confirm; completing the player-stat wizard also resets confirmation. Abandoning the wizard preserves the previous baseline. [1].
3. **Recommendations:** Enter alternative available rolls, optionally reserve equipped colors, and compare legal configurations against selected preparation. Maximize summed normalized Oath threshold coverage without reducing any existing Oath benefit; prefer fewer changes on ties. Suggested values populate the editor only; Apply commits. Capped-stat advice refers to additional gains, not removing necessary equipment. [1].
4. **Precision and persistence:** Nearest-integer displays, fractional internal defensive deltas and ordinary primary conversion, unrounded Oath thresholds. Existing frozen snapshots stay intact. Additive `playerStats.echo` and `dex` fields preserve profile compatibility; old profiles infer minima without stat mutation. Localized editor labels and offline assets. [1]; [3] `Companion Files/i18n.js`; [4] `service-worker.js`.

## Verification

- **PASS:** `tests/sg0314_echostone_browser_test.py` at 1200/390/320px: Red inference and insufficient-roll rejection; first Confirm unchanged; Silver +85 yields internal 404.5 M.DEF and display 405, +84 displays 404; removal restores baseline; Blue and Black changes; four-color rejection; reserved Red and alternate roll recommendation; application and simulated local save / state export-import; reset and stat re-entry, canceled stat edit, Yellow inference and removal, inconsistent inference rejection, no horizontal page overflow or page errors.
- **PASS:** `tests/sg0313b_caps_browser_test.py` (updated for optional DEX and fractional incremental conversion) and `tests/sg0313a_editor_browser_test.py` at all three widths; core `tests/regression_companion.py .` 17/17; `tests/interaction_test.py .` 9/9; modified JavaScript syntax; 81 service-worker CORE paths resolve.
- **Limits:** fixed 2450/2750 planning assumptions and nearest-integer display convention are user-selected, not comprehensive game-engine validation. Recommendations only compare entered candidate rolls, not hypothetical maximum rolls, awakenings or tradeoffs that reduce another Oath benefit. Real device use, origin-bound browser persistence after reload, and hosted PWA refresh remain unverified. Integrated browser tests use injected localStorage.

## Numbered source references

[1] `Companion Files/app.js` — setup, inference, editor, deltas, recommendations, save state and rounding.
[2] `Companion Files/styles.css` — compact responsive editor.
[3] `Companion Files/i18n.js` — English/Korean/Spanish labels.
[4] `service-worker.js` — cache IDs and local stone art.
[5] `tests/sg0314_echostone_browser_test.py` — browser regression.
[6] `features/08-SACRED-GUARDIAN-OATH.md` — current behavior.
