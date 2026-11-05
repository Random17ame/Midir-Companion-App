# Sacred Guardian — Oath Workshop — Feature Log

**Purpose:** Rehearse defensive preparation and frozen snapshot chains for Oath Max and Emergency Oath.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Planning

- **Preparation modes:** Separate full preparation and emergency plans, editable checklists, saved stat baselines, optional gear bonuses and situational reminders. [^1] [^2]
- **Stat sources:** Models Fateweaver 3152, Virtuous Oath, Golden Magic Wool, music, pets and preparation inputs, plus title, relic, emblem and Persona bonuses. [^1] [^2]
- **Visual snapshots:** Captures frozen bonuses in a recursive practice sequence; undo/replay and cap visualization separate snapshot bonuses from the underlying prepared stats. [^1] [^2]

## Oath snapshot mechanics represented by the workshop

- **Three page workflow:** Full Oath Max, Emergency Oath and a preparation Checklist. Full and emergency preparations are independent; the checklist's drag order is a visual plan and does not rewrite the numeric snapshot chain. [^1] [^2]
- **Preparation:** Character-sheet HP, Defense, Protection, Magic Defense and Magic Protection can be entered directly. Catering, Doll Bags, Divine Link, pet bonuses, transformation, music and short-duration defensive skills feed the planned starting stats. Preparation outside combat matters because pet changes and short buffs are not freely interchangeable mid-fight. [^1] [^2]
- **Captured bonuses:** Fateweaver 3152 snapshots **12% of the four defensive stats**, Golden Magic Wool **20% of those four**, and Virtuous Oath **15% Max HP / 10% defensive stats** subject to its own per-cast bonus caps (+3,000 HP, +150 Defense/Magic Defense, +15 Protection/Magic Protection). Fateweaver and Wool do not add HP in this model. Each re-cast replaces its previous bonus while inheriting the currently frozen other effects. [^1] [^2]
- **Sequences and readiness:** The full practice chain is Fateweaver → Oath → Fateweaver → Oath → Wool → Fateweaver → Oath. Emergency sequences are editable and saved separately; suggested use avoids delaying the fight for unavailable music, pets or Wool. Headroom gauges describe the Oath bonus, **not** a total character stat cap. [^1] [^2]
- **Music link:** The planner can draw inspiring Enduring Melody estimates from the saved Rate isn't a Lie inputs or use its own ally-music estimate. These are alternative modeled inputs, not two bonuses to stack blindly. [^1] [^2]


## Preparation timing and decision tradeoffs

- **Illustrated setup order:** The full chain is **F → O → F → O → W → F → O**, with Fateweaver (F), Virtuous Oath (O), and Golden Magic Wool (W) replacing only their own most recent captured bonus while reading the currently frozen bonuses of *other* active types. Earlier contributions can therefore be inherited through later snapshots without a self-stack. [^1] [^2]
- **Practical preparation checklist:** The supported reminders include Lovable Yip and Cloud/Nimbus **before** Divine Link, a linked pet kept in place, short Shield of Trust and Orbital Pulse windows, allied Enduring Melody, defensive catering and weighted Doll Bags. The Orbital Pulse reminder uses **two Protection aspects**; player-entered pet/stat deltas are preferable to unverified universal pet constants. These are preparation options, not mandatory achievements or a live combat timer. [^1] [^2]
- **Wool as a commitment:** Golden Magic Wool is a consumable with an approximately **one-minute** modeled window. Full preparation seeks a strong snapshot before spending it; emergency rehearsal can choose the shorter **F → O → W → F → O** chain or **F → O → F → O** without Wool. The editable emergency cast sequence is persisted separately from the reorderable checklist. [^1] [^2]
- **Survivability over perfect setup:** The workshop teaches when to accept a practical Oath rather than delay a real attempt for resummons, music or a scarce consumable. Its percentages and caps describe a rehearsal model; player decisions are not graded against a compulsory "perfect" rotation. [^1] [^2]


## Persistence and boundaries

- **State separation:** Checklist order, emergency sequence and character stats have saved local settings; the rehearsal sequence is not changed merely by visually rearranging checklist entries. [^1] [^2]
- **Shared music inputs:** Can use a Music Lab estimate for Enduring Melody, without treating source assumptions as known exact allied buffs. [^1] [^2]

## Verification and outstanding limits

- Snapshot math is an illustrative modeled chain, not verified in-game rounding, buff duration or stacking order.
- Particular buff marginal effects apply only to the modeled Oath snapshot, not necessarily to all defensive uses of that buff.
- Preserve the fixed snapshot logic separately from drag ordering, and maintain existing standalone/profile backup contracts.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Oath calculator and checklist: [`app.js`](../../Companion%20Files/app.js).
[^2]: Developer assumptions and known caveats: [`SG-OATH-DEVELOPER-NOTES.md`](../../Companion%20Files/SG-OATH-DEVELOPER-NOTES.md).
[^3]: Music Lab integration: [`app.js`](../../Companion%20Files/app.js).
