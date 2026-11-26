# Midir Companion 0.3.15 Draft

**Documentation:** [Current features](Midir-Companion-Documentation/CURRENT-FEATURES.md) · [Documentation index](Midir-Companion-Documentation/README.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.15.md)


## Release 0.3.15 — Bandit Hunt Exploration

- Explore connected 5×5 regions, unlock neighboring areas from resolved edge locations, and revisit previous regions without respawning prizes.
- Permanent cleared/stolen map locations, responsive encounter dialog, concise map navigation and collapsible help/records.
- Misses forfeit unclaimed prizes and deduct limited current-hunt earnings; prior chest balance stays protected. Existing reaction mechanics and shared economy remain.
- [Bandit Hunt guide](Midir-Companion-Documentation/features/13-POSITIONING-AND-CHASE.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.15.md).

## Release 0.3.14a — Mobile Presentation Refinement

- Compact shared mobile header, navigation, Arcana cards, Vault quick tools and side menu; less repeated text, strategy guidance below tool links, expandable report storage guidance.
- Fix Theta currency header overflow without clipping the page. Keep existing local scrolling, simulator controls and calculator behavior.
- Responsive route audit and current editor/gameplay regressions at narrow and desktop widths. [Release notes](Midir-Companion-Documentation/RELEASE-0.3.14A.md).

## Release 0.3.14 — Sacred Guardian Echostone Planning

- Edit Echostones alongside Oath thresholds. Infer minimum rolls above 2750, confirm initial equipment without adding stats twice, then apply only equipment differences. Reset or complete a new player-stat setup to reconfirm.
- Compare entered alternative rolls across three distinct colors, with reserved stones and no loss of an existing Oath benefit. Display whole numbers; retain fractional defensive values internally.
- [Oath guide](Midir-Companion-Documentation/features/08-SACRED-GUARDIAN-OATH.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.14.md).

## Release 0.3.13b — Sacred Guardian Stat-Cap Recommendations

- Enter observed STR, WILL and INT alongside defensive stats; ordinary gains use shared headroom below 2450. The assumed unified hard cap is 2750, not an ordinary-buff target.
- Separate useful/potential, uncertain/optional and confirmed Oath-capped buffs. Direct defensive bonuses remain independent of primary stat limits.
- [Oath guide](Midir-Companion-Documentation/features/08-SACRED-GUARDIAN-OATH.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.13B.md).

## Release 0.3.13a — Sacred Guardian Checklist Refinement

- Remove separate title bonuses and redundant buff fine-tuning panel.
- Edit four Enduring Melody defensive stats directly or link to the Music Buff Calculator, with navigation and return.
- Override Ophelia’s Tears cooldown to correct accidental checklist changes.
- [Oath guide](Midir-Companion-Documentation/features/08-SACRED-GUARDIAN-OATH.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.13A.md).

## Release 0.3.13 — Native Offline Session ZIP Importing

- Import Midir 49.a ZIP bundles directly through the existing Vault chooser or drag-and-drop. Supports STORE, raw DEFLATE and older manifest-free HTML ZIPs, with no network dependency.
- Validate bundle manifests, safe paths, CRC-32, optional SHA-256 and metadata agreement before saving each HTML report. Preserve original interactive reports and their existing analysis.
- Identify recordings across individual and batch imports; skip exact duplicates, record scope variants and revisions, and prefer a strictly broader scope without adding another recording.
- Keep chosen ZIP and identified HTML reports viewable in the Archive; older compact-only imports retain their previous recovery workflow. Batch progress and separate result counts are shown beside the import controls.
- [Import guide](Midir-Companion-Documentation/features/01-VAULT-AND-IMPORTS.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.13.md).

## Release 0.3.12r — Grade-Colored Rune Inventory Borders

