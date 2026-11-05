# Subject Theta: Containment

**Applies to:** Midir Companion 0.3.2 (build 305).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Progression and presentation

- Ten containment protocols progressively introduce Dark Diviner skills and Theta mechanics. Includes Free Practice, score streaks, achievements, Dark Sigils, the Dark Erg Exchange and cosmetic variants.
- Gameplay uses a first-person staff view, downward-moving note highway with **flat on-track timing rings**, recognizable bundled skill icons, compact button labels and optional expanded reference material. Thunder presentation uses layered bolts and impact visuals while preserving boss visibility.

## Controls and failure

- Offensive skills are rhythm judgments; Render Dorcha, Render Mana and Hexshroud are separate free-timing utility activations. Seething Mana is a toggle; Twilight Surge uses a separate player-triggered charged reminder. Keybinds are configurable.
- Five failed/incorrect inputs end a run; three consecutive successful judgments clear accumulated overheat. Misses flash red energy at the track edges; at four stacks the edge warning stays active with a red screen vignette until cleared.

## Resources and skills

- Base **MP is 2,500**, ordinary **Dorcha caps at 15** (starts at 10). Spell costs, Seething Mana bonuses and Hexshroud hit recovery have separate rules.
- While Seething Mana is active, completed eligible spell casts gain **5% Residual Dorcha** each; Twilight Surge requires 100% charge and its cooldown, and consumes no ordinary Dorcha.
- Shop upgrades include Vivace, Spirit Weapon Lucky Strike, Staff S50, Ice Bolt, spell scoring upgrades and optional cosmetics. The displayed economy and cast calibration are training models.

## Source references

1. Theta mechanics and UI: [`theta-rhythm.js`](../../Companion%20Files/theta-rhythm.js), [`theta-rhythm.css`](../../Companion%20Files/theta-rhythm.css).
2. Storage and cross-game awards: [`app.js`](../../Companion%20Files/app.js).
