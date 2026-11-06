## 0.3.9b — Mobile Arcana menu/cache visibility hotfix

- Confirmed that the mobile route restriction list contains only the legacy keyboard-only drill. Converted games—including Vertrag, Rotation Crafter, Theta, Crom, Pig Pursuit, EV, positioning labs, Rate Isn’t a Lie, and Cutting Chorus—are not restricted.
- Added a defensive cleanup for stale disabled-card decoration after mobile menu renders, an explicit 0.3.9b app header, refreshed service-worker cache identifiers, and mobile navigation regression coverage. No combat rules or saved data changed.
- **Source references:** [1] `Companion Files/app.js` (`MIDIR_MOBILE_DESKTOP_ONLY`, mobile render); [2] `Midir Companion.html`; [3] `service-worker.js`; [4] `tests/mobile039b_menu_test.py`.

## Midir Companion 0.3.9 — EV onboarding and mobile Cutting Chorus

1. EV starter-weapon enemies have 12 HP in wave 1 and 17 HP in wave 2; later waves and upgraded weapons retain normal scaling. [1] `Companion Files/ev-defense.js`.
2. Cutting Chorus on mobile separates touch-drag aiming from skill activation. Individual Melodic Puppeteer and base Puppet skill buttons are used for ordinary timing notes; Cutting Chorus has its own button. There is no direct tap-to-score mode. [2] `Companion Files/mp-rhythm.js`; [3] `Companion Files/styles.css`.
3. Skill-button cooldowns use the existing Rotation Highlights minimums, with a provisional fixed +3-second Melodic Puppeteer penalty on numbered Puppet Acts. Cutting Chorus retains its 4s/2s Link toggle. Hard mode retains its two-prior-skill no-repeat rule. [2] `Companion Files/mp-rhythm.js`.
4. Updated current documentation and offline cache identifiers; browser coverage: [4] `tests/mp039_touch_cooldown_test.py`; [5] `tests/regression_companion.py`.

## Midir Companion 0.3.8 — Pig Pursuit and EV mobile access

1. Pig Pursuit: independent touch sticks for carrot heading and rider counterbalance; retains keyboard/mouse controls and existing physics. (`Companion Files/ek-pig-pursuit.js`, `Companion Files/styles.css`; `tests/mobile038_pig_ev_test.py`)
2. EV Tower Range Lab: mobile patrol pad, independent skill buttons with cooldowns, tap-to-place inventory towers, touch relocation, pinch zoom centered on gesture midpoint; existing desktop pointer-centered wheel zoom preserved. (`Companion Files/ev-defense.js`, `Companion Files/styles.css`; `tests/mobile038_pig_ev_test.py`)
3. Enable Pig Pursuit and EV in mobile Arcana menus; preserve saved game data and refresh offline cache identifiers. Update current-state documentation. (`Companion Files/app.js`, `service-worker.js`, `Midir-Companion-Doccumentation/`)

## Midir Companion 0.3.4 — Rotation Crafter mobile controls

1. Rotation Crafter supports touch drag from the skills drawer to hotkey slots, tap-to-select assignment, and slot-to-slot swap or move on touchscreens. (`Companion Files/app.js`, `Companion Files/styles.css`; `tests/rotation034_touch_test.js`)
2. Assigned mobile hotkeys trigger the existing casting engine, including press-and-hold charging, combo inputs, cooldowns, and rapid Pummel inputs; desktop keyboard behavior is unchanged. (`Companion Files/app.js`; `tests/rotation034_touch_test.js`)
3. On touchscreens, the skill drawer opens as a bottom sheet and the 24 hotkeys display as compact six-column grids. Updated feature and mobile guides and refreshed offline cache identifiers. (`Companion Files/styles.css`, `Midir-Companion-Doccumentation/features/04-ROTATION-CRAFTER.md`, `Midir-Companion-Doccumentation/features/18-MOBILE-FEATURES.md`, `service-worker.js`)

## Midir Companion 0.3.3 — mobile input and combat-interface updates

1. Crom Bás Invaders: Irusan's struggle accepts alternating mobile-joystick directions; the touch controls expose live skill cooldowns. (`Companion Files/as-chicken-invaders.js`, `Companion Files/styles.css`; `tests/release033_gameplay.py`)
2. Ronaun shields absorb one baseline Magnum Shot of damage before overflowing to HP. Defensive automatic ranged fire has a 115-unit proximity radius and uses the Magnum firing cadence, including Golden Time acceleration. (`Companion Files/as-chicken-invaders.js`; `tests/release033_gameplay.py`)
3. Crom elemental orbs show their element colors as they fill and glow when full, retaining the compact mobile position: Fire red, Water blue, Wind white, Earth tan. (`Companion Files/as-chicken-invaders.js`, `Companion Files/styles.css`)
4. Theta rhythm play uses four combat lanes (Thunder, Thunderblight, Shadow Flare, Twilight Surge), with free-timing abilities in a separate toolbar, touch-activated notes and lane buttons, and visible Surge-charge progress. Existing keyboard support stays in place. (`Companion Files/theta-rhythm.js`, `Companion Files/theta-rhythm.css`)
5. Update current-state feature guides and refresh offline shell cache identifiers. (`service-worker.js`, `Midir-Companion-Doccumentation/`)

## Midir Companion 0.3.2a — critical-neutral Rotation Highlights hotfix

1. Use the same ordinary-damage reference for critical and non-critical hits of a skill. For crit-only skills, infer the character-wide critical multiplier from other skills with paired evidence and use it to estimate ordinary damage; retain estimated flags and critical annotations. (`Companion Files/app.js`; `tests/rotation032a_crit_neutral.js`)
2. Refresh offline PWA caches for the code change without changing the 0.3.2 feature version. (`service-worker.js`)

## Midir Companion 0.3.2 — build 305

1. Rotation Highlights skill recognition: retain player-attributed puppet Act damage skills labeled `AI`, while excluding only known passive procs (`Companion Files/skill-use-rules.js`).
2. Rotation Highlights scope selection: prefer actual boss-recipient precise hit windows across all gates; fall back to Gate 2 only when precise boss-only evidence is unavailable (`Companion Files/app.js`).
3. Normalize Melodic Puppeteer Wireless Puppet `Act … AI` labels for the skill tracks while retaining active-skill recognition and source identity; show a track for every recognized skill (including one-off Puppet Acts), resolve bundled puppet skill icons for `AI`-suffixed labels, update docs and offline PWA cache (`Companion Files/app.js`, `service-worker.js`).

## Midir Companion 0.3.1 — build 304

1. Crom Bás Invaders: Correct Cari's ally shield to absorb the damage of two unupgraded Magnum Shots (36 damage); excess damage penetrates (`Companion Files/as-chicken-invaders.js`).
2. Mobile Invaders: Add a button for every skill, retain hold-and-release for charging skills, arrange portrait playfield above controls and landscape controls beside playfield (`Companion Files/as-chicken-invaders.js`, `Companion Files/styles.css`).
3. Compact mobile elemental-orb display at the game area's upper-right; update version and PWA shell cache (`Companion Files/styles.css`, `service-worker.js`).

# Historical application changelog

### Build 302 (0.3.0) — Vertrag arena-edge visibility

- Render the player, overhead HP indicator, and damage floaters after the arena-ground clipping pass so they remain fully visible at the outer giant positions; arena collision, movement boundaries, and damage rules are unchanged. Refresh PWA cache identifiers. (`Companion Files/vertrag-survival.js`, `service-worker.js`; `tests/vertrag302_edge_visibility_test.py`)

This file records prior changes. For current behavior, use the [feature guides](CURRENT-FEATURES.md). Version **0.3.0** is assigned to build 300; build 301 corrected its label only.

### 285 (0.2.85) — Theta Shadow Flare casting rhythm

- Set Shadow Flare cast/load duration to 5.0 seconds at Vivace 0%, reduced 0.5s per +10% shop tier to 1.0s at +80%; the existing note scheduler and offensive cast lock use the same duration. Twilight Surge timing, Thunder timing, all other game rules and saved upgrade levels remain unchanged. (`Companion Files/theta-rhythm.js`; `tests/theta285_cast_test.py`)

### 284 (0.2.84) — Theta Seething Mana resource loop

- Theta offensive hits now recover a provisional 0.5 Dorcha each when Seething Mana is OFF; skill-specific Dorcha costs remain in effect.
- When Seething Mana is ON, normal hit recovery is disabled, its existing surcharge applies, and affordable offensive casts receive the existing +30% points boost. Hexshroud recovery remains independently additive.
- Updated Theta guide and HUD to show the two modes. Previous profile fields, achievements, Lucky Strike, and Vivace upgrades are unchanged.

### 283 (0.2.83) — Theta casting-speed and resource rules

- Dark Erg Exchange: Vivace +10% casting speed per purchase, eight tiers, capped at +80%; separate Shadow Flare/Twilight Surge cast locks and next-Thunder cadence. Provisional cast times are explicit and cooldowns remain separate.
- Documented Dark Diviner Dorcha costs, Seething Mana 0.6 surcharge, Render Mana/Render Dorcha interaction, Hexshroud Dorcha recovery, Thunderblight damage bonus and duration. Unspecified Twilight Surge direct cost is not fabricated.
- Old Theta save key, upgrades, shop achievements, and customized cooldown overrides remain compatible. Focused headless Chromium tests cover higher-speed scheduling, impossible note overlap, costs, lockout, and shop persistence.
- Sources: current user-approved Dark Diviner project handoff; Midir Arcana field guide; Mabinogi official Arcana and 2026 update notes (Nexon); current skill pages (mabi.gg).

### 282 (0.2.82) — Subject Theta timing and resource actions
1. Added explicit hit circles, timing pulses, and nearest-note millisecond countdown in the Theta rhythm highway (`theta-rhythm.js`).
2. Split Render Mana, Render Dorcha, and Hexshroud into independent cooldown-based utility activations without rhythm-note scoring or overheat (`theta-rhythm.js`, `theta-rhythm.css`).
3. Capped Dorcha at 15 and rebalanced provisional resources; raised initial MP to 250; added one-level Spirit Weapon Lucky Strike shop upgrade (10% chance for +20% maximum MP after Thunder cast) (`theta-rhythm.js`).
4. Preserved existing save namespace and upgrade fields, desktop gameplay, mobile restrictions, and PWA cache isolation (`index.html`, `service-worker.js`).

# Midir Companion — Changelog

## 0.3.9a — Mobile Cutting Chorus access hotfix

1. Allow Cutting Chorus to launch from the mobile Arcana hub; retain the keyboard-only legacy drill restriction. Existing two-touch aim and per-skill timing controls are unchanged. [1] `Companion Files/app.js`; [2] `Companion Files/mp-rhythm.js`.
2. Correct the Music Lab and Mobile Features current-state guides and refresh the PWA shell caches. [3] `Midir-Companion-Doccumentation/features/12-MUSIC-AND-PUPPETEER.md`; [4] `Midir-Companion-Doccumentation/features/18-MOBILE-FEATURES.md`; [5] `service-worker.js`.


**Current application version:** 0.3.9a. Build 300 was the 0.3.0 feature release; build 301 only corrected its label. Historical release notes document behavior at the time and may describe mechanics later replaced or corrected.

**For current behavior:** Use the [current feature map](CURRENT-FEATURES.md), [architecture reference](COMPANION-REFERENCE.md), and [verification notes](VERIFICATION.md). This changelog retains historical descriptions only.

- **Rotation Highlights:** The declared Arcana minimum-cooldown tables are not enforced by build-275 candidate scoring. It uses recognized skill-use anchors and attributable hit budgets; the result is an evidence-limited candidate, **not** a validated repeatable rotation.
- **The Vault:** The Vault and compact Achievement Book remain accessible when Secret Sauce is off. The setting conceals report imports, report views, collectibles and importer-only features without erasing saved data.
- **Duplicate reports:** A recognized duplicate prompts **Replace** or **Cancel**. There is no explicit **Keep both** choice for a recognized duplicate.
- **Training models:** Simulators, their drop chances, encounter approximations and gameplay timings are Companion rules—not verified live Mabinogi measurements. EV Tower Range Lab remains an experimental training game.

*Documentation integration note:* This copyediting and documentation-bundling pass does **not** increment the Companion application version or change executable code, assets or player-save contracts. The release history is retained below.

---

## Companion 279 — Mobile report-reading foundation and SG checklist
- **Mobile-aware presentation:** On phone browsers, Vault shows a touch-friendly quick route to the existing Sacred Guardian Oath-maxing checklist (full and emergency modes); the checklist can open without completing the character-stat setup wizard. Existing checklist completion/order and full-backup data are reused. Desktop presentation and controls are unchanged.
- **Conservative active retention:** Mobile defaults to ten active detailed reports instead of desktop's thirty. Overflow and incomplete imports move to the existing archive without deleting entries; optional permanent compaction still requires the existing explicit consent and external source files for recovery. A pre-import confirmation explains when new files may exceed the mobile cap.
- **Storage precautions:** Phone import and reactivation paths request confirmation for files at or above 12 MiB or when browser storage estimates indicate low headroom. The warning explains transient parse memory requirements, external backups and browser quota uncertainty. A persistent Vault notice reminds users about source HTML and backup retention; backup restores also receive the large-file warning.
- **Desktop-only games:** Hotkey-dependent Rotation Crafters, Theta, Vertrag, and other unadapted games are visibly disabled in phone mode with an N/A message. Reforge and Herb modules remain reachable for exploratory use, not yet verified on physical phones. Ordinary desktop operation is unaffected.
- **Compatibility:** Existing saved-profile keys and version-2 backup format are unchanged; all existing application and 277/278 archive regression tests pass. Isolated Android-sized Chromium smoke tests cover mobile navigation, SG touch checkboxes, disabled desktop controls and the ten-active-report cap. Actual HTTPS-hosted Android/iOS large-import and IndexedDB persistence tests remain pending.

---

## Companion 278 — Fingerprint-verified compact archival and encounter-level Arcana
- **True space reclamation:** After a one-time warning and approval, compact archive entries replace full report details, while their independent achievement credit, Arcana rotation winners and historical skill medians remain intact. Original HTML and cold structured-report copies are purged only after durable summary/profile commit. A failed commit retains recoverable full data.
- **Reselect to reactivate:** Return to active requires the original structured export, validated by SHA-256 of the canonical parsed evidence. Filenames may differ. Newly imported reports also retain the original raw file digest; older 277 reports receive a parsed-evidence digest from their existing cold copy when available. Neither duplicate detection nor archive restoration relies solely on a filename.
- **Backups:** The version-2 backup format is preserved; newly compacted reports now export lightweight metadata/ledgers, not the original reports or HTML. Save your source exports externally. Old version-2 backups containing full archived reports remain acceptable.
- **Encounter Arcana correction:** Exclusive, player-attributed skill use/hit events identify Arcana independently per gate/attempt even if the session label is stale. This changes eligible encounter selection and archive categorization, not the Recorded Peak formula. Damage-only exports remain usable. Unresolvable conflicts are excluded from that Arcana rather than guessed; uncertain observations fall back to session metadata only if no exclusive skill evidence exists.
- **Achievement separation:** Archived rotation comparisons never write award credit. Harmonic Saint survival-exemption checks use encounter evidence rather than the session-wide Arcana label.
- **Verification:** Includes new SHA-256, reactivation, compaction durability/failure, and multi-gate Arcana regression fixtures. Real persistent-browser storage/restore requires follow-up user verification.

---

## Companion 277 — Reversible archive compaction and independent lifetime summaries
- **Archive page:** Added a compact top-of-page lifetime achievements/collectibles ledger and an Arcana dropdown with four independent best-sequence categories: recorded 10s/60s and cooldown-aware 10s/60s. Archive entries can be returned to active or permanently deleted from the detailed report store.
- **Archival summaries:** Save the source's qualifying achievement/award *counts by type* before discarding individual earned-milestone history beyond the 30 most recent active reports. The synthetic lifetime ledger unlocks the Achievement Book without re-verifying departed source events. Each source is deduplicated; replacements refresh new credits without counting prior credits twice. Retained collectibles likewise use banked balances.
- **Rolling highlights:** Preserve one winner per Arcana and per 10/60-second scoring category; store compact skill-hit sequences and one median per skill. When another report archives, compare the incumbent and challenger using the same updated per-skill median. If the newer report contains no sample of a skill, its older archived median remains available. No archive comparison calls any achievement awarding path. The live Recorded Peak algorithm was not edited.
- **Reversible memory unloading:** Archived reports' full structured details move into a new IndexedDB `cold` object store (database version 3). Report listing keeps a small metadata/summary record; full backup and return-to-active recover details from `cold`. The cold copy is retained on disk, rather than irreversibly thrown away, so reports remain restorable even when an old HTML original is missing.
- **Migration safety:** Report-only milestones are evaluated before pruning; profile milestone rebuilding is deferred until IndexedDB hydration completes. Archived reports are excluded from active full-data analysis and won't be double-counted when manually reactivated. The 276 10-per-page and 30-active limits remain.
- **Compatibility:** Main localStorage key, backup v2 format, report IDs, and independent minigame save keys remain unchanged. Existing 276 fixtures and a new archive-ledger test set run without changes to the original 275/276 gameplay features.
- **Verification caveat:** JavaScript logic tests and isolated Chromium UI tests passed, but actual browser-origin IndexedDB v2→v3 migration, large real-backup round-trip, and quota/storage-failure rollback still require verification in a persistent browser profile. Save a 276-compatible backup externally before trying the new build.

---

## Companion 276 — Cooldown candidates, archival lists, Theta overheat and Vertrag trial fix
- **Recorded Peak remains unchanged.** The separate cooldown-aware 10s and 60s candidates now consult the Arcana minimum-cooldown tables and provisional skill-shape durations. Continued DoT hits are retained within their originating use, invalid early reactivations are not credited as extra uses, and damage-only legacy reports remain eligible. Every canonical boss attempt/gate starts with a new cooldown history.
- **The Vault** displays at most ten active reports per page, separates complete reports from an archived-report view, and automatically places old/incomplete reports and active entries beyond the newest 30 into the archive. Archive/unarchive is available for individual reports. A backup call-to-action appears at 20 active reports. Archived reports still retain their full structured data in IndexedDB/runtime, so historical achievements and Rotation Highlights can continue to use them. **True data unloading and rolling-summary-only archival are deferred** until an integrity-checked backup/rehydration workflow is established.
- **Subject Theta** now uses overheat marks: five failed/incorrect inputs ends the attempt immediately without Sigils, and three consecutive successful notes reset the current marks. Existing achievement IDs and historical earned data are unchanged.
- **Vertrag Time Trial and Endless** always begin with four living giants, regardless of selected stomp pressure. The pressure selector now controls initially unoccupied/stomping giants; zero does not constitute a clear, and all four must still be defeated in a Time Trial.
- Launcher version label updated to **0.2.76**. Local storage keys and backup type/version remain unchanged. Added synthetic backup/achievement/legacy-report fixtures and focused tests.
- **Verification limits:** Successful isolated Chromium gameplay smoke test and regression suite. A real browser-origin full backup restore and eventual archive unloading remain unverified; no schema-changing migration is claimed.

