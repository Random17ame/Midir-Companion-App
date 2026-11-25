# Sacred Guardian — Oath Workshop

**Applies to:** Midir Companion 0.3.12r.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Preparation

- Oath-Maxing and Emergency Oath tools help compare character preparation, stat sources and timing. The user can build a saved configuration and work through a preparation checklist.
- Inputs include equipment/title bonuses, Persona effects, Doll Bag/Catering options and Alban Knights Emblem variables where exposed.

## Compact available-buff cards (0.3.12)

The SG **Available buffs** grid now includes **Little Fury Sword Relic**, **Ophelia’s Tears**, and **Alban Knights Emblem** alongside Catering, Doll Bags, pet buffs, Divine Link, Shield, Enduring Melody and Orbital Pulse. The compact icon/checkbox/summary/**Edit** presentation replaces their former three large preparation panels. Titles and their free-form stat conversions remain available in a collapsed **Titles & stat conversion** section.

- **Relic:** checkbox activates/deactivates its Will bonus; **Edit** selects None/C/B/A/S/EX. Turning it off retains the previous rank for re-enabling; old saves migrate without losing the selected rank. Relic Will still enters the existing STR/WILL/INT conversion pipeline.
- **Ophelia’s Tears:** checkbox starts or ends the same persona (+100 Will, −20 Intelligence, −30 Strength). The 5-minute duration and shared 30-minute cooldown remain; the button disables during cooldown, and **Edit** shows current timing and action. The visible badge updates while the page remains open.
- **Alban Knights Emblem:** checkbox on **Oath Max** controls the already-existing equipped state. In **Emergency Oath**, the checkbox represents the defensive emblem already equipped when the emergency began, not an in-combat swap. **Edit** contains Mind/Mana/Body rune levels and the explicit Tenacious Taunt / defensive / other emergency selection; these are unchanged. Full and emergency configurations are independent.

All equipment changes persist through the existing SG Oath local save and supported profile backups. In-progress countdowns are not reset by opening an Edit dialog. A scroll-preservation wrapper restores the page and editor scroll after each card edit. Three-language labels and dialogs are provided by `Companion Files/i18n.js`.

## Calculations and limits

- Supports defensive-stat conversions and comparative scenarios for Strength, Will and Intelligence. These tools help plan a snapshot rather than establish a measured game-client combat result.
- The same saved checklist is accessible on mobile; state is included in supported full-profile backups.

## Source references

1. Oath controls, equipment/card state, and calculations: [`app.js`](../../Companion%20Files/app.js).
2. Game data and supporting skill references: [`data.js`](../../Companion%20Files/data.js), [`rotation-reference.js`](../../Companion%20Files/rotation-reference.js).

3. Compact card layout and dialog styling: [`styles.css`](../../Companion%20Files/styles.css).
4. UI translations: [`i18n.js`](../../Companion%20Files/i18n.js).
5. Regression: [`companion0312_boost_cards_test.py`](../../tests/companion0312_boost_cards_test.py).
