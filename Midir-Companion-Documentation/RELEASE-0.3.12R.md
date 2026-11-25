# Midir Companion 0.3.12r — Grade-Colored Rune Inventory Borders

**Baseline:** 0.3.12q cumulative GitHub-ready source. **Scope:** compact Ogham inventory tile clarity only. **No** changes to Rune mechanics, reroll rules, inventories, groups, comparisons, balances, imports, or profile identifiers.

## Current behavior

1. **Grade-colored compact inventory borders.** In tracked and simulated Rune inventories, the Rune tile frame now communicates grade more clearly: **Fine = blue**, **Exquisite = purple**, **Masterwork = gold**. If a Rune has no grade value, the tile frame remains neutral gray.
2. **Inventory-only visual scope.** The color treatment is applied to compact inventory tiles and the inline compare chooser, while the equipped socket presentation remains unchanged.
3. **Condensed drag-first layout retained.** Scrollable inventory panes, compact Rune cards, drag-and-drop organization and mobile tap-to-equip behavior from 0.3.12q remain intact.

## Verification

- `tests/ogham0312q_compact_inventory_browser_test.py` — PASS at 1200/390/320px with Fine, Exquisite, Masterwork and ungraded tile samples; compact pane bounds, drag/group behavior, compare chooser, and scroll retention still pass.
- Existing core, interaction and Ogham suites: unchanged cumulative baseline. Hosted PWA refresh remains a deployment check.

## Numbered source references

[1] `Companion Files/styles.css` — compact inventory/compare tile border colors.
[2] `tests/ogham0312q_compact_inventory_browser_test.py` — browser coverage for grade-colored inventory borders.
[3] `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md` — current Rune inventory behavior.
