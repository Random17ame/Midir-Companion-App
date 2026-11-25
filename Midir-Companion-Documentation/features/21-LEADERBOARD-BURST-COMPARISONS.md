# Personal Bests — 30-second Boss Burst Comparisons

**Applies to:** Midir Companion 0.3.13. Supplementary evidence only; **not** a normal combat-report import or all-session Rotation Highlights.

## Import formats

1. Standard Midir reports continue to use the existing embedded `<script id="data" type="application/json">` payload with `companion.format: "midir-companion"`, `version: 1`; full attempts, timestamps, combat-target evidence and standard 10s/60s Rotation Highlights continue unchanged. Other supported JSON and NDJSON inputs retain existing import paths.
2. Independent Midir-46.b leaderboard comparison HTML uses `<script id="burst-data" type="application/json">`. The new isolated parser in `Companion Files/burst-comparison.js` reads only this embedded JSON; it **never** invokes normal Companion v1 conversion for those comparisons. Up to eight players per file are accepted. The selected 30-second windows may come from different sessions/encounters.
3. A comparison appears in a separate **30s Boss Burst Comparisons** section of the Vault (with **See Secret Sauce** enabled). It has no collectible awards, death/clear status, archive median eligibility, or 60-second records. The index and normalized event evidence are stored locally, included in full profile backups and restored independently of combat reports.

## Observation rules

- The supplied 30-second window is the original leaderboard selection. Total boss damage, timestamp, rank, Arcana and source session are displayed when present. The original 30s per-skill hit damage and observed-use count are now available in a compact expandable table, and 10s skill damage has its own table. Per-skill exporter summaries are not added to hit damage a second time.
- For each player, sorted positive `kind: "hit"` events with millisecond-relative timestamps are scanned for the greatest sum over a **rolling half-open 10,000ms interval**. The displayed result is **Best 10s Within Exported 30s**, not the player's best possible 10 seconds across sessions. The result includes each skill's observed damage, hit count and critical evidence.
- `kind: "use"` observations appear separately from damage hits. A recorded use marker is not a guaranteed completed skill cast or necessarily a boss-directed cast. No absent casts, status effects, boss HP, deaths, or encounters are inferred.
- Pet damage (`skillId: 9999`) can retain optional pet names. When a pet name exists, skill damage is broken down separately for each named pet. Missing pet names stay under the generic ID.
- A comparison does **not** establish any 60-second window. It is not a cooldown-aware candidate and does not modify any established minimum cooldown, skill shape, or crit-neutral conversion.
- A 30-second record selected for highest total 30s damage can omit the player's true peak 10 seconds outside that 30s segment. Always phrase the result as a partial-window observation.

## Field mapping and evidence boundary

A genuine Midir-46.b **Alchemic Sharpshooter** leaderboard comparison HTML has now been supplied, and its `script#burst-data` import format is confirmed against the adapter. The real schema includes `arcanaName`, `windowSeconds: 30`, and up to eight `players`; each player has `rank`, `name`, `arcanaName`, `sessionName`, `sessionId`, `sessionStartMs`, `startMs`, `damage`, numerical `hits`, `skills[]` with **`id`/`name`**/`damage`/`hits`/`observedUses`/`largest`, and `events[]` with `kind: "hit"|"use"`, relative millisecond **`t`**, `skillId`, hit damage/critical evidence and optional `petName`. The exporter does **not** copy skill names to individual hit/use rows, so the adapter now enriches the display via `skills[].id/name` without inventing additional events. The skill summaries are NEVER added into hit damage a second time.

The five-player sample contains **244 individual boss-hit events and 25 observed-use markers**. Every player's 30s exported total reconciles to the exact hit sum (floating-point rounding within .001), as does the independent skill summary. The rolling 10s results are validated with an independent brute-force scan over eligible starts; they remain best *within the provided 30s*, not actual all-time best 10s. The full HTML stays outside the published release and is used only for local test input. [8] User-supplied `midir-burst-alchemic-sharpshooter-comparison.html`; [9] `tests/burst0312c_real_schema_test.js`; [10] `tests/burst0312c_real_browser_test.py`; [2] `Companion Files/burst-comparison.js`.

