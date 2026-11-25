# Midir Companion 0.3.12e Draft — Ogham Runes

**Baseline:** complete 0.3.12d cumulative ZIP. **Status:** functional preview / draft, not mechanics-complete.

## New

- **Ogham Rune Inventory:** add, edit, delete and search personally owned rune instances. Configure one of 26 words, permitted grade, nickname/notes and one, two or three attribute lines. Free-form attribute entries allow capturing an actual item even where the draft list is incomplete.
- **Per-Arcana loadouts:** five independent slots per Arcana, with Awakening 1/5/10/15/20 unlocks. Track all **30** three-word synergies; use their required word composition and 5–9-point grade total. Ten planned NA December synergies are flagged as upcoming. Expand **Recommended equip ⓘ** to see matching owned words and missing components.
- **EV Simulator:** alongside Reforges and Echostones, a third mode **Ogham · Rerolls** contains practice line rolling, 0/1/2 locked lines, cumulative documented resource costs and reset. Simulated lines never modify the rune inventory or spend real inventory currency.
- **Languages:** English, Korean and Spanish controls and attribute labels; stable Latin rune-word identities. First-20 Korean synergy text is a neutral numbered placeholder where a correct Korean official name could not be confirmed. December English names are provisional. No cross-language switching changes combination logic.
- **Icons:** Unicode Ogham glyphs are intentional placeholders, not genuine Mabinogi icons. Direct, consistently named reusable game artwork could not be verified from the Prilus deployment; the module supports a future locally bundled icon mapping.

## Out of scope for this preview

Official per-word attribute eligibility, exact skill-level reroll probability, effect-level fractional steps, 5–9-point numeric synergy bonus curves, direct combat damage application, offline material consumption, and imported-session automatic rune recognition. Existing damage/scoring/Rotation Highlights/Litany/SG/Music calculations are not changed.

## Tests performed

- New Ogham pure rule tests: 26 words, 30 recipes, slot unlocks, score tiers, separate Arcana loadouts, locking/costs, inventory independence — **PASS**.
- New full-script isolated Chromium browser fixture at **1200, 390, 320** widths: add/edit/equip, EV reroll mode, profile-save record, simulated reroll independence, EN/KO/ES language selector, no JavaScript page errors — **PASS**. The fixture must load scripts by injection because local-file/localhost navigation is blocked by this browser runtime. This is not an installed PWA test.
- Existing Companion core regression **17/17 PASS** and interaction suite **9/9 PASS**.
- Existing Rotation Highlights crit-neutral and Wireless Puppet tests, Arcana assignment, Music 0.3.12c upgrade/enchant tests, Litany 0.3.12d gear tests, localization Node/Chromium tests, module binding and compact/fingerprint tests — **PASS**.
- Actual Midir-46.b comparison schema tested with provided Alchemic Sharpshooter HTML: five players, 244 hits, 25 use markers; 30s and rolling 10s sums reconcile — **PASS**.
- Actual iOS/Android installation, mobile screen-rotation, and deployed HTTPS PWA cache transition — **not retested in this draft**.

## Documents

1. `Midir-Companion-Documentation/features/22-OGHAM-RUNE-INVENTORY-AND-SIMULATOR.md` — current-state feature guide and evidence boundaries.
2. `Midir-Companion-Documentation/CHANGELOG.md` — numbered-source change log.
3. `Midir-Companion-Documentation/VERIFICATION.md` — verification and limitations.
4. Source `Companion Files/ogham-runes.js`, `Companion Files/app.js`, `Companion Files/styles.css`, `service-worker.js`.

Sources: [Prilus Ogham](https://prilus.gitlab.io/en/ogham), Nexon 2026-11-12 Arcana Part 1 and Korean 2026-08-13 update (see detailed feature guide).
