# Achievement Book and personal records

**Applies to:** Midir Companion 0.3.4.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Book and milestones

- The Achievement Book is always accessible, with visible milestones even when advanced report tools are disabled. Book pages are scrollable on phones with persistent page-turn and close controls.
- Includes local minigame accomplishments, equipment milestones and import-backed achievements/collectibles, including gate-oriented records when the required evidence exists.

## Evidence policy

- Personal achievement credit is associated with normalized report evidence and ownership rules. Re-imports of the same recording should not duplicate lifetime credit; archive compaction preserves already-earned historical credit.
- Incomplete or ambiguous combat evidence is not silently treated as a victory, cast, death or eligible personal action.

## Persistence

- Records and compatible game progression travel in full-profile backups; browser storage alone is not durable cross-device storage.

## Source references

1. Achievements, Vault and book UI: [`app.js`](../../Companion%20Files/app.js).
2. Evidence rules: [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).
