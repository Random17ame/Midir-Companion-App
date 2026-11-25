# Language Support — English, Korean and Spanish

Version: Midir Companion 0.3.13

Scope: Current implemented behavior only. Historical changes are recorded in `../CHANGELOG.md`.

## Current behavior

The language selector is available in the application header. English (`en`), Korean (`ko`) and Spanish (`es`) are stored as a local browser preference. English is the fallback for strings without a translation. The application does not translate imported reports, user-authored profile data or player names. Gameplay skill proper names can remain in English when needed for recognition.

The shared localization layer translates known navigation, settings, module controls, status text and many minigame UI labels; dynamic DOM insertions, changing HUD counters and known canvas-drawn text are handled as well. Desktop and mobile use the same language preference. New game text must be registered in both language dictionaries rather than written only as a hard-coded English string.

## 0.3.12a Spirit Weapon and relic localization

- The Harmonic Saint Litany module provides independent English, Korean and Spanish labels for its video-sourced Spirit Weapon augment names, three Murias relic slots, selected Prefix/Suffix enchants, fixed Pulse, Healing-only Amulet and S50-conditional Dark Erg. The underlying user-supplied names/rolls remain unmodified.
- The translated 0.3.12a Offline header marker is included in the shared translation dictionary. All locales use the same saved structure and arithmetic; switching languages does not overwrite equipment choices.

## 0.3.12 calculator and SG updates

- The **Harmonic Saint Litany Lab** uses its own locale dictionaries in `hs-litany-lab.js`; all boost/equipment editor labels and informative tooltips now have English, Korean and Spanish paths. User-authored enchant and item names remain literal; this is intentional.
- The **new SG relic, Ophelia’s Tears and emblem cards/edit dialogs**, associated stat/status vocabulary and displayed 0.3.12 version tag are translated in `i18n.js`. The language switch rerenders the affected UI without changing saved state.
- English views do not display Korean calculator labels; the Korean version uses Korean interface copy, and Spanish calculator fields and tooltips use Spanish rather than defaulting to English.

## Known limitations

The app does not claim complete localization of every long explanation, tutorial, dynamically composed status message or game-specific canvas callout. Unrecognized or complex messages fall back to English instead of being automatically translated. Canvas text may require manual spacing adjustments for longer Spanish and Korean labels. Skill names, imported evidence, and user-entered content are deliberately not automatically translated.

## Implementation references

1. `Companion Files/i18n.js` — language dictionaries, state persistence, DOM and canvas text translation.
2. `Midir Companion.html` — language selector and script load order.
3. `Companion Files/app.js` — page rendering and language refresh integration.
4. `Companion Files/theta-rhythm.js`, `Companion Files/vertrag-survival.js`, `Companion Files/as-chicken-invaders.js` — minigame text sources.
5. `Companion Files/ev-defense.js`, `Companion Files/mp-rhythm.js`, `Companion Files/ek-pig-pursuit.js` — additional in-game UI text.

6. `tests/companion0312_boost_cards_test.py` — EN/KO/ES card and dialog smoke tests at desktop/mobile widths.

## Ogham draft localization (0.3.12e Draft)
The separate `ogham-runes.js` module translates its inventory, slot, grade, tooltip and reroll labels in English/Korean/Spanish. Stable Latin rune-word IDs are not translated. December English combo titles are provisional pending NA publication. The ten December recipes have Korean names from the Korean update; the first 20 retain neutral Korean combination labels instead of fabricated skill names until verified. The 18 illustrated attribute labels are localized separately; custom user-authored labels are never translated. See [Ogham guide](22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md).
