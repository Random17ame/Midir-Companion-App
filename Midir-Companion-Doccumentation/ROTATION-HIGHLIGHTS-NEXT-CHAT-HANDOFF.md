# Rotation Highlights — Next Development Chat Handoff (Midir Companion 0.3.11d)

**Scope:** Development roadmap and source-verified starting points. This is not a claim that unverified Mabinogi skill cooldowns or shapes are established. The authoritative current application and documentation are included in `Midir-Companion-0.3.11d-GitHub-Ready.zip`.

## Where we are

- **Version baseline:** Midir Companion 0.3.11d. The latest release refines Theta rhythm timing and miss-only failure after the earlier Music Calculator updates; it intentionally **does not change Rotation Highlights mechanics**.
- **Living rules:** `Companion Files/app.js` (`RH_MIN_COOLDOWNS`, `RH_EXTRA_COOLDOWNS`, `RH_SKILL_SHAPES`, `rhCooldownEvidence`), `Companion Files/skill-use-rules.js`, `Companion Files/skill-evidence.js`, `Companion Files/analysis.js`.
- **Current inventory:** [`ROTATION-SKILL-RULES-INVENTORY.md`](ROTATION-SKILL-RULES-INVENTORY.md) lists 113 Arcana minimum cooldown floors, 15 additional floors, and nine explicit duration/hit budgets. These are **implemented rules**, not a verified live-game database.
- **Source conventions:** A zero-second floor means no enforced positive minimum, **not** proof of a zero cooldown. A simulated Crafter or minigame cooldown is not automatically a Rotation Highlights floor.
- **Current encounter choice:** Prefer boss-only damage evidence when available; fall back to Gate 2. Preserve conservative source/actor attribution.
- **Critical normalization:** Do not weight critical hits above normal hits. Each recognized skill's hits should use the same estimated **non-critical** damage reference. For skills observed only as critical, estimate the non-critical damage with the same player's observed critical multiplier if evidence permits. Keep critical labels informative only.
- **Melodic Puppeteer:** Active Wireless Puppet numbered Act skills may appear with an exporter `AI` suffix. Treat them as corresponding numbered active Acts in the visual skill tracks, retaining raw identifiers for evidence. Other AI-suffixed MP attacks may be active too; do not discard solely on suffix. Do not fabricate player-attributed uses from unattributed hits.
- **Training-specific rules:** Cutting Chorus rhythm training has the preexisting 4s/2s Link toggle and a **provisional +3 seconds** on numbered Puppet Act cooldowns. The actual live-game +2/+3 variant needs verification; this is **not** established as an authoritative Rotation Highlights rule.

## Intended next workstreams

1. **Mechanics database foundation:** Create a single well-defined skill record: canonical name, Arcana, exporter IDs/aliases, base cooldown, minimum possible cooldown, modifier sources, cast/charge/animation timing, damage duration, hit/tick budget, and geometry (single target, line, cone, ground field, chain, aura, move-with-caster, etc.). Each field carries evidence status, date and source references.
2. **First Arcana audit — Melodic Puppeteer:** Enumerate every MP and base Puppetry attack, Wireless Puppet Act IDs, true action/damage grouping, cooldown reductions, and per-skill shape. Inspect the existing real exporter evidence and the user's upcoming controlled Melodic Puppeteer exports. Normalize visual names only with grounded mappings.
3. **Controlled video/export comparisons:** For each skill, use repeatable target arrangements, known buffs/reforges/Link/equipment, visible cooldown UI and synchronized exporter events. Record frame/timestamp uncertainty and test several activations. Video can bound timing and geometric coverage but does not automatically reveal hidden/server hitbox limits.
4. **Reconstruction improvements:** Group an activation's multi-hit/DoT data without duplicate skill uses; distinguish actor-vs-puppet attribution; enforce cooldowns as plausibility checks, never discard explicit recorded actions merely because a provisional rule disagrees.
5. **Regression and cross-module reuse:** Add tests with known real/exporter skill signatures and multi-target samples before adjusting detection or scoring. Consider a shared skill data table for Rotation Crafter / games only after mechanics are verified. Keep training balance overrides explicitly separate.
6. **Arcana expansion:** Continue with Alchemic Sharpshooter and Arsenal Gunner, then the remaining Arcana; review base combat skills alongside the Arcana that use them.

## Evidence quality and annotation

- **Verified:** Repeated observations with controlled conditions and compatible exporter/video evidence.
- **Estimated:** Supported by observations, but exact thresholds or modifiers uncertain; retain bounds/uncertainty.
- **Provisional:** A working model (e.g., MP +3s trainer penalty) not confirmed in live-game conditions.
- **Unknown:** No sufficient evidence. Do not invent numeric defaults or falsely imply a zero value.

Recommended per-test annotation: skill name and exporter ID, player/actor, server/recording timestamps, equipment/reforges/Link, target geometry, target count, hit counts, critical flags, buffs/debuffs, camera/frame rate, first/last effect frame, earliest possible next activation, and confidence level.

## Key regression invariants

- Never credit an ambiguous damage event to a player without actor evidence.
- Preserve grouping and all previously supported skill uses, including Wireless Puppet variants.
- Do not double-count one multi-hit/DoT activation as repeated active uses.
- Critical hits do not improve Rotation Highlights score; estimates use per-player critical multiplier evidence.
- Prefer boss-only data, with Gate 2 fallback when boss-only is absent.
- Keep documentation current-state only, with history exclusively in `CHANGELOG.md`.
- Avoid changes to storage, profile backup or game rules during a skill-data-only iteration.

## First tasks for next chat

1. Verify the 0.3.11d cumulative source archive and read `README.md`, `Midir-Companion-Doccumentation/README.md`, `features/03-ROTATION-HIGHLIGHTS.md`, `ROTATION-SKILL-RULES-INVENTORY.md`, and `DESIGN-AND-TESTING-PRINCIPLES.md`.
2. Programmatically inventory the exact supported MP canonical names, exporter aliases/IDs, grouping signatures, cooldown floors and duration rules from source. Produce an evidence-gap table **without** changing behavior first.
3. Establish a clean format for receiving the user's many video and combat-export files: naming, timestamp alignment, recording conditions, one-skill trials and confidence labels.
4. Apply only validated skill-rule improvements with focused fixtures and document source references.

## Suggested opening message

> We're continuing Midir Companion development from the cumulative **0.3.11d GitHub-ready archive**. First verify the ZIP and read the current documentation and `ROTATION-HIGHLIGHTS-NEXT-CHAT-HANDOFF.md`. After Theta field checks, the next priority is a source- and evidence-grounded overhaul of Rotation Highlights' minimum cooldown rules, skill shapes, hit grouping and activation detection, beginning with Melodic Puppeteer and Wireless Puppet acts. We'll contribute controlled gameplay videos and exporter evidence. Preserve boss-only → Gate 2 fallback, non-critical damage normalization, conservative player attribution, the current-state documentation format, and tested cross-module functionality. Don't invent mechanics; distinguish verified, estimated, provisional and unknown.
