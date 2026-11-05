# Settings, navigation and mobile app

**Applies to:** Midir Companion 0.3.0 (build 300; build 301 label correction).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Application shell

- Launch locally through `Midir Companion.html` or host `index.html` over HTTPS. Navigation provides the Vault, Arcana Simulators, Debuff Academy and an Overview menu for other tools.
- **See Secret Sauce** in Settings reveals extended import/analysis features while leaving basic Vault and Achievement Book access intact.

## UI and localization

- Shared desktop/mobile visual palette with responsive layouts, menu controls and adjustable accessibility preferences including accent, text size, reduced motion and tooltip timing.
- English, Korean and Spanish selection are available; some standalone activity translations may remain partial.

## Mobile and offline behavior

- A PWA manifest and service worker enable home-screen installation and app-shell offline loading after first fetch/caching from HTTPS. Assets requested later may require a prior online visit before offline availability.
- The full-screen mobile HTML report reader includes scatter navigation, display zoom and fit. Browser storage belongs to the origin and does not sync between devices.

## Data safety

- Export backups and retain raw reports before clearing site data or changing origin. Static GitHub Pages hosting does not store personal report data.

## Source references

1. Application state, settings and mobile reader: [`app.js`](../../Companion%20Files/app.js), [`styles.css`](../../Companion%20Files/styles.css).
2. PWA: [`pwa.js`](../../Companion%20Files/pwa.js).
3. Application launcher: [`../index.html`](../../Companion%20Files/../index.html).
