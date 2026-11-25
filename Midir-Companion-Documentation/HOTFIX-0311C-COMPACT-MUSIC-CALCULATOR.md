# Midir Companion 0.3.11c — Compact music calculator and slot overrides

**Baseline:** full cumulative 0.3.11b source. **Release:** cumulative 0.3.11c package. This release does not modify Rotation Highlights calculations.

## What changed

- Each physical item in the eight-slot Music Calculator supports a nullable **manual enchant contribution override**. It replaces only that item's calculated Prefix/Suffix subtotal, not its reforge lines, instrument-specific upgrades, or named set effects. Blank/reset returns to the automatic item subtotal; zero is an intentional override.
- The existing overall Enchant Effects override is attached to a buff-set tab and takes final precedence over the sum of physical-item enchant contributions. A shared item shares its manual value across sets; **Make separate copy** detaches that value with an independent physical item. Old 0.3.11b items without the property continue in automatic mode.
- **Holy Water of Murias** is configured on each physical item except wings (+1 per eligible slot, seven-slot automatic maximum). The equipment panel displays a whole-set manual override with **Use slot total** reset. Old flat Murias values migrate to a visible override without double-counting; shared items and detached copies follow the same rules as other equipment attributes.
- Buff results precede the equipment board and remain visible while the calculator is scrolled. The per-item modal includes a pinned live Normal/Excellent/Inspiring result. The compact board removes redundant copy/new buttons; item management remains in the modal. Additional buff input groups, set renaming, copying and the comparison table remain accessible under explicit disclosures.

## Regression coverage

1. `Companion Files/app.js`: `musicGearEnchantAutoTotal`, `musicGearEnchantItemTotal`, `musicEnchantTotal`, `musicGearPanel`, `musicBuffResultPanel`, `musicBuffBind`.
2. `Companion Files/styles.css`: `.music-compact-workspace`, `.music-result-dock`, `.music-gear-editor-head`, `.music-gear-slot-manual`.
3. `tests/music0311c_compact_override_test.py`: manual/auto/global precedence, zero, shared versus copied instrument, local save/reload, sticky preview and mobile viewports.
4. `tests/music0311c_murias_slots_test.py`: seven eligible slot toggles and wing exclusion, explicit zero/auto override, shared/copy isolation, local save/reload, and preservation of older flat Murias totals.
5. Prior tests for 0.3.11b set-name precedence, reforge slot eligibility, limit-break ranges and earlier music migration remain applicable.

**Field checks still required:** physical phone touch feel and sustained Theta performance, live GitHub Pages cache deployment, and a real profile backup/restore. Avoid clearing browser storage.
