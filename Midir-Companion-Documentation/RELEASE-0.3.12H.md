# Midir Companion 0.3.12h — Ogham Rune Symbol Centering & Optical Sizing (Draft)

**Baseline:** 0.3.12g cumulative ZIP with corrected `Midir-Companion-Documentation/` folder. **Scope:** Ogham glyph presentation, browser checks, documentation, release/cache metadata. Existing gameplay formulas, rune inventory, saved profiles, selection interactions, shared chests, and reroll rules are unchanged.

## UI and rendering

1. The Ogham inventory and pentagon sockets now show all 26 words as their corresponding historical Unicode Ogham glyphs, inside the same existing stone-like visual frames.
2. The browser measures each letter's **painted ink bounds** with Canvas TextMetrics, rather than relying on glyph advance width or font line box. Narrow or short symbols are uniformly enlarged within a common optical frame, and the ink is centered on both axes. It never independently stretches width and height, so the Ogham stroke shapes stay intact.
3. The same visual sizing applies to inventory tiles, equipped sockets, selected-rune details and expanded combination lists. Verified local sprite overrides still work and are not replaced. Rendering remains fully offline and adapts to fonts installed on iOS, Android, Windows and other systems.
4. The slight historical glyph presentation differs from Nexon's textured/colored in-game rune icons; those remain placeholders until suitable user-supplied art is verified.

## Verification

- All 26 glyphs, paint-bound centering and responsive sizing: `tests/ogham0312h_glyph_balance_browser_test.py` at 1200, 390 and 320 px.
- Existing pentagon tap/select/tap-again unequip, drag/drop, loadout preservation: `tests/ogham0312g_pentagon_browser_test.py` at the same widths.
- Core regression, interaction, Ogham simulator/effect and other relevant feature checks recorded in `VERIFICATION.md`.
- Offline cache renamed for PWA update. No storage key, rune ID, gameplay or export format changes.

## Numbered source references

[1] `Companion Files/ogham-runes.js` (`wordIcon`, `fitGlyphs`, `renderInventory`) — drawn glyphs and runtime optical sizing.
[2] `Companion Files/styles.css` (`.ogham-glyph-*`, `.ogham-rune-etched`) — unified square frames, visual placement and local-image fallback.
[3] `tests/ogham0312h_glyph_balance_browser_test.py` — 26-word and responsive glyph test.
[4] `tests/ogham0312g_pentagon_browser_test.py` — existing socket interaction regressions.
[5] `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md` — current-state feature guide.
[6] `Midir Companion.html`; [7] `service-worker.js` — release and cache markers.

**Evidence note:** Ogham letter-to-word mapping follows the standard historical Ogham alphabet and existing Nexon rune words. Decorative frames are not original Nexon art. As before, exact intermediate Prilus effect values and final December translations are separate unfinished tasks.
