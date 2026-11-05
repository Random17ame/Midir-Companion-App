# Companion 266 — Vertrag Giant Phase Survival framework

## Added
- Universal Arcana reference-page shortcut, with Sacred Guardian instructor framing.
- Eight staged survival drills with stomp telegraphs, overlapping waves, current-position targeting, pursuit aura, charge and teleport strikes, and escalation with unattended giants.
- Movement keybinding (duplicate rejection), pause/resume, free practice, game canvas, health/vulnerability HUD, scoring and records, six local awards.
- Configurable telegraph duration, wave interval, stomp radius, movement speed, aura radius, and additional unattended giants.
- Persisted progress and profile backup export/restore using `trainingExtras.vertrag`.

## Calibration required
- All timing and size values are provisional; compare against the provided giant-phase video before treating them as accurate encounter mechanics.
- Geometry and encounter visuals are training placeholders; boss and giant artwork are not final.
- Damage and vulnerability scaling are illustrative and have not been verified against Mabinogi combat data.

## Validation
- `tests/vertrag_survival_test.py`: browser-injected test: SG/DD entry, menu, settings, input binding, arena launch, movement input, pause/resume, results and records, navigation and exceptions.
- Existing `tests/regression_companion.py`: 17/17 checks pass.
- Node syntax checks on all Companion Files/*.js: pass.
