# Midir Companion — Consolidated Changelog

## Companion-55 — Forbidden Alchemist Herb Collection returns
- Restore Herb Collection as its own Rotation Lab page.
- Add eight randomly spawning colored herbs, randomized positions and a persistent counted-herb Storage Chest.
- Keep herbs as quantities only; no special effects or sale mechanics.


## Companion-54 — Erg Break and reforge pity
- Keep reforge odds undisclosed in the UI, apply a normal-Reforge limit-break pity after 2,500 attempts without a limit break.
- Add an Erg Break Simulator for Melodic Puppeteer with B/A/S starting routes, nine tiered taps per rank, rank promotion B50→A30 and A50→S30, S50 completion, variable success probabilities from saved Erg table, escalating secret fail stacks, an assist-potion inventory and shared gold, and a persistent weapon chest.
- Allow transferring owned Reforge Storage Chest weapons into Erg Storage Chest while preserving reforge lines.


## Companion-53 — Storage Chest and Auction House
- Save rolled items with their exact reforge/stim lines; keep in a persistent Storage Chest or list on the Auction House (not both).
- Independently resolve each listing after a random 15–250 subsequent Reforge/Stim attempts and pay fictional gold based on the best eligible line.
- Remove sold items from active listings and require a blocking Auction House sale notification to be acknowledged before further rolls. Completed sales remain visible in sales history.
- Display earned gold, saved collection and pending listings in the simulator; preserve persistent progress across reloads.

## Companion-52 — Reforge roll distribution
- Adjust the normal weighted level RNG so a 1–20 range averages approximately level 7 (expected 7.0017), while lower levels remain more common.
- Preserve Echostone one-line Stims, three-line Reforges, and the existing limit-break chance and ranges.
- This weighting remains a custom simulator choice, not real game odds.

## Companion-51 — Correct simulator item icons
- Corrected swapped assets: the green bottle now represents the Echostone Stimulant (Stim), and the tool-shaped icon represents the Reforging Tool (Reforge). No changes to roll logic.

## Companion-50 — Echostone talent reforges
- Echostone Stim remains a single line with no limit break.
- Add talent-related effects drawn from the 777-row Full Reforge List, grouped by the Echostone page's color/talent descriptions.
- Preserve exclusive color-specific effects, adding shared talent-related lines (including for Silver).
- Per-effect normal level maxima are drawn from source rows. Chance weights remain illustrative.
- Talent mapping is generalized: individual Echostone pages may contain exceptions and should be audited later.

## Companion-49 — Saved wiki reforge tables and one-line Stims
- Extract 777 reforge rows with item eligibility, default level ranges and limit break ranges from the user-saved Reforge/Full List HTML.
- Extract 56 Echostone-exclusive rows with per-color eligibility and level caps from the user-saved Echostone HTML.
- Correct Stimulant rolls to **one** attribute, while retaining **three** for Reforge. Never apply limit breaks to Stims.
- Note that the saved wiki has no Silver-exclusive rows; the exclusive-only simulator correctly does not invent them.
- Keep simulator probability model as user-requested fiction, not game odds.

## Companion-48 — Explosive Vanguard Reforge Simulator (starter pool)
- Removes placeholder Practice Workshop links from Arcana landing pages. Other Arcana pages retain Rotation Crafter, while unique future tools can be designed separately.
- Adds Explosive Vanguard “Reforge Simulator” with the requested tagline, 9 equipment types, grouped weapon subtype dropdown, tool subtype dropdown and five Echostone colors.
- Uses supplied Reforging Tool and Echostone Stimulant artwork, rolls three distinct starter attributes with low-value-weighted RNG. Custom sandbox chance 1/1000 for a limit-break attempt, one exceeding value and full-screen fireworks; no limit breaks on Echostones.
- Important limitation: the full linked wiki reforge and exclusive Echostone tables were not retrievable (403). The embedded pools are explicitly labeled partial starter examples; full item eligibility, exact ranges and rates are not verified. More complete data import remains pending.

