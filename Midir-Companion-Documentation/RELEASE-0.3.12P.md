# Midir Companion 0.3.12p — White/Golden Herb Artwork Correction and Cumulative Ogham Refinements

**Baseline:** 0.3.12o cumulative GitHub-ready source (formerly labeled 0.3.12l). **Date:** November 25, 2026. **Status:** cumulative draft. **Scope:** White/Golden Herb artwork correction and release-version reconciliation; retains all cumulative Ogham and EV refinements. **No** changes to ordinary Reforge/Echostone results, Music, Harmonic Saint, Sacred Guardian, combat exports, Rotation Highlights, achievements, or existing profile storage identifiers.

## Current behavior

Items 1–8 summarize 0.3.12l, item 9 is 0.3.12m, item 10 is 0.3.12n, item 11 is 0.3.12o and item 12 is 0.3.12p. The earlier distributed archives retained the 0.3.12l label; the historical revision numbers have now been reconciled.

1. **Minimal Rune editor.** The rune word is chosen in the 26-stone gallery; the editor shows grade and effect lines with a level-only selector and calculated bonus below. Redundant free-text effect, nickname and notes fields no longer occupy space; old saved nickname/notes remain preserved for backward compatibility.
2. **Visual, movable inventory containers.** Create a new unnamed group in one click, center-drop onto another rune to group, edge-drop to reorder, or tap/select and add via a group. Groups move as units and can be optionally named on double-click/double-tap. The group X appears only on hover/focus/selection and dissolves the box without deleting rune instances. Legacy label groups migrate into visible containers. Both tracked and simulated inventories remain independent collections, with individual favorites/search/manual order.
3. **One EV Item Type control.** The old three-button reforge/echostone/Ogham row is removed. Choose Rune in Item Type to see visual rune-word selection and reroll controls; switching to normal equipment or Echostone returns to the original mechanics. The roll action displays current Gold and any locked-line herb surcharge next to the button.
4. **Arcana-independent rerolls, Arcana-specific equipment.** Rune rerolls have no Arcana dropdown; the roll eligibility depends on rune word (five special words admit the full pool; regular words general only). The two inventories remain shared across all Arcana, but every Arcana saves its **own five-slot equipped loadout** and its own optional Set B comparison.
5. **Gold-only zero-lock costs.** At zero locks all grades cost 5,000 Gold and **no herbs**. Lock one line for 10,000 Gold plus its recipe of herbs, or two lines on a Masterwork for 20,000 Gold plus herbs. Insufficient funds prevent both wallet deductions and do not change the simulated roll. Herbs are a Companion-only fun/practice replacement, **not** the actual game's Ogham materials.

6. **Automatic Rune effects and individual reroll history.** The Rune simulator now shows randomly rolled, read-only effect names and levels with open/closed lock icon buttons, not manual effect/level selectors. Each Rune tracks its own paid attempt count and cumulative Gold/Herb spending; saved simulated runes may be loaded and rerolled without overwriting until Update Saved Rune. The **Disassemble** action confirms and refunds a modeled 1–10% of that rune's accumulated spending (round-up to whole units; zero when unspent), credits the shared chests and removes a disassembled saved instance safely.
7. **Shared chest visible during Rune rolls.** Rune mode displays the same full Storage Chest grid as normal Reforges, with live Gold, Herb, Ducat, tool and item balances. Reforge-only buy/withdraw/transfer actions are not displayed there. The development-only JSON importer/status/Prilus link has been removed from the Rune panel; the catalog and backward compatibility for old imported profiles remain intact.

8. **Awakening Level range correction (same 0.3.12l draft).** The Ogham equipment screen now supports level **0–50** (formerly capped at 20), saves the selected level per Arcana and retains the existing five unlock milestones at 1/5/10/15/20. Levels 21–50 have the same five-slot access and Ogham combination behavior as level 20; there are no new bonuses, rune effects, or reroll changes.

9. **Rune and Reforge visual polish (November 25).** Rounded result cards, read-only level/max and bonus separation, gold quality text at 90% or higher, accessible icon-only locks and slate locked borders without text dimming. Center all 26 stone tiles; add ten clearly provisional images based on the existing stone styles (including orange Beithe), without altering the 16 reference files. Move the ordinary Reforge/Echostone item sprite and name into its single bordered action panel. Refresh the offline cache; no changes to calculations, saved identifiers or resources.

10. **Shared herb artwork (November 25).** The eight original gathering sprites and names appear in the shared Reforge/Echostone/Rune Storage Chest. Rune cost, spending and refund previews use the same local images at compact sizes. All eight assets are precached; no gameplay, balance or save changes.

11. **Ogham layout follow-up (November 25).** On desktop-width screens, the tracked and simulated Rune inventories now sit beside the five-socket equipped layout so dragging or tapping into sockets requires less travel. The Set A / Set B compare view now shows its selection inventory inline beneath both slot rows instead of using a distant modal chooser. The nested decorative border on equipped socket runes has been removed so the rune art sits more cleanly inside the socket frame. Mobile widths keep the stacked flow.

12. **White/Golden Herb artwork correction (November 25).** White uses the static `white.png` (formerly `golden.png`); Golden uses the original six-frame animated `golden.gif` (formerly `white.gif`). The bytes, stored herb IDs, counts, costs and mechanics remain unchanged. Both offline cache namespaces and the precache paths are refreshed. [17]

## Practice costs