---

## Companion 275 — Vertrag eight-landmark arena floor
- Replaced Vertrag’s gameplay floor image with the approved pale-stone and grassy arena featuring all eight turquoise inner-ring landmarks and the large north/south outer platforms.
- Aligned the source image’s oval projection to the game’s circular teal collision boundary; removed duplicate programmatic landmark drawings.
- Retained the four edge-positioned mage Disciples at 1, 5, 7 and 11 o’clock, the player-locked camera, variable wheel zoom, and click-to-move world-coordinate mapping.
- Verified rendering in Chromium, zoom boundaries, giant suppression/defeat, and Companion-wide navigation tests.

## Companion 272 — Vertrag player-locked camera
- Hard-locked camera keeps the player at the center of the Vertrag arena viewport while the arena moves below.
- Scroll wheel adjusts zoom from a dynamically calculated full-arena view to 265%, keeping Vertrag fully readable.
- Click-to-move converts screen coordinates through the zoomed camera so destination and boundary logic still work.
- Fixed HUD is unaffected by camera scale; in-game zoom display added.
- Added dedicated camera regression checks for WASD, click-to-move, and zoom limits.

## Companion 270 — Vertrag circular arena
- Styled giant-phase stone arena floor and teal circular play boundary.
- Eight clock-point floor markers; four temporary mage Disciples on cardinal positions.
- Player, boss and stomp movement constrained to arena circle.

## Companion 269 — Vertrag Arcana animations
- Seven individual transparent player animation frames for each of the ten Arcana sprite sets: idle, locomotion, and damage/stagger states.
- Movement is triggered by actual WASD or click-to-move displacement; hit and deadly/knockdown animations override locomotion.
- Living giants use the existing staff Disciple sprite artwork as temporary arena stand-ins.

## Companion 266 — Vertrag Giant Phase Survival framework
- Added a universally accessible Vertrag survival trainer on every Arcana reference page, presented as Sacred Guardian field lessons.
- Implemented eight provisional stomp-dodging stages, customizable movement controls, telegraphs, pursuit aura, boss strikes, scoring, vulnerability stacks, practice settings, awards, and progress saving.
- Included Vertrag progress in profile backup and restore. Stomp timing/geometry and boss visuals await footage calibration.

## Companion 245 — Melci Animation Frames
- Added 32 dedicated Melci frames in `assets/crom/sprites/melci-action-atlas.png`, adapted from the original approved Melci art: 8 running, 8 Flame Burst, 8 Kunai Storm, and 8 landing/recovery frames.
- Hooked atlas frame selection to the smooth Melci state machine rather than repeating the generic 4-frame enemy atlas.
- Preserved the existing Flame Burst damage pulse cadence and Kunai target/jump/throw/landing sequence.
- Ground shadows and attack targeting telegraphs remain anchored during airborne movement.
- Previous gameplay balance and saved progression are unchanged.

## Companion 241 — Crom Bás enemy depth and Cari/Wyneb formation variety
- Spread normal wave combatants across staggered near/middle/far danger-zone bands with controlled spacing and per-wave variation.
- Cari now patrols with gentle vertical drift rather than remaining on a fixed back-wall line.
- Wyneb companion slimes spawn at varied diagonal/forward/back offsets around Cari without disrupting their pairing or chase/detonation mechanics.
- Preserved the protected player approach, scripted boss placements, combat rules, saved progression and the Companion 240 animation work.

## Companion 235 — Rotation Crafter grounded attack frames
- Ground contact shadow and glow are independent, stationary SVG layers; attack movement affects only the character sprite.
- Added two pre-rendered alternate artwork frames (windup and strike) per Crafter archetype, including Harmonic Saint, with distinct character-specific motion over the frame sequence.
- Preserved approved sprite identities and weapon designs; existing skill timing, visual projectiles, and saved data are unchanged.
- Added reduced-motion fallback to the static idle frames.

## Companion 232 — Rotation Crafter framing fixes
- Reframed all Crafter characters using stage-safe feet anchors, correcting top clipping while preserving approved artwork and existing animations.
- Resized/repositioned Harmonic Saint and allied trainee sprites for the smaller support cards so heads and bodies remain visible.
- Adjusted support-card height and alignment to keep the character portrait, name, and health bar separate.
- No gameplay, save-data, or recognition changes.

## Companion 231 — Alchemist artwork and Rotation Crafter attack motion
- Adopted the approved Soul Liberator Alchemist character artwork, isolating the main character from its reference board for the Crafter.
- Added archetype-specific sprite attack motion: bow draw/release, magic casting, dual-gun recoil, alchemy discharge, control-bar manipulation, shield brace, slashes, punches, and lance thrusts.
- Kept existing skill timings, damage, cooldowns, and progression unchanged. Reduced-motion accessibility preference remains respected.
- Animations are transform-based on static illustrations, not hand-drawn frame-by-frame sprite sheets.

## Companion 230 — Approved Puppeteer art
- Replaced the Rotation Crafter Puppeteer character image with the approved Soul Liberator Control Bars sprite.
- Kept character interactions, skill logic, and all other visual assets unchanged.

## Companion 229 — Crafter sprite mounting correction
- Corrected the Rotation Crafter Puppeteer sprite so the control bars are mounted to the hands/wrists rather than loosely handheld.
- Corrected the Rotation Crafter Alchemist sprite so the cylinder and guard cylinder read as forearm-mounted equipment rather than generic held weapons.
- No functional changes; this is a targeted visual correction pass following the broader Crafter sprite upgrade.

## Companion 227 — Sacred Guardian Oath-Maxing preparation
- Added Little Fury Sword Relic rank C/B/A/S/EX for +20/30/45/60/70 Will, with the provided icon.
- Added Ophelia’s Tears Persona: +100 Will, −20 Intelligence, −30 Strength, five-minute activation and a shared 30-minute cooldown, with persisted real-time timers.
- Added full-preparation Alban Knights Emblem toggle and rune levels 0–5: Mind +5 Will, Mana +3 Magic Defense and Body +10 HP per level; Emergency Oath separately models the emblem already equipped and warns that changes are unavailable during combat / within 30 seconds of combat activity.
- Added independently equipped Title and 2nd Title bonus entry fields accepting multiple signed stats, with parsing and unrecognized-entry feedback.
- Applied +1 Defense per full 10 Strength, +1 Magic Defense per full 10 Will, and +1 Magic Protection per full 10 Intelligence (including negative deltas) to the prepared defensive stats of both Oath modes.
- Added gear and Persona steps to Oath checklists, plus editable signed Strength, Will, and Intelligence for Doll Bags and Catering. Show stat conversions and persist equipment, timers and titles in standalone state and profile backups. Existing frozen snapshots remain frozen.

## Companion 226 — Rotation Crafter visual cohesion pass
- Reworked the Rotation Crafter stage art to better match the stylized Crom Bás Invaders look: darker cathedral staging, sprite-inspired characters, and Crom enemy target sprites.
- Replaced several generic vector weapon placeholders with the provided equipment art where appropriate, including Control Bars for Melodic Puppeteer and Arcana-specific weapon silhouettes across the Crafter scenes.
- Refreshed Harmonic Saint support-target presentation so allied trainees use the same stylized figure language as the Crafter instead of simple placeholder mannequins.
- Audited adjacent minigame/storage visuals and prioritized the biggest cohesion gap: the Crafter’s generated stand-in sprites. Existing item/skill-icon-driven views were preserved where they already matched the platform’s art direction.

## Companion 225

### Secret Sauce & Settings

- Added an unobtrusive menu → Settings page with optional See Secret Sauce (off by default).
- Kept **The Vault** and its compact Achievement Book accessible when **See Secret Sauce** is off. Report imports, report views, collectibles, importer-specific awards and editing stay hidden in that mode; saved data is retained.
- Kept full-profile backup/restore accessible from Settings, including all minigame progress and saved preferences.
- Offered six accent colors, standard/large text, reduced motion, and 3–20 second expanded tooltip timing (default eight seconds); basic tooltips remain unchanged.
- Preserved the 225 working-branch skill recognition rules and unified skill-use presentation, including Base64 effect type decoding.

### Skill-specific use recognition

- Added unified Skill Uses for remote players, built from per-skill action, effect, condition, and damage rules. No inferred/observed distinction is shown to users.
- Default 0-second cooldown, one hit per use; individual tunable overrides for multi-hit and timed skills calibrated from the Rixi reference session.
- Recognized nondamaging signature sequences for Anchor Rush, Rain Casting, Hydra Transmutation, Starlight Veil, Gravity Well, and additional named effects.
- Decoded Base64-encoded `skillObservations.fieldTypes` into numeric protocol type arrays.
- Rotation Highlights cooldown-aware scoring uses the unified skill-use engine, including remote actors.
- The report inspector shows use counts, rules, and use timelines for each player.

## Companion 224 — Rotation Highlights for observation-limited remote players
- Fixed empty 10s / 60s candidate panels when one unknown-cooldown skill had previously disqualified an entire encounter; kept Recorded Peak calculations separate.
- Added separate **evidence-limited candidates** using attributable skill-use evidence and limited hit budgets; these are not verified cast sequences. In build 275, the active scorer uses `MIDIR_SKILL_USES` rules rather than enforcing the declared ten-Arcana minimum-cooldown tables.
- Kept unscored skill hits visible as explicitly excluded context, with a reason and per-skill counts. Damage-backed appearances never become confirmed casts.
- Used actor-verified `0x7926` evidence as timing hints where present, and treated explicit source-attributed boss-condition metadata (`MNEI:2:...`, `MCDCASI:2:...`) as corroborating evidence rather than proof of cast count; never attributed recipient-only effects to their recipients as casters.
- Merged partial action/condition evidence with unmatched hit-backed skill appearances in visual tracks, and fixed duplicate radio IDs between peak and cooldown panels.
- Historical regression note: the `skill usage test.html` sample (Pihx, Harmonic Saint) exercised 10/60-second candidates and limited evidence, without populated `skillObservations`. Its unknown-cooldown exclusions are not a general rule for Companion 275; recognized zero-cooldown-default uses can be eligible when the required anchor and baseline exist.
- Verified JavaScript syntax and sample-driven Node regressions. Full interactive browser QA is limited by the current test environment.

## Companion 223 — Midir 45 skill-evidence import
- Imported and retain `skillObservationSchemaVersion: 1` / `skillObservations` with precise session-relative and absolute timestamps, typed protocol fields, opcode, actor verification, and 64-bit-safe string entity IDs.
- Preserved explicit local `0x6988` skill packets and precise positive `damageHitEvents` (crit, delayed, target, and timestamp) independently; keep optional older HTML compatible.
- Interpret typed `0x7926` Combat Action skill IDs only with a verified actor. Treat `0x9093` and `0x9095` typed IDs and known cues as recipient-associated, not caster-confirmed actions.
- Added a per-player, per-canonical-attempt Skill Discovery inspection table showing direct packets, verified action stages, approximate stage bursts, positive hits, and separately identified recipient-only effects and unresolved records.
- Showed remote verified combat action bursts in Rotation Highlights beside local skill-packet evidence, without turning packet/hit counts into confirmed cast counts or attributing local events to other players.
- Corrected debuff evidence matching so one player's `0x6988` packets do not suppress another player's precise hit evidence; treat internal `9999` pet/summon damage as non-actionable in rotations.
- Kept the recognizable `Midir Companion.html` launcher and GitHub Pages `index.html` redirect.
- Validation: JavaScript syntax checks, ZIP integrity, isolated Node unit/regression fixtures. No live post-update Midir 45 HTML was supplied; interactive browser QA remains pending.

## Companion 222
- Added recognizable `Midir Companion.html` launcher.
- Moved all supporting files to `Companion Files/` while preserving relative resource paths via HTML base URL.
- Kept `index.html` as a GitHub Pages-compatible redirect launcher.

## Companion 221
- Glas and Giga Glas blight circles are 20% larger, telegraphed in red, and staggered rather than appearing together.
- Blight avoids the central dodge corridor.
- Left/right Glas swipes now cover the bottom third and their respective half of the middle third, leaving the upper area and opposite middle half safe.

## Companion 220
- Separated health and wave HUD from currency; removed duplicated currency block.
- Minimized currency display in the top-right corner and made health a compact independent top-left indicator.
- Reduced overlay footprint to preserve enemy health bars and loot visibility.

## Companion 218 — Link I HP correction
- Moved the +2 maximum HP Link milestone from Link V to Link I. Link V retains its Tri-Assault and archery damage bonuses. Existing Link levels apply automatically without re-purchase.

## Companion 217 — Link Progression
- Ten purchasable cumulative Alchemic Sharpshooter Links using escalating Fragments.
- Aqua Volley default charge restored to 2s; Link VIII halves it and grants full-charge damage bonus.
- Link V gives +2 maximum HP, +20% Tri damage, and modest archery scaling.
- Added movement haste, wind width, Ignis radius, elemental charge, Terra duration, distance damage, and Link X adapted damage/defense effects.

> **Superseded in Companion 218:** The +2 maximum-HP milestone moved from Link V to Link I.

## Companion 215 — Responsive HUD, shop wallet and pause hotbar
- Resized the game stage responsively while preserving its **800 × 620** logical battlefield coordinates.
- Made the shop list independently scrollable, with owned currencies pinned in a persistent footer.
- Moved hotbar editing from the shop to a paused-game drawer of unlocked skills.
- Saved drag-and-drop hotbar assignments to the existing player profile without advancing combat time.

## Companion 214
- Added new Disciple sprite treatment: masked human underlings styled after Melci's coat.
- Added Cauldron sprite treatment and slam/crack visual behavior for Irusan phase.
- Reworked camp presentation with a cleaner forward-camp scene and a new procedurally drawn cathedral entrance.
- Moved HP, hotbar, notes, and total currency displays into the game window.
- Shop now keeps owned currency visible while scrolling with sticky currency header.
- Updated Ventus Howl into a weaker damage wind tunnel that pulls enemies toward its centerline.
- Crash Shot base radius is now double Ignis Plume's base radius.
- Terra Scourge is now a hold-and-release placement skill that repeats strikes every 3 seconds for 10 seconds.
- Aqua Volley charge-up speed doubled.
- Urgent Shot now buffs the damage of other skills for a short duration.
- Rare health item drops added to enemy defeats.

## Companion 213 — Cathedral environments (first pass)
- Added sixteen 800×620 fixed-angle top-down cathedral room backgrounds, selected every three non-rooftop waves. Base geometry and enemy hitboxes unchanged.
- Glas on waves 20/40/50 receives distinct altar rooftop treatments: an intact roof at 20, a visible previous-fight breach at 40, and a corrupted, scarred summit at 50.
- Added subdued purple animated corruption (scales with wave and cycle), floor energy pulse, and an occasional Irusan-like moving shadow beneath combat telegraphs.
- Added an approach-to-abyss vignette in camp and aligned the walk-in cathedral entry area and shop hit regions with the intended positions.
- Added a camp Field Notes button with enemy hints and player progression summary; carried over customizable hotbar and shop close fix.
- Art limitation: procedural environment pass with subtle architectural differences, not 16 fully hand-painted scenes. Browser testing blocked by this environment; syntax validation only.

## Companion 212 — Camp and Hotbar Pass
- Fixed the camp shop trap by preventing the shop trigger from immediately reopening when the close button is used.
- Added a customizable drag-and-drop hotbar with skill icons and slot reassignment.
- Added skill icons to the Dark Erg Shop unlock list.
- Reworked the camp into a desolate pioneer staging ground with a cathedral approach to Crom Bás.

## Companion 211 — Ignis Plume and Aqua Volley skill pass
- Ignis Plume leaves burning visual ground marks along its flight and detonates three times at the first enemy impact or map edge. Blast-radius growth is one-third of Crash Shot radius-upgrade growth.
- Aqua Volley uses a two-second charge with a visible narrowing cone, releases five fan-shaped, water-trailed arrows, and permits early keyboard release with key 3.
- Aqua Volley arrows pierce ordinary targets without weakening per hit; Glas element seals / disciples / body blockers still interrupt shots, and Giga Glas blockers reflect Aqua Volley.
- Each Aqua arrow gains the same flat damage increment as the Magnum Shot reforge (+7 per rank).
- Existing saves, achievement keys, and shop progression retained. Runtime browser playtesting still needed.

## Companion 210 — Animated Crom Bás enemy sprites (October 25, 2026)
- Added 11 transparent animation atlases in `assets/crom/sprites/*-atlas.png`, each containing four frames each of idle, movement, attack, recoil and defeat. Frames are derived from the approved 209 concept crops with frame-by-frame transforms rather than hand-drawn replacement poses.
- Characters retain approved identity mapping (Cari ghost bride; Irusan fairy cat; Gwallgof hammer brute; Un Llygadog lantern; Wyneb slime; Wraith purple apparition; Ronaun caged humanoid; Melci hooded feline ninja).
- Renderer selects animation state from actual combat events: projectile/special attacks, damage, Wyneb chase and bomb, Irusan and Glas phases. Gwallgof and Melci use movement frames as they traverse. Falling enemies briefly play a fading defeat animation.
- Archer uses attack and hit animations as well; idle/menu uses movement cycle. Existing telegraph shapes and projectile styles remain visible independently of sprite art.
- Animation changes only; does not modify hitbox dimensions, attack coefficients, persistent profile, shop or cross-game rewards. Supports missing-atlas fallback via previous canvas silhouettes.
- Art limitation: these are animated transformations of approved still artwork, not independently illustrated directional walks or fully redrawn attack poses.

