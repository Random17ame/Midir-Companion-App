# Midir Companion 285

An offline browser companion for **Mabinogi** players. Import compatible **Midir** damage-tracking exports to review recorded encounters and achievements, or use self-contained Arcana practice, arcade games and equipment simulators. The Companion is independent of Midir and does not capture live gameplay.

**AI was used in developing this application.**

## Launch

1. Extract the full ZIP to one folder. Keep `Midir Companion.html`, `index.html`, `Companion Files/` and the documentation folder together.
2. Open **`Midir Companion.html`** in a compatible desktop browser (Chrome or Edge). `index.html` is also provided as the site-friendly launcher.
3. The Vault is the starting page. Use **Arcana Simulators**, **Debuff Academy**, or the ☰ **Overview** menu for training and games.
4. Export periodic **full-profile backups** from Settings. Keep the original Midir exports: local browser storage can be deleted independently of these files.

No installation, active Midir process or internet connection is required for the bundled application. Storage persistence can vary with browser and local-file origin.

## Included feature families

- **The Vault and Achievement Book:** Personal milestones, imported reports and original HTML archives, encounter-based records, boss-phase collectibles and awards when import features are enabled.
- **Rotation Highlights:** Recorded 10/60-second peak windows and evidence-limited, use-anchored candidates; these do **not** establish a globally valid cooldown rotation.
- **Arcana Simulators and Rotation Crafter:** Ten Arcana field guides, customizable practice controls and class-specific exercises.
- **Activities:** Subject Theta: Containment, Vertrag Survival Grounds, Crom Bás Invaders, Sacred Guardian Oath Workshop, Explosive Vanguard Tower Range Lab, music/rhythm and positioning exercises, chase games, and herb collection.
- **Debuff Academy:** Lessons, a nine-group effect field guide, flashcards and recognition drills.
- **Equipment and economy:** Reforge, Erg, Special Upgrade, Echostones, Storage Chest and simulated marketplace/progression systems.
- **Saved progress:** Practice records, user preferences and supported game state in full-profile backup/restore.

See the [current feature map](../Midir-Companion-Documentation-275/CURRENT-FEATURES.md) for the complete list and detailed per-feature references.

## See Secret Sauce and the Vault

In **Settings**, **See Secret Sauce** is off by default. The Vault itself **remains accessible**, with a compact Achievement Book and read-only personal milestones. Enabling the setting reveals imported-session tools, archived report views, collectibles, report analysis and related awards. Turning it off does **not** erase data. Full-profile backup and restore remain in Settings either way.

The header uses **Mabinogi Companion** when the setting is off and **Midir Companion** when it is on. Settings also include accent colors, text sizing, reduced motion and tooltip timing. English, Korean and Spanish are supported with incomplete translation coverage in some standalone games.

## Interpreting imported evidence

- Compatible structured HTML/JSON/NDJSON can differ substantially in the events and precision they contain. Missing death, casting or boss-completion evidence is **not** proof that an event occurred or did not occur.
- Remote skill attribution is conservative: recipient-only effects and damage-hit groups are not automatic confirmations of casts. The 0x6988 and 0x7926 observations serve distinct roles.
- **Rotation Highlights' ten-Arcana minimum-cooldown tables are used for cooldown-aware windows, while Recorded Peak is unchanged.** Candidate scores follow the active skill-use rule registry and recognized hit budgets; they are neither verified optimal rotations nor guaranteed repeatable cooldown schedules.
- Recognized duplicate report imports prompt **Replace** or **Cancel**, not an explicit keep-both option.
- Training mechanics, simulated economy rates and arcade difficulty are not official in-game measurements. **Tower Range Lab is experimental.**

## Documentation and developer references

- **[Verified documentation overview](../Midir-Companion-Documentation-275/README.md)** — start here; contains all seventeen feature guides.
- [Current feature map](../Midir-Companion-Documentation-275/CURRENT-FEATURES.md)
- [Application, import and save architecture](../Midir-Companion-Documentation-275/COMPANION-REFERENCE.md)
- [Accuracy corrections and history audit](../Midir-Companion-Documentation-275/VERIFICATION-AND-PACK-HISTORY.md)
- [Historical application changelog](CHANGELOG.md) — release-by-release history, newest first, with current-build clarifications.
- [Skill icon audit](SKILL-ICON-AUDIT.md) and [Sacred Guardian developer notes](SG-OATH-DEVELOPER-NOTES.md)

