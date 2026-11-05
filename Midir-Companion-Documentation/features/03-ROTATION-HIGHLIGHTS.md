# Rotation Highlights — Feature Log

**Purpose:** Compare a player's strongest *observed* boss-damage windows with a more conservative candidate constrained by the evidence of recognized skill uses and hit limits.

**Baseline:** Midir Companion 275. This documents source behavior, not a validated executable rotation, server-accurate cast log, or development timeline.

## Input, scope and baselines

- **Eligible data:** Uses the explicitly chosen Vault character and selected Arcana. Imported encounter and boss-target evidence determine eligible windows; the view needs usable imported reports. When precise Gate 2 data exists, it is preferred. Otherwise the analysis prefers other precise boss windows, then falls back to older grouped observations. [^1]
- **10-second burst / 60-second rotation:** Finds the highest normalized damage scores in each duration. These are different observational windows, not interchangeable predictions of indefinitely sustainable DPS. [^1]
- **Normalized per-skill damage:** Prefers a pooled, noncritical average **per boss hit**, not total encounter DPS. If only critical samples are available for a skill, an inferred noncritical equivalent may be estimated from other observed skills and marked accordingly. Passive/proc-only skills identified by the configured exclusion names are not treated as deliberate rotation actions. [^1]
- **Recorded peak:** Credits observed boss-hit activity with hit-group and skill-specific strike allowances. It is a record of output, **not** a claim that the sequence is repeatable or executable without temporary effects. [^1]
- **Evidence displays:** Skill-use lanes and timelines show what the parser/recognizer observed or inferred. A display event is not automatically a confirmed independent cast, particularly for multi-hit effects, remote actors and imported grouped data. [^1] [^2] [^3]

## How the cooldown-aware candidate actually works in build 275

- **Active rules:** `rhBuild()` calls `rhCooldownEvidence()` for each eligible encounter. That function gets recognized use events from `MIDIR_SKILL_USES.recognize()` and looks up `MIDIR_SKILL_USES.ruleFor(skillId, name)` in `skill-use-rules.js`. Each hit must fit a recognized use's configured time window and maximum-hit budget to earn candidate credit. Credit is calculated over the encounter's recognized-use timeline, not restarted at the left edge of a displayed 10/60-second window. [^1] [^3]
- **Unknown/default rules:** A skill without a special rule can fall back to **0 seconds configured cooldown, one hit per recognized use, and a two-second hit window**. It is **not excluded merely because its cooldown is unknown**. Hits without an eligible use anchor or damage baseline remain visible as **unscored** context. Some only-critical skills receive an explicitly marked estimated baseline. [^1] [^3]
- **No complete cooldown scheduler:** Although the file declares `RH_MIN_COOLDOWNS` and `RH_EXTRA_COOLDOWNS` with values for ten Arcanas and extra skills, **neither table is referenced by the build-275 scoring functions**. They are currently *inactive reference data*. The candidate does **not** enforce those complete tables as a hard, globally optimal, minimum-cooldown schedule. The active rule registry supports limited recognition/merging and per-use hit constraints; that is narrower than proving every cast could be repeated on cooldown. [^1] [^3]
- **Temporary cooldown exceptions:** Candidate scoring omits windows with identified **Time Shift** or **Bachram Boost** use/action evidence around the window, whereas the recorded peak can still show those bursts. Missing or misattributed exception evidence remains a limitation. [^1] [^4]
- **Remote attribution:** Player-attributed Combat Action hints and source-attributed condition events can help with timing. An effect addressed to a recipient is **not** automatically proof that the recipient cast the skill. Imported `0x6988` skill-use observations, `0x7926` actions and `0x9093`/`0x9095` effect rows have distinct evidentiary roles. [^3] [^4]

## Interpretation and future validation

- The labels **Recorded peak** and **Cooldown-aware** represent **separate scoring models**. The latter is a *partially audited candidate*, not a verified optimal rotation, exact cast count, true 10/60-second DPS, or promise that all Mabinogi modifiers and resources were modeled.
- The inactive tables supply numeric reference values for ten Arcanas and additional skills. Exceptional mechanics such as cooldown resets, charges, accumulated heat and multi-hit behavior require **separate, tested rule logic**. Defining a cooldown number alone does not make that rule active in the candidate.
- Validate representative use evidence, action timing, multi-target hits, DoT, cooldown reduction, charges and buff resets with targeted fixtures and real exports. Old reports cannot gain previously unrecorded events or millisecond precision retroactively.

## Source references

[^1]: Rotation Highlights selection, damage pooling and scoring: [`app.js`](../../Companion%20Files/app.js), functions `rhEligible`, `rhCooldownEvidence`, `rhBuild`, `rotationHighlightsView` and the *declared but unused* `RH_*_COOLDOWNS` tables.
[^2]: Timeline icons: [`rotation-skill-icons.js`](../../Companion%20Files/rotation-skill-icons.js), [`icons.js`](../../Companion%20Files/icons.js).
[^3]: Active use and hit-budget registry: [`skill-use-rules.js`](../../Companion%20Files/skill-use-rules.js), [`skill-evidence.js`](../../Companion%20Files/skill-evidence.js).
[^4]: Imported evidence and encounter grouping: [`session-import.js`](../../Companion%20Files/session-import.js), [`analysis.js`](../../Companion%20Files/analysis.js).