- **Revision history:** [0.3.12l baseline](Midir-Companion-Documentation/RELEASE-0.3.12L.md) · [0.3.12m visual polish](Midir-Companion-Documentation/RELEASE-0.3.12M.md) · [0.3.12n shared herb sprites](Midir-Companion-Documentation/RELEASE-0.3.12N.md) · [0.3.12o Ogham layout](Midir-Companion-Documentation/RELEASE-0.3.12O.md) · [0.3.12p artwork correction](Midir-Companion-Documentation/RELEASE-0.3.12P.md) · [0.3.12q compact Rune inventory](Midir-Companion-Documentation/RELEASE-0.3.12Q.md) · [0.3.12r grade-colored Rune inventory borders](Midir-Companion-Documentation/RELEASE-0.3.12R.md).
- **Current layout:** compact scrollable inventories beside the pentagon on desktop; mobile stacked; inline Set B chooser below both comparison rows; cleaner equipped socket frames.
- **Current herbs:** shared sprites across gathering and EV; static White Herb and animated Golden Herb, with unchanged balances.

- **Visual polish (November 25):** separate Rune result cards, icon lock toggles, gold text at 90–100% of an effect’s maximum level, centered 26-stone gallery, and a single bordered current-item panel beside Reforge results. Ten new stone graphics are provisional; the 16 game-reference images remain unchanged.

- **Reroll UX and chest:** Random read-only effect lines, lock toggles, own per-rune attempt/spending ledger, and a confirmed **Disassemble** practice refund. The existing full Storage Chest now appears during Rune rerolls with updated Gold/Herb balances. Removed the player-facing JSON importer while preserving old imported profile data.

- **Inventory containers:** Create unlabeled movable rune groups and drag/tap runes into or out of them. Double-click/tap the outline to optionally name a group; its focus/hover X dissolves the group without deleting members. Both tracked and simulated inventories remain visible and independent; owned rune IDs and equipped/compared references are retained.
- **One EV Item Type selector:** Choose Rune, Echostone, or conventional equipment; the three redundant simulator-mode buttons are gone. Rune selection uses the existing 26-stone visual gallery.
- **Clarified reroll economy:** Unlocked rerolls cost **5,000 Gold only**, with herbs added only for locked lines and prices shown beside the roll button. No Arcana dropdown for Rune rerolls: both rune inventories are global, while each Arcana retains independent equipped runes and its own comparison set.
- Compact effect editing shows each selected level's bonus below its field. [Ogham guide](Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md) · [Release notes](Midir-Companion-Documentation/RELEASE-0.3.12Q.md).

## Release 0.3.12k — Rune organization, simulated collection and equip comparison

- **Two visible rune collections:** owned/manual runes and separately saved practice-reroll results. Both equip into the same five Arcana sockets; simulated runes can be loaded into the EV Ogham reroll workspace for further rolls. Saving a reroll creates a distinct rune; explicitly updating a loaded simulated rune is required to overwrite the saved result.
- **Persistent organization:** favorite stars, custom group labels, saved manual up/down ordering and sorting by favorites, grade, word, group or newest. Effect-aware search (e.g. **Magnum**) brings matching runes first without hiding others.
- **Equipped Effects:** sums like-for-like effect IDs and units across the five active sockets, listing completed synergies separately. Reconstructed level values remain provisional and are not game damage predictions.
- **Compare 5-Rune Sets:** Set A always reflects the equipped Arcana loadout. Set B starts as a copy of A and can replace, remove or reposition runes from either collection, including shared instances; Set B never equips automatically. Differences in sockets, attribute totals and synergies are identified, with a one-click reset to equipped.
- All records persist within existing Companion profiles/backups. See the [current Ogham guide](Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md) and [0.3.12k release record](Midir-Companion-Documentation/RELEASE-0.3.12K.md).

## Release 0.3.12d — Litany equipment roll corrections (2026-11-24)

