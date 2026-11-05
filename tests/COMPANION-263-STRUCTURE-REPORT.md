# Companion 263 — route-binding cleanup

Baseline: Companion 262. Changes are confined to `Companion Files/app.js` and a new regression test.

## Changes

- Consolidated the three successive `bind()` wrappers for **Target Frames (AS/AG)**, **EV Tower Defense**, and **Crom Bás Invaders** into one route-aware binder.
- Kept the original base `bind()` chain and the per-module `bind` APIs intact.
- Removed an unused `asciPreviousReference` variable from the Crom integration.
- Preserved the `render`, `action`, settings, profile storage, importer and game logic as-is.

## Regression checks

- 17/17 navigation and module-entry checks passed.
- 9/9 Theta gameplay and control checks passed.
- Dynamic delegated-action test passed.
- **New** `tests/module_binding_test.py` passed against both Companion 262 and 263; it compares the binding calls and AS/AG Frame launch controls.
- All packaged `.js` files passed `node --check`.

## Limits

Browser checks inject scripts in an isolated page. Asset loading, real importer reports, full profile persistence and long-running gameplay were not exhaustively tested. No save-schema or balance changes were intended.
