# Equipment simulators, upgrades and economy

**Applies to:** Midir Companion 0.3.12r.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Current tools

- **Reforge:** item/effect pools, modeled rolls, Dazzling tools, Echostone-specific selection and simulated Auction House features.
- **Erg:** B/A/S progression, simulated success rates and equipment handoff.
- **Special Upgrade:** R/S upgrade steps, stone classes, modeled failure/protection/recovery rules and shared storage identity.
- **Storage Chest and shared resources:** simulated gold, stones, items and rewards across compatible modules.

## Equipment identity and eligibility

- The Reforge/Echostone workspace shows the selected item sprite and name in the existing bordered action panel with the Reforge/Stim button; the floating icon above the selectors is removed. On narrow screens the panel stacks above the results. Item selection, tool choice, probabilities, costs and transfer rules are unchanged.

- Equipment moved between supported simulators is intended to preserve the same item identity and attached progress. Off-hand and non-eligible categories are guarded by their receiving module.
- Special Upgrade tracks step/type/state; it is not an official item damage-stat calculator.

## Simulation disclaimer

- Upgrade odds, market valuations and rewards are fictional training/economy simulations, **not real Mabinogi probabilities or prices**. Check the simulator UI for the currently selected route, stone and anvil.
- Save and restore integrated balances through the Companion’s full-profile backup, not a copy of a single module’s local storage.

## Source references

1. Reforge and item rules: [`reforge-simulator.js`](../../Companion%20Files/reforge-simulator.js), [`reforge-data.js`](../../Companion%20Files/reforge-data.js).
2. Erg: [`erg-simulator.js`](../../Companion%20Files/erg-simulator.js).
3. Special Upgrade: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js).
4. Chest, save and economy integration: [`app.js`](../../Companion%20Files/app.js).

## Ogham Rune practice and the Storage Chest (current, 0.3.12r)

The EV Reforge Simulator uses **one Item Type selector** for normal equipment, Echostone and Rune, rather than separate mode buttons. Rune opens the 26-stone visual word picker and read-only randomly rolled effect lines, with lock toggles and the next-roll cost. **Unlocked rerolls cost Gold only (5,000)**; locked lines add the documented Companion-practice Herb cost. Each rune retains its own reroll count and spending ledger, with a confirmation-based **Disassemble** practice refund. See [Ogham rune inventory and simulator](22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md) for exact rules.

The **same full Storage Chest** appears beneath Rune rerolls and ordinary reforges, backed by the existing Reforge Gold chest (`midir-reforge-sandbox-v1`) and Herb Collection chest (`midir-companion-herb-chest-v1`). Gold and Herb amounts update after a paid roll or Disassemble refund. Rune mode shows the shared balances and saved equipment inventory but suppresses equipment-specific purchase/withdraw/transfer buttons to avoid offering actions that cannot be completed from that view. This does not introduce a separate Rune currency, alter unrelated inventory, or rename storage keys.

All eight herb resource slots reuse the gathering game’s canonical sprite and name. Rune next-roll costs, accumulated spending and refund previews use the same art at compact sizes.

Gold/Herb costs and Disassemble refunds are **Companion practice economics**, not a representation of real in-game material or refund recipes. Catalog-development JSON loading is no longer shown in the player-facing simulator.
