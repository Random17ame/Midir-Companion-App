# Midir Companion 0.3.12c — Music and Leaderboard Compatibility

Release date: November 24, 2026. Cumulative source based on 0.3.12b.

## Changes

1. **Music Calculator — Special Upgrade scope:** The instrument-exclusive step upgrade (Step 1–8) now modifies Battlefield Overture and Vivace only, including their displayed variants. Enduring Melody, March Song, Harvest Song and Lullaby no longer gain the instrument-specific bonus. Shared Music Buff Effect, other enhancement inputs and base reforge calculations remain intact.
2. **Instrument enchants:** Polyphony Prefix +6–9 and Tempo Suffix +4–5. The physical gear library migrates old saved rolls +2 once per equipped/shared instrument, without rewriting user-created per-item or per-set enchant overrides.
3. **Editor continuity:** "Other buff sources & settings" and "Manage sets · compare bonuses" no longer collapse after an edit/recalculation. Existing gear editor scroll retention remains.
4. **Real 46.b leaderboard export:** A supplied Alchemic Sharpshooter HTML validates the independent comparison importer and viewer: five players, 244 individual boss hits, 25 distinct use markers. The adapter now uses exported `skills[].id/name` metadata to display real skill names rather than "Skill ####" and recomputes 10s only from hit rows. The original 30s per-skill breakdown is available in a compact expandable table beside the independent best-10s breakdown. The exported 30s sums agree with hit sums and skill summaries.
5. **Compatibility:** Existing full combat report imports, boss-only/Gate 2 scoring priority, per-encounter Arcana, crit-neutral Rotation Highlights, full-session 10s/60s, achievements, storage, profiles, language switching, Sacred Guardian and Harmonic Saint calculations are preserved. No full-session record is fabricated from partial comparison windows.

## Mechanics sources

- Nexon, *Renovation: Season 8 Update* (September 10, 2026): [current instrument enchant ranges](https://test.labanyu.com/global-official/notice/14279?page=1). Nexon news index: https://www.nexon.com/mabinogi/news/
- Nexon, *February Quality of Life Update* (February 2026): [instrument-exclusive Special Upgrade values/eligible effects](https://steamdb.info/patchnotes/21820516/).
- User testing screenshots of November 11/16 and attached Midir-46.b `burst-data` comparison HTML (test input only, not bundled).

## Verification boundary

The included test suite covers synthetic and actual comparisons, named skill mapping, boss-hit sums and 10s windows, old enchant-roll migration, UI open state and major app regressions. There is no claim of all-time best 10s from the 30s snapshot, nor of 60-second evidence. Physical iOS/Android rotation, large mobile iframe stress, and hosted PWA offline refresh need separate device/deployment testing.

For numbered source references see `Midir-Companion-Documentation/CHANGELOG.md`, and current rules in `features/12-MUSIC-AND-PUPPETEER.md` and `features/21-LEADERBOARD-BURST-COMPARISONS.md`.