## Companion-47 — Skill icon resolution and animation refinement
- Remove the Bard/music overlay skill icon so buff announcements return to text-only presentation.
- Resolve the remaining ambiguous skill icons by selecting the most modern-looking Midir variants for Charge, Counterattack, Natural Shield, and Stomp.
- Remove Recovery from Harmonic Saint.
- Bring melee Arcana closer to the strawman and refine Arcana-specific training animations: forward-facing swords for Elemental Knight, close shield-bash posture for Sacred Guardian, punch/kick motion for Blazing Brawler, forward recoil for Arsenal Gunner, a thrusting spear motion for Explosive Vanguard, no string lines and cross-shaped control bars for Melodic Puppeteer, and keep Forbidden Alchemist focused on projectile output.

## Companion-46 — Complete verified skill artwork mapping
- Remove the large icon from the Harmonic Saint on-screen buff announcement; retain clean center-stage buff text.
- Expand local Midir skill icon mapping across the complete Rotation Crafter and Music simulator drawers and hotbars, including verified fighter `Combo:` name aliases.
- Leave unknown or missing skill art as a neutral icon placeholder; no arbitrary substitutions.

## Companion-45 — In-game style music skill icons
- Add the active Bard skill icon to the center-stage overlay in **Rate isn't a Lie**, matching the in-game presentation more closely.
- Continue using local Midir skill icons where available so the simulator resembles the actual buff pop-up style.

## Companion-44 — Maximum-energy Bard performances
- Keep Bard dance animations continuously intense with repeated leaps, exaggerated movement, arm strumming, kicks and instrument swings until the performance is interrupted.
- Move the music-buff announcement into the middle of the simulator field with contrast for readability, retaining all skill-specific buff lines.
- Respect reduced-motion preferences and preserve Escape, pointer-away and next-skill interruption behavior.

## Companion-43 — Harvest Song included in the buff simulator
- Refine the **Rate isn't a Lie** simulator so **Harvest Song** displays all requested support lines: Gathering Success Rate, Production Success Rate, and Gathering Speed.
- Keep the calculator expanded by default while preserving the ability to collapse it.
- Preserve Escape and pointer-interrupt behavior so users can stop one performance and immediately play another.

## Companion-42 — Rate isn't a Lie
- Add Harmonic Saint's Music Buff Effect calculator (wiki-style inputs and performance tiers) and its Bard hotbar performance simulator.
- Calculator begins expanded and can be collapsed without losing the stored settings.
- Performances are associated with individual skill effects; Escape, clicking elsewhere, or starting a new skill interrupts the current animation without stopping the session.
- Name in the performance banner comes from the Vault character field, or uses “your” when empty.


## Companion-41 — Active talent skill audit
- Add all active skills identified in the supplied Combat, Puppetry, Music, Magic, Fighter, Dual Guns, Alchemy, Lance Combat and Holy Arts category/talent lists to the corresponding Arcana crafter pools, excluding passives and crafting.
- Keep Arcana skills and existing customized cooldowns intact. New unverified cooldowns default to simulation zero (not a game mechanics claim) and can be edited in the builder.
- Use user-matched Midir KartRider Water Balloon condition 598 art for the Kart Bomb Academy card.
- Wiki is the explicit source for skill membership; skills are not assumed to be usable with every selected weapon/race/character.

## Companion-40 — All-Arcana Rotation Crafter expansion
- Fix the Rotation Crafter **Clear rotation** control so it clears the entire planned sequence reliably.
- Add **per-skill customization** inside Build a Rotation, including editable cooldown, action-delay, and charged-skill hold time values. This supports user adjustments such as an Erg-modified Urgent Shot cooldown.
- Expand **Alchemic Sharpshooter** with additional bow skills including Crash Shot, Mirage Missile, Arrow Revolver, Final Shot, and Support Shot.
- Generalize the **Rotation Crafter** so every Arcana now has a themed version using the same hotbar/rotation system with Arcana-appropriate visuals: bow archer, dual swords, staff caster, shield user, pistols, brawler, lance user, hand-cannon alchemist, puppeteer, and Harmonic Saint healer.
- Add a first-pass **Harmonic Saint** party-healing scene that spawns 1–3 random ally targets with health bars when Begin is pressed, then shows healing feedback on relevant skills.
- Preserve hidden research/source tracking for Skill Knowledge while keeping those citations out of the player-facing UI.
- Add **Kart Bomb** coverage to Debuff Academy as a provisional increased-damage-taken source in the library and missing-debuff exercise; a temporary placeholder condition icon is used until a verified Midir icon is mapped.