## Companion 209 — Crom Bás sprite integration (October 25, 2026)
- Extracted eleven transparent PNG assets from the approved Crom fantasy pixel-art concepts and the approved hooded feline Melci design. Assets live in `assets/crom/sprites/`.
- Mapped Ronaun=caged face; Gwallgof=hammer brute; Un Llygadog=lantern face; Cari=ghost bride; Wyneb=slime; Wraith=purple specter; Irusan=cat fairy; Glas/Giga Glas=corresponding winged bosses; Melci=hooded feline ninja; player=bow archer.
- Integrated actual PNG sprites into the 800×620 canvas, including camp archer, enemies and upper-third bosses. Missing or loading sprites fall back to v208 canvas artwork.
- Preserved v208 enemy behavior, collision bounds, projectile readability, Vault progression, shop and other games unchanged.
- Art is a single idle frame per character (not a full animation sheet); source sprites are resized to gameplay scale. Future iteration can add animation frames and damage/recoil states.

## Companion 208 — Crom enemy identities, movement, and combat art
- Renamed former Wyneb summoner into Un Llygadog; eliminated generic Llygadog placeholder from active pools.
- Added Cari-paired Wyneb, which pursues after taking damage then locks in place with an invulnerable timed explosive warning radius.
- Gwallgof now uses constant-distance stepping with progressively longer top-to-bottom traversal, including the bottom-center safe sector; Ronaun advances into side danger lanes.
- Restricted ordinary ranged projectiles to Disciples, Cari, and Un Llygadog; Ronaun and Wraith keep their specials only.
- Replaced generic enemy circles with distinct canvas fantasy silhouettes, added a hooded bow-wielding player, and rendered normal magic as fiery orange projectiles and Ice Spear as large blue crystal bolts.
- Added original visual concept sheet under assets/crom/ for later transparent atlas development.

## Companion 207

### Crom Bás Invaders routing repair

- Moved Crom Bás game routing inside the app scope so both entry points render the arcade game rather than Rotation Crafter.
- Verified both navigation paths with browser click-through tests.

### Crom Bás Invaders navigation

- Registered the game directly among the Alchemic Sharpshooter shortcut cards, inside the proper Available pages grid.
- Added Crom Bás Invaders to the Games & Simulators side menu with an explicit AS route.
- Removed the late markup-injection workaround; retain the existing game renderer and click handling.

## Companion 205
- Achievement Book opens as a page-turning popup, organized from Vault-exclusive awards to training and minigames.
- The Vault shows the five latest earned achievements as fully presented horizontal cards.
- Preserved achievement logic and recorded unlock progress.

## Companion 204
- Alban Anvil upgrade fees are 3× normal; both displayed price and charged gold match.
- Crom Bás Invaders shortcut is now inserted directly after the Arcana picker on the Alchemic Sharpshooter landing page, without relying on the Crafter button markup.

## Companion 203
- 13 Crom Bás Invaders achievements for bosses, repeat cycles, equipment shop, and cross-game upgrades.
- Completed-wave rewards checkpoint to local saves; run-end collects the remainder.
- Boss and purchase achievement tracking included in the existing full Vault backup.
- Extended Korean and Spanish labels for Crom Bás Invaders.
- Shared Special Upgrade stone chest remains the source of truth for stone purchases.

## Companion 202 — Giga Glas Ghaibhleann
- Wave 50 now features Giga Glas: awakened opening, repeat elemental disciples, three-lane lasers, safe-lane blasts, persistent expanding puddles, Aqua Volley reflections and berserk last 10%.
- Normal Glas encounters remain at waves 20 and 40.

## Companion 201

### Glas Ghaibhleann

- Element-matched orbs, shielded boss, telegraphed swipes and laser, phased reinforcements, elemental Disciples, purple lethal puddles.
- Tri-Assault now expends charged elemental orbs from Ignis, Aqua, Terra and Ventus; no stat bonuses added.

### Irusan boss encounter

- Multi-phase Irusan teleport swipe and tracked laser pattern, telegraphed red circles, alternate-key struggle, timed cauldron and transformation.
- Half-health invulnerability, Cari reinforcements, accelerating finale, and Melci support during Irusan encounters.
- Saved profile progression and all other minigames preserved.

## Companion 199 — Melci Diafol
- Added Melci Diafol mid-cycle mini-boss on waves 15, 25, 35, and 45; wave loops repeat on schedule.
- Independent V-path timing with Kunai Storm target telegraphs and five strikes, and five-hit cone Flame Burst with brief movement stun.
- Mini-boss health and rewards scale with long-run difficulty; existing ordinary-enemy attack cap unaffected.

## Companion 198 — Crom Bás Invaders enemy behaviors
- Ronaun: fixed one-point shield with overflow, persistent caster-owned tether lines, slowing/entanglement, recoil escape.
- Wyneb: lower health, occupancy-aware summons, triple corner summon.
- Gwallgof: enhanced HP, scaling damage resistance, accelerating W-pattern, touch damage.
- Wraith: staggered mid-wave arrivals, stackable short attack boosts, reactive dodges, cooldown-bound roar and Cari-style Ice Spear.
- Preserved rolling attack budget and five-second intermissions.

## Companion 197 — Crom Bás Invaders enemy pacing
- Safe bottom-center sector; axis-aligned formation movement and special-only lateral dashes.
- First ten waves feature one normal enemy type per wave, shared rolling 3-second attack budget, five-second transitions, and escalating post-25 and post-50 difficulty.
- Disciple directional shots, collision shoves, and dash/aimed special attacks. Cari synchronized 5-second two-point ally shielding and freezing Ice Spear.
- Increased loop rewards and preserved existing profile format.

## Companion 196 — Crom Bás Invaders (Alchemic Sharpshooter)
- Added a 50-wave arcade shooter with Crom Bás-inspired enemies, Irusan/Glas boss waves, an archer protagonist, automatic 1-second Magnum Shots, mouse and WASD/arrow movement, pause/quit, and continuous looping at increased difficulty.
- Dark Erg fragments unlock eight active skills and four persistent reforge tracks (including Crash Shot shrapnel count, radius and damage); chunks buy upgrade stones and cross-minigame bonuses between runs.
- Hooked Dark Erg shop bonuses into Limit Break chances, 20× Huge Lucky herb gathering, Bandit ducats and EV tickets. Added six arcade achievements.
- Saved the arcade profile and cross-game bonuses in the full Vault profile backup/restore payload; maintained existing progress in all other minigames.
- Initial visual/gameplay adaptation of Crom Bás; difficulty values and enemy behaviors are arcade designs, not exact dungeon simulations.

## Companion 195 — Special Upgrade achievements & save audit
- Added 14 Special Upgrade and cross-system achievements, including Step 8 + Erg S50 + Limit Break on the same weapon.
- Record milestone combinations at the moment of the Special Upgrade success or Limit Break roll, not from unrelated items.
- Kept progression, stone rewards, recovery evidence and achievement counters in Special Upgrade saves and full Vault backups.
- Tracked protected failures, recovery comebacks, step and stone milestones, and Storage Chest returns.

## Companion 194 — Special Upgrade workshop polish
- Condensed the anvil layout and stone picker for better use of desktop and mobile space.
- Simplified labels and moved upgrade rules and full rates behind a Help disclosure.
- Highlighted weapon-lock risk only when applicable, preserving existing upgrades, inventory, rewards, and save state.

## Companion 193 — Shared Special Upgrade Equipment
- Moved weapons from Reforge and Erg storage to the Special Upgrade anvil, then back to the Storage Chest without losing Reforge lines, Erg progression, or special-upgrade level and lock state.
- All eligible simulator weapons may reach step 8; off-hand equipment is excluded from Erg and Special Upgrades.
- Herb Collection rolls independent 1/250 standard Eweca/Ladeca and 1/400 protective Eweca/Ladeca chances for each newly gathered herb.
- Preserved weapon special-upgrade state through existing local saves and full Vault backups.

## Companion 192 — Special Upgrade Simulator
- Arsenal Gunner Special Upgrade Anvil, ten stone variants, step 1–8 success and gold costs, protective stones, recovery essence, achievements.
- Special Upgrade materials awarded through Herb Collection, Bandit Hunt, and Soul Liberator wave clears.
- Adds Orb and Spellbook reforge categories; off-hand items remain ineligible for Erg.
- Upgrade outcomes display step and type only, without stat bonuses.

## Companion 191 — Achievement Expeditions
- Added 47 new achievements spanning simulator exploration, cross-game mastery, equipment collections, and progression.
- Added simulated Auction House sale milestones, including a single sale over 1 billion gold.
- Tracked Limit Break reforges rolled specifically on an Erg S50 weapon, along with activity visits and map discovery.
- Added collection milestones to the Vault Achievement Book and included new records in full profile backups.

## Companion 190 — Minigame Achievement Collection
- Added 50 minigame achievement types across Tower Range Lab, Pig Pursuit, Bandit Hunt, Herb Collection, Erg, Reforge, and Sacred Guardian Oath.
- Persisted Dazzling purchases, Limit Break rolls, and Oath memory completions for Vault-backed achievement tracking.
- Kept the Achievement Book compact; achievement progress uses saved game records.

## Companion 189 — Rotation Highlights cooldown-aware comparisons
- Added separate cooldown-aware 10-second and 60-second windows alongside the unrestricted Recorded Peak selections.
- The initial comparison design described user-supplied minimum cooldowns, Showstopper resets, Stampede charges, Blazing Brawler reductions and provisional EV overheat. **Current-build note:** these declared reference tables are not enforced by the Companion 275 scoring path.
- The original release screened for insufficient timing evidence. In Companion 275, the candidate attributes hits using recognized skill-use anchors, per-use hit budgets and a noncritical or inferred damage baseline; it does **not** prove a globally legal rotation schedule.
- Time Shift and Bachram Boost windows remain available under Recorded Peak rather than cooldown-aware results.
- Kept combat reports, Vault backups and minigame save formats unchanged.

## Companion 188 — Korean and Spanish UI copy
- Matched the lighter English interface tone across Vault, Arcana Simulators, Debuff Academy, and minigame navigation.
- Added Korean and Spanish translations for new short labels, contextual help, achievements, EV controls, and Rotation Highlights.
- Preserved player-authored values, imported combat data, game logic, and save formats.

## Companion 187 — Lighter interface copy
- Condensed prominent Vault, Arcana landing, Debuff Academy, Rotation Highlights, Oath, and Herb Collection instructions and labels.
- Added small optional details for Vault imports/backups and Debuff Academy; kept gameplay and save behavior unchanged.
- This is an English-language copy pass; Korean and Spanish translations retain existing wording where applicable.

## Companion 186
- Sacred Guardian Oath Workshop settings, snapshot practice, and checklists now persist locally and travel with Vault full backups.
- Shortened prominent Oath Workshop guidance for a lighter interface.

## Companion 185
- Vault full backup now includes EV Tower Range Lab campaign, tower inventory, and resources, in addition to previously supported minigames. Restore imports EV progress when present.
- Duplicate-session imports offer replacement of an existing recording; session identity is retained and report-derived milestones are recalculated rather than awarded twice.
- Rotation Highlights now calls the winning windows recorded peaks and plainly discloses that a cooldown-aware comparison is not yet computed.
- Added a collapsible Achievement Book with a compact featured-achievements row, plus five progress-derived minigame awards.
- Simplified Rotation Highlights wording about recorded hits and skill-use packets.

## Companion 184 — EV responsive HUD and guided onboarding
- Increased shared Mana Shell maximum and Recharge Shells capacity to 100, including restoration caps and save migration clamping.
- EV hotbar moved above battlefield; Shell and Pressure gauges anchored to bottom-left of battlefield; lives drawn over the Base.
- Shop displays gold/tickets; first-wave tutorial presented as centered character dialogue.
- EV viewport layout now flexes to available browser height to keep control buttons visible.
- Experimental feature; interactive browser regression testing remains pending.

## Companion 183 — EV first-wave guided tour and manual hotbar
- New campaigns must practice A/D track patrol, confirm loot pickup, open and review the Home Base before Wave 1. Existing campaigns with completed waves are grandfathered.
- Assign owned EV skill icons to 12 hotbar slots by drag-and-drop; use keyboard 1–0, minus and equals to manually cast during combat. Right-click slots to clear.
- Shared cooldown countdown appears on hotbar icons and over placed skill towers.
- EV Tower Range Lab remains experimental.

## Companion 182 — Drill Charge knockback visibility
- Experimental EV Tower Range Lab: doubled Drill Charge path knockback from 3m to 6m for stronger crowd control and clearer battlefield impact.
- Added a short cyan knockback trail showing enemy displacement; enemy positions continue to follow their own route, including split branches.
- This 6m push is an arcade balance adjustment, not a claim about Mabinogi’s measured 3m push.
- Other skill ranges, road geometry, and saved progress unchanged.

## Companion 181 — Full Battlefield & Procedural Route Variety
- EV game board now occupies the full available browser width and viewport height; shop, inventory, and Base Manager overlay the battlefield only when open.
- Random map generator now selects between five seeded route families: jagged meanders, flowing S-curves, stepped corridors, irregular switchbacks, and weaving bends. Every path connects the left entry to the right base.
- Skill ranges and campaign saves remain in their existing logical-meter coordinate system; the larger display is a viewport change.
- Experimental EV Tower Range Lab.

## Companion 180 — EV launch initialization fix
- Corrected the startup order of battlefield dimension and road-width constants so the EV Tower Range Lab loads when selected under Explosive Vanguard.
- Confirmed that the original 179 script fails at load with a ReferenceError and the patched script registers the game view and generates its UI.
- No changes to save keys, combat ranges, tower placement rules, or other modules. Experimental EV feature.

## Companion 179 — Accurate roadside tower footprints
- EV Tower Range Lab: removed arbitrary roadside exclusion; placement uses the drawn 1m road (0.5m half-width) plus the visible 1m-radius tower footprint, without changing skill ranges.
- Updated collision with nearby towers and battlefield bounds to match tower footprints; zoom uses unchanged world-coordinate placement rules.
- Experimental / incomplete EV feature; existing saves preserved.

## Companion 178
- EV Tower Range Lab: road rendered at 1 meter width and reduced placement restriction beside route, while retaining world-meter combat ranges.
- EV battlefield: zoom 100–400% with +/- and Fit controls or mouse wheel anchored under cursor; tower drag/drop coordinates account for zoom.

## Companion 177 — EV battlefield-first interface (experimental / incomplete)
- Full-width battlefield-first design, in-board map arrows, clickable base manager, empty new-campaign circuit, shop/inventory side drawer with automatic combat pause.
- Road drawn at 1m wide in current 10px/m scale; continuous (non-snapped) placement off road. Existing tower placements remain preserved unless maps change.
- Three shop pages (Towers, Upgrades, Weapons), next-page spotlight after first placement until another page viewed; drag from shop to purchase/place or Buy to inventory, then drag from inventory to place.
- Preserved local campaign/save compatibility; existing established rotation links retained for existing players.

## Companion 176 — EV first-tower visual spotlight
- Replaced the first-purchase recommendation paragraph with a glowing Relentless Thrust shop card and prominent BUY NOW label only when no towers are placed; the spotlight returns if the last tower is sold.
- No battle mechanics, rotation tools or other modules changed. Experimental / incomplete feature.

## Companion 175 — EV first-tower recommendation
- Added a visible, non-blocking recommendation in the EV Tower Range Lab skill shop to begin with at least one Relentless Thrust tower, explaining its role in Mana Shell recovery.
- No combat mechanics or other minigames changed. Experimental / incomplete feature.

## Companion 174 — EV progressive skill and upgrade details
- EV Tower Range Lab only: initial hover shows basic descriptions after 1.2 seconds; extended descriptions with relevant numeric details appear after 8 seconds. Keyboard focus follows the same progression.
- Hid explicit skill distance/width values from the regular skill shop and removed the permanent attack-width help paragraph. Native title tooltips are suppressed inside the EV module to prevent early exposure.
- Rotation Crafter and Rotation Highlights are unchanged. Experimental / incomplete feature.

## Companion 173 — EV skill attack widths
- EV Tower Range Lab only: Relentless Thrust 0.5m double-jab width and 1m single-follow-up width; Lance Charge 1m, Arc Impact 2m, Blaze of Glory 4m, Dreadnought Burst 3m, Drill Charge 4m. Arcana Link VIII Arc Impact width increase continues to apply.
- Relentless Thrust target lock now resolves hits along the locked line using the correct variant width rather than hitting every enemy in its circular acquisition radius. Drill Charge also uses a 4m-wide locked collision corridor.
- Rotation Crafter and Rotation Highlights remain unchanged. Skill widths remain player estimates; EV Tower Range Lab is experimental and incomplete.

## Companion 172 — EV linked circuit, player-tested ranges, meter-scaled maps
- Home Base circuit uses reorderable/repeatable skill-manager links, auto advance every 1s, optional auto mode and manual Cast buttons. Shared cooldowns/resources remain one transaction across synchronized same-skill towers.
- Range scale changed to 10 board pixels per meter; all existing maps have a minimum path length above 50 meters, longer switchback/spiral layouts exceed 100 meters.
- Player-measured EV skill targeting: 4m omnidirectional Relentless Thrust, 14m Lance Charge farthest-target projectile with distance ramp and 0.25m splash, 5m Arc Impact capped at three line targets, 6m Blast Zone radius, 6m Blaze of Glory line, 5m target-lock Dreadnought Burst with 3m penetration, 3m nearest-target Drill Charge with route knockback. Exact widths and damage scaling remain experimental.
- Relentless Thrust double-jab movement reset and single follow-up; provisional cooldown accumulation after third consecutive use: 2s, 1s at Link X. Drill Charge 1s minimum interval and five-cast heat threshold with 9s lockout; heat cools after idle seconds.
- Retains manual Recharge Shells, A/D loot patrol, existing maps, economy, and saved layouts. Experimental / incomplete feature.

## Companion 171
- Added six map choices (original plus five new): winding slalom, straight line, split-and-rejoin, triple spiral around central base, and randomized switchbacks.
- Split-route enemies follow alternating branches; towers, collision rules, patrol collection and enemy movement use the selected route geometry.
- Map switching between waves refunds placed towers and collects unclaimed loot while retaining overall progression; random map can be rerolled.
- Experimental geometry and balance remain unverified in-game.

## Companion 170
- EV path patrol: A/D or Home Base buttons cycle forward/back over enemy-path stops, including empty tiles.
- Enemy gold/material rewards spawn as path loot and are collected by patrol cursor; wave-clear rewards remain automatic.
- Path movement resets Relentless Thrust to its initial double jab. Unreset follow-up is a stronger single strike with a provisional 5-second cooldown.
- New patrol cursor, loot markers, status; preserve previous campaign save fields.

