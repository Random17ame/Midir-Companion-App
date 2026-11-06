# Midir Companion 0.3.11d — Theta judgment and on-deck notes

**Baseline:** Full cumulative 0.3.11c source. **Release:** Full cumulative 0.3.11d package. **Only Theta game logic/visual timing is changed.**

## Accepted gameplay behavior

1. Flat timing rings are on the fretboard, slightly larger than the notes. Only full-note containment gives Perfect; partial overlap gives Great, Good or OK, with later overlaps scoring more than comparable early overlaps.
2. An unmatched, wrong-lane or outside-ring press is harmless. Five **unplayed notes that fall off the end of the track** cause a failure; three consecutive successful judged notes clear the current miss stack. History retains all misses.
3. The next real queued note appears stationary at the far end before its scheduled approach, including while an earlier note moves. No phantom notes, fabricated activations or new cooldown rules. After the final real event resolves, the run ends rather than lingering with an empty highway.
4. Retain first-person graphics, touch/keyboard controls, user-configurable scroll/offset, existing low-cost mobile graphics mode, level-6 Surge warning, and later persistent Surge reminder.

## Verification and remaining limitations

`tests/theta0311d_judgment_test.py` runs at phone portrait, small phone portrait and landscape viewports (320×568, 390×844, 844×390). The nine pre-existing Theta mechanics tests, `tests/regression_companion.py`, module bindings and mobile UI tests are part of the release checks. The tests use a deterministic simulated clock to cover success/miss conditions without relying on hardware timing. Physical-phone latency and visual feel still require field testing.

**Sources:** [1] `Companion Files/theta-rhythm.js`; [2] `tests/theta0311d_judgment_test.py`; [3] `tests/theta282_test.py`; [4] `Midir-Companion-Doccumentation/features/05-THETA-CONTAINMENT.md`; [5] `service-worker.js`.