## Companion-39 — Verified Alchemic Sharpshooter orb gains
- Replace the provisional 25% per-skill orb increments with user-provided primary and secondary element gains: Ignis Plume Fire +36% / secondary +18%, Aqua Volley Water +52% / secondary +26%, Terra Scourge Earth +100% / secondary +62%, Ventus Howl Wind +78% / secondary +39%. Each orb is capped at 100%.
- Let players select a different secondary element for each skill; default Plume to Water, Volley to Fire, Terra to Wind, and Ventus to Earth. Selection persists locally. The grey-until-full orb display shows exact percentages, and existing Golden Time and Tri-Assault consumption rules remain.
- Values originate from prior user-supplied AS mechanics; no assumption about unverified skill activation packets is added.


## Companion-38 — Alchemy orbs and Tri-Assault sequence
- Swap the two Crafter hotbar rows: F1–F12 above 1–=.
- Add four in-session four-step Alchemy Orb meters, grey until full, then Fire red, Water blue, Wind white and Earth brown. For exploratory practice, Ignis Plume, Aqua Volley, Ventus Howl and Terra Scourge each add one to the matching element; Golden Time fills all. These increments are **illustrative trainer assumptions**, not verified exact game orb-generation values.
- Tri-Assault requires full Fire and Water orbs, spends both on activation, automatically animates three shots from one keypress, includes a 750ms pause between shots two and three, and displays brief edge fireworks on shot three. All other skill activations are suppressed until the third shot, and session termination cancels pending shots.
- Retains all Companion-37 features and assets.


## Companion-37 — Drag-and-drop hotbar Rotation Crafter
- Rebuilt AS Rotation Crafter with 1–= and F1–F12 hotbars, draggable skill drawer, drag-to-move/swap, click-to-assign fallback and right-click-to-clear.
- Collapsed rotation builder is empty by default for a new profile. A drafted rotation shows a next-skill cue; without one, free practice is available. Session duration, Begin/Finish and bow animation are consolidated below. Aqua Volley has hold/release charge indication and cooldown inputs are ignored.
- Removed the duplicate Skill Knowledge panel from the AS crafter. Skill reference pages use locally verified exact Midir icon matches when available and retain source evidence in internal reference data rather than in player-facing explanations.
- Existing Vault, collectibles and imported report/award calculations are unchanged.


## Companion-36 — Arcana skill-reference hubs and AS Positioning Lab
- Every Arcana's Rotation Lab now opens on the same **Skill Knowledge** landing structure, showing the Arcana's skills, roles, explanation and provenance. Existing AS Rotation Crafter, DD automaticity, Sacred Guardian Oath Workshop, and other Arcana practices remain accessible through **Available pages** buttons.
- Alchemic Sharpshooter and Dark Diviner skill entries use prior project/user research; February 2026 and July 2025 official Nexon update information is preferred for recently changed AS damage/cooldowns. All unverified exact effects and skills in other Arcanas are explicitly provisional; keep this reference editable in `rotation-reference.js`. Official references: https://www.nexon.com/mabinogi/news/35462/february-quality-of-life-update and https://www.nexon.com/mabinogi/news/28264/arcana-faith-and-fury-update.
- Add a separate AS **Positioning Lab** with 1–15 randomized enemies, placement/removal and drag-to-position controls, draggable character and aiming handle, adjustable firing angle/range, cone spread and line width, and an Attack action that briefly highlights and eliminates affected targets. Restore and randomize controls support repeated experiments. Geometry is intentionally illustrative and not calibrated to in-game Mabinogi hitboxes.
- Retain all current Vault imports, awards, records, Arcana practices, CSS and local storage schema. No Midir exporter changes.
- Verification: JS syntax and headless Chromium in-memory interaction tests across ten Arcana hubs, DD drill, AS crafter, and positioning interactions. Normal file-origin/IndexedDB workflow not re-verified in this release.


## Companion-35 — Compact layout refinement
- Tighten the header, navigation, Vault heading, character selector, form spacing, and report rows without reducing the prominence or changing the styling of the three achievement collectible cards.
- Keep import and milestone entry controls balanced on larger screens and stack cleanly on smaller screens. Maintain full-width saved milestones with Edit and Remove actions.
- Condense saved-report metadata and action rows into clearer responsive layouts, keeping report viewing and removal behavior unchanged.
- No changes to import formats, reward calculations, storage keys, game mechanics, or existing local artwork. Verification: source/JS syntax and package checks; test visually in normal Chrome or Edge as local browser navigation may be restricted in test environments.

