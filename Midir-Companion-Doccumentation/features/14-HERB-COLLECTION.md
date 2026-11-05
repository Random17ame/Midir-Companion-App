# Herb Collection and Precision Harvest

**Applies to:** Midir Companion 0.3.9.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Activity

- Herb collection and timing exercises produce local collection progress and item-based reward hooks. The mini-activity is usable with touch-friendly input where supported.

## Reward integration

- Special Upgrade rewards from harvesting use random chance per newly collected herb; an interval of play does not guarantee a stone. The balances are simulated Companion inventory, not real Mabinogi items.

## Source references

1. Herb gameplay and save: [`herb-collection.js`](../../Companion%20Files/herb-collection.js).
2. Shared stone rewards: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js).
