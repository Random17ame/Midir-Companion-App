# Positioning, frame challenges and chase games

**Applies to:** Midir Companion 0.3.0 (build 300; build 301 label correction).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Activities

- Includes class-themed positioning and aiming exercises, Frame Bowling, Elemental Knight pig pursuit, and Brawler Bandit Hunt. Input and scoring rules are local practice mechanics.
- Some games use keyboard-first controls, while Bandit Hunt supports touch-friendly actions on mobile.

## Records and rewards

- Progress and supported rewards connect to the Companion’s locally saved achievements/economy. The games do not send live game commands or perform real inventory changes.

## Source references

1. Bowling: [`frame-bowling.js`](../../Companion%20Files/frame-bowling.js).
2. Pig pursuit: [`ek-pig-pursuit.js`](../../Companion%20Files/ek-pig-pursuit.js).
3. Bandit Hunt: [`bb-bandit-flip.js`](../../Companion%20Files/bb-bandit-flip.js).
4. UI integration: [`app.js`](../../Companion%20Files/app.js).