## Companion-34 — Vault layout cleanup and right-side menu
- Move The Vault to the far-left position in the main navigation and preserve the requested tab order: **The Vault, Rotation Lab, Debuff Academy, Encounter Study**.
- Replace the old left-side Overview control with a compact **three-line menu icon on the right** of the navigation row. The slide-out panel now opens from the **right side** of the screen and no longer shows “Overview” on the toggle itself.
- Simplify the Vault header by removing the separate **Your Character** card. Character selection is now an inline field at the top of the Vault. A compact **Save** button appears only when the typed name differs from the currently saved tracked character.
- Condense the **Add to Your Vault** controls so report import and backup actions occupy less space, while keeping **My Milestones** beside them. Saved personal milestones now render in their own **full-width** section below, with existing edit and remove controls preserved.
- Keep existing encounter-aware records, debuff evidence, repeat-import behavior and collectible logic unchanged from Companion-33.
- Verification: JavaScript syntax validation plus package assembly checks. Full interactive browser-origin validation still recommended in normal Chrome/Edge.

## Companion-33 — Encounter records, observed debuff contributions, and runtime corrections
- Added pure offline encounter/attempt analysis (`analysis.js`) over actual Midir-41 `midir-companion` v1 payloads. Logical Vertrag 7600→7601 pairs remain one attempt; recognized Gate 2 and Gate 3 boss entities create separate attempts. Verify clears conservatively from the existing explicit evidence. Show fastest **verified boss-attempt** time per encounter rather than conflating a multi-gate recording with dungeon completion. Time-bounded player deaths and all-target hit-group damage are labeled as such, never cast counts or exact boss-only damage.
- Preserve observed **target and player condition intervals, attacker IDs, first-seen/spawn timestamps, skill IDs and grouped damage-hit timestamps** on import. In the Vault, list observed debuff categories per attempt, explain the provisional 10-group reference, and display evidence for selected character. Confirm source via the boss condition attacker entity ID, or infer a likely contributor only when a **unique** player has a recognized compatible skill hit within ±3 seconds of an ownerless condition. Do not give ownership to someone else if the packet has another attacker ID, infer unknown pet owners, or call hit events proven casts.
- Automatic encounter-specific rewards: **Debuff Contributor** for any defensible attributed application, **Quick Setup** for applications up to 10 seconds after recorded boss appearance, and **Reference Coverage Together** when all the currently listed groups were observed at least once. Last award is explicitly **provisional**, not a verified final full-game debuff set or continuous/simultaneous uptime; the complete set awaits user verification. Existing Bri survival collectibles retain their rules.
- Allow repeat-session HTML imports, each with its own Vault entry and its own collectible/reward counting; show **possible repeat** warnings for matching recording signatures. Retain JSON→HTML attachment for older data-only entries. Removal remains per import. These are not cryptographic deduplication guarantees.
- Correct initial language rerender failure caused by a hyphenated `aria-label` DOM dataset property. Restore Academy Flashcards by initializing the active deck IDs and valid icon set from the verified local condition-icon registry. Avoid stacking celebration dialogs on repeated imports. Improve confusing Gate 3 `Human` report label without altering original archived HTML.
- Preserve original graphical per-skill highest-hit fields from the HTML report while minimizing the redundant saved report summary (full original remains in IndexedDB). Restore record-high hit, skill-hit, raw damage-total and damage-taken comparisons where **both reports contain one recognized matching boss encounter and have the same export target scope**; clearly label these as recording-scoped metrics, not confirmed boss-only hits. Keep localStorage profile keys, training modules, local illustrations, user notes, and one rolling changelog unchanged.
- Verification: JS syntax, supplied sample export parsing, simulated Chromium UI navigation and repeated import/flashcard interaction. Full Windows EXE execution and live game verification not performed. Browser storage behavior needs validation in normal supported browser origin. No Midir-41 exporter changes in this release.

## Companion-32 — Overview sidebar closing
- Fix the sidebar Close button disappearing after opening: its static control now remains mounted while recent-training content rerenders in a separate child container.
- The Overview toggle opens and closes the panel. Escape and clicking outside the panel also dismiss it. Sidebar visibility and accessible expanded/hidden state remain synchronized.
- No Vault, awards, report parsing, character records, or Arcana mechanics changed.


