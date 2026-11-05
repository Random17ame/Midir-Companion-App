# Companion 268 — Vertrag Sprite Integration

- Added pose images from the user-approved masked, knuckle-form Vertrag sprite sheet.
- Boss pose animation keyed to chase, charge tell, movement, rising uppercut, teleport windup, and second slam. One pose per animation frame; no double-character crops in the selected pose sequence.
- Player appearance inherited from the Arcana currently selected in Arcana Simulators, using existing Rotation Crafter character artwork. Movement visually alternates a resting and windup pose.
- On-hit floating damage numbers (including 500-point fixed aura ticks) above the player sprite.
- Existing trainer combat rules, movement controls, settings, achievements, and saved-progress format retained.
- PNG sprite art served locally, no network dependency. Fallback artwork when an image is unavailable.

## Validation
- JS syntax checked with Node.
- Browser regression: 17/17.
- Vertrag-specific browser smoke test passed.
- Local asset-rendering visual screenshot inspected: selected Arcana and Vertrag sprites visible, one masked boss character.

## Further refinement
- The generator sprite poses do not have pixel-perfect Mabinogi skeletal animation or directional walk cycles; this build uses 2D pose changes and horizontal facing.
- Aura tick interval remains tunable in Controls; a definitive tick cadence was not measured in this build.
