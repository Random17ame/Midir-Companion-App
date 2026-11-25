# Midir Companion 0.3.11b — Equipment-set editor and validation

**Source baseline:** cumulative 0.3.11a GitHub-ready package; 0.3.11b contains the full application and assets, not a diff patch.

## Scope

- Icon-based, responsive eight-slot music equipment board with a dedicated modal editor per physical item. Shared/copyable item IDs remain unchanged.
- Reforge restrictions and levels sourced directly from `window.MIDIR_REFORGE_TABLE` (the Reforge Simulator table). Maximum three lines; same reforge is not duplicated on one item; limit-break levels are accepted up to the simulator’s cap.
- Per-item and per-slot named set bonuses: Troubadour, Seraphic Cantabile bangles, Special Ethereal Chiffon Wings. Only buff-effect contributions modeled; duration and Fantastic Chorus skipped; rate modifiers displayed separately.
- Instrument-only upgrade fields remain attached to each instrument item.
- Same-name equipment effects **never add**. The greatest eligible value applies. Test case: Seraphic gloves BFO +5%, Troubadour body BFO +3% and Enduring Melody +3% → BFO +5%, Enduring +3%. Removing Seraphic → BFO +3% and Enduring +3%.
- Old global BFO set bonus treated as an unassigned legacy value until replaced. In the new calculations it competes with named BFO effects by highest value rather than stacking; no guessed physical slot.

## Direct references

1. `Companion Files/app.js`: `MUSIC_SLOT_SET_EFFECTS`, `musicGearSetStat`, `musicGearReforgeRule`, `musicGearState`, `musicGearPanel`, `musicEnchantEditor`.
2. `Companion Files/styles.css`: `.music-gear-equipped`, `.music-gear-slot-button`, responsive mobile board.
3. `Companion Files/reforge-data.js`: `MIDIR_REFORGE_TABLE`, reforge normal/limit-break maxima.
4. `tests/music0311b_slot_rules_test.py`: source rule/slot restrictions, same-name combination precedence, mobile viewports.
5. Supplied source pages: `Seraphic Cantabile Set - Mabinogi World Wiki.html`, `Troubadour's Set - Mabinogi World Wiki.html`, `Special Ethereal Chiffon Wings (Enchantable) - Mabinogi World Wiki.html`.

## Release and field testing

Automated browser/Node tests establish source behavior, not physical-phone usability. Verify on device: opening and closing editors; set swapping/reused instruments; 3-line reforge and limit break entries; correct BFO/Enduring simultaneous bonuses; real profile backup/restore; service-worker upgrade after pushing the cumulative ZIP to GitHub Pages. 0.3.11a Theta performance follow-ups and the separate AG scroll issue remain pending; Rotation Highlights work has not changed.
