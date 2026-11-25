# Midir Companion 0.3.12q — Compact, Scrollable Rune Inventories

**Date:** November 25, 2026. **Baseline:** 0.3.12p cumulative GitHub-ready source. **Scope:** Ogham inventory presentation and organization ergonomics; no economy, effect, profile schema or other simulator rule changes.

## Current behavior

1. **Dense Rune tiles.** Show the stone and name, grade-colored art frame, and a small equipped-slot indicator. Favorite, edit and remove remain accessible through icon buttons; simulated runes also retain their reroll action. Detailed attributes and grade remain in the editor, and effect-aware search still highlights matching lines.
2. **Bounded inventories.** The tracked and simulated grids scroll independently when their contents exceed available height. Each grid and inline comparison picker has a 282px maximum height (260px at phone widths); the combined desktop inventory column is capped at 590px. Small inventories remain compact. Mobile layout stays stacked.
3. **Drag-first organization.** Center-drop groups runes, edge-drop reorders, and group handles move containers. Visible reorder arrows are removed. Alt + Up/Down remains available on ungrouped runes and group handles in Custom order. On touch, drag from stone artwork or scroll from the label/non-artwork area; tap-to-equip remains available.
4. **Stable scroll and state.** Internal scroll offsets persist through selection, favorite and editor redraws; search returns to the top. Existing identities, group membership, shared collections, loadouts, Set B, reroll histories and storage balances are unchanged. Both service-worker cache IDs are refreshed.

## Verification

- `tests/ogham0312q_compact_inventory_browser_test.py` — PASS at 1200/390/320px, including 32 tracked + 24 simulated runes, bounded panes, desktop reorder/group/dissolve, mobile tap-to-equip, scroll retention, search and inline compare selection.
- Existing inventory/EV integration and layout browser tests: PASS at all three widths. Nine Ogham Node suites, 17 core checks, nine interaction checks and syntax: PASS.
- Physical touch drag/scroll and hosted cache refresh remain field checks. The earlier documented ordinary Reforge Item Type edge case is outside this revision. See `VERIFICATION.md` for evidence boundaries.

## Numbered source references

[1] `Companion Files/ogham-runes.js` — inventory tiles, drag handlers, scroll retention.
[2] `Companion Files/styles.css` — compact bounded grids and responsive layout.
[3] `tests/ogham0312q_compact_inventory_browser_test.py` — large-inventory browser fixture.
[4] `tests/ogham0312l_layout_browser_test.py` / `tests/ogham0312l_inventory_ev_browser_test.py` — integration evidence.
[5] `Midir Companion.html` / `Companion Files/i18n.js` / `service-worker.js` — version and caches.
[6] `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md` — current feature guide.
