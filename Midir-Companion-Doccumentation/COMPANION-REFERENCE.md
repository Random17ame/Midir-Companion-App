# Architecture, import and persistence reference — 0.3.9

The accompanying version **0.3.9** source is authoritative for this reference. Historical implementation changes are documented in [CHANGELOG.md](CHANGELOG.md).

## Static application and runtime

- `index.html` is the site entry point; `Midir Companion.html` loads the actual application through bundled scripts, assets and CSS under `Companion Files/`.
- `app.js` owns the shell, Vault, navigation, major state orchestration, backup and report viewing; individual games/simulators expose local state functions.
- `manifest.webmanifest`, `service-worker.js` and `Companion Files/pwa.js` implement HTTPS-hosted installability and offline asset caching. GitHub Pages is hosting only, with no backend storage or account synchronization.

## Report evidence and imports

- Compatible HTML/JSON/NDJSON imports are capped at **90 MiB per file**. Parsing can additionally fail when device RAM/quota is insufficient.
- Embedded structured report JSON is read from HTML source without constructing a full report DOM; the entire file is still loaded as text during import.
- Multi-encounter recordings stay one session; importer gate subdivision is **not implemented**.
- Player and Arcana attribution requires encounter-appropriate actor evidence. Imported hit events, skill observations and boss-state records are different evidence types. Unobserved events are not invented.
- The Vault tracks original reports, active details, archived compact summaries and lifetime achievements. Reactivating a compact archived entry requires an evidence-matching original export.

## Browser storage and backups

- User preferences, gameplay state and simulated inventories use application/local-module browser storage; report HTML and archive-related records use IndexedDB where available.
- Full-profile export is a JSON object with `type: "midir-companion-backup"` and `version: 2`; it includes supported training module state. A compacted archive may not contain the original HTML or full detail.
- Desktop supports up to 30 active detailed reports; the mobile policy defaults to 10. Never treat a GitHub repository as a private user-data store. Back up before browser resets, origin changes or migration between desktop and phone.

## Practice games and integration

- Dedicated game engines include `theta-rhythm.js`, `vertrag-survival.js`, `as-chicken-invaders.js`, `ev-defense.js`, `mp-rhythm.js` and others. Training rules, simulated rates and stored rewards are not official Mabinogi game measurements.
- Mobile gameplay support varies by activity. Cutting Chorus has touch aiming and separate skill-trigger controls and is accessible through its mobile Arcana hub entry. The legacy generic keyboard-only drill remains gated; Cutting Chorus still needs physical-phone usability verification.

## Source references

1. [Application shell and import/backup logic](../Companion%20Files/app.js)
2. [Analysis](../Companion%20Files/analysis.js), [skill evidence](../Companion%20Files/skill-evidence.js), [use rules](../Companion%20Files/skill-use-rules.js)
3. [PWA](../Companion%20Files/pwa.js), [manifest](../manifest.webmanifest), [service worker](../service-worker.js)
4. [Theta](../Companion%20Files/theta-rhythm.js), [Vertrag](../Companion%20Files/vertrag-survival.js), [Invaders](../Companion%20Files/as-chicken-invaders.js)
5. [Rotation Highlights cooldown floors and skill-shape rule inventory](ROTATION-SKILL-RULES-INVENTORY.md)
