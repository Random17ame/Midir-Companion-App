# Midir Companion 0.3.12g — Ogham Pentagon and Effect Levels Draft

**Baseline:** Complete 0.3.12f Ogham Reroll & Shared Chest preview. **Scope:** Ogham interface, effect values, profile-safe state migration, translations and tests; no existing combat calculations changed.

## Inventory and equipped sockets

- The five Arcana Ogham slots now have an illustrated **pentagon arrangement** with game-inspired, locally rendered rune stones. The inventory is a matching visual set of rune tiles. Existing actual owned-rune data and independent loadouts are preserved.
- On desktop, drag inventory stones into a socket; on phones, select a rune then touch the socket. Dragging/reselecting an occupied socket can move/swap it.
- **Occupied socket interactions:** First click/touch selects it and shows name, grade, recorded effect lines, each selected level and its displayed numeric bonus, plus any notes. **Second click/touch on the same socket unequips** that rune. There is no separate socket X button. Another selection cancels pending same-socket unequip. The rune remains in owned inventory.
- Combination activation guidance stays compact behind the existing disclosures. Actual individual game-art icon screenshots can replace the distinct offline placeholder glyphs later.

## Discrete effect levels

- Includes 97 effects (52 general and 45 special/Arcana) with discrete 1–10/1–20 levels and per-level displayed values, using the official Nexon NA min/max endpoints. Special runes use the full pool; regular runes the general pool. Levels on a given effect are uniformly sampled in the practice simulator. Reroll Gold + herb charges remain tied to Companion's shared chests and do not change owned runes.
- **Data caveat:** The official patch only lists endpoints for the effects; intermediate values in this draft are arithmetic reconstructions, *not* a verified extracted Prilus `Values` catalog. User-imported validated source data overrides these reconstructed figures. The December NA English names and many official Korean/Spanish labels still require review against in-game UI.

## Verification

- 17/17 core tests and 9/9 interaction tests passed.
- Ogham rule, shared-chest, 97-effect and Music upgrade/enchant tests passed.
- Browser tests passed at 1200px, 390px and 320px for the pentagon and mobile touch/two-step unequip, detailed line display, Arcana persistence and drag/swap. Browser checks for effect levels and EN/KO switching also passed, with the scripted DOM-change selection workaround documented in `VERIFICATION.md`.
- Physical mobile devices, host PWA upgrade, original rune sprites, exact Prilus intermediate values and certified regional labels are **not** yet verified.

## Documentation naming correction (packaging only)

Renamed the documentation directory to `Midir-Companion-Documentation/` and updated repository links and the existing localization path assertion. Retained the current-state feature guides under `features/`, release notes in this directory, the numbered-source `CHANGELOG.md`, and the existing verification record. Corrected stale version labels in the architecture reference and application-files README. No application code or game rules changed.

## Reference

Full documentation is included in the cumulative source at `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md`, `features/23-OGHAM-EFFECT-LEVELS.md`, `CHANGELOG.md`, and `VERIFICATION.md`.
