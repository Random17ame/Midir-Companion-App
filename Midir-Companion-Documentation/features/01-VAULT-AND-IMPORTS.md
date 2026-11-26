# Vault and report imports

**Applies to:** Midir Companion 0.3.15.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Import contract

- Imports compatible combat-report `.html`, `.htm`, `.json` and `.ndjson` files, plus `.zip` session bundles; the single-file browser-safety limit is **90 MiB** (`90 × 1024 × 1024` bytes). Large imports can still be limited by available device memory or browser storage.
- Embedded JSON in compatible HTML is parsed directly instead of constructing an entire report DOM. Multi-encounter and multi-gate reports are retained as a **single recording**; there is no built-in gate-splitting importer.
- Reports are converted into normalized encounter, player, target, skill-use and damage evidence when those fields exist. Missing evidence remains missing rather than inferred.


## Native ZIP bundles (0.3.13)

- In **Settings → See Secret Sauce → The Vault → Import sessions / reports**, select one or more ZIPs, loose reports, or a mixture, or drop them on the import card. No manual extraction or network service is required. The existing individual HTML parser and evidence rules are reused.
- Midir 49.a universal ZIPs contain root `manifest.json` and complete original HTML reports. The reader supports classic ZIP STORE (0) and raw DEFLATE (8) using the current browser's native `DecompressionStream`. Manifest-free legacy ZIPs scan HTML entries; unrelated non-HTML entries are reported unsupported. Retired 49 JSON-only bundle entries and nested ZIPs are explicitly unsupported. Unpack the outer QA distribution before selecting individual sample ZIPs.
- The reader checks exact entry membership, manifest version 1, evidence versions, scope, timestamps, ID syntax, CRC-32, optional paired SHA-256 hashes, payload agreement, directory/local headers, UTF-8 paths, and duplicate/traversing/encrypted/linked entries. A present invalid manifest is never treated as legacy. Limits: 2,048 archive entries, 90 MiB per entry, 8 MiB manifest, and 384 MiB desktop / 128 MiB mobile for both compressed archive size and total declared uncompressed bytes. Actual output is bounded before copying. Browser RAM/quota may impose lower limits. Select smaller bundles if needed.
- Recording identity is authoritative where present. Same recording/scope/payload SHA-256 is an exact duplicate, including individually imported HTML. A different hash within an existing scope is recorded as a revision, not another run. Different scopes are variants. Retain the first chosen report and original HTML for equal/incomparable scope; a strictly broader scope replaces narrower chosen data under the same local ID. Revision/variant metadata is retained; unselected HTML alternatives are not stored, and there is no revision-selection UI. Legacy reports lack durable IDs; exact byte matches are recognized after 0.3.13b, and potential older overlaps require a user decision (not proof of identity). Choosing to import an ambiguous older report separately may duplicate statistics.
- Entries are processed sequentially with progress and separate imported, duplicate, revision, scope-variant, unsupported and rejected counts. Validated entries are committed independently; a corrupt entry does not invalidate already committed reports. A bad directory or manifest rejects the entire archive before report commits. ZIP/identified HTML storage failure rejects the entry rather than storing incomplete data. The existing legacy standalone data-only fallback remains when IndexedDB is unavailable.
- Original report HTML is retained as lossless UTF-8 text; the viewing copy alone adds CSP and existing mobile helpers. The same sandboxed original viewer renders charts and controls. Do not trust unknown reports merely because they contain a manifest; hashes provide integrity, not authentication.

Producer contract: [Midir 49.a specification](../reference/midir-49a/SESSION-BUNDLE-SPEC.md), [manifest schema](../reference/midir-49a/SESSION-BUNDLE-MANIFEST.schema.json), and [handoff](../reference/midir-49a/COMPANION-HANDOFF.md). See [release](../RELEASE-0.3.13.md) and [verification](../VERIFICATION.md) for limitations.

## Vault and report viewing

- The Vault and read-only personal milestones are available without enabling advanced features. **Settings → See Secret Sauce** reveals the import controls, detailed report viewing, further analysis and related awards.
- Saved original HTML reports can be opened interactively; the phone reader provides full-screen viewing, scatter jump, display zoom, fit and close controls. Desktop supports inline and new-tab options. ZIP and identified HTML reports remain viewable in the Archive; previously compacted archives require the original export to reactivate.

## Evidence and safeguards

- Skill attribution, actor verification, per-encounter Arcana identification, duplicate handling and boss-clear claims are conservative. A report without a particular observation does not prove that the event did not happen.
- Imported user HTML runs in a sandboxed opaque-origin report frame. A viewing-copy content security policy blocks external resources and connections; the parent frame policy limits frame navigation to local URLs. The user should nevertheless treat unknown combat-export files as untrusted and keep backups.

## Source references

1. Import, parser, Vault and viewer: [`app.js`](../../Companion%20Files/app.js), [`session-import.js`](../../Companion%20Files/session-import.js).
2. ZIP transport and metadata: [`session-bundle.js`](../../Companion%20Files/session-bundle.js).
3. Evidence rules: [`analysis.js`](../../Companion%20Files/analysis.js), [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js), [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js).

## 0.3.12b supplemental leaderboard comparisons

Personal Bests HTML comparison exports embedding `script#burst-data` use a **separate** import/viewer path rather than `midir-companion` v1. The Vault presents up to eight independent 30-second boss windows with a best observed rolling 10s **within that exported 30s**, a skill breakdown, and separate observed-use markers. Comparison data is stored separately, included in full profile backups and never treated as combat awards or complete encounter evidence. See [`21-LEADERBOARD-BURST-COMPARISONS.md`](21-LEADERBOARD-BURST-COMPARISONS.md) for schema limitations.
