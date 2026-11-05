# Mobile Features and Touch Support

**Applies to:** Midir Companion **0.3.2a**. This is a current-state reference, not a historical release record.

## Web app and installation

- Midir may be hosted as a static HTTPS website (including GitHub Pages). `index.html` is the hosted entry point; the PWA manifest and service worker support home-screen installation and an offline app shell once cached.
- Asset availability offline depends on which resources have been cached; first install and major updates require network access.
- Reports, profiles, minigame progress and preferences are stored locally in the device's browser/site storage; hosting does **not** synchronize data between PC and phone. Export a profile backup before clearing site data, uninstalling, or changing the app origin.

## Implemented mobile interface

- Responsive navigation and mobile-friendly access to the Companion's preparation tools and settings.
- The mobile HTML combat-report viewer opens full-screen, with zoom, fit and scatter-chart navigation controls. Report importing is an advanced feature controlled by **Secret Sauce**; the basic mobile welcome screen does not advertise it when the toggle is off.
- Crom Bás Invaders supports **all nine skills via touch buttons**. **Portrait:** playfield above skill buttons on the left and analog stick on the right (handheld/GameBoy layout). **Landscape:** side controls flanking the playfield (GBA-style layout). Elemental/alchemy orbs are reduced and placed near the upper-right of the playfield.
- Crom Bás Invaders' Cari shield is a shared damage pool corresponding to two baseline Magnum Shots, rather than immunity to two whole attacks. Its damage calculation is the same on mobile and PC.
- Mobile navigation and/or controls have been developed for other activities, including Bandit Hunt and select minigames, but **not every keyboard-dependent game is confirmed fully playable by touch**. Treat support as game-specific until audited on real devices.

## Desktop parity and accessibility

- Desktop keyboard controls are retained; mobile touch controls are additional interfaces where supported.
- Portrait and landscape layouts must keep health, resources, prompts and other critical information visible without buttons obscuring the playfield. Preserve accessible sizing and safe areas.
- Do not infer a game's mobile support simply because it can be opened in a phone browser; confirm that all actions—including hold, simultaneous inputs, aiming, pausing and restarting—have working touch equivalents.

## Outstanding mobile audit (next development priority)

Create a source-verified matrix for **every** keyboard-dependent activity: desktop key/mouse actions, existing phone affordances, missing actions, proposed touch mapping, orientation handling, and test priority. Verify real-device multitouch, button hold/release, cancellation, on-screen keyboard interference, orientation rotation, pause/resume, and offline reloading. Physical-phone acceptance testing has not been reported for all recent controls.

## Source references

1. PWA assets and registration: [`manifest.webmanifest`](../../manifest.webmanifest), [`service-worker.js`](../../service-worker.js), [`Companion Files/pwa.js`](../../Companion%20Files/pwa.js).
2. Responsive UI and report viewing: [`Companion Files/app.js`](../../Companion%20Files/app.js), [`Companion Files/styles.css`](../../Companion%20Files/styles.css).
3. Crom Bás Invaders gameplay: [`Companion Files/as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js).
4. Other game-specific interfaces for audit: [`Companion Files/vertrag-survival.js`](../../Companion%20Files/vertrag-survival.js), [`Companion Files/theta-rhythm.js`](../../Companion%20Files/theta-rhythm.js), [`Companion Files/bb-bandit-flip.js`](../../Companion%20Files/bb-bandit-flip.js).
