# Achievement Book, The Vault and Personal Records — Feature Log

**Purpose:** Celebrate verified milestones and training progress while keeping importer-based evidence distinct from simulated achievements.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Achievement policy

- **Shared book:** Organizes activities and their awards, including training-module achievements and importer-derived milestones. [^1]
- **Evidence gating:** Importer-derived entries are hidden when See Secret Sauce is off; saved progress is retained. [^1]
- **Verification boundaries:** Imported hit totals, encounter clear evidence and achievements must not treat unverified enemy-source or inferred events as player actions. [^1] [^2]

## Bri Leith achievement collectibles

Three illustrated collectibles appear at the top of the import-enabled Vault. Their card art is bundled locally (`assets/awards/giant-boots.png`, `bottled-horsepower.png`, `halo-badges.png`), with separate per-run **See Awards** histories. These are **signed balances**, not floor-at-zero inventories: eligible clears without a recorded death during the designated phase add **+1**, eligible clears with such a death contribute **−1**, and a failed, incomplete or unprovable attempt makes **no change**. The character-name filter applies to full-party reports. [^1]

| Collectible | Verified encounter and required survival evidence |
|---|---|
| **Giant Boots — Gate 1** | Vertrag of the Deep Roots must have a verified paired-form clear. Survive **both** Ancient Giant windows: **70% on form 7600** and **25% on form 7601**. The exporter may group these as one logical encounter, but its two physical HP histories remain distinct. |
| **Bottled Horsepower — Gate 2** | Verified Bronntanas clear and no tracked-character death in its **50%** special-phase HP plateau. |
| **Halo Badges — Gate 3** | Verified Midir the Beloved clear and no tracked-character death in the **80% and 40%** halo-phase HP plateaus. The **60%** wave is not a Halo Badges penalty phase. |

The current code bounds phases using observed boss-HP samples; for Gate 1 it looks for each form's relevant HP plateau and the following lower HP sample. These are **HP-observed windows**, not authoritative spawn/despawn timestamps. A missing form, incomplete HP series, missing death timestamps or unverified clear must not be guessed into an award. Each separately stored report/attempt is evaluated independently. The importer offers replacement or cancellation when it recognizes a duplicate; **undetected** near-duplicates may remain separately counted and require user review. [^1] [^2]


## Import-backed achievements — current criteria

| Achievement | What the current rule checks |
|---|---|
| Full Party Coverage | All **nine** boss-condition groups observed at some point during a **verified clear**; no caster attribution or simultaneous overlap required. |
| To the Nines | At least **seven of the nine** groups active **simultaneously** for at least **97%** of a verified boss fight, measured from status intervals rather than averaged individual uptimes. |
| Perfectly Dressed | **All nine** groups overlap for **six uninterrupted minutes** of a verified boss fight. |
| Clockwork | Five **distinct imported reports** each supply a qualifying verified Bri Leith gate fight with recorded boss-combat time below half the applicable 20/20/30-minute mission limit: under 10 minutes in Gate 1/2 or under 15 in Gate 3. The current counter deduplicates by report ID, and does **not** certify total mission clear time. |
| The Long Haul | A verified Bri gate boss fight lasting at least 17 minutes in Gate 1/2 or more than 25 minutes in Gate 3. The player-facing description does not disclose those thresholds. |
| Burst of Brilliance | A new personal best in **timestamped damage-hit groups** over ten seconds within a comparable encounter; not necessarily boss-only damage. |
| Never Off Duty | An attributable debuff contribution in three successive verified clears of the same encounter. |
| Sole Survivor | A recorded deathless Bri gate clear while every other recorded party member died at least once. Requires complete party death-history fields. |
| Last One Standing | A recorded deathless Bri gate clear when all other **identified non-Harmonic Saint** teammates had at least two recorded deaths and at least one such teammate exists. A Harmonic Saint may still be alive. |
| Against All Odds | A verified Bri gate clear after at least two other **identified non-Harmonic Saint** teammates each recorded two deaths during that gate. |

The nine groups used by the first three awards are: Defense reduction; Magic defense reduction; Damage amplification; Brionac/Fragarach paired peel; Bone Dragon/Purrling pet defense; Mir Dragon/Ceraunus pet defense; Bunbun/Foxyquinn pet amplification; Kart Bomb (`598`) unique defense reduction; and Fateweaver Aspect of Reversal (`515`) healing on hit. Pet alternatives count once per group. For the peel, **both** max-Protection statuses must be present. [^1] [^2]

