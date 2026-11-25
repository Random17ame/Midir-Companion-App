# Ogham effect levels · 0.3.12r

The offline catalog contains **97 effect entries** transcribed from the English official Arcana: New Awakening Part 1 update: 52 Talent effects, 45 Arcana effects. Every effect has a discrete level list, 10 levels for Arcana and some Talent flat bonuses, 20 levels for the remaining Talent bonuses.

**Important provenance:** The official patch page prints minimum and maximum values only. The intermediate values in this release are reconstructed by equal increments from those endpoints (the progression is consistent with the stated 10/20 levels), **not** extracted from Prilus `OghamAbilityList.Values`. Do not call them independently verified. A future verified Prilus source snapshot could be integrated through a normal code/data update. The player-facing import button has been removed, though profiles retaining previously imported valid data continue to load it.

`Companion Files/ogham-effect-levels.js` stores `Id`, `GeneralPool`, localized `Desc`, `Values`, `Unit`, `MaxLevel`, `Min`, `Max`, and `EndpointDerived`. IDs 90001–90097 are internal, not official Prilus IDs. Its script loads before `ogham-runes.js`. In an existing user profile, a source import continues to override the bundled reconstructed catalog.

English names come from the official English patch. Korean/Spanish labels are reused from the existing translator where available; other effects deliberately display neutral localized placeholders rather than potentially wrong skill names. Label verification remains open.

References: https://www.nexon.com/mabinogi/news/47371/arcana-new-awakening-part-1-update and https://prilus.gitlab.io/en/ogham

**Visual quality indicator (0.3.12m, November 25):** gold text denotes an actual discrete level at or above 90% of the effect maximum (9–10/10 or 18–20/20). Perfect rolls have a subtle extra outline. This is a presentation rule only, not new data evidence or a change in probabilities.