- Murias Water is **Healing Potency only**: on/off and an integer **1–10%** selection; former flat Healing and Party Healing water fields were removed.
- Each general equipment Prefix/Suffix enchant has **a name, whole-number flat Healing, and whole-number Magic Attack**. Unsupported direct Party Healing and potency fields were removed. Magic Attack is recorded separately and does not silently change Recovery/Dissonance. The *named* Murias relic suffix **Gift** retains its own documented +5% potency effect; custom relic enchants use the same whole-number Healing/Magic Attack fields.
- Equipment board: **Gloves / Boots / Robe** complete the 3×3, with **Echostone directly beneath Robe**. Wand/offhand remain adjacent.
- Numeric equipment edits use whole-number inputs; EV reforge math, grade presets and final calculated recovery may still have fractional values. The independent Dissonance calibration retains its precision.
- Litany saved-state schema v6 strips unsupported older water/enchant rolls while retaining valid names, Healing rolls, reforges, grade and enhancement settings. Music, combat, Rotation Highlights, leaderboard comparisons, profiles and all unrelated features are unchanged.

## Release 0.3.12c — Music Buff calculator correction and real 46.b import verification

- **Music instrument special upgrades** now affect Battlefield Overture and Vivace outputs only, following the February 2026 instrument-exclusive upgrade rule. Enduring Melody, March Song, Harvest Song and Lullaby no longer receive this instrument-specific multiplier; their ordinary music buff effect and other gear bonuses are unchanged.
- **Polyphony** instrument Prefix enchant updated from +4–7 to **+6–9** and **Tempo** Suffix from +2–3 to **+4–5** under September 2026 Renovation Season 8. Existing physical instrument enchant rolls migrate **+2 once** per item; manual enchant overrides are preserved. Source: Nexon Renovation Season 8 patch notes.
- **Other buff sources & settings** and **Manage sets** stay expanded as the editor refreshes after changes. The existing item modal scroll-preservation behavior remains.
- Actual Midir-46.b Alchemic Sharpshooter leaderboard comparison file now imports and displays correctly: five players, 244 boss hit events, 25 separate observed-use markers, 30s totals and skill summaries reconciled; current skill names are restored from the 46.b `skills[].id/name` metadata, with separate original-30s and within-30s 10s skill breakdowns. Verified 10s Within Exported 30s remains distinct from full-session bests and 60s, with no change to combat reports.
- Desktop/mobile browser tests, both import formats, localization, other calculators, Arcana, Rotation Highlights, archives and offline shell checked. See `Midir-Companion-Documentation/VERIFICATION.md`.

## Release 0.3.12b — Imported-report orientation and 30-second leaderboard comparisons

- Mobile imported-report reader follows physical device rotation on Android and iOS when system auto-rotate is enabled. Responsive full-screen viewport, sandboxed chart resize, zoom/scroll preservation, and compact landscape toolbar; no report reload or programmatic OS orientation lock.
- Independently identifies 46.b `script#burst-data` HTML and presents up to eight different 30-second boss-only timelines. Computes the greatest **observed** rolling 10-second hit damage within each player's selected 30-second window, with skill breakdown and separately marked observed uses. Not a full session, all-time 10s, or 60s result.
- Comparison records are stored independently of normal combat reports, Vault awards and achievements, and included in profile backup/restore. Real-world 46.b schema compatibility awaits a genuine `burst-data` sample (the supplied test export is a standard `script#data` report).
- Full standard-report import, SG/Harmonic Saint/music, profiles, localization, and offline shell retained.

## Release 0.3.12a — Harmonic Saint Spirit Weapon and Murias Relic refinements

- **Pulse of Purification** is a fixed +20% boost with a checkbox only; **Amulet** is an integer **Healing +0–12** selector with no Party Healing or percentage input.
- **Dark Erg** is a Healing Wand equipment enhancement rather than a separate general boost. Its Lv. 1–50 dropdown appears **only on an equipped S50 Erg Healing Wand**. The Lv. 50 endpoint is +25% Healing Potency; intermediate defaults and custom overrides are marked as assumptions in the source documentation.
- **Relics** is one compact card opening three independent Murias Relic slots, each with an enabled switch, a restored-effect rank (0–10), and editable Prefix and Suffix enchant names. Echoes of Salvation adds 1–10% of Party Healing to **its own healing**; Pulse of Purification and Pall of Ruination add +0.5–5s to **their respective skill durations**. Named Murias relic enchants include the healing-related Gift suffix.
- **Spirit Weapon** opens Attack, Exclusive, and Awakening augment trees using names inspected from the supplied UI video. Normal augments have Lv. 0–5; the three ultimates have Lv. 0–1. Spirit Training/Attunement/Control affect their distinct recovery channels; timed Spirit Healing Wand Awakening grants **+10%** Healing/Party Healing, with **+3% per Awakening Buff Enhancement level** (up to +25%). Conditional exclusive effects are not treated as always-on healing.
- English, Korean and Spanish labels, hover help, profile migration, pinned results and equipment/editor scroll preservation remain supported. Updated documentation and `service-worker.js` cache version are included. No changes to SG Oath, the music buff simulator, combat importer, Rotation Highlights, boss/Arcana logic, or achievements.