**Survival evidence:** The Bri Leith normal revive allowance resets **per gate**, with the second death ordinarily ending participation for the remainder of that fight. Harmonic Saint's cooldown-dependent extra self-revival is an exception. The importer uses recorded HTML death timestamps, **never negative HP or Deadly**, and does not infer full party revival intervals from death events. These awards describe documented death-count conditions, not a frame-by-frame proof of the last living character. [^1] [^2]


## Ownership and personal milestone management

- **Character selection:** Reports may contain entire parties, but collectible balances and imported personal milestones follow the character whose name was explicitly entered in The Vault. A report without a matching player cannot silently award another party member's achievements. [^1]
- **Player-written versus automatically earned:** **My Milestones** can be added beside the report importer and later edited or removed with confirmation. Report-derived **Earned Milestones** are regenerated from retained evidence and remain a separate, non-manual record stream. [^1]
- **Book ownership states:** The Vault's compact achievement area presents discovery progress and up to five recent earned cards; the full popup book shows locked/unlocked states, chapters, individual achievement descriptions and up to three recent unlock details for a selected entry. The book is not simply a flat listing of possible rewards. [^1]


## Records and progression

- **Personal progress:** Stores practice records, milestones and game-specific awards; game modules also keep independent save namespaces. [^1] [^3]
- **Profile continuity:** Full backup includes core progress and supported module extras, allowing restored profiles to retain gameplay achievements. [^1]

## Repeatable mastery and personal progress

- **Fewer Falls** recognizes fewer deaths than a comparable prior attempt, and also another verified **zero-to-zero** deathless clear. **Stronger Defense** similarly treats repeated zero damage taken as maintained mastery rather than impossible further improvement. [^1]
- **Untouchable**, First Boss Clear, faster verified combat, biggest recorded hit, personal skill records, five/three/ten-clear deathless streaks, Personal Best Streak, Speedrunner's Journey, The Comeback, quick attributable setup, varied debuff contribution and Attempt Damage Breakthrough cover distinct aspects of progress. Each has its own evidence requirements. [^1] [^2]
- Imported report awards should not confuse per-second hit buckets with casts; compare the same boss group and matching export scope where the rule requires it. Evidence for target disappearance or negative HP cannot substitute for an explicit clear or death. Existing earned IDs and historical records remain intact if a catalog entry is retired. [^1] [^2]


## Book layout, chapter order and unlock integrity

- **Book interaction:** The Vault shows a compact **single row of five recent earned achievement cards**, and the full book opens as a popup with page navigation and grouped chapters. The page builder splits large groups into readable page spreads (12 entries per chunk), rather than shrinking a huge catalog into one list. [^1]
- **Chapter organization:** The intended and source-configured order begins with **The Vault** and **Exploration & Collections**, then Crom Bás Invaders, Tower Range Lab and the remaining minigame/discipline categories. The entry order is functional grouping, not chronology; avoid turning the book into a version-history page. [^1]
- **Cross-system precision:** Equipment achievements such as Step 8 + Erg S50 + Limit Break must be evidenced on a single saved weapon. Other rewards may rely on lifetime counters (stone purchases, upgrade failures, recovery, boss kills, minigame visits). Events that were never stored in older saves cannot automatically be reconstructed. [^1] [^2] [^3]
- **Special Upgrade milestones:** Locking a weapon on an unprotected high-step failure, purchasing and using a Recovery Essence, protection saving an attempt, reaching red/blue level 8 and combining special upgrades with Erg/Limit Break are tracked through the Special Upgrade state and collected through the shared book. [^1] [^4]
- **Crom milestones:** The book reads game counters for wave/boss progression, Dark Erg spending, skill and Crash Shot progression, enemy defeats and shop bonuses. Do not infer a boss was killed from merely visiting the wave. [^1] [^3]

## Verification and outstanding limits

- Do not rename achievement IDs or silently change importer evidence criteria; users may already have earned progress.
- Audit edge cases when two Arcana share a training game or when Secret Sauce changes visibility.
- Some standalone games maintain records outside the shared localStorage profile; verify both source stores and full backup.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Book, milestones, gating and backup: [`app.js`](../../Companion%20Files/app.js).
[^2]: Importer evidence: [`analysis.js`](../../Companion%20Files/analysis.js), [`session-import.js`](../../Companion%20Files/session-import.js).
[^3]: Game achievement sources: [`theta-rhythm.js`](../../Companion%20Files/theta-rhythm.js), [`vertrag-survival.js`](../../Companion%20Files/vertrag-survival.js), [`as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js).

[^4]: Special Upgrade achievements and proof fields: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js).
