# Midir Companion 0.3.12k — Ogham Inventory Organization, Practice Collection and Loadout Comparison (Draft)

**Baseline:** 0.3.12i cumulative GitHub-ready source. **Scope:** Ogham inventory organization, a separate simulator-results collection, aggregate equipped rune effects and non-destructive five-slot comparison. Existing combat reports, Rotation Highlights, Harmonic Saint, Sacred Guardian, Music, report imports, reroll cost rules, offline storage key, rune IDs, and unrelated gameplay mechanics remain unchanged.

## User-facing changes

1. **Persistent visual organization:** Favorite stars, editable group labels, per-collection manual order controls and sorts (Manual/Favorites/Grade/Name/Group/Recent) across visual rune cards. Search includes effect line names (e.g. Magnum Shot), rune word, nickname, notes, group and grade; matches rise to the top but nonmatches are never hidden.
2. **Two separate inventories:** Manual/owned and simulator-generated collections retain distinct IDs. Reroll results can be saved as a new simulated rune or loaded back for more rolls, with **Update Saved Rune** required to modify a stored simulation. Both collections share Arcana equipment slots; no simulator roll changes manual or saved items without an explicit save action.
3. **Equipped Effects:** Group effect lines by stable effect ID and unit and sum their selected-level values; show 5-slot loadout's activated recipes, grade points and regional availability in an expandable section. No inferred final combat/healing or skill-activation effects.
4. **Compare live equipped vs alternate:** **Set A** reads the equipped set on every render and cannot be edited from the comparison panel. **Set B** defaults to mirroring A before the first comparison edit, avoiding two independent setups. It then saves independently by Arcana and supports overlapping runes with A and swaps from either collection. Changes highlight shared/moved/replaced/added/removed slots, the B-minus-A effect delta, and changed synergy points. Reset B to equipped or Clear B are explicit actions; Set B never changes equipped runes.
5. **Three-language and offline support:** English/Korean/Spanish comparison labels; no new official skill-name claims; versioned offline app-shell cache, updated existing numbered Ogham feature guide and release records inside `Midir-Companion-Documentation/`.

## Verification

- Core: `python tests/regression_companion.py .` **17/17 PASS**; `python tests/interaction_test.py .` **9/9 PASS**.
- New Ogham rules: `ogham0312j_inventory_rules_test.js`, `ogham0312k_dual_inventory_rules_test.js`, `ogham0312k_loadout_compare_test.js` PASS (initial Set B, shared rune IDs, live Set A, per-Arcana snapshots, delete propagation, unit-aware effect sums).
- New browsers: `ogham0312k_dual_inventory_browser_test.py`, `ogham0312k_loadout_compare_browser_test.py` PASS at **1200px, 390px, 320px**; navigation, simulator save/load, two collections, comparison selection, reset and live equipped changes, no page exceptions/overflow.
- Existing Ogham grades and chest: `ogham0312e_rules_test.js`, `ogham0312f_chest_rules_test.js`, `ogham0312g_levels_test.js` PASS. Music 0.3.12c and Litany 0.3.12d rules PASS.
- **Limits:** Intermediate Ogham bonuses remain reconstructed from Nexon endpoints, not validated Prilus `Values`; simulated material recipes use Companion herbs rather than in-game fragments/threads; original report full mobile/PWA verification remains separate; a comparable rune effect does not imply the same outcome in actual combat.

## Numbered source references

[1] `Companion Files/ogham-runes.js`: inventory preferences, dual collections, simulated rune save/load, `effectsForIds`, `compareRuneSets`, `alternateEquip`, `renderCompare` and result UI.
[2] `Companion Files/app.js`: simulator inventory navigation and existing profile save state.
[3] `Companion Files/styles.css`: scoped dual inventory, comparator, source differentiation, and mobile responsiveness.
[4] `tests/ogham0312j_inventory_rules_test.js`; [5] `tests/ogham0312k_dual_inventory_rules_test.js`; [6] `tests/ogham0312k_loadout_compare_test.js` — rules and storage.
[7] `tests/ogham0312k_dual_inventory_browser_test.py`; [8] `tests/ogham0312k_loadout_compare_browser_test.py` — browser interaction and layout.
[9] `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md` — current-state guide.
[10] `Midir Companion.html`; [11] `service-worker.js` — version and offline cache namespace.
