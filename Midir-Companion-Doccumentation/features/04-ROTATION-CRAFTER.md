# Rotation Crafter and Arcana practice

**Applies to:** Midir Companion 0.3.4.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Play and configuration

- Arcana Simulators provides a Rotation Crafter for practicing skill order and pacing with configurable controls, selected target scenarios and Arcana-themed art. The exercises are separate from imported combat-data analysis.

## Specialized activity links

- Arcana pages connect to dedicated activities, including Subject Theta, Sacred Guardian Oath tools, Crom Bás Invaders and other Arcana-specific training. Distinct character and action sprites are bundled locally.

## Scope

- Practice cooldowns, timings and damage feedback are training representations. Do not treat simulated outputs as live game telemetry or evidence of actual combat success.

## Source references

1. Crafter and Arcana routing: [`app.js`](../../Companion%20Files/app.js), [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js), [`rotation-skill-icons.js`](../../Companion%20Files/rotation-skill-icons.js).
2. Local artwork registry: [`icons.js`](../../Companion%20Files/icons.js).

## Mobile Rotation Crafter controls

On touchscreens, the hotkey bar is laid out in six columns per row and the Skills drawer opens from the bottom of the screen. Drag a skill tile to a hotkey slot, or tap a skill and then tap a slot. Existing assigned slots can be dragged to move or swap skills, and long-pressed during setup to clear the slot. During an active practice session, tap a populated hotkey to cast; hold and release it for charged skills. Touch inputs use the same cooldown, combo-stage, and charge behavior as keyboard shortcuts. The desktop key layout and drag-and-drop remain available.

**References:** `Companion Files/app.js` (`craftTouchBind`, `craftKeyDown`, `craftKeyUp`, `craftAssign`, `craftMove`); `Companion Files/styles.css` (mobile `.craft-layout` rules). Physical-device gestures still require verification.