## Release 0.3.12 — Compact SG and Harmonic Saint boost cards

- Sacred Guardian Oath Max and Emergency Oath now show **Little Fury Sword Relic, Ophelia’s Tears and Alban Knights Emblem** as checkbox + icon + Edit cards beside the existing available buffs. Editing ranks, rune levels and emergency equipment happens in compact dialogs; the relic remembers its previous rank when unchecked, the persona keeps its existing 5-minute duration and shared cooldown, and the emergency emblem is still treated as *already equipped*, not a permitted combat swap.
- Harmonic Saint’s **Resonant Litany / Dissonance Lab** boost controls now use the same compact Oath-buff card design. Configured Healing/Party Healing, potency and direct Dissonance values appear on the card; the full editing controls remain behind **Edit**.
- Updated **English, Korean and Spanish** UI strings for the new controls and Spanish Litany field labels/tooltips. The separate Healing and Party Healing calculations, Soul wand bonuses, S Erg configuration, Murias Water, Healing set, Echostone precedence, profiles and all combat analysis remain unchanged. Full calculator details are in [`Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md`](Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md).

**Run:** Extract the ZIP and open `Midir Companion.html` locally. For GitHub Pages publish the repository root and allow the updated service worker to refresh cached application assets. This is a complete cumulative source release.

An offline-capable Mabinogi companion for analyzing compatible combat reports, tracking achievements, preparing characters, and practicing Arcana encounters and minigames. Earlier version 0.3.11i prevented the Music Calculator gear editor from jumping to the top after changing equipment values; it retains the one-line Blue Echostone equipment-slot support while retaining the 0.3.11f Vertrag shop and Theta Thunderblight scheduling changes. Earlier time-trial, mobile and Music Calculator changes are preserved. English, Korean, and Spanish interface support is retained. AI was used in developing this application.

The **Harmonic Saint Resonant Litany / Dissonance Lab** includes compact Healing/Party Healing outputs, Music-style equipment slots, Healing Enhancement points, and Nightbringer/Soul wand quality and Erg selection. See the [feature documentation](Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md). The existing music and combat calculators are unchanged.

## Launch

- **Desktop (offline):** Extract the entire package and open `Midir Companion.html` in Chrome or Edge. Keep the assets in `Companion Files/` beside the launcher.
- **Mobile and web:** Publish the **contents of this application directory** to a static HTTPS host such as GitHub Pages. Open `index.html` (the site root), then use the browser's **Add to Home Screen / Install App** option. The app shell can work offline after its assets have been cached; first-time visits to uncached assets still require connectivity.
- **Settings and imports:** The Vault is available by default. Enable **See Secret Sauce** in Settings to reveal report import and advanced analysis controls.

**Ogham Rune Inventory (0.3.12i draft):** Add real owned runes, edit grade and attribute lines, equip five slots per Arcana, and check all 30 recipes. The EV Reforge Simulator adds an independent Ogham reroll mode; it never alters owned items. See [Ogham guide](Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md).

## Data and privacy

Imports, achievements, and profiles are saved locally in your browser. GitHub Pages does **not** store or synchronize user profiles or combat reports. Back up your full profile periodically and retain original combat exports; clearing site/browser storage can erase local data. A different browser, device, domain, or file origin has separate storage. Never commit personal reports or backups to your public repository.

