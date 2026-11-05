# Companion — Design Vision and Current Regression Contract

**Scope:** Current Companion 275; this is a feature-design and maintenance reference, not a version history. The principles below originate in the project's extended design decisions and are reconciled against active modules. Where they are intentions rather than proven end-to-end behavior, they are labeled accordingly.

## Core promise

Midir Companion has **two related but distinct jobs**: (1) respect recorded Midir combat evidence to help players interpret and improve real performance, and (2) give them offline fantasy training, simulation, collections and progression that feel rewarding on their own. The first must never claim simulated input was measured in the game. The second should be cheerful, accessible and fun even to a player who only wants milestones and big numbers.

- **The Vault** stores report-backed sessions, records and achievement celebrations, without interpreting absent packet data as facts.
- **Rotation Highlights** distinguishes observed 10/60-second peaks from candidates constrained by recognized-use timing and per-skill hit budgets. Windows with identified Time Shift/Bachram Boost exceptions are excluded from the ordinary candidate. A complete **minimum-cooldown compliance check is a desired validation standard, not an implemented ten-Arcana scheduler in build 275**: the `RH_*_COOLDOWNS` tables are declared but unused by the current scoring path.
- **Rotation Crafter and Arcana tools** provide player-controlled execution practice and ability visualizations, not a trustworthy model of every current Mabinogi buff/cooldown.
- **Arcana Field Guides** teach practical sequencing for all ten Arcanas, including named high-priority skill interactions. They are curated advice, not universal talent skill inventories or a substitute for the separate Midir event evidence model. See [Arcana Skill Field Guides](features/17-ARCANA-FIELD-GUIDES.md).
- **Minigames** combine fantasy-specific mechanics, meaningful manual controls, resource economy and long-term goals; sharing rewards is intentional, but separate physical save domains must agree.

## Teaching, attribution and collection boundaries

- **Nonpunitive rehearsal:** Debuff Academy flashcards, missing-source choices, Arcana decisions and Oath snapshots should help players practice recognition and tradeoffs, not imply a poor grade or require one ideal rotation. The player can deliberately set aside familiar cards and practice repeatedly.
- **Player-owned trophies:** The Vault's Gate collectibles are tied to verified encounter/phase evidence and the explicitly chosen character, while personal notes remain user-written. An unproven encounter should not silently change a collectible balance; game-simulation achievements must not be presented as actual Mabinogi clears.
- **Evidence over visual inference:** A shared condition icon cannot prove a skill's caster, a per-second damage bucket cannot prove cast count, and a nominal HP phase does not prove exact mechanic timestamps. Teaching models may use named rules, but imported achievements remain constrained by observed data.


## Visual language

1. **Play first.** A dominant stage/canvas is more useful than a pane of tutorial prose. Keep the central character/action, HUD, resources and current objective visible. Shop, inventory and settings should be short and accessible as drawers/popups rather than persistent columns.
2. **Explain only when asked.** Use single-line action labels; short contextual hints; optional Help or extended hover. The EV model's short-description / eight-second-numbered-tooltip split is a useful precedent, not a blanket requirement to add tooltips everywhere.
3. **Show cause and consequence.** Projectiles, elemental colors, telegraphed hazards, protective shields, action locks, recovery and reward arrivals should have distinctive, readable effects. A lock/irreversible risk should be plainly visible before an unsafe Special Upgrade.
4. **Distinctive Mabinogi atmosphere, not copied UI clutter.** Suggested improvements include an archer idle/walk/shot atlas and arrow/shrapnel VFX for Crom; unmistakable silhouettes for Ronaun, Cari, Wyneb, Melci, Irusan and Glas; boss-specific floor telegraphs; Mabinogi-like weapon/stone icons for inventories; wood/stone/metal base and tower sprites for EV; pig, herb and bandit reaction animations; and a parchment, page-turning achievement book with clear unlocked/locked seals. These are **art opportunities**, not all verified as current assets.
5. **Small-screen usability and accessibility.** Contrast for elemental indicators, keyboard equivalents for mouse input, safe focus handling in popups and responsive playfield height matter more than ornate decorations.

