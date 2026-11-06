# Subject Theta: Containment

**Applies to:** Midir Companion 0.3.11i.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Progression and presentation

- Ten containment protocols progressively introduce Dark Diviner skills and Theta mechanics. Includes Free Practice, score streaks, achievements, Dark Sigils, the Dark Erg Exchange and cosmetic variants.
- Gameplay uses a first-person staff view, downward-moving note highway with **flat on-track timing rings** larger than the descending notes, recognizable bundled skill icons, compact button labels and optional expanded reference material. Thunder presentation uses layered bolts and impact visuals while preserving boss visibility.

## Controls and failure

- The four rhythm highway lanes are Thunder, Thunderblight, Shadow Flare and Twilight Surge (the latter has its own charge/release behavior). Render Dorcha, Render Mana, Hexshroud and Polar Vortex activate separately from the rhythm lane. Ice Bolt is also outside the four rhythm lanes. Seething Mana is a toggle; Twilight Surge uses a separate player-triggered charged reminder. Keybinds are configurable. On touch devices, tapping a note bubble or its timing target activates the corresponding combat lane; the dedicated lane buttons below the track and utility panel also support touch. Twilight Surge displays a charging percentage and fill indicator. Keyboard controls remain available.
- A **Perfect** judgment requires the note to fit completely within its flat indicator. A partial overlap gives **Great**, **Good**, or **OK** based on coverage, with later partial overlaps favored over equivalent early ones. Notes continue visibly beyond the target and only count as missed after falling off the end of the track. Empty, incorrect-lane or out-of-ring presses do **not** add misses. **Five accumulated fallen notes** fail the run; **three consecutive successful judgments** clear the active miss stack (not the historical Miss total). Four stacks trigger an edge warning and red vignette.
- The next actually scheduled rhythm note is shown stationary **on deck** at the far end when it is not yet within its approach window, including during other visible notes; no fake casts are created, and the run closes promptly after its last scheduled event is resolved.

## Upkeep scheduling

Thunderblight now reserves its intended maintenance activation before the rest of a chart is scheduled. Shadow Flare and Thunder avoid that reserved input/recovery interval; Thunder is shifted to the next valid cast window rather than presented simultaneously with Thunderblight. The reservation takes into account both ordinary Thunder and the faster Erg S50 cast. This does **not** modify Thunderblight’s modeled cooldown, the scoring windows, or the uninterrupted rhythm clock.

## Resources and skills

- Base **MP is 2,500**, ordinary **Dorcha caps at 15** (starts at 10). Spell costs, Seething Mana bonuses and Hexshroud hit recovery have separate rules.
- While Seething Mana is active, completed eligible spell casts gain **5% Residual Dorcha** each; Twilight Surge requires 100% charge and its cooldown, and consumes no ordinary Dorcha.
- Shop upgrades include Vivace, Spirit Weapon Lucky Strike, Staff S50, Ice Bolt, spell scoring upgrades and optional cosmetics. The displayed economy and cast calibration are training models.

## Source references

1. Theta mechanics and UI: [`theta-rhythm.js`](../../Companion%20Files/theta-rhythm.js), [`theta-rhythm.css`](../../Companion%20Files/theta-rhythm.css).
2. Storage and cross-game awards: [`app.js`](../../Companion%20Files/app.js).

## Mobile performance rendering (0.3.11a)

The Graphics Mode control provides **Auto**, **Performance** and **Full quality**. Auto uses the lower-cost renderer on small screens and touch devices. Performance scales down the canvas backing pixels, caps painting at approximately 30 frames per second, suppresses screen shake and heavy glow/particle/cosmetic effects, and reduces status-text updates. Crucially, hit detection, cooldowns, beat progression, and scoring are still processed in the independent animation-timing loop; no tolerance windows were enlarged to hide lag. Full quality retains the previous visual presentation. Desktop auto is still full quality. Browser testing confirms mobile renderer activation and basic responsiveness, **not real-device frame-rate guarantees**. [1] `Companion Files/theta-rhythm.js`, `Companion Files/theta-rhythm.css`.

## Track judgments and on-deck preview (0.3.11d)

A single track projection is shared by the canvas, tap selection and scoring. The target is at 90% track progress; an unplayed note remains visible beyond it until its center passes the end of the playing board. A centered note wholly fits in the wider flat target; only then is Perfect possible. Equal-timing-distance partial hits on the late side have higher judgment precedence than early ones. Surges still use their independent charge and lesson-expiry logic. [1] `Companion Files/theta-rhythm.js`; [3] `tests/theta0311d_judgment_test.py`. The existing low-resolution mobile renderer and shop/timing rules are unchanged.