## Companion 169
- Relentless Thrust jabs now split their existing combined damage 40% / 60% to reflect the 1000% and 1500% attack coefficients; total output and per-jab shell restoration are unchanged.

## Companion 168
- Relentless Thrust now costs 5 Mana Shells per activation, before the existing Arcana Link consumption reduction.
- It resolves as two quick jabs; all synchronized towers can hit all enemies in their respective areas on each jab.
- Restored 15 Mana Shells once per successful jab, never per target or tower, capped by the shared reserve capacity; two hits result in a net +25 shells before capacity/Link adjustments.
- Split the existing Relentless Thrust damage across its two jabs to avoid accidentally doubling total damage. If the first jab defeats every enemy, the second jab cannot restore shells.

## Companion 167
- Added Home Base rotation managers with player-controlled order; all towers of one skill activate simultaneously on one shared cooldown and resource transaction.
- Added shared Mana Shell reserve and manual Recharge Shells action that refills the full reserve.
- Added Mana Pressure generation and patch-confirmed Heavy Stander auto-defense bypass above 50% for eligible EV skills.
- Added provisional enemy Heavy Stander reduction and provisional undocumented skill shell/pressure values; no stamina modeling.
- Preserved tower shop, economy, weapons, material inventory, positioning and save migration.

## Companion 166
- EV Tower Range Lab: Added cumulative Arcana Link I–X upgrades using total bonuses at each rank, rather than stacking repeated stat gains.
- Applied global weapon maximum damage and primary-target damage effects, with adjustments to relevant skill cooldowns, ranges and Blaze of Glory damage.
- Added Lance Spirit exclusive minimum Lance Charge range removal, plus clearer upgrade hover descriptions.
- Renamed Arcana Link 9+ to Arcana Link Increase and Horseback Range training to Lance Charge reach training.
- Arcana Link resource-related modifiers are described but not simulated; the EV Tower Range Lab remains experimental and incomplete.

## Companion 165
- EV Tower Range Lab (experimental, incomplete): rebalanced enemy gold and added a reward for clearing a wave, creating more room for tower and weapon upgrades.
- Crafting material drops now follow the next weapon tier instead of requiring specific absolute waves, so newly reached tiers can work toward their next lance immediately.
- Kept internal material probabilities and reward formulas hidden from the game UI; preserved existing saves and combat progression.

## Companion 164
- EV Tower Range Lab (experimental, incomplete): enemy health, speed and group size now respond to the equipped lance tier and waves survived since acquiring it rather than fixed absolute-wave health thresholds.
- New lances grant a strong immediate power advantage; subsequent waves progressively challenge that tier and encourage weapon advancement.
- Forging a lance restarts its difficulty ramp on the next wave; existing campaigns migrate safely without resetting gold, materials, towers or progress.
- Kept underlying tuning values out of player-facing text.

## Companion 163
- Factored maximum Masterwork Grade Bonus into all EV Tower Range Lab weapon tier damage multipliers (Celtic +28%, Perseus +56%, Nightbringer +84%, Soul Liberator +112%); Beginner remains ungraded.
- Updated equipped-weapon details; preserved weapon upgrades, materials, tickets, towers, and saves.

## Companion 162
- EV Tower Range Lab (experimental, incomplete): enemies may drop wave-appropriate lance crafting materials alongside gold.
- Collected materials reduce their associated weapon purchase cost and are consumed when credited; surplus materials may be sold for gold.
- Added weapon-specific enhancement purchases based on the supplied wiki upgrade paths; these affect global tower damage in the experimental model.
- Preserved existing tower economy, tickets, placements, and saved progression.

## Companion 161
- EV Tower Range Lab (experimental): towers may be sold for their original purchase currency and full purchase price; legacy towers refund their listed gold price.
- EV Tower Range Lab: new campaigns include three tower tickets. Players choose Gold or Ticket before placement; selling a ticket tower returns one ticket.
- EV Tower Range Lab: added global lance weapon progression from Beginner Lion Claw to Celtic Clashing, Perseus Tempestuous, Nightbringer Spearhead and Soul Liberator. Prototype damage scaling is derived from the supplied weapons’ base damage and Piercing levels; all placed towers benefit.
- Tower tickets, original purchase costs, and equipped weapon tier persist in the existing save. The tower-defense lab remains experimental and incomplete; weapon scaling is not an in-game damage formula.

## Companion 160
- Reduced EV Tower Range Lab enemy health in the opening waves: wave 1 starts at 24 HP rather than 130 HP.
- Later waves increase enemy HP progressively; tower damage, prices, movement controls, and saved campaign state are unchanged.
- Tower Range Lab remains experimental and incomplete; balance and range values require playtesting.

## Companion 159
- EV Tower Range Lab (experimental): added Midir skill icons to the tower shop and placed towers.
- Added drag-to-move repositioning and explicit rotate-left/right controls, plus Q/E and right-click rotation.
- Tower directions and positions persist in saved campaigns; directional hitboxes follow rotation.
- EV Tower Range Lab remains an incomplete prototype with unverified game geometry.

## Companion 158
- Restored the Erg Break Simulator’s visible current success rate, including the active assist-potion modifier; the in-game Erg interface also displays this rate.
- Kept all hidden probabilities and reward rules concealed elsewhere. No simulator mechanics changed.

## Companion 157
- Removed exact Bandit Hunt average payout, Lucky Finish probability and multiplier from player-facing instructions.
- Replaced the Erg Simulator’s exact success-rate display with qualitative guidance without changing the underlying roll logic.
- Audited game and simulator pages for visible hidden odds; preserved actionable cooldowns, item prices, configuration inputs and actual outcomes.
- Policy for future updates: do not disclose internal probability tables or secret reward formulas in player-facing text unless explicitly requested.

## Companion 156
- Condensed Bandit Hunt instructions into a compact five-action control legend and one brief gameplay tip.
- Removed redundant introductory paragraphs and shortened the pre-game overlay instructions.
- Reduced vertical spacing in the Bandit Hunt overview without changing gameplay or rewards.

## Companion 155
- Simplified changelog formatting into version headings and bullet points, retaining historical release details.
- Marked EV Tower Range Lab explicitly as **experimental and incomplete** in its original release entry and navigation notes.

## Companion 154
- Second language coverage pass for Korean and Spanish across Rotation Highlights, Rotation Crafter, Oath Workshop, Debuff Academy, Vault, AS/AG Target Frames, Bandit Hunt, Pig Pursuit, and EV Tower Range Lab.
- Preserves imported source data, player-provided names, game skill names, and existing language persistence.

## Companion 153
- Added the **experimental EV Tower Range Lab** to the sidebar; Rotation Highlights remains exclusive to its matching Arcana landing page.
- Expanded English/Korean/Spanish dictionary coverage for newer menu routes, training modes, rewards, HUD labels, and Rotation Highlights.
- Preserved all existing navigation and language persistence.

## Companion 152
- AS Positioning Lab and AG Field & Firing Lane Lab now offer Target Frames challenge alongside the preserved Free Mode.
- Ten randomized frames, three shots per frame; persistent target elimination within frames and a perfect-clear bonus eleventh frame.
- Enemy dragging disabled only in challenge mode. Player movement, attack setup, AG fields and positioning remain interactive.
- Prototype skill ranges and patterns are illustrative, not exact Mabinogi geometry.

## Companion 151
- Pig Pursuit adds Normal/Hard modes, arrow-based rider balance guidance, glowing shield/heart/loot pickups, and faster speed progression.
- Timer, health, score, best time, and rider balance are overlaid inside the playfield.
- Hard Mode adds a navigable corridor maze, larger obstacles, more pickups, faster initial speed, higher scores, and two-axis balance.
- Loot bags credit the shared Herb Collection chest and Reforge Simulator ducat balance.

## Companion 150
- Debuff Field Guide entries now stack vertically within their coverage group cards, including narrow browser layouts; cards stay inside the viewport.
- Added the bundled Aspect of Reversal condition 515 icon to the Debuff Academy and Field Guide.
- Second-pass Build the Debuff Opening lesson copy now explicitly distinguishes the nine coverage slots, combined pet alternatives, Kart Bomb, Fateweaver Reversal, and Death Mark within damage amplification.
- Reused existing Midir skill/status imagery in lesson displays; retained no invented pet icons.

## Companion 149
- Debuff Academy New Debuff, Who This? now uses the nine genuine coverage categories. Death Mark is a source of Increased Damage Taken, not an additional requirement.
- Bone Dragon Devil’s Dash and Purrling Furious Charge are interchangeable options for one pet-defense category. Other pet equivalents remain grouped.
- Present-status scenarios display one representative icon for alternative pet effects, avoiding the impression that both must be present. The Brionac/Fragarach paired max-Protection condition still requires both icons.

## Companion 148
- Blazing Brawler Bandit Hunt: responsive nine-by-nine board tiles sized to browser width and viewport height; hidden and revealed tiles remain identical.
- Successes now accelerate timer reduction toward the unchanged 0.7-second floor.
- Up to five concentric reward rings appear around the active card, with increasing ducat bonus and nearby sweep capacity as the streak builds.

## Companion 147
- Rotation Highlights timelines now show skill icons in both the single-stream and skill-track views.
- Added abbreviated skill labels as the fallback when a matching icon is unavailable.
- Added skill icons to track headers when available and adjusted timeline tile sizing for readability.

## Companion 146
- Matching character + Arcana imported records unlock a live normalized boss-damage estimate inside Rotation Crafter.
- Uses Rotation Highlights shared non-critical per-skill damage baseline; inferred crit-only values retain their labels.
- One conservative boss-equivalent strike per accepted action: not yet a verified damage-per-cast model. Unknown/ambiguous skills remain unscored.
- Shows action totals during practice and retains a summary after Finish; optional per-skill breakdown.
- Existing Crafter mechanics, rotations and imported records are unchanged.

## Companion 145
- Added ordered horizontal Skill Use event stream and switchable, time-aligned skill tracks to both peak-window cards.
- Sparse skills (one or two appearances) share a compact Other skills track; frequent skills have dedicated rows.
- Preserved critical hit markings, no-damage-use evidence, and damage-over-time aggregation; raw event lists remain expandable.
- No changes to normalized scoring, boss filtering, or existing Arcana training tools.

## Companion 144
- Prevented Emergency checklist from mixing legacy/full snapshot step IDs with its editable sequence; each selected Emergency cast appears once.
- **Experimental / incomplete:** Introduced the EV Tower Range Lab prototype with purchasable skill towers, illustrative hitboxes/ranges, waves, local saves, and hat/spirit/link upgrades. This is **not a finished feature**; attack geometry, most cooldowns, balance, and gameplay remain under development and require in-game verification.
- Rotation Highlights now excludes Redoubled Offensive, Flare and Blast when identified by skill name; applies the supplied per-use strike budgets, BB unrestricted rule, AG bonus Detonation Field strike allowance, and cooldown-reset exceptions. Precise boss-hit scoring caps inferred activations by latest observed matching skill use or second when not available. Unknown cast boundaries remain inferred.
- Live Wire, Pulse of Purification and Pledge of Penance now combine individual DOT hits into one displayed timeline event per skill per winning window while preserving summed normalized contribution; carry-in DOT is shown at the window start.
- Older scatter-only reports remain approximate and are not asserted to contain target identities.

## Companion 143
- Modern precise-hit stream presence is authoritative even when zero boss hits are found; no silent fallback to unrelated one-second AoE damage.
- When Gate 2 precise boss evidence is available, compare only those attempts; otherwise prefer available precise evidence to legacy estimates.
- Rotation Highlights shows observed Skill Use packets as a separate action timeline, including observed uses without matching positive boss hits. A 30-second preceding-use association is heuristic, not proof of casts.
- Preserved Blazing Brawler critical-hit visualization and allow Rend Armor parry resets. Skill-use packets are not counted as one-to-one casts in cooldown rejection.
- Require Vault selected character and recorded Arcana. Original app routes retained.
- Source schema is based on Midir 45 handoff; live recorded export testing still needed.

## Companion 142
- Read top-level canonical `encounters`, observed `skillUseEvents`, millisecond `damageHitEvents` with target identity, and observed `reviveEvents` / player `reviveTimes`, while preserving the embedded Companion v1 fallback.
- Rotation Highlights preferentially filters precise hits to the boss entity IDs within each canonical attempt; the shared non-critical reference uses those observed boss hits. Gate 2 remains preferred when precise evidence exists. Precise source-hit counts no longer require the old multi-target scatter cap.
- Achievement/debuff analysis uses canonical attempt completion evidence and prefers observed Skill Use for ambiguous debuff attribution, falling back to nearby hit evidence only when the observed-use stream is entirely unavailable. Retain previous death-based award criteria pending validation of full revival-aware survival requirements; revival evidence is stored rather than falsely assuming alive/dead intervals.
- Preserved all pre-existing pages, achievements, stored profiles and raw report viewer. These source fields require validation against a compiled actual Midir 45 export.

## Companion 141
- Conditional Arcana Simulators page for the Vault selected character and matching Arcana.
- Shared non-critical hit averages pooled across eligible Gate 2 runs; critical-only fallback from nearest critical-damage skill.
- Gate 2 boss intervals preferred, then Gate 1 or Gate 3 HP windows. Top 10s and 60s scored windows and per-second hit replay ledger.
- Blazing Brawler counts all registered hits and displays critical observations; no cooldown rejection. Others use conservative single-target caps and verified per-skill occurrence checks only. Rend Armor is exempt from cooldown rejection due to parry-refresh mechanics; do not infer universal cooldowns.
- Limitation: exported per-second events lack hit target and cast identity, so boss HP windows do not guarantee boss-only hits.

## Companion 140
- Lucky Clover (Bunbun, condition 1138) and Foxyquinn’s Mark (condition 716) now form one tracked status category. Neither grants an extra debuff/achievement credit when both are present.
- The New Debuff, Who This? exercise now generates one pet-mark missing group with two valid answers: Bunbun or Foxyquinn. Previously it incorrectly generated two independent missing groups.
- Updated Debuff Field Guide, status cards, pet-source descriptions, coverage and achievement calculations. Raw condition IDs remain unchanged for evidence traceability.
- Kept independent visual cards for both icons as they are distinct artwork despite their equivalent tracking role.

## Companion 139
- Treated Ceraunus Lightning Wave (condition 504) and Mir Dragon Lightning Breath (condition 392) as interchangeable evidence of the same Lightning Debuff, with the same original icon.
- Updated imported-condition analysis, pet coverage, time-overlap achievements (To the Nines and Perfectly Dressed), the Debuff Academy, and displayed condition labels. The shared slot is never double-counted.
- Preserved the two-condition requirement for Brionac/Fragarach Protection Max and Magic Protection Max peel. Existing exports remain compatible.

## Companion 137
- Editable Emergency snapshot cast sequence with insert, remove, reorder, reset and local persistence; drives live snapshot simulation and checklist.
- Full-width, single-column Checklist with prominent leading sequence numbers and responsive icon suppression.

## Companion 136
- Create Your Snapshot applies frozen Fateweaver (12% defense stats), Virtuous Oath (15% HP, 10% defense stats, per-cast caps), and Golden Magic Wool (20% defense stats) to current gauges.
- Corrected HP handling: Fateweaver and Wool never add Max HP. Recasting replaces only its own bonus, retaining other skills' historical frozen values. Undo reconstructs previous states and Reset clears active snapshots.
- Oath bonus gauges and active prepared-plus-snapshot stats stay distinct; this remains a model for gameplay planning rather than verified in-game rounding/duration behavior.

## Companion 135
- Rename Sacred Guardian snapshot rehearsal to Create Your Snapshot.
- Connect ordered Fateweaver, Oath, and Wool captures to frozen numerical snapshot values and live Oath cap gauges. Undo and reset rebuild or clear the sequence; document approximate rules.

## Companion 134
- Reuse Midir Catering and Paladin transformation skill icons on Sacred Guardian buffs.
- Put Edit Player Stats next to Oath thresholds and Rate Isn't a Lie music import next to Ally Music.
- Imported the saved Inspiring Enduring Melody Defense and Protection calculations from Rate Isn't a Lie, with a reversible source toggle.
- Condensed snapshot actions into a unified skill-style panel with minimal controls.

## Companion 133
- Condensed Sacred Guardian available bonuses with skill icons and per-buff stat editing.
- Music sliders now use compact visual stat meters and support wheel/arrow adjustments.
- Snapshot rehearsal uses compact skill-icon controls and removes redundant buff selections.
- Suggested rotation moved to the Checklist drawer.

## Companion 132
- Added a one-time, dismissible stat-entry sequence, animated threshold gauges, and saved shared character values across Oath Max, Emergency Oath, and Checklist.
- Replaced the dense starting-stat table with visual Oath bonus meters and added per-buff guidance for capped/noncontributing defense stats.
- Kept buff selection available even when its modeled Oath contribution is zero and documented assumptions in developer notes.

## Companion 131
- Corrected the *bonus caps* shown and used by the Sacred Guardian Oath threshold planner to +150 Defense/Magic Defense and +15 Protection/Magic Protection. The formula still adds 10% of prepared defensive stats, so the corresponding input thresholds remain 1,500 and 150. HP remains +15% capped at +3,000 (20,000 HP threshold).
- Updated the internal Oath developer notes to distinguish pre-Oath stat thresholds from the resulting capped bonuses.

## Companion 130
- Reinstated three Sacred Guardian pages: Oath Max, Emergency Oath, Checklist.
- Checklist independently toggles full/emergency views and follows preparation selections from those pages, with draggable per-mode orders.
- Uses existing Midir skill icons; removes named doll bag assumptions and generated substitutes for skills.

## Companion 129
- Replaced the Wool Readiness mode with a compact Sacred Guardian Oath visual checklist. Switch between full and emergency prep, drag steps to reorder, mark completed steps, and add/remove options from the existing buff catalog.
- Existing skill/consumable icons are reused; compact fantasy reminder art fills gaps. Independent per-mode checklist order/checks are saved locally; snapshot rehearsal logic is unchanged.

## Companion 128
- Simplified SG Oath planner to BFO and Enduring Protection reforge sliders; calibrates estimated Enduring Melody from the ally’s displayed BFO.
- Divine Link now accepts observed flat stat increases rather than requiring percentages.
- Added practical, editable scenario-based preparation recommendations emphasizing persistent Doll Bags, optional ally music, and avoiding pet swaps/catering during emergency recovery.
- Moved detailed equipment, timing, modeling assumptions to SG-OATH-DEVELOPER-NOTES.md.

