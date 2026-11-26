# Rotation Highlights

**Applies to:** Midir Companion 0.3.15.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Recorded Peak

- Calculates observed peak damage windows over **10 seconds and 60 seconds** using encounter evidence. These are recorded peaks, not a guarantee that a rotation is repeatable.

## Cooldown-aware candidates

- Uses the current Arcana cooldown reference, recognized skill-use evidence and eligible damage-hit budgets to form candidate windows. Cooldown boundaries are scoped to encounters.
- Skill observations do not automatically establish who cast a skill: identity and event-shape evidence are checked before attribution.

## Encounter and display selection

- Prioritize precise, player-attributed **boss-target damage hits** across all supported gates when available. If no precise boss-only hits are available, prefer Gate 2 encounter windows; otherwise use available encounter windows with an explicit approximate-scope warning.
- Recognize named Marionette Act damage skills, including source-labeled `AI` skill names, as actual puppet skill uses when tied to the player's damage. Passive procs (Redoubled Offensive, Flare, Blast) remain excluded.
- Single Stream and Skill Tracks use the same recognized skill-use evidence. Every identified skill receives its own lane, including skills used only once. An inferred damage hit does not by itself prove a separate activation.
- Wireless Puppet active Act labels ending in `AI` (for example, `Act 7: Climactic Crash AI`) display under the ordinary Act name. The original exporter label and skill ID remain available in source data. This suffix does not mean a passive proc.

## Critical-hit normalization

- Each accepted boss hit of a skill uses the same pooled **non-critical per-hit** reference damage whether the recorded hit was ordinary or critical. Critical hit flags only affect visual labels.
- For skills observed only as critical hits, estimate their non-critical reference by dividing their average critical damage by the character’s shared critical-damage multiplier, inferred from other skills with both ordinary and critical observations. Flag these references as **estimated**. If the multiplier cannot be established, the skill remains unscored rather than assigning a fabricated baseline.

## Skill-rule interpretation

- **Cooldown floors** are the minimum accepted separation for cooldown-aware candidates, not a declaration of the skill’s actual base cooldown. A zero-second floor means no positive floor is enforced in that table; other effects, gear, links and skill-specific exceptions require separate verification.
- **Skill-shape rules** currently describe hit budgets and timed multi-hit/DoT windows for a limited set of skills. They are not complete geometric hitbox definitions. Unspecified shapes and timings remain provisional.
- Cutting Chorus training separately uses a provisional +3-second Melodic Puppeteer penalty for numbered Puppet Acts; this is **not** a verified live-game cooldown and is not a global overwrite of Rotation Highlights floors.
- [Source-extracted inventory and validation plan](../ROTATION-SKILL-RULES-INVENTORY.md).

## Interpretation

- Candidate rotation scores depend on imported evidence quality and registry coverage. They are not optimized damage predictions, simulated full combat logs or verified in-game cooldown schedules.
- Archive summaries may retain historical winners and medians even after original detailed reports have been compacted.

## Source references

1. Rotation calculations: [`analysis.js`](../../Companion%20Files/analysis.js), [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js).
2. Use and actor-evidence rules: [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).
3. Vault interface and cooldown/shape maps: [`app.js`](../../Companion%20Files/app.js) (`RH_MIN_COOLDOWNS`, `RH_EXTRA_COOLDOWNS`, `RH_SKILL_SHAPES`).


## 0.3.12b comparison-window supplement

Independent leaderboard comparison exports can supply a best **observed** 10-second damage sum **within a previously selected 30-second boss-only window**. These values are displayed in the separate Vault comparison inspector; they do **not** replace or compete with full-session Recorded Peak or cooldown-aware Rotation Highlights, and they cannot establish a 60-second record. Hits and separately observed uses are never equated. See [`21-LEADERBOARD-BURST-COMPARISONS.md`](21-LEADERBOARD-BURST-COMPARISONS.md).

## Supplementary leaderboard burst imports (0.3.12c)

Real 46.b comparison HTML can now supply a separate **Best 10s Within Exported 30s** observation for each player. The preview uses original per-hit millisecond timestamps and original skill-name/ID metadata, with observed use markers kept separate; it never changes the existing full-session 10s/60s Rotation Highlights, boss scope, crit-neutral reference damage, cooldown heuristics, Arcana logic or gate fallback. See [Leaderboard Burst Comparisons](21-LEADERBOARD-BURST-COMPARISONS.md).
