# Midir Companion 0.3.14a — Mobile Presentation Refinement

**Baseline:** 0.3.14 cumulative GitHub-ready source. **Scope:** shared responsive presentation and Theta portrait overflow. No new simulator mechanics, calculations, resource costs or save-schema changes.

## Current behavior

1. **Compact shared navigation:** narrower header with language/version controls, wrapping navigation, shorter return buttons, responsive Arcana tool cards, and tighter general spacing. Decorative mobile header and footer copy is omitted. [1] `Companion Files/styles.css`; [2] `Companion Files/app.js`.
2. **Prioritize tools:** Arcana strategy summaries remain in Skill Knowledge after tool links. The mobile Vault retains six quick tools, while secondary storage/memory guidance is in an expandable disclosure in advanced mode. Removed repetitive introductory/sidebar copy. New disclosure and return labels localized in Korean/Spanish. [2]; [3] `Companion Files/i18n.js`.
3. **Portrait overflow:** Theta title and currency stack rather than exceeding the viewport. Existing local table/inventory scrolling remains; no blanket page clipping. [1]; [4] `Companion Files/theta-rhythm.css`.

## Verification

- `tests/mobile0314a_presentation_test.py` — 40 checks at each of 320/390px; 39 at 1200px. No document overflow or page-level errors. Includes all ten Arcana hubs and distinct available tool routes, advanced Vault, SG dashboard/editor and selected translated larger-text views.
- SG Echostone, compact Ogham inventory and Litany gear tests pass at 1200/390/320px. Seven mobile gameplay layout checks and EV/Theta portrait/landscape checks pass. Core 17/17; interactions 9/9.
- This is a responsive smoke audit, not exhaustive visual certification of all states, report collections, physical phones or browsers. Hosted PWA refresh and real persisted reload remain unverified.

## Numbered source references

[1] `Companion Files/styles.css` — shared responsive styling.
[2] `Companion Files/app.js` — Arcana, Vault and return copy.
[3] `Companion Files/i18n.js` — localized labels.
[4] `Companion Files/theta-rhythm.css` — portrait header.
[5] `tests/mobile0314a_presentation_test.py` — route/state audit.
[6] `service-worker.js` — cache revision.
[7] `Midir Companion.html` — visible version.
