# Vertrag — Giant Phase Survival Grounds

**Applies to:** Midir Companion 0.3.11d.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Pre-run flow

- The initial screen is a playable arena preview. **Click individual giants** to toggle their stomp source active/quiet, then choose **Time Trial** or **Endless**. The tutorial uses a bouncing click prompt. Time Trial duration can be selected.
- Next choose defense: **Easy** (shield, 8% incoming attack damage), **Normal** (heavy breastplate, 52%), **Hard** (leather armor, 100%), or **Veteran** (sunglasses, 160%). These modifiers affect the existing attack-damage model, not every fixed-damage effect.
- Internal drill progression data still exists, but locked challenges are not shown in the primary mode picker.

## Combat and visibility

- A top-down/camera-following survival arena includes giant stomp warnings, Vertrag attacks, knockback, progression and records. The player has a **health bar above the character** and a low-HP warning. The potion key defaults to **H** and can be rebound in Controls.
- Vertrag’s charge **locks the player’s current location at windup**, then dashes all the way to that location before uppercutting there—even if the player moves. Charge travel time depends on distance.
- The proximity-based quiet zone and its ground ring are **20% larger** than the original two-stomp-radius rule: `2 × stompRadius × 1.2`. Configured occupied giants also do not stomp.

## Graphics and data

- Uses cleaned separate frames for Vertrag and the player Arcana silhouettes; assets are local and fallback shapes keep the game functional if an image fails to load. Controls, options and records use a dedicated browser save key.

## Source references

1. Arena, controls and mechanics: [`vertrag-survival.js`](../../Companion%20Files/vertrag-survival.js), [`vertrag-survival.css`](../../Companion%20Files/vertrag-survival.css).
2. Shared backup: [`app.js`](../../Companion%20Files/app.js).

### Arena-edge visibility

The playable arena boundary constrains the player’s **position**, not the visible character silhouette: the player sprite, overhead HP bar, and floating hit numbers continue rendering across the visual perimeter when approaching the 1 and 11 o’clock giants. Ground hazards and arena effects remain clipped to the arena. (`Companion Files/vertrag-survival.js`)

## Mobile controls

On touch devices, Vertrag survival provides a right-side analog stick or four-way D-pad, a dedicated potion control with a live cooldown label, and two-finger arena pinch zoom. Portrait keeps the arena above controls; landscape places controls beside it. Touch selections work in giant setup and defense menus. Keyboard, left-click movement, and desktop wheel zoom remain supported. See `18-MOBILE-FEATURES.md`.

## Setup accessibility (current)

On touch screens and narrow viewports, the Trial/Endless mode selector is **below the giant-selection canvas**, not layered over the giants. All four giants remain directly tappable before choosing a mode; movement/combat rules are unchanged. [1] `Companion Files/vertrag-survival.css`.
