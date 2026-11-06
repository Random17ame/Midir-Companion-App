# Language Support — English, Korean and Spanish

Version: Midir Companion 0.3.11c

Scope: Current implemented behavior only. Historical changes are recorded in `../CHANGELOG.md`.

## Current behavior

The language selector is available in the application header. English (`en`), Korean (`ko`) and Spanish (`es`) are stored as a local browser preference. English is the fallback for strings without a translation. The application does not translate imported reports, user-authored profile data or player names. Gameplay skill proper names can remain in English when needed for recognition.

The shared localization layer translates known navigation, settings, module controls, status text and many minigame UI labels; dynamic DOM insertions, changing HUD counters and known canvas-drawn text are handled as well. Desktop and mobile use the same language preference. New game text must be registered in both language dictionaries rather than written only as a hard-coded English string.

## Known limitations

The app does not claim complete localization of every long explanation, tutorial, dynamically composed status message or game-specific canvas callout. Unrecognized or complex messages fall back to English instead of being automatically translated. Canvas text may require manual spacing adjustments for longer Spanish and Korean labels. Skill names, imported evidence, and user-entered content are deliberately not automatically translated.

## Implementation references

1. `Companion Files/i18n.js` — language dictionaries, state persistence, DOM and canvas text translation.
2. `Midir Companion.html` — language selector and script load order.
3. `Companion Files/app.js` — page rendering and language refresh integration.
4. `Companion Files/theta-rhythm.js`, `Companion Files/vertrag-survival.js`, `Companion Files/as-chicken-invaders.js` — minigame text sources.
5. `Companion Files/ev-defense.js`, `Companion Files/mp-rhythm.js`, `Companion Files/ek-pig-pursuit.js` — additional in-game UI text.
