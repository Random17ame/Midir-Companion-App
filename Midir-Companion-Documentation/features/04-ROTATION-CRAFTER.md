# Rotation Crafter and Arcana Practice — Feature Log

**Purpose:** Let players rehearse hotkeys, timing, action locks, and Arcana-specific execution separately from imported combat reports.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Common Crafter

- **Shared practice:** Per-Arcana skills, configurable hotbar slots, rotation sequence presets, cooldown/action timing, records and a visual target stage. [^1] [^2]
- **Character scenes:** Uses dedicated sprite archetypes and distinct windup/strike art, with effects appropriate to bows, guns, alchemy, shields, dual blades, staves, lances and control bars. [^1] [^3]
- **Estimated boss damage bridge:** When a matching character/Arcana has usable imported boss data, a panel derives a **per-skill noncritical damage-per-hit reference** from Rotation Highlights. It credits **one normalized single-target strike per accepted practice action**; unmatched actions contribute zero and inferred baselines are labeled. This is **not real DPS**, a critical-hit simulator, or a verified damage-per-activation estimate. [^1]
- **Evidence boundary:** Skill cooldowns, enemy interaction and estimated damage in the Crafter are practice models; measured combat performance must come from imported Midir evidence. [^1]

## Specialized mechanics

- **Alchemic Sharpshooter:** Element/orb management, aimed attack frames, positioning coverage and sequence practice. [^1]
- **Arsenal Gunner:** Field placement, target-centered Heavy Artillery, straight firing lanes, five Energy Bullet indicators and charge-based Bullet Barrage/Fatal Scope. The Arcana is named **Arsenal Gunner** in the current build. [^1] [^4]
- **Sacred Guardian:** Timed enemy tells and Rend Armor parry interaction. [^1]
- **Harmonic Saint:** Ally healing targets with changing HP and skill-responsive healing display. [^1]
- **Other Arcana:** Shares the Crafter engine but keeps class-specific skill lists, equipment and presentation. [^1]

## Resource and execution examples

- **Arsenal Gunner:** Five bullets represent 500 Transmutation Energy, with 100 energy per complete bullet; partial bullets are turquoise and usable full bullets gold. Bullet Barrage fires for 0.5–3 seconds, earns 60–300 energy and takes 1–9 seconds to recover. Heavy Artillery and Calamity Cannon each earn 100. Tracer Pod, Detonation Field and Gunner's Crest each cost 100; Crest lasts 240 seconds and adds 50 per Dual Gun skill used (Flash Launcher, Shooting Rush, Bullet Storm, Grapple Shot or Bullet Slide). The first Fatal Scope shot earns 100; full aim enables 100-energy follow-up shots. Aim takes two seconds normally or one against Tracer Pod/Detonation Field setup; those speed bonuses do not stack. The Crafter models setup against its practice target rather than proving per-enemy effects. [^1]
- **Blazing Brawler:** Stage 1/2/3 combo keys, rapid-input Pummel, chargeable Focused Fist, equipment-related Fighter resets and an optional Link 5 Ignite critical-hit cooldown reduction are separate mechanics. Pummel and Somersault Kick each register three hit checks; critical Ignite/Combo hits refresh Tumble. Counter Punch and Tumble are available as second-stage animation-cancel choices. [^1]
- **Elemental Knight:** Bash stack generation depends on weapon choice (one for two-handed/sword-and-shield, two for dual wield), with a five-stack cap and decay. Flashing Steel spends a Bash stack only to bypass its **active** cooldown; using it normally when ready does not spend one. [^1]
- **Sacred Guardian:** Oath, Pledge and Virtue are distinct resources/uptime conditions. The practice dummy telegraphs attacks; a successful timed Rend Armor parry grants Virtue and resets Rend Armor. Divine Retribution spends a full 100 Virtue. [^1]
- **Forbidden Alchemist / Alchemic Sharpshooter:** The shared-looking elemental orb displays are practice resources, not imported damage records. FA Serpentcall and Chemical Carnival are described in its reference as spending all available Alchemy orbs, while AS Tri-Assault is a three-volley payoff. [^1] [^2]
- **Harmonic Saint / Melodic Puppeteer:** HS uses ally HP changes and emergency healing decisions; MP's gear settings distinguish base Puppetry cooldown reductions from Arcana skill cooldowns, including the Link X Cutting Chorus adjustment. [^1]


## Verification and outstanding limits

- The Crafter is a simulated execution aid; rotation success here does not prove in-game cooldown or damage optimization.
- Check hotbar migration, skill timer behavior, target placement and keyboard input after changes to shared Crafter functions.
- Keep saved slot/sequence IDs stable and do not replace current artworks without user approval.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Crafter code and per-Arcana profiles: [`app.js`](../../Companion%20Files/app.js).
[^2]: Arcana skills and reference: [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js), [`data.js`](../../Companion%20Files/data.js).
[^3]: Sprite assets: [`assets/crafter-sprites/archer.png`](../../Companion%20Files/assets/crafter-sprites/archer.png), [`assets/crafter-sprites/guardian.png`](../../Companion%20Files/assets/crafter-sprites/guardian.png).
[^4]: AG geometry test: [`tests/COMPANION-264-AG-TARGET-FRAMES.md`](../../tests/COMPANION-264-AG-TARGET-FRAMES.md).
