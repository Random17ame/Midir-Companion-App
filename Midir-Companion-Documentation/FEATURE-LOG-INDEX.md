# Midir Companion — Feature Log Index

**Baseline:** Complete Companion 275 release. These logs describe supported functionality **as implemented**, grouped by purpose. They do not reconstruct exact dates or commits for every feature. Individual source references point to the Companion 275 tree. [Current Architecture Reference](COMPANION-REFERENCE.md) documents the shared contracts; [Current Feature Map](CURRENT-FEATURES.md) is the concise product-level summary.

## Feature logs

- [The Vault and Report Import](features/01-VAULT-AND-IMPORTS.md)
- [Archive Storage, Profiles and Backup](features/02-ARCHIVES-AND-PROFILE.md)
- [Rotation Highlights](features/03-ROTATION-HIGHLIGHTS.md)
- [Rotation Crafter and Arcana Practice](features/04-ROTATION-CRAFTER.md)
- [Dark Diviner — Subject Theta: Containment](features/05-THETA-CONTAINMENT.md)
- [Vertrag — Giant Phase Survival Grounds](features/06-VERTRAG-SURVIVAL.md)
- [Alchemic Sharpshooter — Crom Bás Invaders](features/07-CROM-INVADERS.md)
- [Sacred Guardian — Oath Workshop](features/08-SACRED-GUARDIAN-OATH.md)
- [Explosive Vanguard — Tower Range Lab](features/09-EXPLOSIVE-VANGUARD.md)
- [Debuff Academy](features/10-DEBUFF-ACADEMY.md)
- [Achievement Book, The Vault and Personal Records](features/11-ACHIEVEMENTS-AND-RECORDS.md)
- [Music Lab and Melodic Puppeteer Rhythm](features/12-MUSIC-AND-PUPPETEER.md)
- [Positioning, Frame Challenges and Chase Games](features/13-POSITIONING-AND-CHASE.md)
- [Herb Collection and Precision Harvest](features/14-HERB-COLLECTION.md)
- [Equipment Simulators, Special Upgrade and Storage Chest](features/15-EQUIPMENT-AND-ECONOMY.md)
- [Companion Shell, Settings, Languages and UI](features/16-SETTINGS-AND-APPLICATION.md)
- [Arcana Skill Field Guides](features/17-ARCANA-FIELD-GUIDES.md)


## Documentation rules

- Record *implemented* behavior in the relevant feature log; record new source changes in the current feature map only when they materially change user-facing capabilities or data contracts.
- Keep specific mechanics, saving, confidence limits and acceptance tests in the feature log or architecture reference; do not inflate the overview with release-by-release repairs.
- Append or update numbered file references when code ownership changes. References identify **source paths**, not an inferred commit, proof of game accuracy, or a missing test.
- Separate Midir exporter evidence from Companion interpretation. Do not convert received effects or repeated hits into confirmed casts, and do not reconstruct absent observations in older exports.
- Retain localStorage/IndexedDB IDs, saved achievements, existing import semantics and profile backup compatibility unless a documented migration is implemented and tested.
- When a feature has been designed but not implemented, place it under **Outstanding limits** rather than a release-history record.
