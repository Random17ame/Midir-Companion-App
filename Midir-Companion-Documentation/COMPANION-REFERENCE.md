# Midir Companion — Current Architecture Reference (275)

**Purpose:** A compact source map and stability contract for future maintenance. This describes the **Companion 275 implementation**. It does not supersede the Midir source's own packet/export documentation, and it should not be read as proof that all gameplay timers or record interpretations have been live-validated.

## 1. Offline entry points and routing

- `index.html` and `Midir Companion.html` load the local `Companion Files/` scripts and assets. Keep relative directories intact.
- `Companion Files/app.js` owns the central profile, navigation, achievement book, Vault, Rotation Highlights, Rotation Crafter, Debuff Academy and many Arcana workspaces.
- Large activities in their own scripts expose `window.MIDIR_*` APIs with some combination of `view`, `mount`/`bind`, `leave`, `exportState` and `importState`. Verify each module's actual contract before calling it; they are not identical interfaces.
- `See Secret Sauce` hides importer-related surfaces without deleting source data. Backup/restore remains available.

## 2. Imported evidence and attribution

- Report HTML supplies one embedded JSON `script#data` payload. Companion-compatible wrappers and older report formats are accepted when recognized. Full party `players[].deathTimes` in processed HTML are usable as recorded death evidence; raw NDJSON currently does **not** reconstruct those timestamps.
- Preserve the separate meanings of `skillUseEvents`, `damageHitEvents`, `skillObservations` and canonical `encounters`. `skillUseEvents` (explicit `0x6988` evidence) is not a universal cast count. `0x7926` actor-verified action clues may repeat. `0x9093`/`0x9095` are often recipient-addressed effects and cannot be freely assigned to casters.
- `relativeMs` is relative to the report first-damage baseline and may be negative. Exported entity IDs are strings for 64-bit safety. Boss-only does not mean all-target.
- **Deadly is not a death:** negative HP can be a living Deadly state. Do not turn HP values, absent status updates, or a disappearing boss into confirmed deaths, revivals or clears. A Bri Leith normal revive allowance is per gate; the next death normally leaves that player down, but Harmonic Saint has exceptional self-revival rules that death timestamps alone cannot resolve.
- **Party visibility differs by format:** processed HTML may list multiple players, their Arcanas and gate-local deaths even when viewed from one player; older HTML or raw NDJSON can be missing one or more of these fields. Award logic must check completeness before treating an absent death list as zero deaths.
- **Debuff identity:** the nine-slot Full Party Coverage check is condition-based and does not need caster attribution; personal debuff contribution awards use recorded attacker IDs or cautiously correlated evidence. See [Vault achievements](features/11-ACHIEVEMENTS-AND-RECORDS.md) for the exact slot groups and timed-overlap rules.
- The Midir exporter’s packet contracts and parsing blind spots require separate Midir-source verification. A file titled `SKILL-AND-EXPORT-REFERENCE.md` is referenced by historical notes but is **not part of the supplied Companion 275 source bundle**; it should not be represented as checked evidence or silently reconstructed here.

### Vault ownership and Gate collectibles

- The Vault follows an explicit, trimmed, case-insensitive character-name match against each imported report's player list; it does not select a party member by rank or by the recording player's assumed identity. An unmatched player cannot receive personal awards. Editing the selected name rebuilds report-derived milestones; manually written milestone notes are independent. See [Vault and Report Import](features/01-VAULT-AND-IMPORTS.md).
- The three collectible balances are signed (+1/−1/0) and clear/evidence gated. Gate 1 must distinguish **7600 at 70%** from **7601 at 25%**; Gate 2 evaluates 50%, and Gate 3 evaluates **80% and 40%, not 60%**. The HP sample boundary is an observed proxy for a mechanic window, not proof of exact giant or halo timestamps. See [Achievement Book](features/11-ACHIEVEMENTS-AND-RECORDS.md).
- On a recognized duplicate, import offers **replace** or **cancel** (keep old import, without adding the new one); replacement retains report identity and recalculates awards. Similar sessions **not caught** by duplicate detection may be stored separately, counted separately and flagged as possible repeats. Keep fingerprints, archive HTML and award recomputation consistent during replacement and removal.


## 3. Persistent storage and backups

| Area | Current contract | Source |
|---|---|---|
| Main profile | localStorage `midir-companion-01`; lightweight index when IndexedDB hydrated | `Companion Files/app.js` |
| IndexedDB | `midir-vault-archive-v1` v2; `details` and `reports` stores | `app.js` |
| Vault report list | 25 cards per page; structured records hydrate into memory at startup rather than being fully lazy-loaded | `app.js` |
| Full backup | `midir-companion-backup` v2; `data`, `archivedHtml`, `trainingExtras` | `app.js` |
| Theta | localStorage `midir-theta-rhythm-v1` | `theta-rhythm.js` |
| Vertrag | localStorage `midir-vertrag-survival-v1` | `vertrag-survival.js` |
| Crom Invaders | `midir-as-crom-invaders-v1` and `midir-as-crom-global-bonuses-v1` | `as-chicken-invaders.js` |
| Tower Range Lab | `midir-ev-tower-lab-v1` | `ev-defense.js` |
| Pig Pursuit | `midir-companion-ek-pig-v1` | `ek-pig-pursuit.js` |
| Bandit Hunt | `midir-companion-bb-bandit-v1` | `bb-bandit-flip.js` |
| Puppeteer rhythm | `midir-mp-rhythm-v1` | `mp-rhythm.js` |
| Herb chest/challenge | `midir-companion-herb-chest-v1`, `midir-companion-herb-challenge-v1` | `herb-collection.js` |
| Special Upgrade | `midir-special-upgrade-v1` | `special-upgrade.js` |
| Erg | `midir-erg-simulator-v1` | `erg-simulator.js` |

