# Companion 275 — Verification, Documentation History and Known Limits

**Baseline:** `Midir-Companion-275(5).zip` (the attached build-275 application), reviewed against the four attached historical documentation packs. **Master:** Documentation Pack 4. **Output:** Verified Pack 5, a documentation-only revision; no JavaScript, save state or application assets were changed.

## What was compared

| Transition | Documents added or removed | Historical changes material to the review |
|---|---|---|
| **Pack 1 → 2** | Adds `CURRENT-FEATURES.md` and `DESIGN-AND-TESTING-PRINCIPLES.md`; removes historical `CHANGELOG.md` from the pack | Expands Crom Invaders, equipment/economy, achievements, Rotation Highlights and cross-feature navigation. These sections were retained rather than reverting to older descriptions. |
| **Pack 2 → 3** | Adds `features/17-ARCANA-FIELD-GUIDES.md` | Adds detailed Arcana priorities, Vault award evidence, Crafter mechanics, Oath and Debuff Academy rules, storage commentary and shell routing. These form the basis of Pack 4. |
| **Pack 3 → 4** | No documents added or dropped (22 Markdown files preserved) | Substantive revisions to Vault/Import, Sacred Guardian Oath, Debuff Academy, Achievements, application shell and architecture. Pack 4 is the latest historical text, but still contains stale and contradictory statements. |
| **Pack 4 → verified Pack 5** | Preserves **all 22** Pack-4 Markdown files; adds this verification audit (23 total) | Corrects source-disproved behaviors, sharpens evidence boundaries, restores missing active feature details and fixes formatting/ambiguous language. |

The historical packs are **not** a change log for the application. A sentence added to a later document does not establish that its corresponding feature is active. The app source and included test fixtures take precedence.

## Material corrections in this edition

| Priority | Area | Prior claim or ambiguity | Verified build-275 description | Principal code evidence |
|---|---|---|---|---|
| **High** | Rotation Highlights cooldowns | The candidate *enforces* the ten-Arcana `RH_MIN_COOLDOWNS` and `RH_EXTRA_COOLDOWNS` tables. | Both tables are **declared but not referenced by the scoring path**. The active `rhCooldownEvidence()` uses `MIDIR_SKILL_USES.ruleFor()` and recognized use events to cap attributable hits. It is **not** a full minimum-cooldown rotation scheduler. | `app.js`: `RH_MIN_COOLDOWNS`, `RH_EXTRA_COOLDOWNS`, `rhCooldownEvidence`, `rhBuild`; `skill-use-rules.js`: `ruleFor`, `recognize`. |
| **High** | Rotation Highlights unknown skills | Unknown cooldown automatically makes a skill unscorable. | Unknown-specific rules can default to **0s configured cooldown / one hit per recognized use / two-second window**. Credit requires a recognized-use anchor and a noncritical or inferred baseline; absent those, hits are shown but unscored. | Same source functions as above. |
| **High** | Vault with Secret Sauce off | The Vault itself is hidden. | **The Vault remains an accessible starting route**, with compact Achievement Book and existing personal milestones. Importer-related controls, report views, collectibles and editing are concealed while the setting is off. | `app.js`: `vault()`, navigation/render setup. |
| **High** | Duplicate reports | Detection lets the user “replace or keep both” or deliberately retain a recognized duplicate as a second import. | The confirmation is **replace or cancel**; cancel retains the existing report and skips the new file. Separate near-duplicates can coexist only when not caught, with a possible-repeat warning. | `app.js`: import file loop, `confirm()` and Vault report warnings. |
| **Medium** | Backup size and file import | A single 175 MB “backup limit” or undefined import limits. | **175 MB** guard on accumulated HTML during backup export, **200 MB** maximum input backup file on restore, **40 MB** per imported report, **40 × 1,024² characters** per HTML string inside a restored archive (a JavaScript string-length check, not bytes), **250,000** NDJSON lines/events. | `app.js`: export/restore and report import handlers. |
| **Medium** | Crafter estimated boss damage | Inherited Crafter summary omitted the live bridge from imported hit baselines. | If matching imported character/Arcana boss data exists, the Crafter scores each accepted practice action as **one normalized noncritical boss hit**, marking inferred/missing data. Not DPS or realistic damage per full cast. | `app.js`: `craftDamageReference`, `craftDamageCalculate`, `craftDamagePanel`. |
| **Medium** | Gate collectible run links | Implication that an award history can always navigate to its associated run. | Run focus operates on the **current 25-report page** and does not automatically move to the archived page holding a report. | `app.js`: `focusAwardRun`, `reportPageSize`, report entry render. |
| **Medium** | Sacred Guardian sequence | High-level Arcana landing advice could be confused with the full Oath workshop's numeric cast chain. | Field-guide **Fateweaver → Wool → Oath** is a broad setup tip. Oath Max explicitly models the full **F → O → F → O → W → F → O** snapshot chain. | `rotation-reference.js`, `app.js` Oath workshop. |
| **Medium** | Header branding | Described as exclusively “Mabinogi Companion.” | Title switches between **Mabinogi Companion** (Secret Sauce off) and **Midir Companion** (on). | `app.js`: shell rendering and preference checks. |
| **Low** | Herb stone rolls | Stone odds attributed only to the generic shared routing and Crom bonus code. | The actual increment-based **1/250 ordinary** and **1/400 protective** rolls belong to `special-upgrade.js`; Crom's Huge Lucky Harvest is separate. The correct module is cited now. | `special-upgrade.js`: `herb(total)`; `as-chicken-invaders.js`. |
| **Low** | Source provenance and navigation | External Midir packet reference treated as supplied; feature 17 split into a malformed extra table; isolated index entry. | Unavailable external Midir document explicitly marked unverified, all **17 feature rows** in one map, and field guide integrated into the index. | Supplied ZIP inventory and Markdown structure. |

