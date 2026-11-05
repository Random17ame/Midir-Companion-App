# Rotation Highlights

**Applies to:** Midir Companion 0.3.0 (build 300; build 301 label correction).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Recorded Peak

- Calculates observed peak damage windows over **10 seconds and 60 seconds** using encounter evidence. These are recorded peaks, not a guarantee that a rotation is repeatable.

## Cooldown-aware candidates

- Uses the current Arcana cooldown reference, recognized skill-use evidence and eligible damage-hit budgets to form candidate windows. Cooldown boundaries are scoped to encounters.
- Skill observations do not automatically establish who cast a skill: identity and event-shape evidence are checked before attribution.

## Interpretation

- Candidate rotation scores depend on imported evidence quality and registry coverage. They are not optimized damage predictions, simulated full combat logs or verified in-game cooldown schedules.
- Archive summaries may retain historical winners and medians even after original detailed reports have been compacted.

## Source references

1. Rotation calculations: [`analysis.js`](../../Companion%20Files/analysis.js), [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js).
2. Use and actor-evidence rules: [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).
3. Vault interface: [`app.js`](../../Companion%20Files/app.js).
