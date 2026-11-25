# Midir Companion 0.3.12l — Compact Ogham Editing, Visual Groups and Unified Reforge Simulator (Draft)

**Baseline:** 0.3.12k cumulative GitHub-ready source. **Scope:** Ogham UI and inventory organization, unified EV Item Type selection, and clarified gold/herb reroll practice charges. **No** changes to ordinary Reforge/Echostone results, Music, Harmonic Saint, Sacred Guardian, combat exports, Rotation Highlights, achievements, or existing profile storage identifiers.

## Current behavior

1. **Minimal Rune editor.** The rune word is chosen in the 26-stone gallery; the editor shows grade and effect lines with a level-only selector and calculated bonus below. Redundant free-text effect, nickname and notes fields no longer occupy space; old saved nickname/notes remain preserved for backward compatibility.
2. **Visual, movable inventory containers.** Create a new unnamed group in one click, center-drop onto another rune to group, edge-drop to reorder, or tap/select and add via a group. Groups move as units and can be optionally named on double-click/double-tap. The group X appears only on hover/focus/selection and dissolves the box without deleting rune instances. Legacy label groups migrate into visible containers. Both tracked and simulated inventories remain independent collections, with individual favorites/search/manual order.
3. **One EV Item Type control.** The old three-button reforge/echostone/Ogham row is removed. Choose Rune in Item Type to see visual rune-word selection and reroll controls; switching to normal equipment or Echostone returns to the original mechanics. The roll action displays current Gold and any locked-line herb surcharge next to the button.
4. **Arcana-independent rerolls, Arcana-specific equipment.** Rune rerolls have no Arcana dropdown; the roll eligibility depends on rune word (five special words admit the full pool; regular words general only). The two inventories remain shared across all Arcana, but every Arcana saves its **own five-slot equipped loadout** and its own optional Set B comparison.
5. **Gold-only zero-lock costs.** At zero locks all grades cost 5,000 Gold and **no herbs**. Lock one line for 10,000 Gold plus its recipe of herbs, or two lines on a Masterwork for 20,000 Gold plus herbs. Insufficient funds prevent both wallet deductions and do not change the simulated roll. Herbs are a Companion-only fun/practice replacement, **not** the actual game's Ogham materials.

6. **Automatic Rune effects and individual reroll history.** The Rune simulator now shows randomly rolled, read-only effect names and levels with lock checkboxes, not manual effect/level selectors. Each Rune tracks its own paid attempt count and cumulative Gold/Herb spending; saved simulated runes may be loaded and rerolled without overwriting until Update Saved Rune. The **Disassemble** action confirms and refunds a modeled 1–10% of that rune's accumulated spending (round-up to whole units; zero when unspent), credits the shared chests and removes a disassembled saved instance safely.
7. **Shared chest visible during Rune rolls.** Rune mode displays the same full Storage Chest grid as normal Reforges, with live Gold, Herb, Ducat, tool and item balances. Reforge-only buy/withdraw/transfer actions are not displayed there. The development-only JSON importer/status/Prilus link has been removed from the Rune panel; the catalog and backward compatibility for old imported profiles remain intact.

8. **Awakening Level range correction (same 0.3.12l draft).** The Ogham equipment screen now supports level **0–50** (formerly capped at 20), saves the selected level per Arcana and retains the existing five unlock milestones at 1/5/10/15/20. Levels 21–50 have the same five-slot access and Ogham combination behavior as level 20; there are no new bonuses, rune effects, or reroll changes.

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

- `tests/ogham0312l_groups_rules_test.js` — group creation/membership/ordering/rename/dissolve, separate collections, persistence, no equipment deletion.
- `tests/ogham0312l_shared_cost_rules_test.js` — zero herb-cost at zero locks, true Gold-only purchase without Herb Chest support, lock-dependent cost precheck, cross-Arcana shared inventory with independent loadouts.
- `tests/ogham0312l_inventory_ev_browser_test.py` — combined inventory/EV navigation script remains **timed out**, so it is not counted as passing. Its smaller focused behaviors were verified separately.
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

**Evidence boundary:** The intermediate values in the 97-effect Ogham catalog are still reconstructed from official endpoints and have not been verified from Prilus's full `Values` table. English/KO/ES translations use confirmed names where available and neutral fallback elsewhere. Rune imagery remains partially sourced from the user's low-resolution game screenshots; other words use glyph placeholders.

[13] `tests/ogham0312l_awakening_50_browser_test.py` / `Companion Files/ogham-runes.js` (`slotsAt`, `renderInventory`, awakening change handler) — Awakening Level 0–50 regression.

**Historical record:** This is the 0.3.12l baseline. Later revisions are recorded separately as [0.3.12m](RELEASE-0.3.12M.md), [0.3.12n](RELEASE-0.3.12N.md), [0.3.12o](RELEASE-0.3.12O.md) and [0.3.12p](RELEASE-0.3.12P.md). The original inventory/EV timeout was subsequently resolved in 0.3.12m. See `VERIFICATION.md`.
