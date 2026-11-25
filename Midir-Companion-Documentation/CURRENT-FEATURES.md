# Current feature map

**Version:** 0.3.13 (November 25 cumulative revision). All linked guides describe current implemented behavior; see the changelog for history.

**Harmonic Saint Litany (current):** locale-aware Recovery/Dissonance calculator with corrected whole-number enchant and Murias rolls, a Robe-complete 3×3 equipment board, Echostone below, independent boosts, grade/Erg selectors and pinned output. See [`features/20-HARMONIC-SAINT-LITANY-DRAFT.md`](features/20-HARMONIC-SAINT-LITANY-DRAFT.md).

| Feature | What it does | Guide |
|---|---|---|
| Ogham Rune Inventory & EV Rerolls | Visual 26-stone picker (16 screenshot-matched icons, 10 provisional local images), compact, bounded tracked + simulated rune collections; favorites/movable visual containers/manual sort and effect search; 5-slot per-Arcana loadouts with Awakening Level 0–50 (slots still unlock at 1/5/10/15/20), equipped effect totals and Set A (equipped) vs Set B comparison; 30 recipes/grade points; EV Item Type Rune reroll practice (Gold-only with zero locks), live shared Storage Chest, random read-only effect lines, per-rune reroll/spending histories and confirmed Disassemble refunds. | [Read](features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md) |
| Vault and report imports | Compatible HTML/JSON/NDJSON reports and offline ZIP bundles; validated manifests, durable recording identity, duplicate/scope/revision handling, and original interactive report inspection. | [Read](features/01-VAULT-AND-IMPORTS.md) |
| Archives, profiles and backup | Local active reports, protected ZIP/identified HTML archives, legacy compacted archives, reactivation and portable profile backups. | [Read](features/02-ARCHIVES-AND-PROFILE.md) |
| Rotation Highlights | Recorded 10/60-second peak windows and evidence-limited cooldown-aware candidates. | [Read](features/03-ROTATION-HIGHLIGHTS.md) |
| Rotation Crafter and Arcana practice | Configurable class training, input/timing exercises and visual combat scenes. | [Read](features/04-ROTATION-CRAFTER.md) |
| Subject Theta: Containment | Dark Diviner rhythm-combat trainer, resource management and ten protocols. | [Read](features/05-THETA-CONTAINMENT.md) |
| Vertrag Survival Grounds | Giant-stomp arena, locked-position dash, customizable controls and defensive loadouts. | [Read](features/06-VERTRAG-SURVIVAL.md) |
| Crom Bás Invaders | Alchemic Sharpshooter arcade shooter with persistent progression. | [Read](features/07-CROM-INVADERS.md) |
| Sacred Guardian Oath Workshop | Oath Max and Emergency Oath with compact, editable buff cards for the relic, persona and emblem; preparation checklists. | [Read](features/08-SACRED-GUARDIAN-OATH.md) |
| Explosive Vanguard Tower Range Lab | Experimental route-and-tower defense game. | [Read](features/09-EXPLOSIVE-VANGUARD.md) |
| Debuff Academy | Effect lessons, flash cards and recognition exercises. | [Read](features/10-DEBUFF-ACADEMY.md) |
| Achievement Book and records | Imported evidence milestones and local minigame progression. | [Read](features/11-ACHIEVEMENTS-AND-RECORDS.md) |
| Music and Melodic Puppeteer | Music calculator with 2026 Polyphony/Tempo values, BFO/Vivace-only instrument special upgrades and noncollapsing extra settings; rhythm/performance activities. | [Read](features/12-MUSIC-AND-PUPPETEER.md) |
| Positioning and chase activities | Targeting, Frame Bowling, pig pursuit and Bandit Hunt. | [Read](features/13-POSITIONING-AND-CHASE.md) |
| Herb Collection | Collection minigame and shared rewards. | [Read](features/14-HERB-COLLECTION.md) |
| Equipment simulators and economy | Reforge, Erg, Special Upgrade, Echostones and chest inventory. | [Read](features/15-EQUIPMENT-AND-ECONOMY.md) |
| Settings and app shell | Navigation, Secret Sauce, accessibility, languages and PWA behavior. | [Read](features/16-SETTINGS-AND-APPLICATION.md) |
| Arcana field guides | Ten Arcana landing pages with contextual practice and reference content. | [Read](features/17-ARCANA-FIELD-GUIDES.md) |
| Mobile features and touch support | Install/offline behavior, touch controls, local storage and mobile verification limits. | [Read](features/18-MOBILE-FEATURES.md) |

| Personal Bests — boss burst comparisons | Midir-46.b five-player real comparison tested; imported 30s boss hits with within-exported 10s skill breakdown and separate observed-use markers; not a complete session or 60s window. | [Read](features/21-LEADERBOARD-BURST-COMPARISONS.md) |
| Harmonic Saint — Resonant Litany / Dissonance | Independent Healing and Party Healing recovery, compact equipment and boost cards, three relic slots, Spirit Weapon augment trees, S50 Dark Erg, Dissonance stack and Midir breakpoint comparisons. | [Read](features/20-HARMONIC-SAINT-LITANY-DRAFT.md) |
| Language support | English, Korean and Spanish text across navigation, pages and known game interfaces, with English fallback. | [Read](features/19-LANGUAGE-SUPPORT.md) |

For the next Rotation Highlights verification pass, see [cooldown floors and skill-shape inventory](ROTATION-SKILL-RULES-INVENTORY.md).

- **Harmonic Saint / Resonant Litany (0.3.12a):** independent Healing and Party Healing recovery, EV-backed healing reforge/equipment selection (including user-provided Party Healing Echostone 1–20 and accessory exclusivity), direct Soul wand Dissonance bonus, optional Midir breakpoint comparison, and manual/calibrated and optional proportional comparison modes. [Current-state draft guide](features/20-HARMONIC-SAINT-LITANY-DRAFT.md).

Historical 0.3.12f: introduced shared Gold/Herb spending and optional validated catalog imports; the current 0.3.13 simulator instead bundles all 97 Nexon-listed effect types, has no player-facing JSON uploader, and preserves previously imported profile data for compatibility.

### Ogham current inventory and equipment
Rune inventory and five-point Arcana equipment board with drag/drop and touch selection. Desktop inventories are beside the board in a shared 590px maximum-height column, mobile inventories below it; each collection scrolls independently when full. Rune cards are compact art/name tiles with icon actions and drag-first organization; the comparison chooser is inline beneath Set A/B, and equipped sockets use a single primary frame. An occupied socket first shows details, then unequips on second tap to that same socket. The discrete 97-effect catalog uses reconstructed in-between level values; documented in features/22 and features/23. All 26 Ogham stone images are centered in their inventory/socket/detail frames. Practice rerolls spend the existing Gold and Herb chests but never mutate owned runes.

**Current visual refinement:** Rune reroll cards show effect bonus, level/max, gold high rolls and open/closed lock buttons; all 26 stones have centered local PNG art (10 provisional). Ordinary Reforge and Echostone display the current item inside the single bordered roll-action card. See Guides 15, 22 and 23.

**Shared herb artwork:** gathering, shared Reforge/Echostone/Rune Storage Chest, and Rune cost/spending/refund displays use the same eight local sprites by herb ID, including static White Herb (`white.png`) and animated Golden Herb (`golden.gif`). No balance or gameplay changes.