## Companion 127
- Model Protection reforge levels 0–3 on boots without changing Inspiring Effect.
- For levels 4–9, add one or two Protection-reforged accessories, each granting up to 3 levels while replacing 3 Inspiring Effect from the corresponding BFO accessory.
- Preserved 16 Inspiring Effect for BFO, use the highest possible remaining Inspiring Effect for the selected Enduring protection total, and display the optimal boots/accessory split in the 0–9 comparison.
- Kept all three target Bri music-build profiles, Oath preparation and saved user data otherwise unchanged.

## Companion 126
- Bri BFO profiles use 16 Inspiring Effect (instrument plus two accessories) and adjusted Music Buff Effect to target 65%, 69% and 75% BFO.
- Enduring Melody profiles replace both accessories with Protection reforges, reducing Inspiring Effect by 6 to 10. This affects every 0–9 Protection reforge comparison and the editable preview.
- Only Inspiring/Haunting performance scenarios are compared; other music grades are excluded from this Oath planner.
- No changes to saved player data, equipment inventory, or combat mechanics.

## Companion 125
- Cloud/Nimbus is a fixed Defense/Protection summon bonus, not an editable per-pet stat; still summon before Divine Link.
- Divine Link uses editable percentage increases recalculated from currently prepared character stats. G2 transformation remains a configurable flat bonus based on race and skill rank.
- Reworked Enduring Melody estimates for Bri: Inspiring-performance build profiles targeting about 65–75% Battlefield Overture, with Music Buff Effect and Inspiring effect inputs and a 0–9 Protection reforge comparison.
- Corrected Enduring Melody Defense versus Protection baseline values. No changes to achievement rules, snapshot sequence, or other simulators.

## Companion 124
- Added a pre-Oath defensive stat planner to the Oath Workshop with editable HP, Defense, Protection, Magic Defense, and Magic Protection values, cap headroom and preparation-buff switches.
- Added Shield of Trust with Magic Dampening, Lovable Yip, Cloud, Divine Link, Catering, Doll Bags, G2 transformation and both additive Orbital Pulse aspects. Situational video bonuses are editable examples, not universal stat guarantees.
- Added Enduring Melody Protection reforge scenario comparison from 0 through 9, music performance grades and an adjustable music-build strength estimate that incorporates existing Music Lab buff modifiers.
- Provided specific preparation guidance for full setup, emergency recovery and Wool readiness; the snapshot lineage rehearsal is unchanged, and undocumented recursive stat mathematics is not represented as exact.
- Retained earlier Explosive Vanguard content for expert player review. No saved-state schemas, reward mechanics or cooldowns changed.

## Companion 123
- EV Rotation Crafter now models maximum Lance Spirit Amplitude and Link 9+ by default, with a 5/5 Lance Charge cooldown reforge and selectable 0–7/5 values (6/5 and 7/5 identified as rare limit breaks).
- Lance Charge and Dreadnought Burst cooldowns update together from the chosen reforge. Dreadnought uses a conservative **6-second simulator floor**; this minimum is not explicitly confirmed in the supplied game sources.
- Settings persist per Arcana, and custom cooldown entries for skills remain supported. Existing inventory, reforge probability, and saved progress are unchanged.

## Companion 122
- Rewrote the Explosive Vanguard Arcana Simulators skill guide around max-ranked Lance/Arcana interactions and practical rotation choices instead of numerical damage tooltips.
- Added Lance Charge, Lance Leap, and Lance Impact to the EV landing reference and Rotation Crafter, including range management, mounted-charge bonus setup, and movement chains.
- Documented Mana Shell sustainability, Relentless Thrust's charge bonus, inherited Flash Launcher/Grapple Shot damage enhancements, Dreadnought Burst's Lance Charge dependencies, and existing Lance Charge reforge categories.
- Corrected clearly sourced EV baseline cooldowns for Lance Charge, Arc Impact, Blast Zone and the Link-adjusted Dreadnought Burst. The simulator still abstracts accumulated cooldown behavior, and rare limit-break reforge outcomes are not assumed.
- No changes to reforge odds, inventory, persistent storage keys, achievements, or unrelated Arcana.

## Companion 121
- Compared all seven supplied in-game skill information screenshots against Rotation Crafter base defaults for Harmonic Saint, Blazing Brawler, Melodic Puppeteer, Forbidden Alchemist, Arsenal Gunner, Sacred Guardian, and Elemental Knight.
- Updated 34 clearly labeled cooldown defaults, preserving skill-specific rules and optional Link/equipment modifiers. Cutting Chorus remains 4s base / 2s with Link X; Flashing Steel remains 7s.
- Left cooldowns absent from the screenshots unchanged; this is a screenshot-grounded correction, not a claim that all remaining skills have been independently verified.
- Existing player-customized cooldowns remain stored in the same save key and are not reset by updating the app.

## Companion 120
- Compared every Arcana's Rotation Crafter default cooldown list against the project handoff and later confirmed Cutting Chorus skill tooltip.
- Corrected **Elemental Knight · Flashing Steel** from 20s to its documented natural **7s** cooldown; Bash-stack bypass remains a separate mechanic.
- Corrected **Melodic Puppeteer · Cutting Chorus** from 8s to its confirmed **4s** base cooldown; optional Link X still subtracts 2s, yielding **2s** while enabled.
- Preserved existing user-customized skill cooldowns and all other baseline values; the handoff does not specify sufficient numerical values to certify most other skill cooldowns. Arsenal Gunner's charged Bullet Barrage retains its documented dynamic 1–9s timing.
- No changes to saved profiles, other simulation rules or achievement criteria.

## Companion 119
- Place white and Cutting Chorus circles in chronological hit-time order, maintaining a continuous mouse-following path rather than jumping to unrelated positions.
- Limit the distance between consecutive circles by their time separation; short gaps place notes close together and longer gaps permit wider movement across the field.
- Gently curve and reflect the path near playfield edges so notes continue naturally from their previous location.
- Preserved white-note rhythm, Link X Cutting Chorus intervals, input bindings, Hard Mode, scoring, and saved settings.

## Companion 118
- Load the previously omitted rhythm module, fixing the Melodic Puppeteer activity shortcut.
- Kept Begin, instructions, End Practice, results and replay controls inside the rhythm playfield.
- Retained default Link X bonus and the verified 2-second ON / 4-second OFF Cutting Chorus intervals.

## Companion 117
- Added a mouse-and-key rhythm activity with white ordinary-skill notes and black Cutting Chorus notes, approach-ring timing, scoring, and an optional no-ABA-repeat hard mode.
- Added customizable Cutting Chorus input and an independently saved Link X cooldown toggle, enabled by default.
- Corrected the Cutting Chorus interval using the in-game Rank 1 skill tooltip: **4 seconds normally; 2 seconds with Link X** (−2 seconds). This correction is included in the existing Companion 117 release number.
- Preserved saved simulator progress and included the rhythm settings in profile backups.

## Companion 116
- Reorganized the Field Guide around the nine distinct Full Party Coverage achievement groups, including the paired protection-peeling statuses and interchangeable pet effects.
- Displayed existing condition icons prominently; grouped secondary skill sources and interactions under an expandable section with available skill icons.
- Removed developer-facing “Midir condition” wording from the guide and source notes, preserving important distinctions between shared debuffs, unique effects and skill sources.
- Kept the existing achievement definitions, missing-debuff exercise rules, saved progress and other simulators unchanged.

## Companion 115
- Require confirmation of a Limit Break before the next reforge roll.
- Replaced numerical reforge odds in the UI with a simple statement that Dazzling is better.
- Tighten reforge line/value spacing and consolidate gold, ducats, items and resources into a slotted Storage Chest interface.
- Added two-way Erg weapon transfers, preserving Erg progress, and prevent Erg weapons from being listed for sale.
- Kept Erg Unlock Assist Potion purchasing on Erg Break, using the supplied potion icon; remove the duplicate Reforge shop purchase.
- Preserved existing storage keys; add Erg weapon progress to optional full-backup training extras, while keeping older backups compatible.

## Companion 114
- Doubled Detonation Field radius from 47 to 94 diagram units.
- Click-release on open space places a field; drag the blue player and red enemies at any time. Removed the tool/move-mode selector and redundant enemy-position controls.
- Limited fields to five, discarding the oldest when a sixth is placed.
- When a selected line or Heavy Artillery attack intersects a field, all enemies in that field and touching connected fields are hit.
- Added simultaneous line and Heavy Artillery commitment with one combined unique-target result. Both attacks can be enabled independently.
- Preserved previous simulator records and other app functionality.

## Companion 113
- Moved Pig Pursuit Begin Ride to its playfield, with click / Escape / pointer-exit pause and in-window Continue. Results require confirmation before returning to instructions and Begin Ride.
- Moved Bandit Hunt Begin Hunt and End Hunt controls inside the playfield; removed the separate toolbar controls.
- Added brief training-purpose notes to Pig Pursuit (Flashing Steel mouse awareness) and Bandit Hunt (quick reactions to changing cooldowns) in game instructions and Arcana shortcut descriptions.
- Preserved existing saved records, encounter mechanics, and ducat rewards.

## Companion 112
- Renamed the **Rotation Lab** top tab, page titles, return buttons, and related navigation to **Arcana Simulators**.
- Restored **Reforge Simulator** as the Explosive Vanguard tool shortcut and page title.
- Updated the README and Korean/Spanish navigation translations. No simulation or saved-data changes.

## Companion 111
- Added direct Overview sidebar navigation to games, simulators, Rotation Crafter, and Debuff Academy above recent training.
- Made Encounter-Specific Records and Earned Milestones collapsible in the Vault.
- Renamed the Rotation Crafter editor bar to **Edit Skills & Presets** and increased its contrast.
- Renamed the Explosive Vanguard Reforge Simulator shortcut and title to **Arcana Simulators** (reversed in Companion 112).
- Updated AS Positioning with an instructions start screen, draggable player and enemies without modes, a visible rotation handle, and Left/Right arrow rotation.

## Companion 110
- Fixed Pig Pursuit Start Ride failing because obstacle generation called an undefined random helper.
- Set all Bandit Hunt board slots and tiles to exactly 125 × 125 px, preserving consistent dimensions and horizontal scrolling.
- No intentional changes to controls, progression, economy, saves, or achievements.

## Companion 109
- Rebuilt Pig Pursuit as a free-roaming, top-down 2D obstacle course. The camera stays centered on the pig as it chases the mouse-controlled carrot in any direction.
- Arrow keys or WASD adjust rider balance only; steering and obstacle avoidance use the mouse.
- Pig movement accelerates to a capped speed, after which obstacles spawn with progressively smaller spacing.
- Added world-space obstacles, collisions, rider balance, and new top-down field graphics; preserved Pig Pursuit records and save compatibility.

## Companion 108
- Increased every Bandit Hunt card and grid slot to a fixed **200 × 200 px**. All states remain uniform.
- Enlarged artwork inside the cards while retaining horizontal scrolling on smaller screens. No gameplay, economy, or save changes.

## Companion 107
- Standardized all Bandit Hunt card slots to identical fixed width and height, whether hidden, active, revealed, or showing artwork.
- Contained portraits and long card names within their slots; narrower screens scroll horizontally without resizing individual cards.
- No changes to encounters, rewards, game logic, save formats, or other modules.

## Companion 106
- Added “AI was used in making this app.” at the top of README and in the app header below the version number and above the language selector.
- No application logic, save format, or achievements changed.

## Companion 105
- Rewrote README as a short project overview, feature list, basic usage guide, and limitations.
- Moved early-release notes out of README and consolidated the changelog into chronological release entries.
- Removed duplicate feature inventories and historical trace tables without changing application behavior or save formats.

## Companion 104
- Added Wisp, Red/Brown/White/Young Gray Fox, and Green/White/Gold/Black Kiwi as illustrated **Wait** encounters.
- Wildlife art appears on flipped tiles and in the active reaction panel; all assets work offline.

## Companion 103
- Added seven named outlaws with paired attack (**Counter Punch**) and escape (**Charging Strike**) poses.
- Added five Golem reference portraits with raised-arm **Tumble** cues; avoided player-control swirl imagery.

## Companion 102
- Separated attacking bandits (**1 · Counter Punch**) from neutral, looting, or fleeing bandits (**2 · Charging Strike**); assigned Golems **3 · Tumble** and wildlife **Wait**.
- Expanded encounter variants and fighter skill icons; successful reads shorten nearby timers to a 0.7-second minimum.
- Added Erg Unlock Assist Potion quantity to Storage Chest; preserved existing purchases and consumption.

## Companion 101
- Added endless Blazing Brawler card-hunting practice, streak sweeps, nearby treasure theft on wrong reactions, and saved records.
- Added 5–8 ducats per base tile and 20× Lucky Finish payouts at 1/300 odds, credited to Storage Chest.
- Added Dazzling Reforge Tools for 1,000,000 ducats each: one consumed per roll, 1/100 limit-break chance; standard rolls remain 1/1000.
- Expanded full-profile backups to include Bandit Hunt and Reforge Simulator storage.

## Companion 100
- Added Elemental Knight Pig Pursuit: mouse-led pig control, steering/balance pressure, hazards, survival records.
- Added Forbidden Alchemist's optional timed Precision Harvest: disappearing/shrinking/moving herbs, accuracy and speed records. Kept untimed gathering and chest quantities.
- Included new training records in full-profile backups with older-backup compatibility.
- Verified targeted Chromium interactions; normal local-file browser regression still pending.

## Companion 99
- Placed Counter Punch and Tumble together in the Rotation Lab reference as animation cancels after second-stage combo attacks. Counter Punch is the stationary, quickly canceled option; Tumble adds movement.
- Added Counter Punch to the Rotation Crafter skill choices with its existing Fighter icon.
- Critical hits from Ignite or Combo attacks now immediately refresh Tumble in the Crafter, independent of the optional Link 5 Ignite cooldown reduction and the equipment-driven Fighter resets.
- Refined Radiant Storm’s reference as Blazing Brawler’s nuke: fire it when ready or hold it for an imminent burst window; retain its Absolute Fury interaction.

## Companion 98
- Reworked Fury Engine/Fire Within, Berserker’s Fury, Piercing Gale, Earthshaker, Radiant Storm, and Ignite combo card descriptions.
- Explain Absolute Fury’s 15% damage boost for 10 seconds on Fury spenders (does not stack with Rage Impact).
- Added optional Link 5+ critical-hit cooldown reduction to BB Rotation Crafter: each Ignite crit removes 20% of full configured cooldown from currently cooling Ignite and Combo skills, independent of equipment Fighter resets.

## Companion 97
- Reframed the landing page around three simultaneous puppets, Live Wire uptime, Downbeat Drop and Act 7 as core damage, and frequent Cutting Chorus weaving during puppet attacks.
- Added Act 4 and Act 6 as rotation fillers; refreshed Act 2, Act 7, Showstopper, Echo, and Tempo descriptions.
- Removed Pierrot Marionette, Colossus Marionette, and Marionette Summoning from the landing-page skill cards only. Simulator mechanics unchanged.

## Companion 96
- Removed the duplicate header Arcana dropdown. The Rotation Lab selector remains the single Arcana switcher; it updates saved selection and resets practice timers without affecting other modules.
- Added Arcana selection directly on the Rotation Lab landing page, synchronized with the existing header selector. Switching Arcana stops practice timers and returns to the selected Arcana’s skill reference.
- Rebuilt the Academy landing page with Rotation Lab-style activity tiles and an embedded Debuff Field Guide.
- Renamed the missing-effect exercise **New Debuff, Who This?** and simplified **Flash Cards**.
- Upgraded the guided debuff opening with visible lesson progress and direct step navigation.
- Simplified development-facing text, normalized Rotation Lab return buttons, and refreshed the header tagline to **“Make every encounter count.”**
- Removed numeric bracket IDs from displayed Reforge attribute names without changing roll weights or levels.
- Standardized the exact rate disclaimer across music, Erg, and Reforge simulators.

## Companion 95
- Rewrite FA Rotation Lab skill cards around pre-combat formulas, full four-element amplification, orb spending by Serpentcall and enemy-targeted Chemical Carnival, and Fangs/Water Cannon/Heat Buster rotation priorities.
- Group Elemental Wave beside Heat Buster; explain Shock as Brionac activation and Flame Burst as Serpentcall support.
- Removed Sand Burst and Life Drain from the Rotation Lab landing skill reference only; preserve simulator skill availability and combat behavior.

## Companion 94
- Rewrote AG Rotation Lab landing skill cards to explain verified energy generation, full-bullet consumption, Crest dual-gun generation, and Fatal Scope aim/re-aim.
- Clarified that Tracer Pod and Detonation Field halve full aim time without stacking, and that Heavy Artillery and Calamity Cannon generate rather than spend energy.
- Reference wording only; no simulator or Vault behavior changed.

## Companion 93
- Added Sole Survivor: verified Bri gate clear, selected player zero recorded deaths, every other party member at least one death in that gate.
- Added Last One Standing: selected player deathless, all other identified non-Harmonic Saint party members have two deaths in the gate (normal revival exhausted); a Harmonic Saint may survive.
- Added Against All Odds: verified Bri gate clear with at least two confirmed non-Harmonic Saint teammates recording two deaths each in that gate.
- Require complete timestamped party records; never treat negative HP or Deadly as a death. Missing Arcana information prevents permanent-down awards from being inferred.
- Kept achievement history in existing storage and preserve original interactive HTML viewer.

## Companion 92
- Added Perfectly Dressed: nine boss effects overlap continuously for six minutes on a verified clear.
- Added Clockwork: five distinct verified Bri Leith gate boss combats below half their gate mission allowances (20/20/30 minutes). Clearly label that measurement as observed boss combat, not complete mission duration.
- Added The Long Haul: verified Gate 1/2 boss fights at least 17 minutes; Gate 3 fights over 25 minutes. Threshold omitted from in-app description.
- Added Burst of Brilliance (10-second personal recorded hit group peak) and Never Off Duty (attributed debuff streak).
- Solo-survivor/only-deathless-party-member and finishing-strong boss-phase awards deferred: current exports do not prove continuous party alive state or boss-targeted final-phase hits.

## Companion 91
- Removed Reference Coverage Together from the active achievement catalog and new award generation. Full Party Coverage and To the Nines now cover meaningful observed and sustained boss debuff coverage.
- Existing historical award records remain untouched in saved profiles; the retired type no longer counts toward active catalog completion.

