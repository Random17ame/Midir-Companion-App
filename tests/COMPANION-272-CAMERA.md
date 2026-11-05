# Companion 272 — Vertrag camera

- Fixed player center on canvas screen coordinates `(425,270)` at all camera zoom levels.
- Scroll wheel zoom between `minCameraZoom(player)` (full circle on-screen even near arena boundary) and `2.65x`.
- Starts at `1.35x`; camera zoom lasts for the current run.
- Mapping for clicks: `player + (screen - center)/zoom`, then clamp to circular arena.
- Canvas world rendering is transformed; HTML HUD remains screen-space.

Validation: `vertrag_survival_test.py`, `vertrag_camera_test.py`, `regression_companion.py` (17 checks), JavaScript syntax and visual snapshot.
