# Midir Companion 0.3.12i — Game-Inspired Rune Stones and Visual Word Picker (Draft)

**Baseline:** 0.3.12h cumulative GitHub-ready source. **Scope:** Ogham rune artwork and rune creation/word selection UI; relevant tests, documentation, and offline cache. No changes to Midir combat/Arcana evidence, Harmonic Saint, Music, SG, Rotation Highlights, reroll calculations, chest materials, rune grade/points math, save keys, or report imports.

## User-facing changes

1. **Visual Add Rune:** Opening Add Rune shows a full-panel, scrollable gallery of **26 distinct selectable rune tiles**, grouped into Special (5) and Regular (21) just like the in-game inventory. A tap or click picks the word and opens the existing editor for grade, nickname, notes and discrete-level effect lines. The editor's **Change Rune** action opens the same visual word gallery rather than a word dropdown.
2. **Game-shaped artwork from the supplied image:** **16 identified names** — Sail, Dair, Uilleand, Gétal, Coll, Straiph, Óir, Tinne, Fearn, Luis, Cert, Peithe, Gort, Onn, Ailm and Nin — use screenshot-derived textured stone images. These preserve the game's various slab silhouettes and slanted marks, including colored special stones, rather than approximating their shapes from historical Unicode. Other ten words retain centered historical letter fallback tiles; images are not mislabeled as exact game artwork. The small provided screenshot limits sharpness; user-supplied individual rune pictures can later replace these images without changing rune data.
3. **Safe editing:** Gallery Cancel does not add a rune. Choosing a word creates an unsaved editor draft; **Save** alone adds the new instance. Cancelling the editor likewise leaves inventory unchanged. Editing an existing stone through Change Rune preserves its stable instance ID and only commits on Save. Original per-Arcana five-socket pentagon, tap/drag equipping and second-tap unequip remain intact.
4. **Offline/mobile:** Stone images are local `Companion Files/assets/ogham/game-reference/*.png` assets and are pre-cached with the versioned shell. The gallery has responsive columns, a scrollable interior and touch-size word buttons. UI controls are localized in English, Korean and Spanish.

## Verification

- `tests/ogham0312i_word_picker_browser_test.py`: all 26 tiles, 16 correctly loaded image sprites, EN visual controls, unsaved cancel safety, creation/edit word changes, Masterwork-only special rune grade, socket interactions and 1200/390/320px layout.
- Updated `tests/ogham0312g_pentagon_browser_test.py`, `tests/ogham0312g_levels_browser_test.py`, and `tests/ogham0312e_browser_fixture_test.py` exercise the new create flow while retaining preexisting pentagon, effect-level and chest reroll assertions.
- Updated `tests/ogham0312h_glyph_balance_browser_test.py` tests 10 historical glyph fallbacks plus 16 game image tiles. Full app regressions recorded in `VERIFICATION.md`.
- Physical Android/iOS, deployment PWA refresh and user-supplied higher resolution screenshots are separate validation activities.

## Numbered source references

[1] `Companion Files/ogham-runes.js`: `GAME_PLATES`, `wordIcon`, `runeWordPicker`, `bindRuneWordPicker`, `editor`, `bindEditor`, `renderInventory`.
[2] `Companion Files/assets/ogham/game-reference/*.png`: 16 user-supplied in-game screenshot-based named stone images.
[3] `Companion Files/styles.css`: `.ogham-word-picker`, `.ogham-picker-grid`, `.ogham-editor-word-pick`, `.ogham-game-reference-art`.
[4] `tests/ogham0312i_word_picker_browser_test.py`: screenshot-backed artwork, selection/cancel/commit and touch regression.
[5] `tests/ogham0312g_pentagon_browser_test.py`; [6] `tests/ogham0312e_browser_fixture_test.py`; [7] `tests/ogham0312h_glyph_balance_browser_test.py`: retained interaction, chest and glyph checks.
[8] `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md`: current-state inventory and loadout guide.
[9] `Midir Companion.html`; [10] `service-worker.js`: release/offline asset metadata.

**Evidence boundary:** This change is visual and UX-focused. No new official Prilus per-level data or regional skill translations were obtained. The existing 97-effect endpoint-derived intermediate values still carry their documented limitations.