## Companion 90
- Full Party Coverage achievement detail now displays a nine-item bulleted debuff checklist; removed “required” from its description and associated messaging.
- Distinguished pet defense debuff groups: Bone Dragon/Purrling and Mir Dragon/Ceraunus; pet damage amplification uses Bunbun/Foxyquin. Each group occupies one of the existing nine independent slots.
- The same corrected grouping applies to To the Nines simultaneous coverage calculations. The seven-of-nine for 97% threshold is unchanged.

## Companion 89
- Structured imported reports are now stored individually in IndexedDB; localStorage keeps a lightweight index and achievement/profile data.
- Existing report data is migrated only after IndexedDB write and readback verification; localStorage is not rewritten when migration fails.
- On startup the existing achievement system hydrates its report evidence from IndexedDB; report cards are paginated 25 at a time.
- The Vault includes Storage Management immediately before Previously Imported Reports, with browser quota estimates and persistent storage requests.
- Full profile backup can include existing archived HTML reports and the original structured report data.
- Imports write structured data before committing the new profile index; removed reports clear their stored detail record.
- Archived interactive HTML viewer remains unchanged. Vault awards remain in localStorage.
- Known limitation: all reports still need to hydrate for existing achievement calculations; incremental achievement indexing is a future optimization.

## Companion 86
- Validated backup structure, size, and record counts before replacement; added confirmation preview and rollback on failed storage save.
- Added bounded Vault imports (40 MB per file, 250,000 NDJSON events, entity-count caps).
- Roll back unsaved imported records and awards rather than presenting transient progress as saved.
- Note: browser-stored structured records are not yet migrated to IndexedDB; full migration needs a dedicated tested release.

## Companion 85
- Prevented a repeated Midir session import from generating another set of achievements, even under a new file name; retains a warning and prevents duplicate storage.
- Included conditions that started before the boss-combat window but remained active inside it in debuff attribution/coverage observations. To the Nines already clipped intervals correctly.
- Archived HTML reports opened in a separate tab now run in a sandboxed iframe with an opaque origin (scripts permitted for legacy interactive plots, but no same-origin access to Companion data), consistent with the existing inline viewer. Note that untrusted scripts may still make network requests; do not import untrusted HTML.
- Remaining risks: local browser storage quotas, lack of cryptographic authenticity for offline imports, comprehensive malformed-file validation, and full browser regression tests.

## Companion 84
- Stronger Defense now also celebrates repeated verified zero-damage-taken clears, without fabricating zero damage when the metric is missing. Both the report and attempt award paths support this.
- Quick Setup now enforces its advertised first-ten-seconds window; late attributed debuffs no longer qualify.
- Reviewed zero-boundary and repeatability across Vault awards: Fewer Falls already covers repeated deathless clears; Reliable Finisher uses explicit streak thresholds; record achievements retain genuine improvement requirements; Full Party Coverage and To the Nines remain evidence-based.

## Companion 83
- Fewer Falls now counts improvements all the way to zero deaths rather than excluding zero.
- Successive verified zero-death clears also qualify as maintaining zero falls.
- Deathless Improvement remains a separate award for improving from deaths to a verified deathless clear.
- Requires recorded death counts; never infers zero when death data is missing.

## Companion 82
- Added To the Nines: >=97% of verified boss combat duration with seven or more of the nine Full Party Coverage effects simultaneously active.
- Uses recorded condition start/end timestamps across the encounter; pet alternatives share one slot and the Brionac/Fragarach pair requires both icons simultaneously.
- Shows exact qualified seconds and percentage per attempt. Missing/unfinished debuff timing disqualifies the attempt instead of inventing uptime.
- Retains Full Party Coverage as the separate once-observed achievement and requires verified clear for To the Nines.

## Companion 81
- Clarified Kart Bomb condition 598 as a distinct defense reduction, never shared damage amplification, throughout Debuff Academy and achievement references.
- Clarified Aspect of Reversal condition 515 as 100 HP healing to the attacker per hit on afflicted target; it proves Fateweaver presence but is neither amplification nor defense reduction. Listed all five Fateweaver aspects.
- Added both separate icon categories to the missing-debuff trainer; Full Party Coverage remains nine condition-based checks and does not require caster attribution.

## Companion 80
- Activated Full Party Coverage using observed boss condition icons, regardless of attacker/source; nine slots include Kart Bomb ID 598 and Aspect of Reversal ID 515.
- Added Personal Best Streak, Reliable Finisher, Skill Specialist, Debuff Regular, The Comeback and Speedrunner’s Journey milestones.
- Added Bronze/Silver/Gold track labeling, a per-attempt coverage checklist and evidence-aware achievement descriptions.
- Previously imported sessions are re-evaluated when the tracked character is confirmed; no implicit attribution or simultaneous-uptime claims.

## Companion 79
- Added First Boss Clear for the first verified clear of each recorded encounter.
- Added Versatile Support for two or more distinct attributable boss debuff categories in one attempt.
- Added Attempt Damage Breakthrough for a 20% or greater increase in timestamped personal damage across comparable attempt windows, clearly distinguished from boss-only DPS.
- Existing award rules, private Vault, imports, and collectible accounting preserved.
- All newly awarded achievements explicitly identify their available evidence; repeat imported sessions remain independently counted under existing Vault policy.

## Companion 78
- Confirmed Heavy Artillery and Calamity Cannon grant 100 Transmutation Energy each.
- Tracer Pod, Detonation Field, and Gunner’s Crest spend one full bullet; Crest runs for 240 seconds and grants 50 energy from Dual Gun skills.
- Fatal Scope initial shot grants 100 energy; fully aiming allows subsequent re-aim shots at a cost of one full bullet each.
- Normal aim takes two seconds; bonus aim rate from a relevant Tracer Pod or Detonation Field doubles speed to one second rather than allowing instant aim.
- Active setup is modeled on the practice target; Tracer Pod and field durations remain provisional where not yet provided.

## Companion 77
- AG energy bullet indicators are turquoise/light blue until 100 energy and turn gold only when full. Keep fractional fills, all existing resource costs, and Bullet Barrage charge timing unchanged.

## Companion 76
- Bullet Barrage is now held for 0.5–3 seconds, automatically firing at 3 seconds. Energy scales linearly from 60 to 300 (100 per bullet mark). Cooldown scales linearly from 1 to 9 seconds.
- The five AG resource marks support partial filling; other AG skills retain provisional training values.

## Companion 75
- Removed retired Martyr’s Consecration; place Fateweaver, Golden Magic Wool and Virtuous Oath together in the correct order, with the user-provided wool icon. Add SG Bash and Rage Impact entries.
- Detonation Field layering and Grapple Shot i-frame guidance; remove Shooting Rush from AG landing reference.
- Added Arsenal Gunner Field & Firing Lane Lab, with multiple independently placed medium fields, an enemy-centered larger attack circle, draggable targets and linear shots (no cones).
- Added five-mark resource training display to AG Rotation Crafter. Clearly mark as simplified because game tooltip uses numerical Transmutation Energy, and exact generation/spend conversions are unverified.

## Companion 74
- Corrected Terra Scourge as target-selected area damage, not ground-targeted; note the long cast opportunity cost.
- Rework Hexshroud around attacking afflicted enemies for Dorcha generation.
- Rewrite Elemental Knight and Harmonic Saint skills in short, actionable terms.
- Replaced Harmonic Saint Playing Instrument reference card with Encore and its real icon.
- Rephrase the other Arcana references around real rotation decisions rather than dense tooltips; preserve provisional EV details.
- Reference-only changes; existing simulator behavior retained.

## Companion 73
- Hid the standalone Encounter Study navigation and homepage entry points pending its future redesign.
- Kept its implementation and encounter-derived Vault records intact; requests to open the hidden module route back to the Vault.
- Preserved Rotation Lab, Debuff Academy and the Vault.

## Companion 72
- The Harmonic Saint music calculator now has one permanently visible “Skill modifying reforges” section for all eight inputs.
- Inputs remain independent of skill selection, retained in persistent settings, and affect only the matching effects.
- Removed the conditional reforge panel inside the selected result card.

## Companion 71
- Consolidate three Musical Knowledge tier-specific Reforge inputs into one Musical Knowledge - Reforge field that applies to all tiers. Migrate old saved tier values by taking the largest to avoid inadvertent stacking.
- Put contextual March Song, Enduring Melody, Harvest Song, and Vivace reforges next to the Rank 1 effect results rather than burying them in the lower modifier sections.

## Companion 70
- Removed source-note cards mistakenly rendered as skills (Field evidence / tooltip pass).
- Merged tooltip information into named skills; rebuilt Arsenal Gunner, Forbidden Alchemist, Puppeteer and Brawler skill lists with named, illustrated actions.
- Rewrote all ten landing page summaries to reflect actual resource, movement, cooldown and timing interactions, distinguishing known mechanics from provisional interpretations.
- Added missing icon aliases for applicable skill references.

## Companion 69
- Pummel and Somersault Kick register three separate damage hit events for critical-hit and Fighter cooldown reset checks, regardless of global hit-count setting.
- Pummel rapid input count remains separate from damage hit count.

## Companion 68
- Updated Fighter base cooldowns from player-measured values at Erg S50: Focused Fist/Tumble 7s, Charging Strike/Spinning Uppercut 6s, Drop Kick 10s, Somersault Kick 8s, Pummel 12s. Base values are doubled before the optional S50 reduction to avoid double-halving.
- Focused Fist supports optional early release or full charge. Pummel now accepts up to ten repeated activation-key presses during a five-second action, displaying a live counter.

## Companion 67
- Stage 2/3 combo choices remain visible while cooling, but grey out and cannot activate.
- Live tenths-of-a-second countdowns refresh during practice and react immediately to Fighter cooldown resets.
- Normal key overrides and combo progression remain unchanged.

## Companion 66
- 1–3 override assigned hotbar skills only during an active Stage 2 or Stage 3 combo selection.
- Stage 1: Charging Strike, Focused Fist, Flurry of Fists; Stage 2: Spinning Uppercut, Somersault Kick, Cyclone Drive; Stage 3: Pummel, Drop Kick, Hammerblow.
- Added on-screen selectable combo cards, preserve normal hotbar outside combos, prevent cancelled/cooling actions from advancing a stage.
- Avoided binding browser-reserved F1-F3 for the combo.

## Companion 65
- Flashing Steel only consumes a Bash stack when activated during its existing cooldown, without resetting the cooldown timer. Bash stacks decay one every 20 seconds without a new Bash.
- SG gains Virtue from Pledge, Ardent, Rend, Judgment, and a three-stage Zealous, with Retribution only at 100 Virtue and full consumption; added persistent Pledge ground indicator and capped duration extensions.
- A successful SG dummy parry during Rend’s 1.5-second window grants the additional Rend Virtue bonus.
- Blazing Brawler critical-reset events refresh Fighter skills only, not Arcana skills; configurable critical rate retained.

## Companion 64
- Automatic, randomized 3–10 second dummy strikes during Sacred Guardian Rotation Crafter sessions.
- Weapon winds up visibly over 1.7 seconds; final 1.5 seconds allows a reaction parry.
- Successful parries grant 7 Virtue and reset Rend Armor; missed strikes are harmless.
- The attack loop stops cleanly when practice ends.

## Companion 63
- EK selectable two-handed, sword-and-shield, dual-wield Bash generation; hit verification toggle and configurable two-handed spirit Rage Impact resets.
- SG continuous Oath Virtue generation, configurable Murias Relic generation, parry event and Virtue meter.
- MP independent puppet reductions (each 50%), separate Link X Cutting Chorus reduction, summon minimum.
- BB hit-count-aware critical reset evaluation.
- AG spirit option distinguishes bullets from Transmutation Energy.
- Practice-model uncertainties documented separately.

## Companion 62
- Replaced provisional skill references for EK, SG, AG, FA, MP, BB and HS with user-supplied in-game screenshot transcription and mechanic notes.
- Added EK Bash stack tracking and Flashing Steel cooldown reset/stack consumption in Rotation Crafter.
- Added opt-in MP Erg / puppet set cooldown modifiers and BB Erg / critical-reset simulation controls.
- Excluded Explosive Vanguard, as requested. Source tooltips and screenshot conclusions should be checked against user corrections.

## Companion 61
- Added independent MP Recovery Speed and Stamina Recovery Speed inputs (footwear cap level 10; accessories cap level 3).
- Enduring Melody calculator and on-stage buff announcements now use separate values.

## Companion 60
- Added Enduring Melody Protection reforge (+1 flat base per level), Harvest Song Gathering Speed reforge, and independent Vivace Magic/Alchemy Casting Speed reforges (+1 percentage point of base per level for speed modifiers).
- Applied modifiers to their corresponding base skill results only, preserving separately calculated performance tiers and local persistence.
- Showed the relevant modifier controls dynamically and reflect them in Harmonic Saint simulator text.

## Companion 59
- Added March Song-specific walking/mount speed reforge controls drawn from the supplied mabi.gg calculator, and apply the values exclusively to their matching speed result.
- Added Normal/Excellent/Inspiring tier-specific effect bonuses without treating them as generic music buff stat.
- Persist the new settings in the existing calculator profile.

## Companion 58
- Restored the Oath Workshop as a separate Rotation Lab page alongside Rotation Crafter.
- Reuse the original full / quick / Wool modes and interactive snapshot controls.

## Companion 57
- Updated Harmonic Saint's Rotation Crafter so randomly spawned heal targets display full-body cartoon ally figures with their weapon silhouettes, instead of simple abstract blocks.
- Preserved target labels, health bars, and healing pop feedback.

## Companion 56
- The Vault accepts Midir `.ndjson` session recordings, parses their raw event stream offline, and converts them into the existing Companion encounter/report model.
- Group damage hits by second and preserve HP/condition evidence; avoid fabricating verified death/clear evidence where the event data is insufficient.
- Preserved multiple-import behavior, repeat warnings, existing HTML import, awards and local profile state.

## Companion 55
- Restored Herb Collection as its own Rotation Lab page.
- Added eight randomly spawning colored herbs, randomized positions and a persistent counted-herb Storage Chest.
- Kept herbs as quantities only; no special effects or sale mechanics.

## Companion 54
- Kept reforge odds undisclosed in the UI, apply a normal-Reforge limit-break pity after 2,500 attempts without a limit break.
- Added an Erg Break Simulator for Melodic Puppeteer with B/A/S starting routes, nine tiered taps per rank, rank promotion B50→A30 and A50→S30, S50 completion, variable success probabilities from saved Erg table, escalating secret fail stacks, an assist-potion inventory and shared gold, and a persistent weapon chest.
- Allowed transferring owned Reforge Storage Chest weapons into Erg Storage Chest while preserving reforge lines.

## Companion 53
- Save rolled items with their exact reforge/stim lines; keep in a persistent Storage Chest or list on the Auction House (not both).
- Independently resolve each listing after a random 15–250 subsequent Reforge/Stim attempts and pay fictional gold based on the best eligible line.
- Removed sold items from active listings and require a blocking Auction House sale notification to be acknowledged before further rolls. Completed sales remain visible in sales history.
- Displayed earned gold, saved collection and pending listings in the simulator; preserve persistent progress across reloads.

## Companion 52
- Adjust the normal weighted level RNG so a 1–20 range averages approximately level 7 (expected 7.0017), while lower levels remain more common.
- Preserved Echostone one-line Stims, three-line Reforges, and the existing limit-break chance and ranges.
- This weighting remains a custom simulator choice, not real game odds.

## Companion 51
- Corrected swapped assets: the green bottle now represents the Echostone Stimulant (Stim), and the tool-shaped icon represents the Reforging Tool (Reforge). No changes to roll logic.

## Companion 50
- Echostone Stim remains a single line with no limit break.
- Added talent-related effects drawn from the 777-row Full Reforge List, grouped by the Echostone page's color/talent descriptions.
- Preserved exclusive color-specific effects, adding shared talent-related lines (including for Silver).
- Per-effect normal level maxima are drawn from source rows. Chance weights remain illustrative.
- Talent mapping is generalized: individual Echostone pages may contain exceptions and should be audited later.

## Companion 49
- Extract 777 reforge rows with item eligibility, default level ranges and limit break ranges from the user-saved Reforge/Full List HTML.
- Extract 56 Echostone-exclusive rows with per-color eligibility and level caps from the user-saved Echostone HTML.
- Corrected Stimulant rolls to **one** attribute, while retaining **three** for Reforge. Never apply limit breaks to Stims.
- Note that the saved wiki has no Silver-exclusive rows; the exclusive-only simulator correctly does not invent them.
- Kept simulator probability model as user-requested fiction, not game odds.

## Companion 48
- Removes placeholder Practice Workshop links from Arcana landing pages. Other Arcana pages retain Rotation Crafter, while unique future tools can be designed separately.
- Adds Explosive Vanguard “Reforge Simulator” with the requested tagline, 9 equipment types, grouped weapon subtype dropdown, tool subtype dropdown and five Echostone colors.
- Uses supplied Reforging Tool and Echostone Stimulant artwork, rolls three distinct starter attributes with low-value-weighted RNG. Custom sandbox chance 1/1000 for a limit-break attempt, one exceeding value and full-screen fireworks; no limit breaks on Echostones.
- Important limitation: the full linked wiki reforge and exclusive Echostone tables were not retrievable (403). The embedded pools are explicitly labeled partial starter examples; full item eligibility, exact ranges and rates are not verified. More complete data import remains pending.

## Companion 47
- Removed the Bard/music overlay skill icon so buff announcements return to text-only presentation.
- Resolve the remaining ambiguous skill icons by selecting the most modern-looking Midir variants for Charge, Counterattack, Natural Shield, and Stomp.
- Removed Recovery from Harmonic Saint.
- Bring melee Arcana closer to the strawman and refine Arcana-specific training animations: forward-facing swords for Elemental Knight, close shield-bash posture for Sacred Guardian, punch/kick motion for Blazing Brawler, forward recoil for Arsenal Gunner, a thrusting spear motion for Explosive Vanguard, no string lines and cross-shaped control bars for Melodic Puppeteer, and keep Forbidden Alchemist focused on projectile output.

## Companion 46
- Removed the large icon from the Harmonic Saint on-screen buff announcement; retain clean center-stage buff text.
- Expanded local Midir skill icon mapping across the complete Rotation Crafter and Music simulator drawers and hotbars, including verified fighter `Combo:` name aliases.
- Leave unknown or missing skill art as a neutral icon placeholder; no arbitrary substitutions.