These are compatibility anchors. Profile export can be restricted by archive size; browser database and localStorage may be tied to an origin/path. Never claim a ZIP download itself contains a player's saved profile.

- The **175 MB export threshold** applies to accumulated archived HTML; **200 MB** is the backup-file restore guard; each embedded archived-HTML string in a restored backup has a **40 × 1,024² JavaScript-character length guard**. The normal report-import limit is **40 MB per file**, and NDJSON parsing rejects more than **250,000 lines/events**. Full backup contains structured report records and supported `trainingExtras`, but does **not** package the Companion application source files. Confirm separately which standalone module saves are included.

## 4. Rotation Highlights — current evidence limit

- Active calculations: `app.js` functions `rhEligible`, `rhCooldownEvidence`, `rhBuild`, `rhVisualTimeline`, `rotationHighlightsView`, with active recognition and per-use hit rules in `skill-use-rules.js` and corroboration in `skill-evidence.js`.
- **Inactive reference maps:** `RH_MIN_COOLDOWNS` and `RH_EXTRA_COOLDOWNS` are declared in `app.js` but **not read by the scoring path in build 275**. Do not describe their ten-Arcana values as enforced cooldowns.
- Recorded Peak and Cooldown-aware candidate are separate 10/60-second scoring models. Candidate hits need a recognized-use anchor, a configured/default per-use hit budget and a noncritical/estimated reference value. **Unknown fixed cooldown by itself does not exclude a skill** (`ruleFor` can default to 0s and one hit per use). No whole-rotation minimum-cooldown proof is implemented; do not convert a partial candidate into a verified rotation.
- Regression should include local 0x6988, remote 0x7926, ambiguous effect-recipient 0x9093/0x9095, non-damaging skills, DoT and multiple hits, encounter boundaries, old reports without millisecond evidence.

## 5. Theta and Vertrag — gameplay boundaries

- Theta: `theta-rhythm.js` has ten levels, skill/resource scoring and independent progression. See `THETA-RHYTHM-NOTES.md` for which timers are provisional. Validate audio, frame display, stage progression and whole-profile restore in an actual browser.
- Vertrag: `vertrag-survival.js` uses arena world size 850×540, circular playable footprint, camera transform, eight built-in image landmarks, giant behavior and survival/timed drills. Approved map path: `assets/vertrag/giant-phase-arena.png`. Source giant stations: 1, 5, 7 and 11 o’clock.
- Vertrag proximity suppression and permanent Time Trial defeat are distinct from pending stomp circles; Endless giants never die. Blue Hemorrhage drops all stacks after 30 seconds without a new application.
- Tests verify important source logic, not the lived Mabinogi fight or all frame-perfect inputs. In particular the 500-damage aura *amount* is established in the game model, while 1.5 seconds is a configurable starting tick interval.

## 6. Verification entry points

- Run appropriate present scripts under `tests/`, including `regression_companion.py`, `interaction_test.py`, `action_dispatch_test.py`, `module_binding_test.py`, `vertrag_survival_test.py`, `vertrag_giant_rules_test.js`, `vertrag_camera_test.py` and `arena275_visual.py`.
- Use `node --check` on changed JavaScript, confirm all referenced assets exist, run ZIP integrity checks, and do manual Chrome/Edge interactions for the actual app and browser persistence. Test scripts may inject modules into synthetic Chromium pages, not operate as a complete disk-open playthrough.
- An archive-storage change needs a backup/restore round trip with real files plus failure-case testing (quota, interrupted writes, migration and duplicate replacement). A game-art change needs visual sprite crop and overlap review.

## 7. Special Upgrade and cross-game integrity

- `special-upgrade.js` stores **R/S step 0–8**, not combat stat increases. Normal and Alban rate arrays differ, and Alban costs triple. Failed unprotected steps 6–8 brick the weapon until a 1-billion-gold essence is consumed.
- Storage Chest movement between Reforge, Erg and the anvil must preserve a weapon's full identity and `specialUpgrade` property. Off-hand Orb/Spellbook/Shield/Guard Cylinder items must not enter Erg or Special Upgrade.
- `MIDIR_SPECIAL_UPGRADE.herb(total)`, `.flip()` and `.wave(weapon)` receive distinct external game reward signals; the herb API is increment-based and must not reroll old totals. See the [Equipment and Economy feature](features/15-EQUIPMENT-AND-ECONOMY.md).
- The current game architecture includes **independent localStorage save namespaces**. A full Vault backup should be tested against all touched namespaces, rather than assuming a core-profile save guarantees the attached game data.

## 8. Maintenance boundaries

1. Treat the full `Midir-Companion-275.zip` as the release source of truth, and these feature logs as descriptive indexes.
2. Keep documentation current when adding gameplay actions, save keys, data interpretation or new achievements; do not imply user-facing completion from an asset mockup alone.
3. Add a new feature log only when it is materially independent; most routine fixes belong in an existing log.
4. Preserve saved IDs, imported provenance, and the Secret Sauce visibility boundary during changes.

## Source references

[^1]: Core routing, importer, profile and feature logic: `Companion Files/app.js`.
[^2]: Evidence processing: `Companion Files/session-import.js`, `analysis.js`, `skill-use-rules.js`, `skill-evidence.js`.
[^3]: Current standalone game contracts: `Companion Files/theta-rhythm.js`, `vertrag-survival.js`, `as-chicken-invaders.js`.
[^4]: Existing regression and release notes: `tests/` and `Companion Files/CHANGELOG.md`.
