# Current design and verification principles — 0.3.11d

## Product and evidence contract

- Use the same dark palette and recognizable Mabinogi icons across desktop and mobile. Prefer compact on-screen controls, clear status cues, and optional expanded explanations over long default text.
- Keep training simulations separate from imported combat analysis. Treat missing actor/boss/debuff evidence as unknown, not confirmation.
- Keep saved identifiers and backup compatibility stable across releases. Preserve original imported files outside the browser for archive reactivation.
- New features must not silently change other games, simulators or the historical achievement ledger.

## Acceptance checks

1. Build passes JavaScript syntax and selected browser regression tests. Confirm local launcher and GitHub Pages paths remain valid.
2. Validate report imports including HTML/JSON/NDJSON, duplicate recognition, compact archives and backup restore. For large reports, check browser memory/quota and avoid claiming all devices can import the maximum permitted file size.
3. Test source-specific attribution and per-encounter Arcana decisions against contradictory or missing observations.
4. Test game mechanics independently of presentation: Theta timing/costs, Vertrag dash locked endpoints and giant quiet boundaries, and simulator inventory identity.
5. For phone changes, check narrow viewport controls and overlays, PWA caching and touch input. Browser-emulated tests do not prove physical-phone performance.
6. When a mobile engine gains new touch handling, check that its **hub route is actually reachable** from a phone; implementation alone is not sufficient. Update **affected current-state feature guides** and architecture references with each behavioral change; record the change history separately in `CHANGELOG.md`.

7. For Rotation Highlights rules, keep **cooldown floors**, **cast/action evidence**, **per-use hit budgets**, and **skill shapes/durations** separately identified. No zero floor is evidence of an actual zero cooldown; do not adopt training cooldown approximations as verified game values.

## Source and tests

- [Tests directory](../tests/) — regression scripts and browser checks.
- [Application source](../Companion%20Files/app.js) and module-specific source files linked from the feature guides.
