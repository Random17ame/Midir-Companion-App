# Companion 275 — Vertrag landmark map integration

- Floor source: approved `teal_landmark_arena_map.png`; bundled as `Companion Files/assets/vertrag/giant-phase-arena.png`.
- Eight landmark dots are baked into the artwork at 12, 1, 3, 5, 6, 7, 9, and 11 o’clock. Two larger north/south pads remain outside the teal ring.
- Drawing maps source center (620,580), radii (500,474) to world ARENA radius 226. No second drawn dot layer.
- Giant stations remain at 1, 5, 7, and 11 o’clock near the arena rim.
- Regression: `python tests/vertrag_survival_test.py <root>`, `node tests/vertrag_giant_rules_test.js`, `python tests/regression_companion.py <root>`.
- Visual smoke test: `python tests/arena275_visual.py` (requires Playwright and Chromium). Ensures floor loads, zoom up/down works, click-to-move accepted without page errors. Screenshot generated at `arena275-preview.png` in testing workspace.
