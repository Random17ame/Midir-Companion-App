# Companion 276 — verification and compatibility notes

## Included changes

- Rotation Highlights `Recorded Peak` branch is left unchanged; `rhCooldownEvidence()` now consults the ten Arcana cooldown tables and `RH_SKILL_SHAPES`. Skill shape durations are **provisional** and intended for frequent correction.
- DoT damage remains attributable to the previous use within a shaped duration; when no use observation exists, boss damage infers current/prior use. Encounter processing is independent across gates/attempts.
- The Vault has 10-entry active/archive pagination and a manual archive toggle. Old incomplete data and report overflow beyond the newest 30 active entries are archived by default.
- Archive classification considers skill observations, canonical boss encounters and positive damage to an encounter boss. Full report details remain stored and hydrated while archived so record/achievement/Rotation Highlights queries keep working. This is **not** yet true offloading/unloading or summary-only retention.
- Backup warning is visible at 20 active reports, with an export action. Main profile/report IDs, achievement IDs and backup v2 remain unchanged.
- Theta: accumulated overheat 5 ends the attempt with no reward; three successful note judgments clear marks.
- Vertrag: four living giants for all Time Trial and Endless configurations; stomp pressure controls initial occupancy, not life/death.

## Automated test commands

```sh
node tests/companion276_rules_test.js
python tests/companion276_gameplay_test.py .
python tests/regression_companion.py .
python tests/interaction_test.py .
python tests/action_dispatch_test.py .
python tests/module_binding_test.py .
python tests/vertrag_survival_test.py .
node tests/vertrag_giant_rules_test.js
python tests/vertrag_camera_test.py .
```

`companion276_rules_test.js` checks cooldown conflicts, DoT credit continuity, hit-inferred fallback, gate reset, legacy archive classification and 30-item active cap. `companion276_gameplay_test.py` runs in isolated Chromium and verifies Theta no-reward failure and Vertrag zero-stomper/four-giant Time Trial.

## Backup fixture

`tests/fixtures/companion276-synthetic-backup-v2.json` is a **fictional v2-format** profile containing 24 reports (2 legacy/no observations), a milestone, and both Theta and Vertrag saved progress. Use this for restore/page-count regression checks; it must never replace a user's actual backup. Real `file://` origin restoration and storage pressure behavior cannot be established by the injected-browser harness here.

## Unfinished items

1. A full user-backup restore/backup round-trip once an actual backup is provided, including archived original HTML, achievements, and Theta/Vertrag state.
2. True archived detail unloading and compact rolling best-peak/normal-rotation summaries, coupled to safe rehydration and reversible backups.
3. Deep validation against individual actions in the three supplied HTML samples; skill rules are initially provisional. Some observed-use packets are not confirmed completed casts.
4. More comprehensive Subject Theta feedback and Vertrag play feel/achievement balancing.
5. Storage fault/transaction rollback, multi-part backup export and archive integrity checks.
