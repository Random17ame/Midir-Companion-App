# Midir Companion — Consolidated Changelog

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
