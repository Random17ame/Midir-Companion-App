# Midir Companion 0.3.13a — Sacred Guardian Checklist Refinement

**Baseline:** 0.3.13 cumulative GitHub-ready source. **Scope:** SG preparation and configuration, not snapshot rates or unrelated systems.

## Current behavior

1. Remove separate titles from prepared stats and checklist steps; character-sheet totals already include titles. Retain old title settings as inert metadata and preserve frozen snapshots. Remove redundant fine-tuning panel while retaining individual effect editors. [1] `Companion Files/app.js`.
2. Replace Ally Music sliders with Enduring Melody Edit: four independent flat values, or live Inspiring calculator results, direct calculator navigation and return. Migrate old manual/BFO-estimated values once and keep existing linked mode. [1]; [2] `Companion Files/styles.css`.
3. Add explicit simulated persona cooldown override and activation; normal cooldown still applies. [1].
4. Update localized labels, release/cache IDs and documentation. [3] `Companion Files/i18n.js`; [4] `service-worker.js`; [5] `Midir Companion.html`; [6] `tests/sg0313a_editor_browser_test.py`.

## Verification

- **PASS:** `tests/sg0313a_editor_browser_test.py` at 1200/390/320px: title exclusion, frozen snapshot preservation, legacy manual migration, four independent decimal inputs, saved values, live calculator navigation/return and persona cooldown override. Uses injected localStorage test double.
- **PASS:** `tests/companion0312_boost_cards_test.py` and `tests/music0312c_browser_test.py` at all three widths; core regression 17/17, general interaction 9/9, JavaScript syntax.
- **Remaining checks:** hosted PWA cache refresh, physical mobile devices and actual persisted browser reload remain unverified; existing 0.3.13 import field limitations remain.

## Numbered source references

[1] `Companion Files/app.js` — planner, editors, persistence and navigation.
[2] `Companion Files/styles.css` — melody fields.
[3] `Companion Files/i18n.js` — localized controls.
[4] `service-worker.js` — offline cache namespaces.
[5] `Midir Companion.html` — visible version.
[6] `tests/sg0313a_editor_browser_test.py` — integrated browser checks.
