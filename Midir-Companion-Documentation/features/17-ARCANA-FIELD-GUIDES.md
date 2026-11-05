# Arcana Skill Field Guides — Feature Log

**Purpose:** Explain what the ten Arcana Simulators landing-page references teach, how they relate skills to one another, and where those descriptions differ from timed practice or imported combat evidence.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not a skill tooltip encyclopedia or a chronology of prior wording changes. Source references identify files rather than specific revisions.

## Arcana Simulators references

- **Entry and navigation:** Choose an Arcana on the Arcana Simulators landing page to view its illustrated skill reference and linked activities. The shared header no longer contains a second Arcana selector. Cards prioritize practical decisions, interactions, sequencing and positioning; underlying talent skills can remain available in a Crafter drawer even when they are omitted from the concise landing reference. [^1] [^2]
- **Scope:** These are authored learning descriptions, **not** a reconstruction of an imported player's skill casts. The Rotation Crafter has its own configurable cooldown, charge, hit and resource simulation; Rotation Highlights uses separate recorded damage/evidence models. [^1] [^2] [^3]

## Offensive and hybrid Arcanas

| Arcana | Rotation priorities currently taught |
|---|---|
| **Alchemic Sharpshooter** | Prepare Fire/Water for Tri-Assault's three volleys, aim lines and groups deliberately, and use Magnum Shot between Arcana actions. Terra Scourge selects an **enemy** and hits around it, rather than choosing arbitrary ground; its roughly two-second cast competes with additional Magnums. Golden Time refills elemental resources rather than resetting Arcana cooldowns. |
| **Dark Diviner** | Maintain Thunderblight; use Hexshroud to earn **Dorcha when attacking afflicted enemies**, offsetting Seething Mana's empowered-cast cost. Thunder, Shadow Flare and other damage choices serve that resource cycle. |
| **Elemental Knight** | Keep **Instill Elements** toggled on and visible in the status list. Two-handed/sword-and-shield sequences emphasize Bash stacks and **Shattering Windmill before Dynavolt Smash**; dual-wield chains build Bash faster and weave Flashing Steel. Flashing Steel only spends a stack if its natural cooldown is still active. |
| **Arsenal Gunner** | One full Energy Bullet is **100 Transmutation Energy** (five bullets maximum). Bullet Barrage earns 60–300, Heavy Artillery/Calamity Cannon earn 100, and Gunner's Crest spends one bullet to enable +50 energy per qualifying Dual Gun use for four minutes. Detonation Field and Tracer Pod each spend one bullet and double Fatal Scope aim speed against affected targets (**2s → 1s**, not instant; bonuses do not stack). The first Fatal Scope shot earns 100, fully aimed follow-ups spend 100 each. Overlap Detonation Fields; save Grapple Shot's i-frames for danger. |
| **Forbidden Alchemist** | Prepare Elemental Compounding and Catalyst before combat, keep all four Elemental Amplification bonuses, and lean on **Fangs of Stone** plus a build-preferred **Water Cannon or Heat Buster** route. Elemental Wave can amplify Heat Buster. Serpentcall and the enemy-targeted Chemical Carnival share and consume **all** available Alchemy orbs; Serpentcall and Fangs can miss moving enemies. Flame Burst supports Serpentcall rather than dominating the Arcana rotation; Shock is a reusable route to activate Brionac. |
| **Explosive Vanguard** | Keep Relentless Thrust's Mounted benefit and Mana Shell supply in circulation, cycle Lance Charge/Dreadnought Burst, and reserve Blaze of Glory for a safe burst window. Its reference reflects the present lance-oriented game and equipment assumptions, not a universal reforge prescription. |
| **Blazing Brawler** | Maintain level-two **Berserker's Fury** and refresh as needed. Fury spenders (Piercing Gale, Earthshaker, Radiant Storm) activate **Absolute Fury** for ten seconds; its damage bonus does not stack with Rage Impact. Piercing Gale is stronger forward/single-target pressure, Earthshaker surrounds the player, and Radiant Storm is the nuke. From Link 5, each critical hit from an Ignite skill shortens Ignite and Combo cooldowns by 20% of their **full** cooldown; the related equipment reset is separate. Tumble and Counter Punch serve as second-stage cancels; Tumble refreshes on Ignite/Combo crits. |

## Support and multi-action Arcanas

| Arcana | Rotation priorities currently taught |
|---|---|
| **Sacred Guardian** | Prepare **Fateweaver → Golden Magic Wool → Virtuous Oath** to amplify defensive snapshots. Oath is an ongoing toggle; Pledge helps build Virtue, timed Rend Armor parries make boss attacks productive, and Divine Retribution spends 100 Virtue. Bash and Rage Impact strengthen the Close Combat foundation feeding Windmill and the SG chain. This **Fateweaver → Wool → Oath** advice is a high-level preparation cue, **not** the full numeric Oath Max sequence; the separate Oath Workshop explicitly models **F → O → F → O → W → F → O**. Do not substitute one for the other. |
| **Harmonic Saint** | Keep **Voice of Vitality** and **Echoes of Salvation** active, use **Hand of Restoration** for urgent single-target rescue, place Pall for a real burst, and keep **Pulse of Purification** circles visible by not covering one with another. Hymn of Resurrection is primarily presented as a combat pet revive; **Encore** resets music-buff cooldowns when trying for a stronger performance. Spirit Healing Wand Awakening increases healing effectiveness during demanding moments. |
| **Melodic Puppeteer** | All three puppets can carry out actions together. **Downbeat Drop** and **Act 7** are the bread-and-butter attacks; maintain Live Wire and weave short-cooldown **Cutting Chorus** whenever a summoned puppet is already attacking, adding AoE at that puppet's location. Acts 2/4/6 fill rapid attack openings; Showstopper is the finale. Summoning skills remain in the wider talent skill pool but are omitted from the concise landing-page rotation priorities. |

## Interpretation and test boundaries

- The reference follows the available user-reviewed mechanics, while the **implemented Crafter** may provide configurable approximations or deliberately simplified enemy targeting. For example, AG aim-speed bonuses are modeled against the practice target, and MP server-side target restrictions are not reproduced as full server combat.
- A skill missing from an Arcana's featured cards is **not** necessarily disabled in the wider game. The field guide is editorial selection; skill pools and imported skill evidence are independently maintained. [^1] [^2] [^3]
- Check the current `rotation-reference.js` when revising advice and test that the desired skill has its real icon mapping. Do not silently upgrade uncertain simulation mechanics into validated Mabinogi formulas. [^1] [^2]

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Landing-page skill records and editorial priorities: [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js), [`app.js`](../../Companion%20Files/app.js).
[^2]: Crafter skill lists, gear toggles, input and action handling: [`app.js`](../../Companion%20Files/app.js), [`rotation-skill-icons.js`](../../Companion%20Files/rotation-skill-icons.js).
[^3]: Recorded evidence model: [`analysis.js`](../../Companion%20Files/analysis.js), [`session-import.js`](../../Companion%20Files/session-import.js).
