# Rotation Highlights

**Applies to:** Midir Companion 0.3.2a.

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

## Interpretation

- Candidate rotation scores depend on imported evidence quality and registry coverage. They are not optimized damage predictions, simulated full combat logs or verified in-game cooldown schedules.
- Archive summaries may retain historical winners and medians even after original detailed reports have been compacted.

## Source references

1. Rotation calculations: [`analysis.js`](../../Companion%20Files/analysis.js), [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js).
2. Use and actor-evidence rules: [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).
3. Vault interface: [`app.js`](../../Companion%20Files/app.js).

