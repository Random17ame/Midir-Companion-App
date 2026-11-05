# Equipment Simulators, Special Upgrade and Storage Chest — Feature Log

**Purpose:** Connect fictional equipment rolls, resource balances and upgrade progression inside Companion.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Simulators

- **Reforge:** Lets players choose items/categories and roll modeled modifier pools, including resource costs and optional Dazzling tools. [^1]
- **Erg Break:** Models weapon route/level progression and transfer to other simulators; the app explicitly treats its rates as fictional. [^2]
- **Special Upgrade:** Tracks upgrade stones, weapons, different anvils and step progress, sharing some balances with the Reforge simulator. [^3]

## Reforge and Erg interaction details

- **Reforge:** Normal item rolls show three effects; an Echostone stimulant shows one effect from its matching pool. The full pool includes item- and talent-specific effects; trailing numeric source tags are stripped from displayed names. Standard and purchasable Dazzling tools differ in modeled results. A Limit Break result needs confirmation before another roll. [^1]
- **Simulated Auction House:** An unsaved eligible roll can be listed for a sale that resolves after additional simulated reforges/stims; the sale presents a modal before rolling resumes and credits simulated gold. Saving to the Storage Chest and listing for sale are distinct actions. [^1]
- **Erg Break:** Weapons advance in five-level steps through B/A/S routes; completing B50 advances to A30, A50 to S30, and S50 is the final destination. Failure-based success modifiers and an optional **500,000-gold Erg Unlock Assist Potion** are contained in the simulation, with only the current effective success rate shown to players. [^2]
- **Disclaimer:** Rate isn't a Lie, Reforge and Erg each display the deliberately playful line **“Any similarities to in game rates are purely an accident.”** The simulators do not share verified in-game roll odds. [^1] [^2] [^5]


## Cross-feature resources

- **Storage Chest:** Retains currencies, consumables and equipment ownership within the Companion, with reward hooks from games. [^4]
- **Separate save domains:** Reforge, Erg and Special Upgrade use dedicated localStorage namespaces and export/import helpers for full backups. [^1] [^2] [^3]

## Reforge, Erg, Special Upgrade eligibility and shared identity

- **Reforge categories:** The user-provided equipment-icon set includes boots, body, hat, gloves, colored Echostones and weapon types (lances, guns, knuckles, swords, axes, bows/crossbows, control bars, instruments, staves/wands, cylinders, scythes, chain blades and others). **Orbs, Spellbooks and Shields are valid reforge categories**; they are **not** eligible for Erg or Special Upgrade. Guard Cylinders are also excluded from Special Upgrade and treated as off-hand in shared transfers. [^1] [^2] [^3]
- **Weapon handoff:** A weapon moved Reforge → Storage Chest → Erg or Special Upgrade → Storage Chest is intended to retain the **same item's identity** and attached lines/progression. Special Upgrade stores type (`R`/`S`), step (0–8), locked/bricked and recovered flags in `specialUpgrade` on the returned item. The receiving anvil's `eligible()` guard rejects off-hands. Avoid merging progress from different weapons when awarding cross-system achievements. [^1] [^2] [^3]
- **Step-only model:** Special Upgrade purposely models **step and color**, not a stat/critical/magic bonus calculator. Every eligible simulator weapon can access step 8: no Soul Liberator class restriction is imposed for this activity. The stone inventory is separately counted, and stones must match step and red/blue type constraints. [^3]

## Special Upgrade rules (source-verified)

| Step reached | Normal success | Alban success | Normal gold cost | Alban gold cost |
|---|---:|---:|---:|---:|
| 1 | 100% | 100% | 30,000 | 90,000 |
| 2–3 | 50% | 75% | 30,000 | 90,000 |
| 4–6 | 45% | 67% | 50,000 | 150,000 |
| 7 | 30% | 45% | 500,000 | 1,500,000 |
| 8 | 30% | 45% | 1,000,000 | 3,000,000 |

- Standard red/blue stones support steps 1–5; protective red/blue and Eweca/Ladeca varieties support progression through step 7, subject to protection property; dedicated level-8 stones are step-8 only. A failure attempting **step 6, 7 or 8 without a protective stone** permanently locks subsequent attempts until a Recovery Essence is used. Protected attempts do not lock the weapon. Essence costs **1,000,000,000 simulated gold**, deducted through the shared Reforge balance. [^3]
- **Stone reward hooks:** For each **new herb**, Special Upgrade's `herb(total)` independently rolls **1/250** for regular Eweca/Ladeca and **1/400** for protective Eweca/Ladeca; these are not guaranteed after a harvest interval. Each Bandit Hunt flip has independent **1/10** regular red/blue and **1/250** protective red/blue chances. EV clears award one red/blue level-8 stone when the incoming weapon tier argument denotes Soul Liberator Lance. [^3]
- **Simulation and evidence:** The anvil uses modeled chance rolls and a shared **simulated** gold economy; Auction House records and rare-roll achievements do **not** establish real Mabinogi sales. A triple-crown achievement must identify a level-8 Special Upgrade, Erg S50 and Limit Break on the **same item**, not a combination across separate inventory entries. [^1] [^2] [^3] [^4]

## Verification and outstanding limits

- Odds, item prices and modeled rates should not be described as current verified Mabinogi probabilities or economy prices.
- Cross-simulator item handoffs and balancing require transactional tests, particularly when a profile restore happens mid-progression.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Reforge and shared gold: [`reforge-simulator.js`](../../Companion%20Files/reforge-simulator.js), [`reforge-data.js`](../../Companion%20Files/reforge-data.js).
[^2]: Erg simulator: [`erg-simulator.js`](../../Companion%20Files/erg-simulator.js).
[^3]: Special Upgrade: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js).
[^4]: Chest, achievements and backups: [`app.js`](../../Companion%20Files/app.js).

[^5]: Music calculator disclaimer: [`app.js`](../../Companion%20Files/app.js).
