Companion 261 offline regression tests

Run from an environment with Python, beautifulsoup4, Playwright and Chromium:
  python tests/regression_companion.py .
  python tests/interaction_test.py .

These tests inject the packaged JavaScript into an isolated browser document because
local file and localhost page navigation are blocked in the available test environment.
They verify state and controls, but not external image/audio loading, pixel-level
rendering, full importer workflows, or end-to-end localStorage persistence.

Companion 262 action dispatch: python tests/action_dispatch_test.py <extracted-build-dir>
This confirms delegated actions work for dynamically inserted/nested buttons and avoids repeated dispatch after rerender. The dynamic insertion case is an intentional improvement over 261.

Companion 263 module-entry binder parity: python tests/module_binding_test.py <extracted-build-dir>
Checks route-specific EV/Crom/AS/AG module binding, frame entry buttons and JavaScript exceptions.

Companion 265 spelling check: python tests/bri_leith_spelling_test.py <extracted-build-dir>