## High-confidence rules preserved from Pack 4

- **Bri Leith collectibles:** Gate 1's Ancient Giant uses form **7600 near 70%** and form **7601 near 25%**; Gate 2 uses **50%**; Gate 3 uses **80% and 40%**, **not 60%**. HP sampling is a proxy for a phase window, not exact spawn timing. Death events and a verified clear are required; absence of proof is not success or death.
- **Party debuff achievements:** Full Party Coverage checks the nine defined condition groups during an evidenced clear; **To the Nines** needs at least **seven concurrent groups for at least 97%** of the fight; **Perfectly Dressed** needs **all nine concurrently for six uninterrupted minutes**. Evidence grouping does not automatically identify individual casters.
- **Survival and clear records:** A recorded death is not inferred from negative HP or a vanished target. Harmonic Saint's exceptional revival behavior is not universally reconstructed from death events. Clockwork measures **boss-fight intervals from separate reports**, not full dungeon travel/mission time.
- **Save namespaces and backups:** Standalone game state may live outside the core profile. IndexedDB details, archived HTML and the supported `trainingExtras` backup payload remain distinct concepts. Protect existing IDs, profiles and data contracts.
- **Practice vs evidence:** Theta, Vertrag, Crom, Oath, Crafter, equipment and economy modules are simulations/trainers. Their progression is not a real Mabinogi clear, combat log or verified game-server formula.

## Verification performed on the supplied build

- **Source-level check:** Followed feature and award descriptions through `Companion Files/app.js`, `session-import.js`, `analysis.js`, `skill-use-rules.js`, `special-upgrade.js` and representative standalone activities. Compared all four pack inventories and their changed sections; Pack 4 is the preserved base.
- **Existing automated tests:** Ran bundled `tests/regression_companion.py` (**17/17 passed**), `vertrag_giant_rules_test.js`, and Python checks for interaction, action dispatch, AG targeting, Bri Leith naming, module binding, Vertrag survival and camera behavior. These support build integrity and selected behaviors, **not** complete gameplay validation.
- **Documentation checks:** Verified relative Markdown links and bundled source/asset references against the extracted app folder, reviewed major hard-coded save names and limits, and checked archive integrity. Recheck on any future release because source line locations and behavior may change.

## Outstanding validation and developer follow-up

1. **Rotation Highlights:** Decide whether to wire the ten-Arcana minimum-cooldown tables into a real scheduling validator, with resets, charges, heat/accumulation, targeted skill evidence and multi-hit cases. Do not use the word “fully cooldown-verified” until this exists and has fixtures.
2. **Archive/restore:** Test large authentic reports, browser quota errors, interrupted IndexedDB writes, failed backup restores and multi-origin local-file persistence. Automated source tests do not establish atomicity.
3. **Import evidence:** Validate all relevant new/old Midir export formats, remote action attribution, raw NDJSON death-evidence absence and each Bri phase cutoff with real sample sessions.
4. **UI interaction:** Manually exercise a browser-opened build: Secret Sauce on/off, genuine drag/drop/hotkeys, file import/duplicate decisions, all Arcana routes, responsive layouts, embedded original-report viewing and award links on later report pages.
5. **Gameplay mechanics and translation:** Simulated action timing, damage and drop rates are application rules. Compare to current game only with appropriate in-game evidence; Korean/Spanish coverage of standalone modules remains partial.

**Use rule:** The pack documents **what the supplied code does**. Any historical aspirations, external Midir exporter contracts or in-game claims without supporting source or tests remain labeled as assumptions, models or outstanding verification.
