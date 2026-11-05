# Crom Bás Invaders

**Applies to:** Midir Companion 0.3.2 (build 305).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Gameplay

- Alchemic Sharpshooter arcade shooter with waves of enemies, distinct attack styles and boss encounters, including Crom Bás-themed Glas Ghaibhleann variants. Arena play uses bundled enemy and effect artwork.
- Upgradable Aqua Volley, Terra Scourge and Anchor Rush, with keyboard play on desktop and touch attack controls plus a movement stick on mobile. Landscape orientation is preferable for the fixed-ratio playfield.

## Progress and integration

- The game has an unlock/progression shop and local records. Some earned resources feed shared Companion equipment and achievement systems; it does not represent live Mabinogi combat or economy.
- Mobile touch input uses the existing skill gating: unavailable/unpurchased actions remain disabled.

## Interpretation

- Enemy behavior, skill damage and reward pacing are custom arcade rules. Artwork atlases are indexed by fixed cell coordinates and should not be trimmed as if they were independently exported frames.

## Source references

1. Gameplay and mobile controls: [`as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js).
2. Shared progression: [`app.js`](../../Companion%20Files/app.js).


## Current mobile controls (0.3.2)

- Portrait layout: gameplay above a nine-skill touch grid (left) and analog movement stick (right). Landscape layout: skill grid to the left of the gameplay and stick to the right.
- All nine skills have dedicated buttons; locked skills remain visible but disabled. Aqua, Terra and Anchor use press/hold/release; other skills cast on a tap.
- Elemental orbs are compact and aligned at the top-right of the game area.
- Cari grants nearby allies a damage-absorption pool equal to two baseline, unupgraded Magnum Shots (36 damage), refreshed on a shared five-second cycle. Higher-damage skills can deplete the pool and deal remaining damage to HP in the same hit. Other shield types retain their existing numeric absorption behavior.
