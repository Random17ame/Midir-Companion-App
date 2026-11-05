# Herb Collection and Precision Harvest — Feature Log

**Purpose:** Provide an inventory-linked herb gathering minigame and timed reaction challenge.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Collection and practice

- **Herb chest:** Tracks named herb varieties and individual quantities with bundled local images. [^1]
- **Precision Harvest:** Timed reaction mode generates collectible herbs, records missed/expired opportunities and misclicks, and awards gathering progress. [^1]
- **Standalone state:** Preserves `midir-companion-herb-chest-v1` and `midir-companion-herb-challenge-v1` and supports profile export/import. [^1]

## Shared bonuses and stone-drop contract

- Herb Collection's accumulated gathered-herb count is passed into `MIDIR_SPECIAL_UPGRADE.herb(total)`. The receiving module handles only **newly counted** herbs and makes independent rolls per herb: **1/250** for an ordinary Eweca Blue or Ladeca Red stone and **1/400** for a protective variant. Both can occur on one herb. This probabilistic system replaces a guaranteed 300–400-herb reward interval. [^1] [^2]
- Crom Bás Invaders can sell a permanent **Huge Lucky Harvest** bonus affecting the special 20× gathering outcome; that is separate from the probability of earning a Special Upgrade stone. [^3]

## Verification and outstanding limits

- Collection quantities are Companion progress, not a synchronized Mabinogi inventory.
- Preserve chest key compatibility and asset IDs; validate animation and challenge timers after any change to rendering.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Herb game, persistence and images: [`herb-collection.js`](../../Companion%20Files/herb-collection.js), [`assets/herbs/base.png`](../../Companion%20Files/assets/herbs/base.png).
[^2]: Special Upgrade herb-reward probabilities and increment handling: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js); route and backup integration: [`app.js`](../../Companion%20Files/app.js).
[^3]: Dark Erg shop hook and permanent bonus: [`as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js).
