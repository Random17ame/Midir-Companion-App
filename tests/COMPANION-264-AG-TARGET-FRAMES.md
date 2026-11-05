# Companion 264 — AG Target Frames targeting separation

- Independent checkboxes for player-origin Firing Line and enemy-centered Heavy Artillery.
- Heavy Artillery target chosen with dropdown or click on an existing living enemy; automatically retargets when the selected enemy is defeated or a new frame begins.
- The line's yellow handle and angle slider no longer change the Heavy Artillery center.
- Separate Demolition Field placement mode: click empty ground to place, with a limit of five. Fields retain chain-detonation behavior.
- Fire is unavailable if both AG attack toggles are disabled.
- Alchemic Sharpshooter Target Frames behavior is unchanged.

Verification:

```
python tests/ag_target_controls_test.py .
python tests/module_binding_test.py .
python tests/regression_companion.py .
python tests/interaction_test.py .
python tests/action_dispatch_test.py .
```

Static syntax checks and browser tests passed in the isolated test environment. Full packaged offline gameplay asset rendering not verified.