## Documentation

The current feature guides, source references, verification limits, and historical release log are maintained in one place:

- **[Documentation home](Midir-Companion-Documentation/README.md)**
- [Ogham Rune Inventory & EV Rerolls](Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md)
- [Feature map and 22 feature guides](Midir-Companion-Documentation/CURRENT-FEATURES.md)
- [Architecture, imports, backup, and storage](Midir-Companion-Documentation/COMPANION-REFERENCE.md)
- [Current verification limits](Midir-Companion-Documentation/VERIFICATION.md)
- [Rotation skill cooldown and shape inventory](Midir-Companion-Documentation/ROTATION-SKILL-RULES-INVENTORY.md)
- [Historical changelog](Midir-Companion-Documentation/CHANGELOG.md)

Source code and art live under `Companion Files/`. The accompanying `tests/` directory contains development regression tests and fixtures rather than required website resources.

## Notes

Midir Companion is independent of the Midir combat logger and does not capture live game traffic. Minigame resource costs, simulated damage and economy models are practice tools, not verified Mabinogi combat calculations. Browser storage capacity and large-report import memory use depend on the device and browser.


### 0.3.11i — Gear editor stability

The Music Calculator equipment editor now maintains its scroll position and numeric field focus when live calculations refresh. No music formula or saved-profile format changed in this patch.

### 0.3.11h — Blue Echostone

The center-right equipment cell supports one Blue Echostone reforge, with no enchants, Murias Water, grade or instrument upgrades. A matching Echostone reforge replaces same-name ordinary gear contributions only when its level exceeds each individual matching gear level. The equipment system migrates existing sets to an empty Echostone slot.

### 0.3.11g — Equipment arrangement

The equipment board now shows Accessory 1 / Hat / Accessory 2; Instrument / Body / Blue Echostone; Glove / Boot / Wing. The change was visual only at that version.

### 0.3.11f — Vertrag shop and Theta priority

Vertrag awards Training Points through play and successful clears, with a shop delivering Special Upgrade stones, Erg Unlock Assist Potions and Dazzling Reforging Tools to existing shared inventories. Its bouncing setup prompt stays inside the playfield. Theta schedules Thunderblight maintenance ahead of competing Thunder casts, including the S50 variant. Actual-phone testing remains a release follow-up.

### 0.3.11e prior release

Vertrag Time Trial is now a race to defeat all four giants in the shortest elapsed time, not a countdown. The old selectable 60–180s timer is removed from setup, and the elapsed clock keeps running until all giants fall, the player dies, or the player ends the run. Only successful clears create a new fastest record, grouped by stomp configuration and defense tier; older countdown-trial records remain preserved but are labeled as unverified legacy times. Giant-attached remaining-health strips now start full and drain to empty, and render **above arena effects outside the circular ground clip** so the lower giants' bars are visible when their giants are in frame. No separate four-giant progress HUD was added. Gameplay, defense rules, Theta, music equipment and Rotation Highlights are otherwise unchanged.

### 0.3.11d prior release

Theta's flat target rings now sit on the playable highway. Perfect requires the entire elliptical note inside the target, with Great / Good / OK for partial overlaps. Late partial overlaps outrank comparable early overlaps; late non-Perfect notes also receive a small score preference. Empty presses do not count as misses. A note becomes a miss only after falling past the bottom edge; five accumulated misses end a run, while three consecutive successful judgments clear the active miss stack. The next real scheduled note remains on deck at the far end until it enters its approach, with no fabricated activations. Rhythm cooldowns, skills, saved-state keys, low-cost mobile rendering and Rotation Highlights rules remain unchanged.

### 0.3.11c prior release

The Music Calculator has an optional **manual enchant subtotal override on each physical equipment item**. Leave the item value blank for its automatic Prefix/Suffix total, or reset with **Use this item’s enchants**. The existing **overall Enchant Effects override for the active set** retains final precedence. Slot-specific reforges, grade and upgrades, and named equipment combination effects remain separate and are never overridden by an enchant entry.