## Shared-progression principles

- **Identity over counters:** An Erg S50/Limit Break/Step 8 achievement is meaningful only if the same weapon has all attributes. Keep shared equipment objects and item IDs intact through Reforge, Erg, Storage Chest and the anvil.
- **Reward evidence:** Record purchases, rolls, rare drops, deaths, completions and memory sequences when they happen. Do not backfill unlogged historical events. Simulation Auction House transactions are **simulation** transactions.
- **Inventory differences:** Orbs, Spellbooks, Shields and Guard Cylinders cannot use Erg or Special Upgrade in the current item restrictions, even if some can be reforged. Colored Echostones have their own categories.
- **Game-to-game economy:** Crom Dark Erg Chunks fund stone purchases and bonuses for other modes; Herb Collection, Bandit Hunt and Soul Liberator EV clears also feed stones into the same Special Upgrade chest. Keep reward probabilities, ownership, receipt and save keys aligned.
- **Saved experience:** A run can have checkpointed earned currency without having its live enemy locations, active power struggle or attack state restored. Avoid promising mid-fight resumability unless explicitly implemented.

## Gameplay acceptance tests to run when tuning

| Area | Essential check | Why |
|---|---|---|
| Crom entry | Both Arcana shortcut and global menu actually open playable Crom canvas | Labels previously opened the wrong renderer |
| Crom basic waves | First ten wave types, 3/3-second attack limit, five-second intermissions, bottom-center safe area | Defensible learning curve |
| Crom status | Ronaun shield overflow and line ownership; shared Cari shield refresh; Wyneb spawns; Wraith roar stacks; Melci independent attacks | Distinct enemies and no hidden spam |
| Irusan | Alternating-key struggle at 50%, 20s cauldron, transformation, late Cari, accelerating 10% timer | Deterministic phase transitions |
| Normal Glas | Four matching seals, elemental Disciples, piercing-blocker summons, puddle intervals | Fair elemental puzzle |
| Giga Glas | 20s disciples, 3-lane laser, safe-lane blast, 10% berserk, life-drain puddles | Fair high-pressure final boss |
| EV | Manual shell refill, pressure threshold, heat, multiple-tower shared cast cost, route placement, patrol loot | Internal economy consistency |
| Special Upgrade | Alban 3× gold / listed odds, protections, high-step brick/recover, off-hand prohibition, round-trip weapon identity | No silent loss of equipment |
| Vault | Recognized-duplicate replace/cancel, archive load, original HTML, and Secret Sauce’s compact Vault mode | Trustworthy report archive |
| Backup | Core saves + `trainingExtras`, large reports, interrupted/failed restore, achievements, item progression | Player continuity |
| Localization | English/Korean/Spanish on major panels and dynamic standalone-game messages | No broken fallback UI |
| Achievement Book | Vault chapter first, correct minigame chapters, latest five full cards, popup focus and page turns | Celebration without clutter |

## Code pointers

- Core app / evidence / achievements: `Companion Files/app.js`, `analysis.js`, `skill-use-rules.js`, `skill-evidence.js`.
- Crom and elemental encounters: `Companion Files/as-chicken-invaders.js`.
- EV range lab: `Companion Files/ev-defense.js`.
- Equipment: `Companion Files/reforge-simulator.js`, `erg-simulator.js`, `special-upgrade.js`.
- Minigame rewards: `Companion Files/herb-collection.js`, `bb-bandit-flip.js`, `ek-pig-pursuit.js`.
- Localization / styles: `Companion Files/i18n.js`, `styles.css`.

**Validation status:** This file was checked against the build's present implementation, not against an exhaustive interactive playthrough. Distinguish code-level mechanics from tested player experience.
