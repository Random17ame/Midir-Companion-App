# Crom Bás Invaders

**Applies to:** Midir Companion 0.3.0 (build 300; build 301 label correction).

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
