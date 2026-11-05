# Companion 277 archive and saved-profile compatibility

## Functional contract

- List at most ten active or archived reports on each page; at most 30 active reports, with older and incomplete imports moved to the archive. The backup reminder remains visible at 20 active entries.
- Each newly archived report is evaluated while its full structured data is still accessible. Its individual report-earned milestones are discarded after conversion into a durable `archiveLedger.awards` count-by-type. Existing active awards and game-specific achievements remain separate. The archive ledger cannot be credited by highlight normalization, and repeat compaction is idempotent by report ID and source signature.
- Archive-owned Bri Leith collectible balances are banked independently, and manually reactivated source reports are not counted twice.
- Each Arcana has one rolling winning sequence in each scoring category `best:10`, `best:60`, `repeatable:10`, `repeatable:60`. Only the winning skill-hit sequence, event timing, source metadata, and one skill-specific median are needed for ongoing comparisons. A newer archived median takes precedence for the same skill; otherwise retain the previous skill's value. Both sequences are evaluated under that same table. Crit-only baseline approximations can be retained with an `estimated` flag.
- `details` contains compact archive index/summary records and `cold` contains full original structured reports. Both records are written in the same IndexedDB transaction; the profile localStorage index and summary ledger follow. Startup can replay missing ledger credit from saved compact summaries. Return-to-active reads from cold, and full profile backup reconstructs full structured records. The `reports` object store for interactive HTML remains independent.
- Deleting an archived entry removes recoverable structured details, cold details, and any original HTML, but leaves previously banked lifetime awards and winning rotations. Individual source milestone histories beyond the first 30 active sessions are not retained.

## Tests

```sh
node tests/companion277_archive_rules_test.js
python tests/companion277_archive_ui_test.py .
node tests/companion276_rules_test.js
python tests/companion276_gameplay_test.py .
python tests/regression_companion.py .
python tests/interaction_test.py .
python tests/action_dispatch_test.py .
python tests/module_binding_test.py .
python tests/vertrag_survival_test.py .
python tests/vertrag_camera_test.py .
```

## Real backup fixture

The externally supplied `midir-companion-full-backup2.json` is version 2 and contains 16 structured reports, 126 existing milestone entries, and eight retained interactive HTML originals. Every report has legacy damage data but no newly introduced root-level skill-observation or damage-hit arrays. The real backup is **not bundled** to protect user data. The separate fictional v2 backup in `tests/fixtures/` remains the distributable restore fixture.

## Verification limitations

The test environment blocks direct file/HTTP/data navigation in Chromium, so authentic persistent-origin IndexedDB upgrade and real full-backup restore could not be proven here. The release intentionally does not purge cold storage or promise a reduction in browser disk usage. Retain external backups and your original Midir exports, particularly since only 8 of 16 HTML originals are present in the provided backup. The full-backup restore path in this baseline is still not transactionally rolled back on all possible storage failures.
