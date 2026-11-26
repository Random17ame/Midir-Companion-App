# Positioning, frame challenges and chase games

**Applies to:** Midir Companion 0.3.15.

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

## Compact mobile action UI (current)

Arsenal Gunner places its Detonation Field and Heavy Artillery touch selectors and Commit/Randomize/Clear action buttons **above** the positioning arena, with icons where bundled skill artwork exists. Advanced firing parameters remain below the arena. Pig Pursuit's initial mobile overlay is a single brief instruction and a visible Begin Ride button; desktop keyboard explanation remains available only for desktop input. Bandit Hunt displays icon-only mobile response buttons in a centered encounter dialog with accessible skill names, avoiding wrapped multi-line labels. [1] `Companion Files/app.js`; [2] `Companion Files/ek-pig-pursuit.js`; [3] `Companion Files/bb-bandit-flip.js`; [4] `Companion Files/styles.css`.

## Bandit Hunt — trade road exploration (0.3.15)

- Begin at Camp in a 5×5 region. Resolve a location on the corresponding edge to open a new region to the north, south, east or west; a previously visited region is always reachable from its adjacent region. Coordinates and a return arrow identify travel; the current region is kept in memory for the active hunt.
- Flipped encounters, chain-sweep rewards and stolen prizes remain resolved for the entire hunt. No automatic replacement or repeat payout; adjacent rewards and pressure remain region-local. New terrain is generated on first entry. End Hunt and start another to generate a fresh map; leaving and reopening the tool within the same page retains the run, but full reloads do not.
- The same Counter Punch (1), Charging Strike (2), Tumble (3) and wildlife wait rules apply. A centered encounter dialog keeps artwork, timer and response controls visible. Streak pressure, lucky rewards, five payout tiers and cross-module earnings remain.
- A wrong response permanently forfeits that location and all still-hidden adjacent prizes; a timeout forfeits that location. Either also steals up to the encounter's base reward from net current-hunt earnings already credited to Storage Chest. The debit cannot exceed either net hunt earnings or the balance above the starting chest amount. Earned ducats from completed hunts remain protected. End Hunt records net earnings.
- Help and records are collapsible. The current hunt map is not included in persistent profile backups; existing lifetime records and balances remain compatible.

Sources: [1] `Companion Files/bb-bandit-flip.js`; [2] `Companion Files/reforge-simulator.js`; [3] `Companion Files/styles.css`; [4] `tests/bandit0315_map_browser_test.py`.