The adapter retains aliases for handoff-described alternate 46.b fields and rejects missing individual evidence. Additional Arcana exports, app installations and physical phones still need separate device/variant tests.

## Mobile reader

Full-screen *ordinary* imported HTML reports use the existing sandboxed report viewer. The viewing-only helper resizes its chart on `resize`, `orientationchange`, `visualViewport.resize`, and `ResizeObserver` layout changes. On devices with OS auto-rotate enabled, the viewport follows portrait/landscape transitions without reloading the report, resetting zoom, or replacing its embedded events. Narrow landscape compresses the header; iOS safe-area padding and dynamic viewport height protect controls. `manifest.webmanifest` declares `orientation: "any"` so installed PWAs are not intentionally locked to portrait. A web app cannot override the user's system rotation lock on iOS, and rotation may be limited by individual browser or PWA modes; physical iOS and Android tests remain required.

## Tests and limits

- `tests/import0312b_sunday_test.js` parses user-supplied **test export sunday 4.html**: six players, seven attempts (three observed clears), 20,020 hits, 1,774 uses, 99,603 observations; no HTML included in the distributed release.
- Real 47 MB report loads independently in headless Chromium with all six player panels, eight encounter selector entries, chart and no page JavaScript exceptions. Direct `file://` navigation is blocked by this test environment; `page.set_content()` was used.
- `tests/burst0312b_parser_test.js` covers independent schema, window boundaries, 10s skill sums, marker separation, no double counting, and pet-name grouping.
- `tests/mobile0312b_burst_orientation_test.py` tests mobile portrait → landscape → portrait, 150% chart zoom retention, in-report scatter navigation, reader close, and separate leaderboard imports and player switching.
- The genuine comparison was tested in browser-sized desktop and phone viewports (1200×800 and 390×844). The `skills[].id/name` mapping and 30s/10s hit arithmetic also pass a standalone Node test; raw source export is not bundled.
- Existing regression suites continue to protect Arcana attribution, Gate 2 fallback, boss-only scoring, critical-normalized references, Music/Sacred Guardian/Harmonic Saint calculators, storage, localization, and other functionality.
- Other Arcana-specific 46.b comparisons, a full-app 47MB mobile iframe stress test (local timeout), physical-device auto-rotation, hosted PWA offline refresh, and full original Midir 46.b TypeScript/test fixtures were **not supplied/verified**.

## Numbered source references

1. User-supplied **Midir-46.b → Companion Development Handoff** (new comparison export contract, boss-only 30s selection, isolated records, evidence limitations, 10s/60s proposal).
2. `Companion Files/burst-comparison.js` — separate `burst-data` parser and rolling 10s hit selection.
3. `Companion Files/app.js` — `parseReport` and `cleanExport` original v1 contract; additional comparison storage/UI and mobile viewer reflow.
4. `Companion Files/styles.css` — report-reader responsive sizing and comparison evidence timeline.
5. `manifest.webmanifest`, `service-worker.js`, `Midir Companion.html`, `Companion Files/i18n.js` — orientation-independent standalone setting, offline files, script loading and EN/KO/ES labels.
6. `tests/burst0312b_parser_test.js`, `tests/mobile0312b_burst_orientation_test.py`, `tests/import0312b_sunday_test.js` — new regression coverage.
7. `Midir-Companion-Documentation/features/01-VAULT-AND-IMPORTS.md`, `03-ROTATION-HIGHLIGHTS.md`, `18-MOBILE-FEATURES.md` — original contracts and use limitations.

8. User-supplied Midir-46.b Alchemic Sharpshooter leaderboard comparison HTML — real schema, names and exact hit/use evidence.
9. `tests/burst0312c_real_schema_test.js` — real-schema numeric and name reconciliation against supplied comparison.
10. `tests/burst0312c_real_browser_test.py` — actual comparison import/render with 5 players and English/Korean/Spanish locale switching.
