# Midir Companion 0.3.13 Draft — Documentation

This is the **current-state** documentation for the Midir Companion 0.3.13 Draft application, maintained as a description of the current application behavior.

This documentation folder is part of the GitHub repository, alongside the application files and root `README.md`. Feature guides document current behavior; release notes and the historical changelog remain inside this folder.

## Start here

- [Ogham Rune Inventory and EV Reroll Simulator](features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md)
- [Ogham effect levels](features/23-OGHAM-EFFECT-LEVELS.md)
- [Current feature map — all 23 feature guides](CURRENT-FEATURES.md)
- [Architecture, import and save reference](COMPANION-REFERENCE.md)
- [Design and verification principles](DESIGN-AND-TESTING-PRINCIPLES.md)
- [Current verification limits](VERIFICATION.md)
- [Rotation Highlights cooldown and skill-shape inventory](ROTATION-SKILL-RULES-INVENTORY.md)
- [Historical changelog](CHANGELOG.md)

## Current release: 0.3.13 Draft

**Native session ZIP importing:** Midir 49.a universal HTML bundles, legacy HTML ZIPs, offline integrity checks, stable recording identity, original interactive HTML retention, and consolidated results. [Vault guide](features/01-VAULT-AND-IMPORTS.md) · [release](RELEASE-0.3.13.md).

**Rune simulator (cumulative):** Bordered result cards, icon-only locks, gold high rolls, centered local stone art and a prominent Reforge item panel.  One EV Item Type selector, automatically rolled (read-only) effect lines, Gold-only zero-lock pricing, the **same live Storage Chest** as ordinary Reforges, and per-rune reroll/spending ledgers with confirmation-based Disassemble refunds. The catalog importer is no longer visible in player UI. [Ogham guide](features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md); [release](RELEASE-0.3.12R.md).

**Ogham inventory and comparisons:** Desktop inventories sit beside the equipped board; mobile stacks them below. The Set B chooser appears inline beneath the comparison rows, and equipped sockets omit the redundant inner frame. Awakening Level now supports **0–50** per Arcana, with the same five socket unlocks at 1/5/10/15/20 and no additional bonus above 20. Two distinct visible collections for tracked and simulated runes; both can equip into the current Arcana's five sockets. Persistent favorite, group, manual order, multiple sorts and effect-aware searches keep nonmatches visible. Equipped Effects displays combined attribute totals. Compare Sets always uses the live equipped loadout as Set A and initializes Set B from A; B can share rune IDs, change slots and show numeric/synergy differences without applying equipment. [Current Ogham guide](features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md); [release details](RELEASE-0.3.12K.md).

**Shared herb artwork:** The same eight gathering sprites appear in the Storage Chest and Rune cost, spending and refund displays. White Herb is static (`white.png`); Golden Herb is animated (`golden.gif`). See [Herb Collection](features/14-HERB-COLLECTION.md).

**Ogham rune selection:** Add Rune opens a 26-word visual gallery rather than a dropdown. The 16 screenshot-identifiable words use local cropped stone silhouettes with their in-game slanted marks; the other ten use centered provisional local stone PNGs. Selecting a tile opens grade/effect editing, and Save is required to add the rune; Cancel leaves inventory intact. See [0.3.12i release notes](RELEASE-0.3.12I.md).

**Ogham UI and effects:** A game-inspired five-socket pentagon and visual rune tiles support desktop drag-and-drop or tap-to-equip. On occupied sockets, the first tap shows rune details and a second tap unequips; 97 Ogham effects have selectable discrete levels. Intermediate bonuses reconstructed from published endpoints remain provisional pending Prilus source values. See [Ogham inventory](features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md), [effect levels](features/23-OGHAM-EFFECT-LEVELS.md), and [0.3.12g release notes](RELEASE-0.3.12G.md).

**Historical 0.3.12e Ogham Draft:** Introduced the inventory, Arcana five-slot equipment and 30 recipes; the old separate Rune mode is now replaced by the single EV Item Type selector. [Ogham guide](features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md).

**Litany equipment correction:** Murias Water is exclusively a 1–10% whole-number Healing Potency roll; general enchant lines supply whole-number Healing and Magic Attack, not Party Healing/potency. Robe ends the 3×3 grid and Echostone sits below it. Schema-v6 saves discard former unsupported fields without dropping valid equipment selections. See [Harmonic Saint](features/20-HARMONIC-SAINT-LITANY-DRAFT.md).

**Music:** Instrument Polyphony +6–9 and Tempo +4–5; instrument-exclusive upgrade applies to BFO/Vivace only; expanded buff sources and sets survive edits. See [Music and Puppeteer](features/12-MUSIC-AND-PUPPETEER.md).

**Leaderboard:** A real Midir-46.b Alchemic Sharpshooter comparison import has now been tested for five players, 244 exact hit events, 25 independent use markers, 30s totals, per-skill names and bounded best-10s windows. See [Leaderboard Comparisons](features/21-LEADERBOARD-BURST-COMPARISONS.md).

**New:** [30-second Personal Bests comparison imports and mobile report orientation](features/21-LEADERBOARD-BURST-COMPARISONS.md). Full-session analysis remains independent.

