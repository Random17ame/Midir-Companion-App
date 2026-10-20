
Midir Companion-17 — Adds randomized ongoing icon flashcards and a persistent set-aside / restore deck.

Midir Companion-15
===================

This build adds the verified shared Lightning Debuff icon for Ceraunus and Mir Dragon to Debuff Academy.

# Midir Companion 01 — offline functional foundation

Open `index.html` in Chrome/Edge. No server, account, npm, network connection, or Midir executable needed. Keep `index.html`, `styles.css`, `data.js`, and `app.js` in the same folder. All training data and imported summaries remain in browser `localStorage`; use **Reports → Export local backup** to save them. The companion does not send data to a server.

## Implemented
- Multiple Midir-27/28 `midir-companion-v1.json` imports and standalone HTML reports (extracts embedded `script#data` -> `companion`). Legacy HTML's report-only data is accepted with warning. Deduplicate likely repeated exports; this fingerprint is not a cryptographic proof of run identity.
- AS: editable keys/cooldowns/action locks and player-defined patterns; active keydown practice with cooldown visualization, accepted-action log and self-evaluation; basic line/cone positioning choice scenario. Timings and shapes illustrative; no live in-game APM measurement.
- DD: five progressive drill layers, 17s heartbeat visualization, timed spoken cognitive prompts (Web Speech API), no microphone or graded performance, local self-assessment and adjustable challenge frequency. Browser background scheduling is best-effort, not guaranteed.
- Debuff Academy: six self-contained lessons; six decision scenarios with reflections; reviewed lesson tracking.
- Encounter Study: three Bri gate summaries and prioritized survival mechanics.
- Personal Records: editable self-reported milestones, drill history, Gate 1/3 conservative collectible evidence processing of versioned export data; Gate 2 is deliberately unverified pending target mapping. A confirmed cleared attempt with bounded phase HP plateaus and timestamped player deaths results in +1/no phase death or -1/any phase death; others show no change/unverified. **HP plateau is a proxy for the mechanic interval, not absolute proof of mechanic onset/end.** Do not treat collector results as fully certified until validated with representative session exports. No balance floor at zero.
- Registry in `data.js` for future Arcana skills/drills.

## Known gaps
- The input must be **Midir exported HTML or companion JSON**, not raw `.ndjson` sessions.
- Midir skill hit groups are not certified button activations. AS practice APM is *keyboard training* only. No fabricated crit normalization or comparisons from hits.
- Exact game skill icons/assets not bundled. Future asset pack can replace generic interface elements.
- DD resource and AS action/cooldown timings and geometry are training illustrations; they may depend on latency, character traits and loadout. All skill descriptions are documented from provided handoff; they have not been cross-checked against game client this release.
- Midir report data are sensitive: imported player names stay local in this app, but browser storage is not encrypted. Backup files should be handled accordingly.
- Grouping Gate 1's split boss and resolving detailed mechanic intervals still require native Midir-side verification. Automatic Gate 1 awards remain unverified if necessary intervals aren't represented on the selected continuous HP timeline. Gate 3 uses race ID 7603 from observed sessions. Gate 2 mapping is intentionally absent.
- Condition icon recognition and auto-awarded party achievements await verified exported condition mappings; no fake icons or invented awards.
- Console/browser may throttle JavaScript background scheduling for audio. Pre-test with Mabinogi focused; for guaranteed timing, a native app/background audio engine would be necessary.

## To extend
Add Arcana definitions to `window.MIDIR_DATA.arcana` in `data.js` and implement a dedicated trainer view/router case in `app.js`. Avoid forcing DD or AS assumptions onto other Arcana. `cleanExport` normalizes the version-1 data contract; future version migrations belong there. Keep `format`, `version`, `timeUnit`, `timeOrigin` explicit and preserve `provenance`.

## Acceptance / verification
Open browser and test Overview, Reports, Rotation Lab (each Arcana), Debuff Academy, Encounter Study and Personal Records. Import same JSON twice to confirm duplicate guard. Import a Midir HTML report to validate `script#data`. Confirm drills don't persist running timers after navigation. Test audio with user gesture. No Midir source modified.


## Academy revision (02)
The Debuff Academy now opens to four paths: guided rotation walkthrough, debuff effect library, placeholder-symbol flashcards, and missing-effect recognition. No verified status icon artwork is included yet. Old practice history remains compatible.


## Version 03 — The Vault

Reports and Personal Records have become **The Vault**. HTML report files are the preferred input: Midir-28 HTML already embeds `script#data` containing its structured companion v1 payload. JSON-only exports remain supported but cannot reopen the original interactive report.

Full HTML bytes are stored in browser IndexedDB; the normalized report index, manually entered milestones, and metric events remain in the existing localStorage profile. A profile JSON backup **does not include original HTML bytes**, so keep your Midir HTML exports safe for re-import. Browser storage can be cleared by the user, and `file://` storage availability can vary by browser.

Importing a comparable report logs boss-specific per-character milestones: +10,000 DPS or more with positive percentage change; fewer recorded deaths culminating in a deathless run; a higher largest-hit value **when genuinely available**; lower received damage **only if that field is present**. Events are compared to the latest earlier imported report for the same named encounter, rather than crit-normalized baseline damage. Events are celebratory observations, not proofs of improved execution. One notable event is shown as a celebration; all eligible events are recorded. Duplicate import detection avoids repeating the same event.

Not yet supported: absolute deathless achievement when there is no earlier comparison; damage-taken comparisons from current Midir-28 exports (no supported damage-taken field); verified fast debuff achievements (status application source/target identity and timing coverage require validated fixtures); validated entire-dungeon clear times. Avoid claiming any of those have been measured.

The original interactive HTML opens from the Vault in a new tab via locally stored Blob. Some browsers require allowing popups from local files. Training history appears on Overview instead of Milestones.

## Version 04 — Evidence-based Vault awards

The Vault now offers additional automatically recorded milestones on imported report data: first verified deathless boss clear (only where clear evidence exists), reduced deaths, per-skill strongest hit improvement, 10%+ raw damage-total increase, and faster verified boss combat duration. The existing +10,000 DPS, zero-death improvement, available damage-taken improvement, and largest-hit awards remain. Per-skill records use the skill identifier supplied by Midir; unknown identifiers are not embellished with invented skill names.

First-deathless and faster-boss achievements require verified clear evidence; legacy HTML without the required proof will not trigger those. Boss combat duration is not full dungeon completion time. Total damage can grow simply because the encounter lasts longer, so it is deliberately not represented as rotation efficiency. All awards are encounter/character-specific. Only the most prominent award is shown per import batch; others are stored quietly in Milestones. No automatic Bachram or timed-debuff achievement is inferred. These await validated event semantics and conditions. No new game data are collected from the client; input remains exported HTML (preferred) or optional JSON.

Verification: JavaScript parsed by Node and ZIP integrity tested; browser interaction and actual export fixture testing still required.


For consolidated changes and verification caveats, see `CHANGELOG.md`.
