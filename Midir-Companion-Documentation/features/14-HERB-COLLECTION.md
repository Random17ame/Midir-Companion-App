# Herb Collection and Precision Harvest

**Applies to:** Midir Companion 0.3.12r.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Activity

- Herb collection and timing exercises produce local collection progress and item-based reward hooks. The mini-activity is usable with touch-friendly input where supported.

## Reward integration

- Special Upgrade rewards from harvesting use random chance per newly collected herb; an interval of play does not guarantee a stone. The balances are simulated Companion inventory, not real Mabinogi items.

## Source references

1. Herb gameplay and save: [`herb-collection.js`](../../Companion%20Files/herb-collection.js).
2. Shared stone rewards: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js).

## Herb target geometry (current)

Herb sprites in the gathering field scale to a legible 42×78 CSS-pixel frame, and the clickable button uses only a narrow 2-pixel border around the displayed sprite rather than a much larger transparent region. The random herb placement and timing mechanics are unchanged. [1] `Companion Files/styles.css`.

## Shared resource artwork (0.3.12p)

The eight gathering sprites (Base, Mana, Mandrake, Sunlight, Bloody, Poison, White and Golden) are also used in EV’s shared Storage Chest and Rune cost, spending and refund displays. All views resolve the existing herb catalog by ID and use the same local assets, including static White Herb (`white.png`) and animated Golden Herb (`golden.gif`); only the display size varies. The earlier filenames and catalog assignments were reversed relative to the intended artwork; the correction renames the original files without re-encoding them or changing herb IDs. Generic achievement symbols are not individual herb inventory icons. Gathering mechanics and stored balances are unchanged.