The Harmonic Saint Litany Lab adds three Murias Relic effect/enchant slots, video-sourced Spirit Weapon augment trees, fixed Pulse, Healing-only Amulet, and S50-conditional Dark Erg in the wand slot. Full mechanics, source status and UI behavior are documented in the [Harmonic Saint guide](features/20-HARMONIC-SAINT-LITANY-DRAFT.md). The prior release also added SG and Litany compact cards.

Resonant Litany / Dissonance Lab is documented in [Harmonic Saint guide](features/20-HARMONIC-SAINT-LITANY-DRAFT.md). The **boost cards** now match the SG Oath Maxing visual pattern with icon, checkbox, compact values and Edit action. Sacred Guardian’s **relic, Ophelia’s Tears, and Alban Knights Emblem** were moved from an oversized equipment/persona panel into the same Available buffs grid, with their rank, timer and rune/emergency controls preserved behind Edit. UI vocabulary is updated for English, Korean and Spanish. See the [SG guide](features/08-SACRED-GUARDIAN-OATH.md) and [language guide](features/19-LANGUAGE-SUPPORT.md).

## Release history and change records

- [0.3.13 — Native offline session ZIP importing](RELEASE-0.3.13.md)
- [0.3.12r — Grade-colored Rune inventory borders](RELEASE-0.3.12R.md)

- [0.3.12q — Compact, scrollable Rune inventories](RELEASE-0.3.12Q.md)
- [0.3.12p — White/Golden Herb artwork correction and cumulative release](RELEASE-0.3.12P.md)
- [0.3.12o — Ogham inventory layout and socket refinement](RELEASE-0.3.12O.md)
- [0.3.12n — shared herb sprites](RELEASE-0.3.12N.md)
- [0.3.12m — Rune and Reforge visual polish](RELEASE-0.3.12M.md)
- [0.3.12l — compact rune editor, movable group boxes and unified EV Item Type](RELEASE-0.3.12L.md)

- [0.3.12k — persistent rune organization, simulated collection and live equipped comparison](RELEASE-0.3.12K.md)

- [0.3.12i — visual rune picker and game-inspired stone artwork](RELEASE-0.3.12I.md)

- [0.3.12h — Ogham glyph centering and optical sizing](RELEASE-0.3.12H.md)

- [0.3.12g — Ogham pentagon board and discrete effect levels](RELEASE-0.3.12G.md)
- [0.3.12e — Ogham tracker and EV reroll draft](RELEASE-0.3.12E.md)
- [0.3.12c — Music Calculator and leaderboard compatibility](RELEASE-0.3.12C.md)
- [0.3.12a — Harmonic Saint and Murias improvements](RELEASE-0.3.12A.md)
- [Complete numbered-source change history](CHANGELOG.md)

Earlier release changes are retained in the cumulative changelog and feature guides; standalone notes should remain in this documentation folder, not the application root.

## Run and publish

For local desktop use, extract the full application together and open `Midir Companion.html` in Chrome/Edge. For mobile/home-screen installation, host the contents of the application folder at the root of an HTTPS GitHub Pages site; GitHub Pages serves `index.html`. The manifest and service worker provide an offline-capable app shell after resources are cached. Imported reports and player profiles live in **local browser storage**, not on GitHub or a shared server.

The Companion is an independent training and analysis application. It does not capture live gameplay or authenticate Mabinogi accounts. Simulated economy rates and training damage models are not official game data.

**Data safety:** Export full-profile backups regularly, retain original combat-report exports, and do not assume mobile and desktop saves synchronize. Different browser origins store separate profiles. AI was used in developing the application.

## Next development phase

The [Rotation Highlights next-chat handoff](ROTATION-HIGHLIGHTS-NEXT-CHAT-HANDOFF.md) describes the skill-cooldown, shape and activation-detection research plan. This is forward planning, separate from the implemented 0.3.11i application.

**0.3.11a historical release:** [Hotfix release and tests](HOTFIX-0311A-RELEASE-AND-TESTS.md).  **0.3.11b release:** [Equipment editor and set-bonus changes](HOTFIX-0311B-EQUIPMENT-EDITOR-AND-TESTS.md). **0.3.11c release:** [Compact calculator and manual slot overrides](HOTFIX-0311C-COMPACT-MUSIC-CALCULATOR.md). **0.3.11d release:** [Theta judgment and on-deck notes](HOTFIX-0311D-THETA-TIMING.md).

### Previous milestone: 0.3.11i

The Music Calculator gear editor preserves internal scrolling and numeric focus while live results update. The preceding updates added the Blue Echostone slot (0.3.11h), nine-cell equipment arrangement (0.3.11g), Vertrag supply shop and Thunderblight-priority Theta scheduling (0.3.11f), and the earlier training and calculator improvements. See the [historical changelog](CHANGELOG.md) for version-specific source references.

## New import evidence and mobile auto-rotation

See [`features/21-LEADERBOARD-BURST-COMPARISONS.md`](features/21-LEADERBOARD-BURST-COMPARISONS.md) for independent 30-second boss comparison imports, partial-window 10s observations and schema limits. The mobile full-screen reader follows device orientation when OS rotation is enabled, without forcing rotation.