## Companion 45
- Added the active Bard skill icon to the center-stage overlay in **Rate isn't a Lie**, matching the in-game presentation more closely.
- Continue using local Midir skill icons where available so the simulator resembles the actual buff pop-up style.

## Companion 44
- Kept Bard dance animations continuously intense with repeated leaps, exaggerated movement, arm strumming, kicks and instrument swings until the performance is interrupted.
- Moved the music-buff announcement into the middle of the simulator field with contrast for readability, retaining all skill-specific buff lines.
- Respect reduced-motion preferences and preserve Escape, pointer-away and next-skill interruption behavior.

## Companion 43
- Refine the **Rate isn't a Lie** simulator so **Harvest Song** displays all requested support lines: Gathering Success Rate, Production Success Rate, and Gathering Speed.
- Kept the calculator expanded by default while preserving the ability to collapse it.
- Preserved Escape and pointer-interrupt behavior so users can stop one performance and immediately play another.

## Companion 42
- Added Harmonic Saint's Music Buff Effect calculator (wiki-style inputs and performance tiers) and its Bard hotbar performance simulator.
- Calculator begins expanded and can be collapsed without losing the stored settings.
- Performances are associated with individual skill effects; Escape, clicking elsewhere, or starting a new skill interrupts the current animation without stopping the session.
- Name in the performance banner comes from the Vault character field, or uses “your” when empty.

## Companion 41
- Added all active skills identified in the supplied Combat, Puppetry, Music, Magic, Fighter, Dual Guns, Alchemy, Lance Combat and Holy Arts category/talent lists to the corresponding Arcana crafter pools, excluding passives and crafting.
- Kept Arcana skills and existing customized cooldowns intact. New unverified cooldowns default to simulation zero (not a game mechanics claim) and can be edited in the builder.
- Used user-matched Midir KartRider Water Balloon condition 598 art for the Kart Bomb Academy card.
- Wiki is the explicit source for skill membership; skills are not assumed to be usable with every selected weapon/race/character.

## Companion 40
- Fixed the Rotation Crafter **Clear rotation** control so it clears the entire planned sequence reliably.
- Added **per-skill customization** inside Build a Rotation, including editable cooldown, action-delay, and charged-skill hold time values. This supports user adjustments such as an Erg-modified Urgent Shot cooldown.
- Expanded **Alchemic Sharpshooter** with additional bow skills including Crash Shot, Mirage Missile, Arrow Revolver, Final Shot, and Support Shot.
- Generalize the **Rotation Crafter** so every Arcana now has a themed version using the same hotbar/rotation system with Arcana-appropriate visuals: bow archer, dual swords, staff caster, shield user, pistols, brawler, lance user, hand-cannon alchemist, puppeteer, and Harmonic Saint healer.
- Added a first-pass **Harmonic Saint** party-healing scene that spawns 1–3 random ally targets with health bars when Begin is pressed, then shows healing feedback on relevant skills.
- Preserved hidden research/source tracking for Skill Knowledge while keeping those citations out of the player-facing UI.
- Added **Kart Bomb** coverage to Debuff Academy as a provisional increased-damage-taken source in the library and missing-debuff exercise; a temporary placeholder condition icon is used until a verified Midir icon is mapped.

## Companion 39
- Replaced the provisional 25% per-skill orb increments with user-provided primary and secondary element gains: Ignis Plume Fire +36% / secondary +18%, Aqua Volley Water +52% / secondary +26%, Terra Scourge Earth +100% / secondary +62%, Ventus Howl Wind +78% / secondary +39%. Each orb is capped at 100%.
- Let players select a different secondary element for each skill; default Plume to Water, Volley to Fire, Terra to Wind, and Ventus to Earth. Selection persists locally. The grey-until-full orb display shows exact percentages, and existing Golden Time and Tri-Assault consumption rules remain.
- Values originate from prior user-supplied AS mechanics; no assumption about unverified skill activation packets is added.

## Companion 38
- Swap the two Crafter hotbar rows: F1–F12 above 1–=.
- Added four in-session four-step Alchemy Orb meters, grey until full, then Fire red, Water blue, Wind white and Earth brown. For exploratory practice, Ignis Plume, Aqua Volley, Ventus Howl and Terra Scourge each add one to the matching element; Golden Time fills all. These increments are **illustrative trainer assumptions**, not verified exact game orb-generation values.
- Tri-Assault requires full Fire and Water orbs, spends both on activation, automatically animates three shots from one keypress, includes a 750ms pause between shots two and three, and displays brief edge fireworks on shot three. All other skill activations are suppressed until the third shot, and session termination cancels pending shots.
- Retains all Companion-37 features and assets.

## Companion 37
- Rebuilt AS Rotation Crafter with 1–= and F1–F12 hotbars, draggable skill drawer, drag-to-move/swap, click-to-assign fallback and right-click-to-clear.
- Collapsed rotation builder is empty by default for a new profile. A drafted rotation shows a next-skill cue; without one, free practice is available. Session duration, Begin/Finish and bow animation are consolidated below. Aqua Volley has hold/release charge indication and cooldown inputs are ignored.
- Removed the duplicate Skill Knowledge panel from the AS crafter. Skill reference pages use locally verified exact Midir icon matches when available and retain source evidence in internal reference data rather than in player-facing explanations.
- Existing Vault, collectibles and imported report/award calculations are unchanged.

## Companion 36
- Every Arcana's Rotation Lab now opens on the same **Skill Knowledge** landing structure, showing the Arcana's skills, roles, explanation and provenance. Existing AS Rotation Crafter, DD automaticity, Sacred Guardian Oath Workshop, and other Arcana practices remain accessible through **Available pages** buttons.
- Alchemic Sharpshooter and Dark Diviner skill entries use prior project/user research; February 2026 and July 2025 official Nexon update information is preferred for recently changed AS damage/cooldowns. All unverified exact effects and skills in other Arcanas are explicitly provisional; keep this reference editable in `rotation-reference.js`. Official references: https://www.nexon.com/mabinogi/news/35462/february-quality-of-life-update and https://www.nexon.com/mabinogi/news/28264/arcana-faith-and-fury-update.
- Added a separate AS **Positioning Lab** with 1–15 randomized enemies, placement/removal and drag-to-position controls, draggable character and aiming handle, adjustable firing angle/range, cone spread and line width, and an Attack action that briefly highlights and eliminates affected targets. Restore and randomize controls support repeated experiments. Geometry is intentionally illustrative and not calibrated to in-game Mabinogi hitboxes.
- Retained all current Vault imports, awards, records, Arcana practices, CSS and local storage schema. No Midir exporter changes.
- Verification: JS syntax and headless Chromium in-memory interaction tests across ten Arcana hubs, DD drill, AS crafter, and positioning interactions. Normal file-origin/IndexedDB workflow not re-verified in this release.

## Companion 35
- Tighten the header, navigation, Vault heading, character selector, form spacing, and report rows without reducing the prominence or changing the styling of the three achievement collectible cards.
- Kept import and milestone entry controls balanced on larger screens and stack cleanly on smaller screens. Maintain full-width saved milestones with Edit and Remove actions.
- Condensed saved-report metadata and action rows into clearer responsive layouts, keeping report viewing and removal behavior unchanged.

## Companion 34
- Moved The Vault to the far-left position in the main navigation and preserve the requested tab order: **The Vault, Rotation Lab, Debuff Academy, Encounter Study**.
- Replaced the old left-side Overview control with a compact **three-line menu icon on the right** of the navigation row. The slide-out panel now opens from the **right side** of the screen and no longer shows “Overview” on the toggle itself.
- Simplified the Vault header by removing the separate **Your Character** card. Character selection is now an inline field at the top of the Vault. A compact **Save** button appears only when the typed name differs from the currently saved tracked character.
- Condensed the **Add to Your Vault** controls so report import and backup actions occupy less space, while keeping **My Milestones** beside them. Saved personal milestones now render in their own **full-width** section below, with existing edit and remove controls preserved.
- Kept existing encounter-aware records, debuff evidence, repeat-import behavior and collectible logic unchanged from Companion-33.
- Verification: JavaScript syntax validation plus package assembly checks. Full interactive browser-origin validation still recommended in normal Chrome/Edge.

## Companion 33
- Added pure offline encounter/attempt analysis (`analysis.js`) over actual Midir-41 `midir-companion` v1 payloads. Logical Vertrag 7600→7601 pairs remain one attempt; recognized Gate 2 and Gate 3 boss entities create separate attempts. Verify clears conservatively from the existing explicit evidence. Show fastest **verified boss-attempt** time per encounter rather than conflating a multi-gate recording with dungeon completion. Time-bounded player deaths and all-target hit-group damage are labeled as such, never cast counts or exact boss-only damage.
- Preserved observed **target and player condition intervals, attacker IDs, first-seen/spawn timestamps, skill IDs and grouped damage-hit timestamps** on import. In the Vault, list observed debuff categories per attempt, explain the provisional 10-group reference, and display evidence for selected character. Confirm source via the boss condition attacker entity ID, or infer a likely contributor only when a **unique** player has a recognized compatible skill hit within ±3 seconds of an ownerless condition. Do not give ownership to someone else if the packet has another attacker ID, infer unknown pet owners, or call hit events proven casts.
- Automatic encounter-specific rewards: **Debuff Contributor** for any defensible attributed application, **Quick Setup** for applications up to 10 seconds after recorded boss appearance, and **Reference Coverage Together** when all the currently listed groups were observed at least once. Last award is explicitly **provisional**, not a verified final full-game debuff set or continuous/simultaneous uptime; the complete set awaits user verification. Existing Bri survival collectibles retain their rules.
- Allowed repeat-session HTML imports, each with its own Vault entry and its own collectible/reward counting; show **possible repeat** warnings for matching recording signatures. Retain JSON→HTML attachment for older data-only entries. Removal remains per import. These are not cryptographic deduplication guarantees.
- Corrected initial language rerender failure caused by a hyphenated `aria-label` DOM dataset property. Restore Academy Flashcards by initializing the active deck IDs and valid icon set from the verified local condition-icon registry. Avoid stacking celebration dialogs on repeated imports. Improve confusing Gate 3 `Human` report label without altering original archived HTML.
- Preserved original graphical per-skill highest-hit fields from the HTML report while minimizing the redundant saved report summary (full original remains in IndexedDB). Restore record-high hit, skill-hit, raw damage-total and damage-taken comparisons where **both reports contain one recognized matching boss encounter and have the same export target scope**; clearly label these as recording-scoped metrics, not confirmed boss-only hits. Keep localStorage profile keys, training modules, local illustrations, user notes, and one rolling changelog unchanged.
- Verification: JS syntax, supplied sample export parsing, simulated Chromium UI navigation and repeated import/flashcard interaction. Full Windows EXE execution and live game verification not performed. Browser storage behavior needs validation in normal supported browser origin. No Midir-41 exporter changes in this release.

> **Current-build clarification:** Companion 275 uses nine specified debuff condition groups for party-coverage awards, not this early provisional ten-group model. Recognized duplicate imports offer replacement or cancellation; only unmatched near-duplicates may coexist.

## Companion 32
- Fixed the sidebar Close button disappearing after opening: its static control now remains mounted while recent-training content rerenders in a separate child container.
- The Overview toggle opens and closes the panel. Escape and clicking outside the panel also dismiss it. Sidebar visibility and accessible expanded/hidden state remain synchronized.
- Consolidated historical release notes 05–31 into one changelog; no application behavior changed.

## Companion 5–31 — Condensed early release history (5–31)
- **05–09:** Expanded offline foundations, collectible evidence, Arcana pages, and Sacred Guardian Oath Workshop.
- **06, 11–16:** Added Midir skill and condition icons, shared/pet debuff recognition, and verified Lightning Debuff artwork.
- **17–19, 21, 27:** Developed shuffled flashcards, persistent set-aside deck, procedural missing-debuff drills, and guided lesson artwork.
- **10, 20, 22–25:** Reorganized Vault navigation, imported HTML viewing/removal, and illustrated collectibles.
- **26–28:** Corrected Gate 1 collectible phase handling, exact character attribution, and Overview sidebar.
- **29–30:** Added editable milestones, achievement catalog, and compact Vault layout.
- **31:** Added English/Korean/Spanish selection with partial translation support.
- Intermediate corrections and superseded implementations are represented by their final documented behavior rather than repeated as separate entries.

## Companion 17
- Randomized icon flashcards; persistent set-aside and restore deck.

## Companion 15
- Added verified Ceraunus / Mir Dragon shared Lightning Debuff icon to Debuff Academy.

## Companion 4
- Added evidence-based Vault awards: verified deathless clears, improved deaths, stronger skill hits, increased total damage, and faster verified boss combat duration.
- Achievements remain encounter/character-specific; uncertain or missing clear evidence does not generate awards.

## Companion 3
- Renamed Reports and Personal Records to The Vault; stored imported HTML in IndexedDB and report summaries in localStorage.
- Added encounter-comparison milestones and interactive HTML report reopening; archived HTML is separate from older JSON-only backups.

## Companion 2
- Reorganized Debuff Academy into guided lessons, debuff library, flashcards, and missing-effect recognition.

## Companion 1
- Created offline browser Companion with Midir HTML/JSON import, Alchemic Sharpshooter practice, Dark Diviner drills, Debuff Academy, encounter summaries, and personal records.
- Established local persistence and conservative evidence rules for report-derived milestones.

## Unattributed legacy note

The original changelog included the following EV Base Manager note outside a version section. Its release number was not documented, so no version is assigned here.

- EV Base Manager: owned skill palette only; drag skills into the rotation, reorder repeated links, and view greyed-out cooldown icons with numeric timers.


### 280 (0.2.80) — Mobile PWA foundation
1. HTTPS installable web app manifest and locally created icon set; offline application shell, cautious on-demand asset cache, cache rotation on update.
2. Opt-in home-screen install prompt on supported browsers; no automatic profile sync.
3. Enabled touch-capable Bandit Hunt on mobile using existing action buttons and responsive board. Herb Gathering and Reforge Simulator remain accessible.
4. Desktop-only keyboard/mouse modes remain disabled on phones. Retained 279 mobile import/storage guards.

### 281 (0.2.81) — Crom Bas Invaders mobile controller
1. Mobile Invaders enabled; fixed 800:620 playfield with left hold/release skill buttons (Aqua Volley, Terra Scourge, Anchor Rush), right analog movement and landscape guidance.
2. Reuse existing charges, placement, cooldowns and analog movement logic; avoid keyboard simulation and desktop input changes.
3. Touch state resets on pause, navigation or lost capture; preserved all progress and save schema.
4. Rotate PWA shell cache for the new game files.
\n### 286 (0.2.86) — Twilight Surge residual gauge and burst value\n1. Seething Mana ON: completed spell casts add 5% to an independent Residual Dorcha gauge (not on hit); gauge caps at 100%.\n2. Twilight Surge is manually triggered at 100% charge and cooldown ready (36 seconds by default); consumes all charge, costs zero ordinary Dorcha and no Seething surcharge, and is removed from mandatory note generation.\n3. Damage-weighted Surge burst earns 1,600 base points before established combo/upgrade/Seething modifiers, displays readiness and gauge, and uses existing provisional cast lock.\n4. Preserved 285 Shadow Flare timing and existing save keys; added focused regression tests. Source: theta-rhythm.js, tests/theta286_surge_test.py.\n
### 287 (0.2.87) — Twilight Surge timed lesson note
1. Protocol 6 teaches Twilight Surge with an eight-second approach animation during the end of the 36-second cooldown after the first Surge. At the due point, an increasingly radiant, faster-pulsing reminder remains for six seconds, after which an uncast Surge automatically fails containment. The opening Surge must be used to complete this lesson.
2. Protocols 7–10 preserve the same cooldown and persistent reminder but never auto-fail; the reminder remains separate from regular hit judgment and overheat.
3. The protocol-6 offensive chart now offers a shorter Thunder cadence and less frequent Shadow Flare interrupts so the charged 20-cast Surge cycle is achievable. Existing cooldown/resource/scoring rules and player saves are preserved. Sources: Companion Files/theta-rhythm.js and tests/theta287_surge_note_test.py.

### 288 (0.2.88) — Dark Diviner spell costs, Thunder/S50 and Hexshroud

1. Thunder Intermediate Magic Seething cost table (1.3→0.6) and Advanced/Dark Diviner table (1.6→0.6), with Magic talent +0.5 Dorcha/cast and 50 MP Seething activation, based on supplied skill-cost screenshots.
2. Thunder six-hit Hexshroud recovery, timed as separate rapid strikes; Polar Vortex small ongoing scoring/resource ticks.
3. Thunder provisional baseline 1.30s and S50 1.00s load, independent of Vivace. Shadow Flare and Twilight Surge both use agreed Vivace 5.0–1.0s.
4. Erg Simulator saved S50 Staff redemption into Theta and alternative 950-Sigil purchase. Saved-state compatibility maintained; tests/theta288_mechanics_test.py covers resource/timing/trade invariants.

### 289 (0.2.89) — Theta shop focus and Ice Bolt
1. Retired Mana Reservoir, Dark Economy, Hexshroud Extension and Ritual Precision from purchase and effects. Legacy upgrade fields remain in saved profiles without giving retired benefits; Containment Aura remains an optional visual-only particle purchase placed last.
2. Ice Bolt unlock: five automatically timed one-second releases from a single activation, treated as five Bolt Magic casts for 0.5 Magic-talent Dorcha each, 0.9 Seething Dorcha cost each, +5% Residual charge each with Seething ON, and one Hexshroud recovery per hit. Existing note chart shifts during the automatic volley.
3. Cross-game one-time Sigil purchases grant standard or protective red/blue stones to Special Upgrade and Erg Unlock Assist Potions to the shared Reforge/Erg inventory. Shop puts functional upgrades before cosmetic items.
4. S50 Erg staff redemption, Shadow Flare Vivace timing, Surge lesson, 15-Dorcha cap, and prior saves preserved. Sources: Companion Files/theta-rhythm.js, Companion Files/reforge-simulator.js.

