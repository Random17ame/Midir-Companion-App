# Equipment simulators, upgrades and economy

**Applies to:** Midir Companion 0.3.0 (build 300; build 301 label correction).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Current tools

- **Reforge:** item/effect pools, modeled rolls, Dazzling tools, Echostone-specific selection and simulated Auction House features.
- **Erg:** B/A/S progression, simulated success rates and equipment handoff.
- **Special Upgrade:** R/S upgrade steps, stone classes, modeled failure/protection/recovery rules and shared storage identity.
- **Storage Chest and shared resources:** simulated gold, stones, items and rewards across compatible modules.

## Equipment identity and eligibility

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
