# Positioning, Frame Challenges and Chase Games — Feature Log

**Purpose:** Practice click targeting, spatial judgments and reactions in small independent exercises.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Movement and targeting

- **Positioning Lab:** Shows illustrative attack line/cone coverage, selected approach points and visible enemy targets. [^1]
- **Arsenal Gunner field lab:** Places multiple medium Detonation Fields under enemies, aims a larger enemy-centered Heavy Artillery circle, and tests straight firing lanes; unlike the Alchemic Sharpshooter exercise, it does not use cone attacks. The visual exercise is separate from the Crafter's energy simulation. [^1]
- **Frame Bowling:** Adds AS/AG positional targeting challenges and patterns without replacing free positioning labs. [^2]
- **Pig Pursuit:** Elemental Knight top-down cursor/chase activity with obstacles, difficulty and best-time records. [^3]
- **Bandit Hunt:** Blazing Brawler decision exercise with named bandit behaviors and action-specific Counter Punch rules. [^4]

## Saved behavior

- **Game profiles:** Pig Pursuit uses `midir-companion-ek-pig-v1`; Bandit Hunt uses `midir-companion-bb-bandit-v1`. [^3] [^4]
- **Shared entry points:** Arcade activities are available from relevant Arcana pages and use their own controls/results. [^1]

## Cross-game reward connections

- **Bandit Hunt** flips forward earned opportunities to the Special Upgrade stone chest: normal red/blue stones use a 1-in-10 roll and protective red/blue stones use a 1-in-250 roll per flip. Crom Bás Invaders also sells a permanent bonus to Bandit ducat gains. Neither behavior implies real inventory or trading proceeds. [^4] [^5]
- **Frame challenges** and Pig Pursuit remain distinct arcade exercises; use each game's own saved result counters and input handler rather than treating an Arcana landing-page visit as gameplay completion. [^2] [^3]

## Verification and outstanding limits

- Hit geometry, bandit reactions and movement are fictionalized training conditions rather than reproduced live dungeon behavior.
- Validate keyboard/mouse focus, resize, and replay handling independently for each exercise.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Arcana position lab and routing: [`app.js`](../../Companion%20Files/app.js).
[^2]: AS/AG frame challenges: [`frame-bowling.js`](../../Companion%20Files/frame-bowling.js).
[^3]: Elemental Knight pursuit: [`ek-pig-pursuit.js`](../../Companion%20Files/ek-pig-pursuit.js).
[^4]: Brawler Bandit Hunt: [`bb-bandit-flip.js`](../../Companion%20Files/bb-bandit-flip.js).

[^5]: Shared stone reward ledger and per-flip odds: [`special-upgrade.js`](../../Companion%20Files/special-upgrade.js).
