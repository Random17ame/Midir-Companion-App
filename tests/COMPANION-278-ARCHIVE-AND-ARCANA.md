# Companion 278 — File-assisted compact archive and encounter Arcana

GitHub version: **0.2.78**. Launcher: **Midir Companion.html**.

## Compact archival contract

1. Active Vault reports remain at 10 per page, at most 30 active. Older/incomplete reports are moved to the archive. Source-report milestone records may be discarded after durable banked credits have been committed; lifetime awards and rolling rotation summaries stay independent.
2. On first irreversible compaction, the browser explains that **the original export must be kept externally** and asks the user to approve. Declining leaves details in browser storage and reveals a button to approve later. Manual Archive similarly asks before removing detailed data.
3. A report is canonicalized from parsed evidence fields; a SHA-256 evidence digest and, for newly imported files, a SHA-256 file-content digest are stored with archive metadata. The canonical digest ignores mutable Vault IDs, archive status, and original filename. Older 277 archives can migrate using their recoverable `cold` report, even when their original HTML was not retained. A 277 compact archive without its cold copy cannot be verified and is **not** silently reactivated or discarded.
4. Full details are staged in IndexedDB `cold` and a compact `details` entry in one transaction. Banked awards and winning rotation sequences are saved to the version-2-compatible local profile index. **Only after the profile commit** are the temporary cold report and stored HTML removed. If the profile commit fails, the cold and HTML copies are preserved.
5. Clicking Return to active asks to reselect the original `.html` (or matching structured JSON/NDJSON) export. The parsed SHA-256 evidence digest must match; filename alone never qualifies. The reactivated full report retains its ID and banked awards. A normal import matching an existing compact archive offers verified reactivation rather than duplicate awards.
6. Backup `type=midir-companion-backup`, `version=2` remains supported, but new backups contain **compact archive metadata and ledger, not the archived raw reports**. Old full-report backups remain importable. Users must retain original HTML/structured exports to recover individual archived details. Inaccessible or partial archival data should not be silently treated as complete.

## Encounter-scoped Arcana attribution

- A session's player Arcana can be stale if they left between gates and changed it. The **gate/attempt** is the unit of Arcana identification and cooldown history.
- An exclusive Arcana skill observed as player-attributed use, actor-verified observation, or player-to-boss skill hit identifies the Arcana for that encounter, even when the session-level label differs. Damage-only older samples remain supported. A skill shared with normal talents (e.g. Windmill) is not a strong Arcana identifier.
- Contradictory exclusive-Arcana evidence in the same attempt returns **unresolved** and is excluded from that Arcana's Rotation Highlights. Encounters with no exclusive skill evidence fall back to the session label and display this provenance in the Vault.
- This attribution is used for Recorded and cooldown-aware candidate eligibility, per-Arcana archived median/rotation summaries, the Vault Arcana label, and Harmonic Saint's special treatment in survival-achievement calculations. It does not change the raw imported `player.arcana` or the Recorded Peak scoring algorithm.
- Archived rotation sequences and award progress remain completely independent: a new skill median cannot mint achievement credit.

## Targeted tests

```
node tests/companion278_arcana_test.js
node tests/companion278_fingerprint_test.js
node tests/companion278_compaction_test.js
node tests/companion277_archive_rules_test.js
python tests/companion277_archive_ui_test.py .
node tests/companion276_rules_test.js
python tests/regression_companion.py .
python tests/interaction_test.py .
python tests/action_dispatch_test.py .
python tests/module_binding_test.py .
python tests/vertrag_survival_test.py .
python tests/vertrag_camera_test.py .
```

## Operational limitations

- The archival SHA-256 calculation needs `crypto.subtle`, which should be available in a secure browser context. If it is unavailable, compaction halts rather than discarding a full report. Browser storage and local-file origins vary.
- Persistent browser-origin IndexedDB migration from a real 277 profile, a complete restore and re-backup of the **user's** 32 MB backup, and forced disk-quota failures have not been demonstrated in this isolated test environment. Keep an external backup of 277 and originals for the first migration test.
- `sourceFingerprint` from earlier builds is a loose duplicate indicator, **not** a cryptographic proof. Migrated archives receive a SHA-256 digest of the stored parsed report; only a precisely matching reimport can reactivate it.
- A current 278 backup of a compact archive contains the information needed to preserve achievements/highlights but cannot reproduce the old report without reselecting its export.
