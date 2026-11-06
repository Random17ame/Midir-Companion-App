# Archives, profiles and backup

**Applies to:** Midir Companion 0.3.11d.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Active and archived reports

- The Vault manages detailed active reports and historical archive summaries. Desktop retains at most **30 active detailed reports**; the phone policy defaults to **10**. The interface uses paginated lists.
- Compacted archives retain identifying metadata, historical achievement/collectible credit and summarized rotation statistics, but not the full original report content. Retain the original import file for later reactivation.

## Reactivation and duplicates

- Compact report reactivation requires selecting the original compatible report file and passing its evidence fingerprint check. Importing the same recording should not award a second lifetime credit.
- The local archive uses browser-side IndexedDB where supported; browser site data removal can erase saved reports.

## Backups and device behavior

- Settings exports a `midir-companion-backup` **version 2** JSON file containing Companion state and supported minigame/simulator state. Restoring a compact archive does not recreate original raw exports missing from that backup.
- Desktop and mobile are separate browser storage environments. A GitHub Pages deployment is static hosting, **not a synchronization service**. Preserve external full backups and original reports.

## Source references

1. Storage, backup and archive operations: [`app.js`](../../Companion%20Files/app.js).
2. Export conversion: [`session-import.js`](../../Companion%20Files/session-import.js).
