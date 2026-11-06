# Vault and report imports

**Applies to:** Midir Companion 0.3.11i.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Import contract

- Imports compatible combat-report `.html`, `.json` and `.ndjson` files; the single-file browser-safety limit is **90 MiB** (`90 × 1024 × 1024` bytes). Large imports can still be limited by available device memory or browser storage.
- Embedded JSON in compatible HTML is parsed directly instead of constructing an entire report DOM. Multi-encounter and multi-gate reports are retained as a **single recording**; there is no built-in gate-splitting importer.
- Reports are converted into normalized encounter, player, target, skill-use and damage evidence when those fields exist. Missing evidence remains missing rather than inferred.

## Vault and report viewing

- The Vault and read-only personal milestones are available without enabling advanced features. **Settings → See Secret Sauce** reveals the import controls, detailed report viewing, further analysis and related awards.
- Saved original HTML reports can be opened interactively; the phone reader provides full-screen viewing, scatter jump, display zoom, fit and close controls. Desktop supports inline and new-tab options. Archived compact-only reports require the original export to reactivate.

## Evidence and safeguards

- Skill attribution, actor verification, per-encounter Arcana identification, duplicate handling and boss-clear claims are conservative. A report without a particular observation does not prove that the event did not happen.
- Imported user HTML runs in a sandboxed report frame. The user should nevertheless treat unknown combat-export files as untrusted and keep backups.

## Source references

1. Import, parser, Vault and viewer: [`app.js`](../../Companion%20Files/app.js), [`session-import.js`](../../Companion%20Files/session-import.js).
2. Evidence rules: [`analysis.js`](../../Companion%20Files/analysis.js), [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).
