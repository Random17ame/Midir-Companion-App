# Companion 262 — focused structural cleanup

Baseline: Companion 261. All previously stored keys, game data, assets and public module APIs retained.

## Refactors

- `app.js`: Use one delegated document click handler for `data-act` actions rather than attaching a fresh listener to every action button at each render. This also covers buttons inserted after initial page binding (e.g. award detail controls).
- `app.js`: Remove the now-unnecessary local action bindings in `evidence()`.
- `app.js`: Remove a literal `if(false)` Debuff Academy library markup branch; the live library redirects to the Academy home already.

No game-rule, balancing, import-parsing or save-schema changes.

## Checks

- 24 JavaScript syntax checks.
- 17 route / entry checks and 9 Theta controls, as in the 261 audit.
- New delegated-actions test: dynamic action buttons, clicks on nested span, repeated rerenders, and exactly one saved practice round per click. This additional test intentionally fails on 261, where dynamically inserted buttons without an explicit rebind were not connected.

## Not changed

- The chained `render`, `action` and `bind` extension overrides; replacing them wholesale would require substantial feature coverage.
- Any dynamically loaded sprite assets or saved-profile fields.

## Testing limitations

Browser tests inject packaged scripts into an isolated page. They do not provide actual asset-loading, real imported reports or full persistence lifecycle coverage. 
