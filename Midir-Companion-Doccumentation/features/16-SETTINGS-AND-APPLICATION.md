# Settings, navigation and mobile app

**Applies to:** Midir Companion 0.3.4.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Application shell

- Launch locally through `Midir Companion.html` or host `index.html` over HTTPS. Navigation provides the Vault, Arcana Simulators, Debuff Academy and an Overview menu for other tools.
- **See Secret Sauce** in Settings reveals extended import/analysis features while leaving basic Vault and Achievement Book access intact. With the option disabled, the mobile welcome card and basic achievements do not advertise imports, report archive limits or hidden report-only awards.

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

## Mobile training interfaces

- Crom Bás Invaders has dedicated skill buttons, a joystick, live touch-button cooldown labels, joystick-controlled Irusan struggle, and small color-coded elemental gauges. Portrait keeps the arena above the controls; landscape keeps buttons alongside it.
- Subject Theta has touch-triggerable rhythm bubbles and timing targets, four combat lanes, separate utility controls and a Twilight Surge charge indicator. Keyboard bindings are retained.
- Physical mobile/PWA ergonomics, orientation handling and storage permissions require device verification; browser tests are not a substitute for gameplay.

## Source references for mobile features

1. `Companion Files/as-chicken-invaders.js` and `Companion Files/styles.css`.
2. `Companion Files/theta-rhythm.js` and `Companion Files/theta-rhythm.css`.
3. `tests/release033_gameplay.py`.
