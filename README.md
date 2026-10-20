
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


### Companion 33: Encounter Records & Debuff Evidence
Open **The Vault → Personal Records & Milestones → Encounter-Specific Records & Debuff Contributions** after importing a Midir-41 HTML report. Enter your exact character name for personal credits. Each logical boss attempt is separate from its containing session, and only explicitly verified clear attempts enter the fastest-boss-combat records. Raw damage-hit events in an attempt window can include adds or other targets and are labeled accordingly; a skill-damage event is not a verified activation.

**Debuff evidence:** Actual boss condition intervals and player damage-hit groups are retained. Recorded attacker IDs take precedence; for an ownerless condition a single unique nearby (±3 sec) matching skill-hit group can substantiate a likely player contribution. Unknown, overlapping, conditional and pet-owned applications are not guessed. The 10 listed reference condition groups, including the paired max-Protection effects, are **a review draft**, not a final definitive game list. Currently “coverage” means observed at least once during the attempt, **not uptime**, simultaneous effects or proof that every source was identified. “Quick Setup” measures from the recorded boss `firstSeen` to an attributed condition start, inclusive of 10 seconds.

**Repeat sessions:** Same-session imports are permitted as distinct entries with a visible notice. Their records and survival awards can both count. Manually remove unwanted repeats. Re-importing HTML for a previously imported JSON-only entry attaches the original HTML when the index matches. Profile backups do not contain original HTML attachments and should be paired with separately saved HTML files.


### Companion 34: Vault Layout Refresh
- Main navigation reordered to place **The Vault** first, followed by Rotation Lab, Debuff Academy and Encounter Study.
- The menu toggle is now a compact icon on the right side of the navigation row, and the slide-out panel opens from the right.
- The separate **Your Character** panel has been replaced with a compact inline character-name field at the top of The Vault. The Save button stays hidden until the text changes.
- Import/backup controls are more compact, and saved personal milestones now span the full available width below the import and new-milestone row.

### Companion 35: Visual Spacing Refinement
More compact Vault controls and responsive saved reports. Large Bri achievement collectible cards are deliberately unchanged. Existing offline functionality and profile data are preserved.


### Companion 36: Arcana Skill Knowledge and AS Positioning Lab
The Rotation Lab defaults to a uniform skill-information landing page for each Arcana. AS and DD entries combine prior project mechanics and published Nexon adjustments; provisional descriptions are marked. Use the Available pages buttons to enter the prior training experiences.

AS's Positioning Lab is a configurable **idea sandbox**: click to move your character, drag enemy markers, choose placement/deletion tools, or drag the aiming handle. Select 1–15 targets, cone or line, angle, reach and shape. Click Attack to visualize eliminating intersected enemies. It is not an exact in-game hitbox model.

Nexon update references: https://www.nexon.com/mabinogi/news/35462/february-quality-of-life-update and https://www.nexon.com/mabinogi/news/28264/arcana-faith-and-fury-update.


### Companion 37 — Rotation Crafter hotbar
AS Rotation Crafter has two twelve-slot rows (1 through = and F1 through F12). Open the Skills drawer at the right and drag a skill onto any slot; drag filled slots to swap or move. For keyboard/touchpad accessibility, click a drawer skill and click a slot. Right-click a filled slot to remove it. Use the collapsed **Build a Rotation** panel to add steps, or practice freely without one. Begin/Finish controls and a charging indicator are part of the simulated bow rehearsal. Existing imported reports and the Vault are unchanged.


### Companion 38
Four-element orb practice meters and Tri-Assault three-shot sequence, with an orb prerequisite and input lock. Orb gains are provisional training assumptions. Function keys appear above the number row.


### Companion 39: Percentage-Based AS Orbs
The Rotation Crafter uses recorded user-provided elemental generation percentages, including configurable secondary elements, rather than a generic quarter-orb per use. Orbs cap at 100%; Golden Time fills all four and Tri-Assault requires and consumes Fire and Water.


### Companion 40: Full Rotation Crafter Expansion
- Adds a Rotation Crafter page for every Arcana, each with a themed character and target setup.
- Expands Alchemic Sharpshooter with extra bow skills, fixes full rotation clearing, and adds per-skill cooldown/delay customization in the builder.
- Adds a first-pass Harmonic Saint healing stage with random ally targets, plus provisional Kart Bomb coverage in Debuff Academy.


### Companion 41 — Active talent skill audit
Additional active base talent skills for all nine non-AS Arcana now appear in the crafter. Species/weapon eligibility remains a gameplay constraint; editable trainer defaults do not verify exact cooldowns. Kart Bomb references condition 598 Midir artwork.


### Companion 42: Rate isn't a Lie
Harmonic Saint music calculator (expanded by default, collapsible) and Bard skill rehearsal. Stop performance with Escape or page interaction; switch directly to another assigned skill.


### Companion 43: Harvest Song simulator refinement
- Expand Harvest Song's on-screen simulator text to include Gathering Success Rate, Production Success Rate, and Gathering Speed in the same style as the provided screenshot.


### Companion 44: High-Energy Performances
- Music simulator now keeps an exaggerated energetic dance going for the full performance.
- Buff text occupies the center of the stage rather than a bottom caption; Escape and outside interaction stop the dance.


### Companion 45: Music skill icons in simulator
- Add the active music skill icon to the center-stage buff announcement so the simulator more closely matches the in-game look and the provided screenshots.


### Companion 46: Skill Icon Coverage
- Skill drawers and keybars use bundled Midir icon artwork, with official Combo: aliases for fighter skills. The music buff announcement intentionally does not contain a skill icon. See SKILL-ICON-AUDIT.md for missing exact matches.


### Companion 47
- Resolved the remaining ambiguous skill icon choices (Charge, Counterattack, Natural Shield, Stomp) using the most modern-looking available Midir icon variants.
- Removed Recovery from Harmonic Saint.
- Refined Arcana training animations and positioning for melee, shield, fighter, lance, dual-gun, alchemy, and puppetry presentations.


### Companion 48: Reforge Simulator (provisional)
Open Explosive Vanguard > Rotation Lab > Reforge Simulator. Reforge or Stim three attributes for a selected equipment category. Source tables at Mabinogi World Wiki Reforge/Full_List and Echostone#Awaken were blocked by 403 during development. Results use a limited starter list, not the full tables or real game odds. The 1-in-1000 limit break and skewed weighting are entertainment rules as requested. Artwork supplied by the user.


### Companion 50 — Echostone talent effects
Echostone pools combine exclusive awakening lines and mapped talent-related reforge lines from the saved wiki tables. Stim is still one line only, no limit break. Talent/color classification uses the Echostone overview and should be checked against individual Echostone pages for edge cases.


### Companion 52: Reforge odds tuning
- Normal 1–20 lines are weighted toward lower rolls but now average approximately 7.0. One-line Stim and three-line Reforge behavior is unchanged.


### Companion 53: Storage Chest & Auction House
Each roll can be saved to the Storage Chest (preserving exact lines), or listed on the simulated Auction House. Sold items leave listings and their proceeds add to the gold ledger. Sales resolve after 15–250 future attempts. A modal must be acknowledged before another attempt is possible. All payouts and timings are fictional.


## Companion 54
Adds a reforge limit-break pity trigger after 2,500 unsuccessful normal reforge attempts; removes odds disclosure from Reforge UI. Adds Melodic Puppeteer Erg Break Simulator with saved wiki B/A/S rate tables, user-defined 15-failure stack ramp and 0.01-percentage-point steps, weapon chest, Reforge Chest gold-funded assist potions, and uploaded divine mineral fragment Tap icon.
