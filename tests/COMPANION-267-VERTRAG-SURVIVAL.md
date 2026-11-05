# Companion 267 — Vertrag Survival Grounds

Updated the shared, cross-Arcana Vertrag trainer (existing MIDIR_VERTRAG module and localStorage/profile key retained).

- Survival setup: 0–4 unattended giants, four durability presets, Endless vs Time Trial, configurable challenge duration.
- Instructions and learnable challenge modes, with the earlier eight focused drills retained under a collapsible practice list.
- WASD/rebound-key movement plus left-click-to-move, click retargeting, movement-key cancellation.
- Four giant locations remain static in Endless. In Time Trial, each living giant clears only while Vertrag's damaging shadow overlaps its location. Nominal individual clear times are 3× approximate coordinated-party times: 9/24/18/6 seconds; slower when just one giant is shadow-covered.
- Blue Hemorrhage: all stacks share one 30-second expiry, refreshed on each stack, cap 10; escalating multipliers through stack 10.
- Multi-stomp overlaps resolve as separate consecutive hits against the current stack count. Stomp damage ratio can be tuned between 25% and 50% of baseline Vertrag hit.
- Charge: direction-locking windup, visible forward-oriented lane, animated travel, uppercut damaging at mid-swing; safe side and rear regions.
- Teleport: small first hit without stack, then larger 1.5×-stomp-radius second strike adding a stack, with walk-away window.
- Shadow ticks: fixed 500 HP damage, no stack multiplication; configurable tick interval pending reliable footage measurement.
- HP negative deadly range down to -100%, death from any subsequent hit while deadly; stun and knockdown inhibit recovery potion; Q potion recovers HP/MP/stamina and has a 30 s cooldown.
- Personal survival records keyed by mode, giant count and selected durability. Existing recorded drill progress retained and backup/restore-compatible.

Tests: `python tests/vertrag_survival_test.py .` and `python tests/regression_companion.py .` passed; JS syntax verified with node.

Tuning remains a gameplay approximation, not an exact damage or timing simulator. The 500-damage aura value comes from the player's explicit rule; tick interval remains tunable.
