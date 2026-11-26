# Sacred Guardian — Oath Workshop

**Applies to:** Midir Companion 0.3.15.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Preparation

- Oath-Maxing and Emergency Oath tools help compare character preparation, stat sources and timing. The user can build a saved configuration and work through a preparation checklist.
- Enter the character-sheet totals with titles already equipped, before temporary buffs. Title bonuses are not added separately. Other inputs include Persona effects, Doll Bag/Catering options and Alban Knights Emblem variables.

## Compact available-buff cards (0.3.12)

The SG **Available buffs** grid now includes **Little Fury Sword Relic**, **Ophelia’s Tears**, and **Alban Knights Emblem** alongside Catering, Doll Bags, pet buffs, Divine Link, Shield, Enduring Melody and Orbital Pulse. The compact icon/checkbox/summary/**Edit** presentation replaces their former three large preparation panels. Titles and the separate fine-tuning panel have been removed; edit configurable effects directly on their cards.

- **Relic:** checkbox activates/deactivates its Will bonus; **Edit** selects None/C/B/A/S/EX. Turning it off retains the previous rank for re-enabling; old saves migrate without losing the selected rank. Relic Will still enters the existing STR/WILL/INT conversion pipeline.
- **Ophelia’s Tears:** checkbox starts or ends the same persona (+100 Will, −20 Intelligence, −30 Strength). The 5-minute duration and shared 30-minute cooldown remain; the button disables during cooldown, and **Edit** shows current timing and action. **Override cooldown and activate** explicitly restarts the simulated 5-minute active and 30-minute shared-cooldown timers to correct an accidental uncheck. The visible badge updates while the page remains open.
- **Alban Knights Emblem:** checkbox on **Oath Max** controls the already-existing equipped state. In **Emergency Oath**, the checkbox represents the defensive emblem already equipped when the emergency began, not an in-combat swap. **Edit** contains Mind/Mana/Body rune levels and the explicit Tenacious Taunt / defensive / other emergency selection; these are unchanged. Full and emergency configurations are independent.

## Enduring Melody (0.3.13a)

- **Edit** accepts independent flat Protection, Defense, Magic Defense and Magic Protection values (including decimals). **Save custom values** applies them together.
- **Use Music Buff Calculator** switches to live Inspiring Enduring Melody results (equal defense pairs and equal protection pairs). **Open Music Buff Calculator** opens the calculator with Enduring Defense selected; return directly to the editor. No live BFO-derived estimate or protection-reforge slider remains.
- Old manual or BFO-estimated values migrate once to flat custom values; previously linked settings stay linked. Old title fields are retained as inert compatibility metadata, not preparation bonuses or checklist steps. Frozen snapshots remain unchanged until recaptured.

All equipment changes persist through the existing SG Oath local save and supported profile backups. In-progress countdowns are not reset by opening an Edit dialog. A scroll-preservation wrapper restores the page and editor scroll after each card edit. Three-language labels and dialogs are provided by `Companion Files/i18n.js`.

## Calculations and limits

- Edit Player Stats collects observed Maximum HP, Defense, Protection, Magic Defense and Magic Protection, plus optional Strength, Will, Intelligence and Dexterity (for Yellow Echostone inference). These are pre-temporary-buff character-sheet values, not values reconstructed by Companion. Unknown primary values remain blank rather than being treated as zero.
- Planning assumption for fully progressed Arcana: unified ordinary soft cap 2,450 and hard cap 2,750 (base assumptions 1,500/1,800 plus 950). This revision uses fixed thresholds, not an Arcana-level or race model. The hard cap provides conservative minimum Echostone inference; no ordinary positive gain is modeled at or above the soft cap.
- Sum selected primary bonuses before applying shared headroom; only the exact fractional incremental conversion is added to the observed defensive total (10 STR → 1 DEF; 10 WILL → 1 M.DEF; 20 INT → 1 M.PROT). Negative primary changes below the soft cap are included in the net; at/above it, hidden excess makes reductions uncertain. Direct defensive and HP additions remain independent. No frozen snapshot is recalculated.
- Buff advice compares prepared Oath output with and without the candidate, keeping other selected buffs. Useful or potential benefit is recommended below the soft cap unless all relevant Oath thresholds are already satisfied. At or above the soft cap, or if a primary stat is unknown, uncertain ordinary gains are optional, not discouraged. Explicit skip advice is reserved for positive affected Oath stats already capped with other selected preparation and a confirmed character profile. This is Oath-only advice, not a judgment about other buff utility. Gear cards retain timing/equipment status separately from advice; Emergency Oath does not suggest swapping emblems.
- Echostone contributions already in the character sheet are retained as observed values. The tool is a conservative planning model, not a measured game-client result.
- The same saved checklist is accessible on mobile; state is included in supported full-profile backups.

## Echostone equipment and recommendations (0.3.14)

- Open **Echostones → Edit** beneath the Oath thresholds in Oath Max or Emergency Oath. Red (STR → DEF), Silver (WILL → M.DEF), Blue (INT → M.PROT), Black (HP), and Yellow (DEX; no direct Oath gain) use existing local stone icons. At most three distinct colors may be equipped; 0 means empty. Whole-number rolls are required.
- Observed STR/WILL/INT/DEX above 2,750 prefill the corresponding minimum roll (observed minus cap). A value at or below the cap does not establish whether a stone is equipped. Black cannot be inferred from HP. Conflicting four-color evidence requires correcting the player stats; do not discard an inferred stone automatically.
- **Confirm** describes equipment already included in the observed sheet; it never adds another bonus. **Apply** subsequently changes both recorded primary and related defensive stats by the exact roll difference, bypassing the caps. Unknown primary stats remain unknown. **Reset** appears only after confirmation; it preserves current recorded stats, clears confirmation and prefills newly inferred minima for another baseline confirmation. Completing Edit Player Stats also resets equipment confirmation; abandoning the stat wizard preserves the previous baseline.
- Enter an optional **Available roll** for each color and mark equipped colors **Reserve** to retain them in suggestions. Compare all valid alternatives (current, available or empty) against selected preparation, maximize the sum of normalized Oath threshold coverage without reducing any current Oath contribution, and prefer fewer changes on ties. Suggestions only populate draft values; Apply is explicit. Already capped thresholds cannot gain further Oath benefit; a stone needed to maintain a cap may still be valuable. No unknown stone roll is fabricated and no automatic in-game changes are made.
- Defensive conversion retains fractional internal values (10 STR/WILL or 20 INT per defensive point). Display player stats and frozen bonuses as nearest integers, including 404.5 → 405 and 404.4 → 404; Oath calculations use unrounded values. This is a working display convention, not certified game rounding. Existing frozen snapshots remain unchanged. Existing manual Enduring Melody precision is retained.
- The equipment baseline, available rolls, reservations and exact recorded values persist in existing SG local save and full-profile state; old profiles infer minima without changing their observed stats.

## Source references

1. Oath controls, equipment/card state, and calculations: [`app.js`](../../Companion%20Files/app.js).
2. Game data and supporting skill references: [`data.js`](../../Companion%20Files/data.js), [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js).

3. Compact card layout and dialog styling: [`styles.css`](../../Companion%20Files/styles.css).
4. UI translations: [`i18n.js`](../../Companion%20Files/i18n.js).
5. Regression: [`companion0312_boost_cards_test.py`](../../tests/companion0312_boost_cards_test.py).

6. Direct melody, title removal, navigation, migration and persona override regression: [`sg0313a_editor_browser_test.py`](../../tests/sg0313a_editor_browser_test.py).

7. Echostone baseline, delta, recommendation and reset regression: [`sg0314_echostone_browser_test.py`](../../tests/sg0314_echostone_browser_test.py).