| Grade | Locks | Gold | Herbs added for locked lines |
|---|---:|---:|---|
| Fine | 0 | 5,000 | None |
| Exquisite | 0 | 5,000 | None |
| Exquisite | 1 | 10,000 | Base ×3, Mana ×1, Bloody ×1 |
| Masterwork | 0 | 5,000 | None |
| Masterwork | 1 | 10,000 | Base ×4, Mana ×2, Bloody ×1, Sunlight ×1 |
| Masterwork | 2 | 20,000 | Base ×5, Mana ×2, Bloody ×2, Golden ×1 |

## Verification

The following are previously recorded cumulative results, not fresh results from the version-only packaging pass. Fresh packaging-pass checks: 17/17 core regressions, 9/9 general interactions, herb sprite, layout and inventory/EV browser tests at 1200/390/320px, JavaScript syntax and 75/75 service-worker CORE paths. See the latest entry in `VERIFICATION.md` for scope and limitations.

- Shared herb sprite regression: PASS at 1200/390/320px, including corrected White/Golden paths, distinct balances and Golden-only spending/refund; see VERIFICATION for the separate pre-existing direct Item Type navigation issue and offline deployment limitations.
- `tests/ogham0312l_layout_browser_test.py` — desktop side-by-side loadout/inventory, mobile stacked fallback, and inline Set B compare inventory directly beneath the compare slot rows: **PASS** at 1200/390/320px.

- `tests/ogham0312l_groups_rules_test.js` — group creation/membership/ordering/rename/dissolve, separate collections, persistence, no equipment deletion.
- `tests/ogham0312l_shared_cost_rules_test.js` — zero herb-cost at zero locks, true Gold-only purchase without Herb Chest support, lock-dependent cost precheck, cross-Arcana shared inventory with independent loadouts.
- `tests/ogham0312l_inventory_ev_browser_test.py` — previous timeout resolved by making a paid initial roll before attempting to lock an effect. **PASS** at 1200/390/320px for grouped inventory, 26 loaded/centered images, unified selection, icon locks, costs and Reforge item display.
- `tests/ogham0312l_disassemble_rules_test.js` — per-rune histories/refunds, saved copy isolation and cleanup: PASS.
- `tests/ogham0312l_disassemble_browser_test.py` — automatic read-only lines, confirmation and refunds at 1200/390/320 px: PASS.
- `tests/ogham0312l_shared_chest_browser_test.py` — shared Reforge/Rune Storage Chest, Gold-only zero-lock, herb-bearing lock, Disassemble credit and no viewport overflow at 1200/390/320 px: PASS.
- `tests/ogham0312l_awakening_50_browser_test.py` — **PASS** at 1200/390/320px: levels 0/1/5/10/15/20/21/35/50, per-Arcana profile persistence and unchanged equipment/combination rules above 20; see `VERIFICATION.md`.
- Existing core, interaction, Ogham, music, Litany, and localization suites: see `VERIFICATION.md`. Physical iOS/Android behavior and hosted PWA refresh remain separate deployment checks.

## Numbered source references

[1] `Companion Files/ogham-runes.js` (editor, groups, `COSTS`, `simInit`, `renderSim`, `purchaseRoll`).
[2] `Companion Files/styles.css` (group containment, responsive compact controls).
[3] `Companion Files/app.js` (single EV Item Type wrapper, `state.ogham` persistence).
[4] `tests/ogham0312l_groups_rules_test.js`.
[5] `tests/ogham0312l_shared_cost_rules_test.js`.
[6] `tests/ogham0312l_inventory_ev_browser_test.py`.
[7] `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md`.
[8] `service-worker.js` / `Midir Companion.html` (cache and version).
[9] `tests/ogham0312l_disassemble_rules_test.js` / `tests/ogham0312l_disassemble_browser_test.py` (simulator and refund evidence).
[10] `tests/ogham0312l_shared_chest_browser_test.py` (full Storage Chest parity).
[11] `Companion Files/reforge-simulator.js` / `Companion Files/herb-collection.js` (shared resource display and credit transaction).
[12] `Midir-Companion-Documentation/features/15-EQUIPMENT-AND-ECONOMY.md` (living economy guide).

**Evidence boundary:** The intermediate values in the 97-effect Ogham catalog are still reconstructed from official endpoints and have not been verified from Prilus's full `Values` table. English/KO/ES translations use confirmed names where available and neutral fallback elsewhere. Rune imagery remains partially sourced from the user's low-resolution game screenshots; the other ten use provisional local stone artwork, not verified game images.

[13] `tests/ogham0312l_awakening_50_browser_test.py` / `Companion Files/ogham-runes.js` (`slotsAt`, `renderInventory`, awakening change handler) — Awakening Level 0–50 regression.

[14] `tests/ogham0312l_visual_polish_browser_test.py` — threshold/lock/accessibility/locale checks.
[15] `Companion Files/assets/ogham/provisional/` — ten reconstructed local images, separate from `game-reference/`.
[16] `tests/ogham0312i_word_picker_browser_test.py` — current picker, cancel/create/edit/socket flow.

[17] `tests/0312l_shared_herb_sprites_browser_test.py` / `Companion Files/herb-collection.js` — shared herb catalog and cross-view asset checks.

[18] `tests/ogham0312l_layout_browser_test.py` / `Companion Files/ogham-runes.js` / `Companion Files/styles.css` — desktop Ogham layout, inline compare inventory, and socket-frame cleanup.
