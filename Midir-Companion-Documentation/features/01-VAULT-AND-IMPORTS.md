# The Vault and Report Import — Feature Log

**Purpose:** Bring portable Midir reports into an offline personal archive without treating missing observations as verified combat facts.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Import and inspection

- **Portable reports:** Imports structured Midir HTML (`script#data`), Companion-compatible JSON, and supported NDJSON through parsing paths that preserve report provenance. Legacy reports remain useful but may lack encounter and event evidence. [^1]
- **Encounter browsing:** Presents report, player, target, boss-only and all-target views using recorded entity associations. Canonical logical encounters and their physical boss phases are views of the same fight, not duplicate fights. [^1] [^2]
- **Skill inspection:** Keeps explicit use, damage-hit and remote observation evidence distinguishable; unknown casts, unverified effect sources, and missing historic precision are not backfilled. [^2] [^3]
- **Personal archive:** Maintains imported records and optional original HTML; a report index allows navigation without keeping every full report serialized in localStorage. [^4]

## Vault layout and personal ownership

- **Opening flow:** The Vault is the initial route. With See Secret Sauce enabled, it shows the character-name field, the three Bri Leith collectibles, **Add to Your Vault** (imports and My Milestones together), personal records/achievements, storage management and previously imported reports. When Secret Sauce is off, importer-specific tools and awards are hidden, while personal milestones and the non-importer Achievement Book remain accessible. [^1] [^4]
- **Own character in a party export:** The character-name field matches one `players[].name` by trimmed, case-insensitive **exact name**. It does not infer ownership from player order, highest damage or the recording scope. Reports without that character are excluded from personal collectible calculations and automatically generated milestones; they remain inspectable as full party reports. Changing the chosen name rebuilds report-derived milestones without deleting player-written notes. [^1] [^4]
- **Saved milestones:** My Milestones shares the import area. Personal entries can be edited, saved, canceled or removed with confirmation; imported, evidence-derived milestones are separate records rather than editable personal notes. [^1]
- **Original report viewing:** **View report here** opens the saved, script-enabled report **above** the list of saved reports, with minimize/close and new-tab controls; **Inspect data** is a separate structured-evidence view. Reports lacking saved original HTML can remain useful for data inspection without an embedded chart. [^1] [^4]
- **Collectible audit:** The three collectible cards show signed balances and **See Awards** histories. Selecting a run attempts to highlight its saved report on the currently displayed Vault page; it does not automatically change report pages. An evidenced qualifying attempt may add +1 or subtract 1; insufficient evidence produces no change. See [Achievement Book and Personal Records](11-ACHIEVEMENTS-AND-RECORDS.md) for the exact gate rules. [^1]


## What each imported format can establish

| Evidence | Processed Midir HTML / Companion data | Raw NDJSON adapter |
|---|---|---|
| Party and character identities | Embedded player entries may provide names, entity IDs, Arcana and selected-player context | Session summary and entity events can provide identities and Arcanas when present |
| Deaths | `players[].deathTimes` can record actual per-player deaths; filter by each gate's attempt start/end | Emits `deathTimes: []` with `deathEvidence: 'not-reconstructed'`; do not award deathless achievements from this omission |
| Boss attempt and clear | Canonical encounters, logical gates, target forms and explicit completion evidence when exported | Can observe target HP and conditions, but zero/negative HP is **not** a verified defeat |
| Debuffs | Boss-target condition IDs, start/end intervals and optional attacker IDs; statuses may start before an encounter window | Condition `EventId: 4`/`5` and spawn conditions may reconstruct intervals; missing ends limit timed-uptime proof |
| Damage | Skill summaries, per-second hit groups, and optionally precise hit/use/observation events | Positive `EventId: 3` damage is grouped by player, skill and second; these groups are **not casts** |

**Bri Leith survival:** A player normally has one revival per gate, then remains down after a second death in that gate. Harmonic Saint has a separate, cooldown-dependent extra self-revival. The HTML death timeline establishes death events, but not the exact moment of every revival or which teammates were alive simultaneously. Negative HP is not proof of death: Mabinogi's Deadly status allows a living player to remain below zero HP. This limits any literal *last person alive* interpretation of the reports. [^1] [^2]


## Record handling

- **Duplicates:** When a session matches a saved import, the confirmation offers **Replace** or **Cancel**. Replace keeps the saved report ID and recalculates its awards; Cancel keeps the existing report unchanged and does **not** add the selected file. There is no explicit “keep both” option for a recognized duplicate. Similar reports that evade the check can still remain as separate entries; the saved-report list flags possible repeats and warns that their awards may count separately. Do not assume all overlapping exports are deduplicated. [^4]
- **Import limits:** Each selected report has a **40 MB** file limit. The raw NDJSON path also rejects recordings exceeding **250,000 lines/events**; these checks precede parsing. [^4]
- **Historical scope:** Older reports retain their limited evidence rather than receiving newly invented death, boss-phase, or skill-use events. [^2] [^3]

## Verification and outstanding limits

- Source-specific protocol and cast-identity assumptions must be validated against Midir exports; the presence of additional event fields in one export cannot be projected onto older files.
- Importer behavior should be tested with both fresh and older HTML, multiple-gate exports, and remote-player evidence before extending interpretation rules.
- With **See Secret Sauce** disabled, the **Vault route remains available** and shows a compact Achievement Book and existing personal milestones. Import tools, collectible cards, report browsing and milestone editing are hidden in that mode; saved data is not deleted.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Importer and Vault UI: [`app.js`](../../Companion%20Files/app.js), [`session-import.js`](../../Companion%20Files/session-import.js).
[^2]: Session analysis: [`analysis.js`](../../Companion%20Files/analysis.js), [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).
[^3]: Vault archive and backup routines: [`app.js`](../../Companion%20Files/app.js).
[^4]: Vault import, duplicate handling, archive access and report index: [`app.js`](../../Companion%20Files/app.js).