The calculator puts the live Normal / Excellent / Inspiring buff output first and keeps it visible during scrolling. The slot editor has a pinned live preview; compact 3×3 equipment tiles remove redundant Copy/New shortcuts (still accessible inside an item editor). Extra source fields and set management/comparison are available in collapsible sections. No changes were made to Theta gameplay or Rotation Highlights mechanics in 0.3.11c.

### 0.3.11b prior release

This historical 0.3.11b release retained 0.3.11a EV onboarding, equipment sets and Theta performance updates, and added:
- Music buff equipment board: tap any of eight slots to configure physical items, including their enchantments, three reforge lines with simulator slot eligibility and limit-break caps, and slot-specific set effects.
- Same-name combination bonuses use the highest active value; Battlefield Overture Seraphic +5% overrides Troubadour +3% without canceling Troubadour Enduring Melody +3%.
- Seraphic gloves, Troubadour pieces, and Special Ethereal Chiffon Wings effects; instrument-only grade/upgrade settings. Duration and Fantastic Chorus effects intentionally omitted.

The previous 0.3.11a changes also include:
- EV Tower Defense final tutorial confirmation inside the Base Manager so Wave 1 is reachable without dismissing an obstructing drawer.
- Music buff sets: eight equipment slots with individual Prefix/Suffix enchants and up to three reforge lines each; reusable physical equipment can be shared between sets or independently copied for alternate accessories, boots, gloves and instruments. Live set comparison, per-set enchant override, and controlled migration of old flat reforges are included. March Song mount speed is removed from the calculator; Enduring Melody Defense reforge is added.
- Subject Theta: Containment mobile rendering performance mode (automatic on touch/small screens), optional full quality, and preserved input/timing logic. Physical-phone performance still needs confirmation.

Follow [current verification notes](Midir-Companion-Documentation/VERIFICATION.md) before deployment. The planned Rotation Highlights research remains separate and unchanged.

### Harmonic Saint Litany preview (0.3.11i source extension)

**Equipment draft v4:** the Healing Wand editor now owns Type, Grade, Special Upgrade, and Erg. A Shield/Spellbook offhand slot sits beside it; the wand no longer contributes Healing-set points. SG Oath-style boost buttons and a header Reset button preserve the pinned result strip and modal editing scroll. See `Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md`.


The Harmonic Saint Arcana hub includes a **draft** Resonant Litany / Dissonance Lab beside Rate Isn't a Lie. EV-backed Healing/Party Healing reforges, independent recovery, Echostone Party Healing with accessory non-stacking, and a manual per-stack Dissonance calibration are available. The recovery-to-Dissonance scenario formula is **not validated**. See `Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md`.


### Ogham 0.3.12f: shared practice economy

Ogham rerolls consume Gold from the existing Reforge Storage Chest and a **Companion-only herbal recipe** from Herb Collection. Unlike real Ogham Fragment/Thread materials, herb spending is an intentional practice economy. Validated offline effect-data JSON can be imported, but **the bundled starter effects are incomplete and must not be used as exact reroll odds**. Details: `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md`.

### Ogham 0.3.12i: Game-inspired rune stones, visual selection and pentagon equipment

The bundled offline effects catalog now lists all 97 names and published bonus endpoints from the Nexon NA Arcana Part 1 patch. Equipment and reroll editors show the selected **Lv. 1–10 or Lv. 1–20** and corresponding bonus value. Intermediate values are reconstructed from printed endpoints, not a verified Prilus `Values` dump; import of directly verified source values still takes priority. Owned rune stones now appear on a pentagonal 5-socket board with tap/drag equipping. The Add Rune action opens a 26-word tile gallery; choose the stone visually, then customize its grade and effect lines. Sixteen confidently labeled game icon shapes are clipped from a user-provided screenshot, while ten still use centered historical glyphs until clear game references are supplied. The selection and editing step does not add a rune until Save; Cancel discards the draft. **Tap an occupied socket once for rune details; tap that same socket again to unequip** (no additional X button). See `features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md` and `features/23-OGHAM-EFFECT-LEVELS.md`.