**Source audited:** `Midir-Companion-31.zip`. This replaces the **27 historical `RELEASE-*.md` notes** (05–31) in the Companion archive with one maintained document. The application files are otherwise unchanged. Historic features are described by their **latest documented behavior**, with obsolete/failed intermediate fixes removed from the current-feature list. Earlier 01–04 history appears in `README.md`; no separate release notes for those versions were present in the audited archive.

## Current feature inventory

### Offline app, training, and Arcana modules
- Standalone offline HTML/JavaScript companion; local browser data and user-managed backups. Existing Alchemic Sharpshooter keyboard/action practice and spatial scenarios and Dark Diviner automaticity/audio routines remain. Practice supports reflection, not punitive rotation grades or fabricated measured in-game casts. [foundational README, 05–06]
- Ten selectable Arcana pages: Alchemic Sharpshooter, Dark Diviner, Elemental Knight, Harmonic Saint, Sacred Guardian, Explosive Vanguard, Arsenal Gunner, Forbidden Alchemist, Melodic Puppeteer and Blazing Brawler. Non-AS/DD pages include preliminary drills and placeholders rather than fully verified mechanical simulations. [07, 09]
- Sacred Guardian **Oath Workshop** provides guided full defensive setup, community snapshot cascade **F→O→F→O→W→F→O**, Fateweaver 3152 practice, quick/recovery routes, Wool commitment and snapshot inheritance cues. Timing approximations are practice aids; no claim of globally optimal verified in-game formula. [08–09]
- Melodic Puppeteer Cutting Chorus weaving rehearsal, Forbidden Alchemist herb-clicking minigame, and introductory drills for other Arcanas. [07, 09]
- Midir skill/condition artwork bundled locally, with verified ID associations and placeholders where missing. [06, 11–16]

### Debuff Academy
- Debuff reference/learning materials distinguish the three post-April shared status categories: Defense/Protection Decreased, Magic Defense/Magic Protection Decreased and Increased Damage Taken; Death Mark's own indicator remains distinct. Sources do **not** imply uniquely attributed casters or independent stacking. [12]
- Pet-specific condition recognition covers Bunbun/Clover Mark, Foxyquin's Mark, Bone Dragon/Devil's Dash, Purrling/Furious Charge and Ceraunus/Mir Dragon Lightning Debuff. The Lightning icon uses original Midir artwork (`gui_condition_change04_5_0.png`) rather than the earlier user-supplied screenshot. [13–16]
- Distinct Protection Max Decreased / Magic Protection Max Decreased icons for Brionac/Fragarach training; practice treats them as an **inseparable pair**. [14, 18–19]
- Icon flashcards use shuffled non-repeating rounds with optional locally persisted **set-aside / restore** choices. Cards without verified unique artwork remain explanatory entries rather than falsely exact icon cards. The Debuff Academy Flashcards Open action was revised to handle older profiles that lack `academySetAside`. [17, 21, 27]
- “Which debuff is missing?” is an unlimited randomized category/source-choice exercise: 1–3 missing groups, varied present icons, recently repeated scenarios avoided; players choose skill-source icons or labeled placeholders for pets/Brionac. Source mapping accounts for skills that cover several categories and configuration-dependent sources. [18–19]
- Guided debuff lessons and Explore Debuffs show available source skill icon images alongside condition icons. [27]

