# Companion 275 — Documentation Integration Notes

**Scope:** Documentation-only integration into the supplied Companion 275 archive. No application version increment and no changes to runtime scripts, HTML launchers, assets, test code or save-data contracts.

## Included documentation

- Bundled the complete **verified Documentation Pack 5** as `Midir-Companion-Documentation-275/` at the archive root. All **23 Markdown files**, including **17 feature guides**, remain byte-for-byte identical to the verified standalone pack.
- Kept that directory beside `Companion Files/` and `tests/`, preserving the feature guides' relative links to scripts, tests and assets.
- Added a root `README.md` and updated `Companion Files/README.md` to point to the verified documentation and describe current-build behavior consistently.

## Changelog editing

- Kept the original release-history content, normalized release headings, placed entries in descending numeric order, and combined separate topics under their shared version number for **225, 207 and 201**.
- Consolidated two semantically duplicated entries for **Companion 215** into one note without dropping unique feature details.
- Repositioned the mistakenly embedded changelog title and its general warning to the introduction, and placed formerly appended **208, 212, 266 and 269** notes at their numeric positions.
- Regularized introductory verbs to past tense and corrected the stray word “Bewegung” to “Movement” in the 269 animation note.
- Added source-verified current-build clarifications where earlier descriptions could mislead readers: **Vault availability with Secret Sauce off, duplicate import decisions, Rotation Highlights scoring versus unused minimum-cooldown tables, legacy debuff group counts and the Link I versus Link V HP correction**.
- Kept a previously unversioned EV Base Manager bullet clearly identified as **unattributed**, rather than assigning it an invented release.

## Source priority and limits

The existing changelog is a history of **recorded release intentions and changes**; it does not supersede the verified feature documentation when a prior behavior is no longer active. Feature and source references in the verified pack describe the supplied build's implementation, not an exhaustive real-Mabinogi validation or a claim that every UI path was tested live.

## Verification

- **Archive inventory:** Original: **1,477 entries**. Integrated: **1,502 entries** (25 additions: 23 verified pack documents, root README and integration notes). Only two pre-existing entries changed: `Companion Files/CHANGELOG.md` and `Companion Files/README.md`. Every other original file was compared by ZIP CRC and uncompressed size; no differences were found.
- **Documentation:** The bundled 23 files were compared byte-for-byte against verified Pack 5. All relative Markdown links in the documentation, changelog and updated READMEs resolved inside the assembled ZIP. ZIP integrity testing passed.
- **Executable regression tests on the extracted integrated archive:** `tests/regression_companion.py` passed **17/17** Chromium module/navigation checks; `tests/vertrag_giant_rules_test.js` passed the giant suppression, resume, defeat and timing checks. These are targeted regressions, not exhaustive live gameplay verification.

- Build 291: Performed a quality pass on Arcane Aesthetics in Subject Theta, enriching the procedural visuals for Thunder, Shadow Flare, and Polar Vortex without changing gameplay.

- Build 292: Thunder in Subject Theta now has a dedicated presentation pass (charge source, bolt travel, impact bursts, light shake, and layered audio) with no mechanical changes.

- Build 295: Full-screen mobile viewing of saved original HTML reports with scatter zoom and jump controls; viewer-only enhancements do not modify archived data.

- Build 296: Subject Theta visuals were refined for readability: the timing receiver is now a flatter on-track ring, overheat feedback is edge/vignette-based instead of large miss text, the right HUD avoids overlapping status lines, and Thunder effects obscure Theta less.

- Build 297: Cleaned Vertrag sprite-sheet bleed on several movement/attack frames and padded all boss frames with additional transparent space to reduce side-edge artifacts during motion.

- Build 300: Vertrag offers a defense-state picker after mode selection, mapped to the existing four saved durability multipliers; no changes to actual combat skills or giant configuration.
