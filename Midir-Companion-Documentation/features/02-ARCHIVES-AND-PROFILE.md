# Archive Storage, Profiles and Backup — Feature Log

**Purpose:** Protect imported source reports and training progress across browser sessions, exports, and restores.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Storage contract

- **Profile index:** Main profile uses localStorage key `midir-companion-01`; where IndexedDB is active, report entries are saved as lightweight indexes. [^1]
- **Report database:** IndexedDB `midir-vault-archive-v1` version 2 stores structured `details` separately from original HTML `reports`, keyed by report ID. [^1]
- **Recovery guard:** If IndexedDB hydration fails, report storage blocks ordinary profile saves rather than overwriting the saved index with incomplete report data. [^1]
- **Storage visibility:** The Vault shows storage usage/availability and offers a persistent-storage request when the browser supports it. [^1]
- **Report-list pagination:** Previously imported records are rendered in pages of 25. Detailed structured reports are stored individually in IndexedDB, but the current startup path hydrates them into memory for legacy analysis and achievement calculations; pagination alone does not make every report fully on-demand. [^1]

## Portable backups

- **Full profile:** `midir-companion-backup` version 2 exports profile data, archived HTML, and `trainingExtras` for games/simulators including Theta and Vertrag. [^2]
- **Restore validation:** Checks backup structure and auxiliary game data before applying restore, with failure recovery rather than an intentional destructive reset. [^2]
- **Size protections:** Full-backup export declines when accumulated archived HTML exceeds the current **175 MB** guard. Backup restore rejects an input file larger than **200 MB** and rejects any embedded archived-HTML string whose **JavaScript string length exceeds 40 × 1,024² characters** (not an exact byte-size measurement). These are separate checks, not one uniform backup-size limit. Build 275 has no tested split-backup workflow. [^2]
- **Original viewer:** Archived interactive Midir HTML is still opened in a sandboxed viewer. A static or script-free replacement is **not** part of the current product; preserve the original report experience. [^1]

## Verification and outstanding limits

- Browser-origin and file-path changes can make existing browser data appear missing. Backups are not encrypted and should be retained separately from the app ZIP.
- Atomicity under interrupted IndexedDB writes, duplicate replacements, quota exhaustion, migration, and large archive recovery requires dedicated test fixtures; current success should not be inferred from syntax/navigation checks.
- Do not change IndexedDB names, localStorage keys, saved report IDs, or `trainingExtras` formats casually.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Profile and IndexedDB handling: [`app.js`](../../Companion%20Files/app.js).
[^2]: Backup feature contracts: [`app.js`](../../Companion%20Files/app.js).
[^3]: Storage-focused development handoff: [`tests/README.txt`](../../tests/README.txt).
