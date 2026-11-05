# Positioning, frame challenges and chase games

**Applies to:** Midir Companion 0.3.9.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Activities

- Includes class-themed positioning and aiming exercises, Frame Bowling, Elemental Knight pig pursuit, and Brawler Bandit Hunt. Input and scoring rules are local practice mechanics.
- Pig Pursuit supports separate mobile Carrot and Rider Balance sticks; Bandit Hunt and the AS/AG positioning labs also have touch input. Desktop mouse/keyboard input remains available.

## Mobile positioning controls

- **Alchemic Sharpshooter Positioning Lab:** Drag the blue player, red targets, or larger aiming handle with a finger. Attack shape, angle, reach, and spread remain adjustable with touch-friendly form controls.
- **Arsenal Gunner Field & Firing Lane Lab:** Use the orange **Detonation Field** mode to tap a location (including a target) and place a field. Switch to purple **Heavy Artillery** mode, then tap a target to center the target-based circular attack. Drag player/enemies to rearrange freely. Attack areas are illustrative rather than calibrated Mabinogi hitboxes.
- **Target Frames (AS/AG):** Move the player and rotate the firing lane with touch. AG has separate orange field-placement and purple artillery-target modes; tap a target to aim artillery, while the enemies remain fixed in frame challenges. Fire / Next / Reset buttons remain touch-accessible.
- In both labs, fields and Heavy Artillery have distinct colors and controls. The underlying hit/overlap calculations remain unchanged.

## Records and rewards

- Progress and supported rewards connect to the Companion’s locally saved achievements/economy. The games do not send live game commands or perform real inventory changes.

## Source references

1. Bowling: [`frame-bowling.js`](../../Companion%20Files/frame-bowling.js).
2. Pig pursuit: [`ek-pig-pursuit.js`](../../Companion%20Files/ek-pig-pursuit.js).
3. Bandit Hunt: [`bb-bandit-flip.js`](../../Companion%20Files/bb-bandit-flip.js).
4. UI integration: [`app.js`](../../Companion%20Files/app.js).

## Pig Pursuit mobile inputs

Pig Pursuit uses independent touch sticks: the carrot-direction stick points the pig toward a target while the rider-balance stick applies an opposite lean for stability. Both can be manipulated simultaneously. The desktop mouse/keyboard inputs, difficulty selection, collectible effects, world collisions and score model are unchanged. Physical-phone multitouch responsiveness is pending.

**References:** `Companion Files/ek-pig-pursuit.js`, `Companion Files/styles.css`, `tests/mobile038_pig_ev_test.py`.