### Vault, imported Midir reports, and awards
- The **Vault is the default landing view**; Overview is a collapsible sidebar for recent training rather than a separate tab or an element inside Vault. [10, 20, 23, 28]
- Three visually illustrated Bri collectibles: **Giant Boots** (Gate 1 70%/25% Ancient Giant phases), **Bottled Horsepower** (Gate 2 Bronntanas 50% phase), **Halo Badges** (Gate 3 80%/40% halo phases). Calculations require appropriate observed clear, bounded phase/death evidence, and deduplication; confirmed survival adds one, relevant death subtracts one, unverified adds zero. The Gate 1 verifier reads **7600 70%** and **7601 25%** independently. [05, 24–26]
- Celebratory **See Awards** panels toggle open/closed; run links scroll to and highlight corresponding imports. Collectible labels show entity names, not race IDs. Final approved art replaces the *earlier* Giant Boots-with-adventurer image. [24–25]
- The Vault supports imported standalone Midir HTML (including embedded `midir-companion` data), legacy/data-only formats when recognized, archived full HTML and on-page sandboxed report viewing with minimize/switch, open-in-new-tab where permitted, and structured-data inspection. Older data-only imports can attach their original HTML on a matching fingerprint. [05, 22]
- Report removal uses confirmation, removes the archived HTML and associated imported auto-generated milestones, closes its viewer if active, and recalculates collectibles from remaining imports. User-written milestones and unrelated reports persist. [23]
- Character name setting performs case-insensitive **exact-name** matching within imported party reports, filters personal awards/stats and auto-generated milestones to that character, and reports no match instead of choosing a different player. Changing character recalculates derived milestones, not personal notes. [28]
- My Milestones can be added, edited and removed. Achievement Catalog uses earned counts, discovered/unearned states and expandable histories; upcoming unsupported party-debuff awards are marked not yet tracked. [29]
- Current Vault order: collectibles; **Add to Your Vault** (imports and My Milestones together); compact single-row Achievement Catalog above Earned Milestones; on-page report viewer **above** the imported-report list. [30]

### Language support
- English default, Korean and Spanish selectable in app header; choice stored locally. First-pass localization covers major navigation, controls, status/category labels and selected training interfaces. Existing skill names, character names, user text and imported reports are not rewritten. **Full translation of every Arcana explanation is not complete.** [31]

## Superseded / corrected history
- The flashcard shortcut briefly added to Overview in 20 was **removed in 21**; the intended entry is inside Debuff Academy. Later 27 addressed legacy-profile deck initialization. Do not count these as three separate training features.
- The Vault route initially showed Overview despite the Vault tab being selected; this was corrected in 20. Overview was subsequently converted to a sidebar in 28, and recent training is intentionally excluded from the Vault.
- The original 12 fixed missing-debuff scenarios were replaced by an indefinite procedural generator [18→19]. Early flashcard “shuffle” behavior was replaced by randomized-round deck management [17].
- Earlier screenshot-based Lightning Debuff art was superseded by an exact icon file from Midir [15→16].
- Earlier Gate 1 collectible evaluation checked both milestones on 7601; corrected to read 7600 at 70% and 7601 at 25% [26].
- Early standalone reports could only be inspected below other reports or lacked original HTML. The latest viewer appears above the list and supports attached original HTML [22→30].
- Earlier broad achievement list was replaced by owned/unearned gallery and condensed to one row [29→30].
- Final Giant Boots collectible artwork excludes the small adventurer [24→25].

## Audit limits and regression checklist
This is an audit of **27 release notes and the latest packaged application files**, not a claim of interactive browser verification. The notes document JavaScript syntax, file/icon existence and ZIP integrity checks, while multiple versions explicitly lacked full browser interaction tests; button behavior, `file://` storage, embedded HTML in iframes, multiple report switching, character matching and language rerenders should be checked in Chrome/Edge. Continue to treat condition/skill icon mappings as evidence-labeled, report HP phase windows as observational rather than explicit mechanic packets, and damage-hit groups as distinct from skill casts.

For quick local regression: open Vault on fresh/legacy profiles; test Overview sidebar; import a multi-player Midir HTML and set character name; verify three Gate 1 award checks, duplicate import and removal; open/switch/minimize the full report; edit/delete a personal milestone; navigate Debuff Academy → Flashcards → Open; set aside/restore; run several missing-debuff questions with paired protection icons; switch English/Korean/Spanish while staying on the page.

## Historical release trace
| Releases | Consolidated current result |
|---|---|
| Foundational README, 05–09 | Offline base, saved data, AS/DD and eight further Arcana pages, Sacred Guardian Oath Workshop, Arcana route corrections |
| 06, 11–16 | Icon library, post-April debuff categories, pet and protection icons; Midir Lightning image supersedes screenshot |
| 17–19, 21, 27 | Randomized flashcard deck and unlimited missing-debuff drills, inside-Academy navigation, legacy-profile handling and lesson art |
| 10, 20, 22–25 | Vault layout route, collectible pictures and panels, original HTML viewing, report removal |
| 26–28 | Gate 1 award correction, character attribution, Vault landing and Overview sidebar |
| 29–30 | Editable milestones, personalized compact achievement gallery and revised Vault order |
| 31 | English/Korean/Spanish first-pass localization |