**Data caution:** Player backups and saved local reports are not encrypted; handle them accordingly. Full browser storage loss can permanently remove saves that have not been backed up.


## Companion 0.2.78 — compact archive and per-encounter Arcana evidence

Old archived imports can be unloaded from browser disk after a one-time confirmation. The archive retains achievements, per-Arcana winning rotation sequences, one historical median per skill, and identifying report metadata. The structured report and HTML copy are erased from local storage **only after their summaries have been saved**. To return an archived report to active, select its original `.html`, `.json`, or `.ndjson` export again; a SHA-256 digest of the parsed report evidence must match. Keep your original exports on your computer, as full backups made after compaction contain only archived summaries. Previously archived 277 reports are migrated from cold storage where available.

Arcana identification for Rotations and relevant achievements now uses distinctive player-attributed skill use or damage within **each encounter**; the session Arcana label remains a fallback where no exclusive skill is observed. Conflicting evidence is marked unresolved rather than assigned to an incorrect Arcana. Recorded Peak's damage-window rules and cooldown reset boundaries are unchanged. Archive lifetime award credits and median-normalized Rotation Highlights remain separate.

## Companion 0.2.77 — archived lifetime records

The Vault archives incomplete and overflow reports, with ten reports per active/archive page and 30 active at most. Archived reports are summarized and their heavy structured details are moved out of memory into the IndexedDB `cold` store. A selected report can be restored to active for full inspection. The archive view shows a banked achievement/collectible list and a per-Arcana selector for archived 10/60-second Recorded and cooldown-aware rotation candidates. Historical skill medians are retained one per skill, updated when a new archived run contains that skill; both competing sequences use the same current median. **Archive achievement credits are never earned by re-scoring a rotation**. Individual source milestone history is not retained once archived.

As of 277, full backups (still type `midir-companion-backup`, version 2) included recoverable cold reports. **As of 278, compact archived entries are backed up as summaries only**; the original external exports are required to restore their details. Keep your exported backup and original HTML outside the browser. Cold storage does not eliminate the on-disk original structured report; it protects manual unarchive and full-backup recovery. Do not clear site storage. Browser-origin IndexedDB restore is still pending an end-to-end compatibility test in a real browser profile.

## Companion 0.2.76

Vault active imported reports now show ten entries per page and offer an Archive tab. Old reports without both canonical boss damage and skill observations are archived automatically, as are entries older than the newest 30 active reports. Archived reports are **not deleted** and continue to contribute to historical analysis and achievement evidence. Export a full backup as the collection grows; the archive is an organization view, not yet a disk-space reduction feature.

Rotation Highlights' **Recorded Peak is unchanged**. The cooldown-aware 10s and 60s figures use provisional minimum-cooldown and skill-duration tables, including support for boss-damage-only old reports. Cooldowns reset per encounter. Please report questionable use assignments so the shape rules can be refined without removing historical data.

Subject Theta now ends after five overheat marks (three consecutive successes clear the marks), and Vertrag's zero-stomper Time Trial still requires defeating four living giants. Existing training progress is retained.

## Companion 0.2.79 — Mobile Vault and Sacred Guardian checklist

Phone browsers display a compact Vault companion section with a one-tap route to the Sacred Guardian Oath-maxing checklist. This uses the same saved checklist and backup contract as desktop. For mobile report imports, enable the existing optional report features from Settings; downloaded Discord HTML exports can then be chosen with the phone file picker. Mobile retains at most ten active detailed reports, versus thirty on desktop; older entries are archived under existing consent-based compaction rules. Keep original exports outside the browser to reactivate compacted reports.

Phone imports of files >=12 MiB, low browser quota, or imports that could overflow the ten-active limit display an additional warning before parsing. A browser quota estimate is **not** an available-memory guarantee. Keyboard/mouse-dependent games show a disabled desktop-only state on phones; their desktop behavior is unchanged. A secure HTTPS host is recommended for mobile browser persistence and SHA-256 file reactivation. No cloud synchronization is included. Test on actual phones before trusting important data to mobile storage; external backups remain essential.