### 290 (0.2.90) — Ice Bolt timing and Arcane Aesthetics
1. Ice Bolt loads once for 1.00s, then releases five guaranteed-hit casts 0.30s apart (1.20s first-to-last). Each cast separately incurs Bolt-tier Seething cost, contributes 5% residual charge while ON, and triggers one Hexshroud recovery; all Dorcha is clamped to 15. Thunder remains one cast and six hits. [Source: user gameplay specifications, 2026-11-04.]
2. Replaced cosmetic Containment Aura particle increments with saved, toggleable Arcane Aesthetics tiers: Thunder palette and alternate jagged bolt shapes; Shadow Flare projectile/flame variants; Polar Vortex seasonal snow/wind/heat/leaves/icicle motifs. Existing purchased ranks are honored. Purely visual; no point, resource or timing advantage. [Source: user cosmetic directions, 2026-11-04.]
3. Version and offline cache updated to 0.2.90. [Source: cumulative build convention.]

### 291 (0.2.91) — Theta cosmetic quality pass
1. Refined Arcane Aesthetics so Thunder, Shadow Flare, and Polar Vortex variants use richer layered animation, stronger silhouette separation, and more themed particles/motion. The goal is to make cosmetic tiers feel worthwhile while staying purely visual. [Source: user request for a cosmetic quality pass, 2026-11-04.]
2. Clarified the Cosmetic Studio descriptions so each tier explains what visual changes it unlocks. [Source: user request for cosmetics to feel high quality and worthwhile, 2026-11-04.]
3. Updated the version and cache labels to 0.2.91. [Source: cumulative build convention.]

### 292 (0.2.92) — Thunder feel pass
1. Reworked Thunder presentation in Subject Theta so the base spell and cosmetic variants feel more satisfying to cast: visible staff-side charge source, multi-strand bolt travel, brighter target impact bursts, and mild screen shake. [Source: user request to focus on Thunder feel, 2026-11-04.]
2. Added a lightweight layered Thunder cast / hit sound profile to better sell the cast and repeated strike sequence while keeping the rhythm game fully offline and self-contained. [Source: user request to make Thunder feel enthralling to use, 2026-11-04.]
3. No scoring, cooldown, Dorcha, or cadence rules were changed; this is a presentation / feel pass only. [Source: preservation requirement.]
4. Updated version and cache labels to 0.2.92. [Source: cumulative build convention.]

### 293 (0.2.93) — Mobile utility access audit
1. Provided direct mobile home shortcuts to Music Buff Effect Calculator, Special Upgrade, Erg Simulator, Oath Max setup, Emergency Oath, and Oath checklist. The calculator now runs in a standalone touch-friendly route instead of being blocked with the keyboard-based Bard performance simulator. [Source: user mobile availability request, 2026-11-04.]
2. Added narrowly scoped mobile layout and touch-target adjustments for music forms, Special Upgrade, Erg and SG stat entry; desktop presentation remains unchanged. [Source: user mobile playability request, 2026-11-04.]
3. Updated version and offline cache to 0.2.93. [Source: cumulative build convention.]

### 294 (0.2.94) — Mobile menu, Achievement Book and music page
1. Reunited the Music Buff Calculator and the Rate Isn't a Lie performance gag on one shared page for desktop and mobile. On phones, calculator inputs work and the simulator remains visible with Begin disabled; desktop Begin is unchanged. [Source: user mobile layout preference, 2026-11-04.]
2. Improved the Achievement Book mobile dialog layout with scrollable book pages, persistent chapter-turn controls, and 44px mobile close/turn targets; the existing achievement filtering and Secret Sauce toggle are preserved. [Source: user request for full mobile book exploration, 2026-11-04.]
3. Verified slide-out menu Settings and See Secret Sauce on mobile; no change to desktop menu behavior. Updated version and PWA cache labels. [Source: user mobile navigation verification request, 2026-11-04.]

### 295 (0.2.95) — Mobile visual consistency and full-screen report reader
1. Audited shared desktop/mobile palette, typography, navigation and card styles. Preserved desktop visual identity and retained compact mobile layout behavior. [Source: user visual-consistency review request, 2026-11-04.]
2. Open saved interactive HTML reports in a dedicated full-screen phone reader, with fixed close, scatter jump, zoom in/out and fit controls. A viewer-only helper adjusts the chart display and enables point-tap tooltip interaction; original HTML remains saved unmodified and sandboxed. [Source: user request for mobile scatter visibility and zoom, 2026-11-04.]
3. Desktop report inline and new-tab behaviors are unchanged. Version and offline cache updated to 0.2.95. [Source: cumulative build convention.]

### 296 (0.2.96) — Theta visual clarity and overheat feedback pass
1. Replaced Subject Theta's round bottom timing receivers with flatter on-track timing rings sized to cleanly contain incoming notes at the hit point, and removed the extra circular strike-line overlays above the keycaps. [Source: user visual feedback, 2026-11-04.]
2. Reworked miss feedback so overheat is communicated through red energy flashing along the track edges, with a persistent red danger state and full-screen vignette at 4/5 overheat, instead of a large on-screen miss/overheat text counter. [Source: user visual feedback, 2026-11-04.]
3. Cleaned the right-side Theta HUD to reduce overlapping text and shorten utility readouts while preserving cooldown/state information. [Source: user UI cleanup request, 2026-11-04.]
4. Reduced Thunder impact occlusion over Theta so the boss reaction remains visible through the effect while keeping the improved cast feel. [Source: user feedback on Thunder readability, 2026-11-04.]
5. Simplified the live status strip by removing the on-screen overheat counter. [Source: user feedback to minimize text.]

### 297 (0.2.97) — Vertrag sprite cleanup
1. Cleaned several Vertrag movement/attack sprite frames that were still carrying detached pieces of neighboring poses from the source sheet export. The affected frames now keep only the main silhouette plus very small VFX fragments, removing the stray body-piece bleed visible at the left/right edges during motion. [Source: user report, 2026-11-05.]
2. Added extra transparent padding around all Vertrag boss frames so the scaled animation has more breathing room and is less prone to edge artifacts while moving. [Source: user report, 2026-11-05.]

### 298 (0.2.98) — Large imports, sprite framing, Vertrag charge
1. Increased individual report import and archive reactivation safety limit from 40 MB to 90 MB and parsed embedded JSON directly rather than constructing a full HTML DOM; multi-encounter recordings remain one report for achievement and duplicate-credit safety. [Source: 58.6 MB seven-encounter user export and request, 2026-11-05.]
2. Vertrag now snapshots the player's position when charge windup begins, traverses the entire distance to that point, and uppercuts at that fixed endpoint even if the player moves. The telegraph shows the full path. [Source: user gameplay feedback, 2026-11-05.]
3. Giant quiet zones and visual rings expanded by 20%, preserving the existing adjustable stomp radius and four-giant rule. [Source: user gameplay feedback, 2026-11-05.]
4. Cleaned detached neighboring poses from shared Vertrag player animation frames; reviewed other game atlases for sprite sampling boundaries. [Source: user sprite feedback, 2026-11-05.]

### 299 (0.2.99) — Theta & Vertrag usability
1. Used bundled skill icons for Theta controls; condensed help into a Quick Guide and collapsible reference.
2. Increased Theta base MP to 2,500, without altering skill costs or Lucky Strike percentages.
3. Replaced Vertrag setup dropdowns with interactive giant occupation toggles over the arena and central Trial/Endless buttons; locked drill selectors no longer clutter the main menu.
4. Added a player-facing overhead HP bar and default H potion key, included in customizable controls and compatible with older saves.

### 300 (0.3.0) — Vertrag defensive state selection
1. Added a four-choice defensive loadout screen between selecting Trial/Endless and entering Vertrag's arena: Easy (shield, Sacred Guardian-like), Normal (heavy breastplate), Hard (leather armor), Veteran (sunglasses). [Source: user request, 2026-11-05.]
2. Reused the existing damage multipliers (8%, 52%, 100%, 160% respectively) and saved durability fields, retaining save compatibility and prior tuning. [Source: established Vertrag survival mechanics.]
3. Moved the armor selector out of the arena preparation overlay, keeping giant toggles and time-trial duration controls intact; the selected defense tier is visible in the run header. [Source: user-requested two-step launch flow.]

### 301 (0.3.0) — Version-label correction (not a new version release)
1. Corrected the application’s display to the established **0.3.0** release version, which belongs to build 300. This build introduced no new product version, gameplay changes or saved-data schema changes. [Source: user clarification, 2026-11-05.]
2. Advanced PWA cache identifiers so installed copies can refresh the version display. [Source: release hygiene.]

### 303 (0.3.0) — Mobile Secret Sauce disclosure fix
1. Removed import, archive and original-report warnings from the default mobile Vault welcome card; those details now appear only after See Secret Sauce is enabled in Settings. [Source: user mobile screenshot and feedback, 2026-11-05.]
2. Removed the mention of hidden importer achievements from the basic Achievement Book intro. Normal training shortcuts remain visible and the advanced data and controls are preserved. [Source: user Secret Sauce concealment requirement.]
3. Refreshed PWA caches for GitHub Pages clients; application version remains 0.3.0 and saved-data formats are unchanged. [Source: release verification.]

### 0.3.5 — Vertrag mobile controls
- Added touch movement with shared analog/D-pad preference for Vertrag and Crom, including simultaneous D-pad directions. [1] `Companion Files/mobile-movement.js`; [2] `Companion Files/vertrag-survival.js`; [3] `Companion Files/as-chicken-invaders.js`.
- Added Vertrag pinch zoom, potion cooldown button, and portrait/landscape controller layout. [2] `Companion Files/vertrag-survival.js`; [4] `Companion Files/styles.css`.

### 0.3.6 — Mobile positioning labs

1. AS Positioning Lab: enlarged touch aiming target and single-pointer ownership, keeping existing geometry (`Companion Files/app.js`, `Companion Files/styles.css`).
2. AG Field & Firing Lane Lab: distinct orange field-placement and purple artillery-target modes, including target-centered field placement (`Companion Files/app.js`).
3. AS/AG Target Frames: larger drag targets, explicit AG tool choices and a fix for target hit-testing on touch (`Companion Files/frame-bowling.js`, `Companion Files/styles.css`).
4. Updated Positioning and Mobile Features current-state references; refreshed PWA cache keys.

### 0.3.7 — Rate Isn’t a Lie mobile performance

- Enable mobile Begin and touch Bard hotkeys with existing cooldown / performance rules.
- Add touch drawer-to-slot drag, tap-then-assign, slot rearrangement and long-press clearing.
- Remove stale mobile-menu restrictions on previously converted games.
- Current references: [1] `Companion Files/app.js`; [2] `Companion Files/styles.css`; [3] `tests/music037_touch_test.py`; [4] `Midir-Companion-Doccumentation/features/18-MOBILE-FEATURES.md`.


## 0.3.10 — Localization audit and expansion

- Expanded Korean and Spanish strings for legacy navigation, module settings and current minigame interfaces (source: `Companion Files/i18n.js`).
- Added localization of changing text nodes, newly inserted game overlays and known canvas HUD labels, preserving English fallback and user/report data (source: `Companion Files/i18n.js`).
- Added current-state Language Support guide and documented remaining untranslated long-form strings (source: `Midir-Companion-Doccumentation/features/19-LANGUAGE-SUPPORT.md`).
- Updated visible version and offline shell cache for 0.3.10; no gameplay or saved-profile schema changes (sources: `Midir Companion.html`, `service-worker.js`).

## 0.3.11 — Mobile UI accessibility and Music Calculator enchant editor

- Moved Vertrag mode buttons outside the giant setup arena; shortened Pig Pursuit onboarding and switched Bandit Hunt's mobile skill responses to icon-only controls (`vertrag-survival.css`, `ek-pig-pursuit.js`, `bb-bandit-flip.js`, `styles.css`).
- Made Cutting Chorus's icon/cooldown bank compact without nested scrolling and auto-focused the gameplay view on start; retained separate aiming and triggering (`mp-rhythm.js`, `styles.css`).
- Docked EV's tutorial with an accessible confirmation button and compacted its tower shop; moved Arsenal Gunner's targeting/firing actions above the arena (`ev-defense.js`, `app.js`, `styles.css`).
- Aligned Herb Collection hit regions with enlarged visible herb sprites (`styles.css`).
- Removed the duplicate Musical Knowledge reforge input and math; added an eight-slot Prefix/Suffix music enchant wizard with integer ranges and manual Enchant Effects override (`app.js`).
- Updated the current-state feature guides, language labels and PWA cache names; retained gameplay scoring, saved profiles and Rotation Highlights rules (`i18n.js`, `service-worker.js`).


## 0.3.11a — EV tutorial, switchable music gear, Theta mobile renderer

1. Corrected EV Tower Defense's four-step onboarding: the Base Manager drawer displays the final confirmation itself, and completing step 4 closes it so Wave 1 can begin. [`Companion Files/ev-defense.js`](../Companion%20Files/ev-defense.js), [`styles.css`](../Companion%20Files/styles.css).
2. Consolidated music enchants and reforges into eight-slot named buff-set tabs, each storing complete named physical items (Prefix/Suffix actual rolls, three reforge lines, and instrument-specific upgrades). Added shared-item reuse, independent copies, loadout switching, set comparison and per-set enchant manual override; retained 0.3.11 settings through visible, assignable legacy values. [`Companion Files/app.js`](../Companion%20Files/app.js).
3. Removed March Song Mount Speed from results, kept Walking Speed, added Enduring Melody Defense reforge (+1 base Defense/level, max 3). Removed the redundant standalone reforge contributions without altering preexisting performance tier semantics. [`Companion Files/app.js`](../Companion%20Files/app.js).
4. Added mobile low-cost rendering in Theta: smaller canvas buffer, approximately 30 FPS drawing throttle without slowing rhythm logic, reduced shake/glow/particles/cosmetics and optional Graphics Mode settings. Gameplay timing rules remain unchanged. [`Companion Files/theta-rhythm.js`](../Companion%20Files/theta-rhythm.js), [`theta-rhythm.css`](../Companion%20Files/theta-rhythm.css).
5. Updated browser regression coverage, current-state guides, package version and service-worker caches; preserved assets, profiles, three UI languages, and Rotation Highlights roadmap. [`tests/mobile0311a_hotfix_test.py`](../tests/mobile0311a_hotfix_test.py), [`tests/mobile0311_music_test.py`](../tests/mobile0311_music_test.py), [`service-worker.js`](../service-worker.js). Physical-phone performance and persistence over a deployed HTTPS origin have not been certified.


## 0.3.11b — Music Calculator equipment board and named set-effect precedence

1. Replaced the multi-slot select list with an interactive eight-position equipment board; each slot opens a physical-item editor retaining named-tab sharing/copying, enchant prefixes/suffixes and overrides. [1] `Companion Files/app.js`, [2] `Companion Files/styles.css`.
2. Reforge choices now use the existing Reforge Simulator table per slot: three lines maximum, duplicates filtered, normal and exceptional limit-break caps shown and enforced. Special Ethereal Chiffon Wings have no reforge lines. [1] `Companion Files/app.js`, [3] `Companion Files/reforge-data.js`, [4] `tests/music0311b_slot_rules_test.py`.
3. Consolidated Seraphic glove, Troubadour body/hat/glove/boot and Special Ethereal Chiffon Wings effects into physical equipment. Instrument grade, special upgrades and instrument buff upgrades remain instrument-only. Buff duration and Fantastic Chorus effects are excluded. [1], [4]; supplied wiki HTML source captures.
4. Named combination effects resolve using the highest equipped same-name bonus, not their sum: Seraphic BFO +5% overrides Troubadour BFO +3%, while Troubadour Enduring Melody +3% still applies. Legacy BFO set selections are capped under the same name until explicitly reassigned. [1], [4].
5. Updated current-state guides, app version and service-worker shell/asset names, preserving EV/Theta gameplay, persisted profiles, localization and Rotation Highlights analysis rules. [5] `Midir Companion.html`, [6] `service-worker.js`, [7] `Midir-Companion-Doccumentation/features/12-MUSIC-AND-PUPPETEER.md`. Physical-device verification and deployed HTTPS persistence remain pending.

## 0.3.11c — Compact Music Calculator and per-item manual enchant overrides

1. Each of the eight physical music gear items now accepts an optional typed enchant contribution, replacing its own automatic Prefix/Suffix subtotal; blank/reset restores auto, and manual zero is valid. The existing per-buff-set overall Enchant Effects override still takes final precedence. Reforges, set effects, grades and instrument upgrades are not overridden. [1] `Companion Files/app.js` (`musicGearEnchantItemTotal`, `musicEnchantEditor`, `musicBuffBind`).
2. Moved live music results above the equipment board with compact sticky display, and added a pinned preview in each item editor. Removed duplicate Copy/New controls from tiles (retained within item editors); collapsed additional input fields and manage/compare tools for more room to interact on mobile. [1] `Companion Files/app.js`; [2] `Companion Files/styles.css`.
3. Added browser regression for item override precedence, shared instruments versus independent copies, save/reload and phone layouts. Updated current-state docs and offline cache IDs; preserved Rotation Highlights mechanics. [3] `tests/music0311c_compact_override_test.py`; [4] `service-worker.js`.
4. Moved Holy Water of Murias from the miscellaneous global input into the seven eligible physical equipment slots (+1 each; wings excluded). Added a per-set manual Murias override with auto reset; legacy flat values migrate to that override without double-counting or inventing gear attribution. Shared items and independent copies retain distinct intended behavior. [1] `Companion Files/app.js`; [5] `tests/music0311c_murias_slots_test.py`.

## 0.3.11d — Theta track judgment, missed-note failure and on-deck preview

1. Moved flat timing indicators onto the track and aligned canvas note motion, touch selection and score judgment to one geometry: Perfect when a note is fully enclosed; Great/Good/OK for partial overlaps, with late overlap favored and a modest late scoring premium. Notes visibly leave the board after passing the indicator. [1] `Companion Files/theta-rhythm.js`; [2] `tests/theta0311d_judgment_test.py`.
2. Removed overheat from unmatched/out-of-ring presses; only fully unplayed notes that leave the board raise the miss stack. Preserve five-miss failure, three-consecutive-hit reset, historical miss count, and unrelated skill timing/cooldown rules. [1]; [2]; [3] `tests/theta282_test.py`.
3. Display the next actually scheduled note stationary at the far end before its approach window, without inventing skill uses. Close the chart promptly when its final note resolves. [1]; [2].
4. Bumped visible release and offline caches; updated current Theta guide and current verification notes while leaving Rotation Highlights mechanics, user data and other simulator rules unchanged. [4] `service-worker.js`; [5] `Midir Companion.html`; [6] `Midir-Companion-Doccumentation/features/05-THETA-CONTAINMENT.md`.
