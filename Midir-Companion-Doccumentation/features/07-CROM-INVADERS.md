# Crom Bás Invaders

**Applies to:** Midir Companion 0.3.11i.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Gameplay

- Alchemic Sharpshooter arcade shooter with waves of enemies, distinct attack styles and boss encounters, including Crom Bás-themed Glas Ghaibhleann variants. Arena play uses bundled enemy and effect artwork.
- Upgradable Aqua Volley, Terra Scourge and Anchor Rush, with keyboard play on desktop and touch attack controls plus a movement stick on mobile. Both portrait and landscape mobile layouts are available.

## Progress and integration

- The game has an unlock/progression shop and local records. Some earned resources feed shared Companion equipment and achievement systems; it does not represent live Mabinogi combat or economy.
- Mobile touch input uses the existing skill gating: unavailable/unpurchased actions remain disabled.

## Interpretation

- Enemy behavior, skill damage and reward pacing are custom arcade rules. Artwork atlases are indexed by fixed cell coordinates and should not be trimmed as if they were independently exported frames.

## Source references

1. Gameplay and mobile controls: [`as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js).
2. Shared progression: [`app.js`](../../Companion%20Files/app.js).


## Mobile controls, shield behavior and defensive fire

- Portrait layout: gameplay above a nine-skill touch grid (left) and analog movement stick (right). Landscape layout: skill grid to the left of the gameplay and stick to the right.
- All nine skills have dedicated buttons; locked skills remain visible but disabled. Aqua, Terra and Anchor use press/hold/release; other skills cast on a tap.
- Elemental orbs are compact and aligned at the top-right of the game area. Empty orbs appear grey, partial fills show the element hue, and fully charged orbs illuminate: red Fire, blue Water, bright-white Wind, tan/brown Earth.
- Cari grants nearby allies a damage-absorption pool equal to two baseline, unupgraded Magnum Shots (36 damage), refreshed on a shared five-second cycle. Higher-damage skills can deplete the pool and deal remaining damage to HP in the same hit. Ronaun shields absorb one baseline unupgraded Magnum Shot (18 damage), with excess damage overflowing to HP. Other shields retain their existing numeric absorption behavior.

- The Irusan power struggle accepts rapid alternating left/right joystick directions on mobile, equivalent to keyboard A/D or Left/Right. Held-stick direction does not repeatedly progress the struggle.
- Mobile touch skills show live cooldown seconds on their buttons and remain unavailable while cooling, except when holding an in-progress charged action.
- Short-range automatic defensive ranged shots fire at enemies within 115 canvas units to help when Gwallgof-like melee enemies flank or overlap the player. They follow the normal Magnum auto-fire interval, including Golden Time acceleration, without gaining Magnum’s full attack range.

## Verification

- Automated portrait and landscape checks cover joystick alternating, Ronaun shield overflow, nine touch controls, cooldown labels and elemental fill states (`tests/release033_gameplay.py`). Physical-device ergonomics and balance require playtesting.

## Mobile movement selection

The mobile movement pad can switch between analog and D-pad, sharing its saved device preference with Vertrag survival. Diagonal D-pad input is supported; Irusan struggle receives horizontal motion from either control. See `18-MOBILE-FEATURES.md`.
