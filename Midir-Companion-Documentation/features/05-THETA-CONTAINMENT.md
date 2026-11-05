# Dark Diviner — Subject Theta: Containment — Feature Log

**Purpose:** A standalone first-person rhythm and resource-management trainer for Dark Diviner.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Progression and controls

- **Ten levels:** Progresses from basic Thunder cadence through Thunderblight, Shadow Flare, Render Dorcha, mechanic reaction, Twilight Surge, Hexshroud, Polar Vortex and Render Mana, culminating in combined sequences. [^1] [^2]
- **Skill input:** Eight configurable skill lanes, customizable hotkeys, cooldowns and response controls; key overlap protection and pause/retry/results behavior. [^1]
- **Resource model:** MP and Dorcha, Seething Mana score-spend toggle, Hexshroud Dorcha regeneration, and level-specific mechanic pressure. [^1] [^2]

## Presentation and rewards

- **First-person combat:** Perspective lanes, foreground hands/staff, illustrated Theta, animated telegraphs and generated rhythm tones. [^1] [^2]
- **Long-term progress:** Dark Sigil shop, unlocks, saved records and ten achievement entries integrated with the shared book. [^1] [^3]
- **Independent profile:** Uses localStorage `midir-theta-rhythm-v1` and participates in full-profile backup/restore. [^1] [^3]

## Verification and outstanding limits

- Skill costs, boss timing, scoring and judgment windows are modeled for play; they are not validated Mabinogi timings.
- The boss animation is composited art rather than a complete skeletal or hand-drawn action atlas.
- Final testing should include 10-level progression, restart/pause, muted audio, keybind conflicts, status effects, upgrade purchases, achievement unlocks and backup round trips.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Theta gameplay and save contract: [`theta-rhythm.js`](../../Companion%20Files/theta-rhythm.js), [`theta-rhythm.css`](../../Companion%20Files/theta-rhythm.css).
[^2]: Theta development notes: [`THETA-RHYTHM-NOTES.md`](../../Companion%20Files/THETA-RHYTHM-NOTES.md).
[^3]: Shared achievement and backup integration: [`app.js`](../../Companion%20Files/app.js).

## Build 283 follow-up — casting and Dorcha rules

- Vivace bonus casting speed is purchasable in eight +10% tiers, up to 80%; affects only provisional Shadow Flare / Twilight Surge casting time, not skill cooldowns. Offensive notes are arranged after each casting lock.
- Updated Dorcha cost model: Seething Mana 0.6 per magic/DD cast (reducible by the pre-existing shop upgrade), Shadow Flare 1, Thunderblight 1.5, Polar Vortex 3, Hexshroud 0.7, Render Mana 1; Render Dorcha grants 5 for 100 MP + 10% maximum MP. Thunder has no intrinsic Dorcha generation.
- Render Mana restores 30% maximum MP, reduces spell MP expenditure 20% for 15 seconds, and grants +1 to Render Dorcha if used during that period. Hexshroud contributes +0.5 Dorcha per attacking cast against the affected target.
- Twilight Surge's 36-second cooldown and Seething Mana residual-charge relationship are documented, but its direct Dorcha cost is unspecified, so no direct cost is charged here. Residual-charge simulation is still pending.
- Base casting time estimates and score model are provisional game mechanics, not verified animation measurements.

- **Build 284 resource-loop clarification:** Hexshroud applies a 10-second debuff to Theta (extended by shop upgrades), costing 0.7 Dorcha to activate. Successful attacks against affected Theta yield 0.5 Dorcha regardless of Seething Mana toggle state. During Seething ON, this offsets the 0.6-Dorcha Thunder surcharge for a net 0.1 spend (before Dark Economy reductions). Hexshroud does not independently increase scoring; Seething ON provides the empowered score bonus.
