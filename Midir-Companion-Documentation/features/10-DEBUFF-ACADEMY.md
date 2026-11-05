# Debuff Academy — Feature Log

**Purpose:** Teach condition recognition and buff/debuff setup through reference cards and repeatable drills.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Learning tools

- **Debuff Field Guide:** The Academy landing page lists nine boss-debuff coverage groups with icons, descriptions and related skill/pet sources. A separate source reference expands on effects outside those nine slots. [^1] [^2]
- **Recognition practice:** **Flash Cards** provides reveal/set-aside drills; **New Debuff, Who This?** asks players to identify missing groups and choose possible skill or pet sources. [^1]
- **Build the Debuff Opening:** A step-by-step guided route with selectable stages and a progress indicator, independent of actual imported application evidence. [^1]

## The nine-group training contract

- Shared physical Defense/Protection reduction, shared Magic Defense/Magic Protection reduction, and Increased Damage Taken are three separate groups; **Death Mark** contributes to the amplification group rather than creating a tenth slot.
- Brionac/Fragarach Protection Peel counts as one group but needs **both** maximum-Protection condition IDs (`1093` and `1094`).
- The two pet defense groups are **Bone Dragon or Purrling** (`211`/`912`) and **Mir Dragon or Ceraunus** Lightning Breath/Wave (`392`/`504`). **Bunbun Lucky Clover or Foxyquinn's Mark** (`1138`/`716`) is the separate pet damage-amplification group.
- **Kart Bomb / Water Balloon (`598`)** is its own defense reduction, not damage amplification. **Fateweaver Aspect of Reversal (`515`)** restores 100 HP per hit to the attacker and counts as visible Fateweaver evidence; it is neither damage amplification nor defense reduction.
- The recognition exercise teaches possible sources. An observed condition icon by itself does not identify who cast the effect. [^1] [^3]


## Repetition and icon integrity

- **Flash Cards deck:** Uses verified mapped condition-icon cards and randomized repeatable rounds. Players may reveal, advance, set aside familiar cards, restore individual cards or restore all. An older saved profile without `academySetAside` receives an empty list rather than breaking the trainer. The route is opened from the Academy menu, not from an Overview-only shortcut. [^1] [^2]
- **Missing-group exercise:** Generates continuing situations with one to three missing coverage groups. Players choose **source skill or pet** icons, potentially several at once; a conditional source can cover more than one group. The two maximum-Protection statuses always operate as **one paired logical requirement**. The exercise explains possible sources and records reflection, without scoring a guess as a real imported cast. [^1]
- **Verified art:** Mapped Midir skill icons and condition icons are used where available. Missing pet/Brionac source artwork is represented by labeled placeholders, not fabricated status icons; distinct icons must not be invented for shared condition categories. [^1] [^2]


## State and presentation

- **Learning history:** Progress is stored in the shared profile alongside other practice results. [^1]
- **Source icons:** Uses documented skill and condition IDs; missing icons fall back without inventing condition identities. [^1] [^2]

## Verification and outstanding limits

- Recognition and effect explanations are educational rules, not evidence that a particular imported fight applied a debuff.
- Keep Debuff Academy distinct from the universal Vertrag avoidance trainer and from report-derived Rotation Highlights.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Debuff lessons, state and cards: [`app.js`](../../Companion%20Files/app.js).
[^3]: Boss-condition grouping and coverage checks: [`analysis.js`](../../Companion%20Files/analysis.js).
[^2]: Condition icon registries: [`icons.js`](../../Companion%20Files/icons.js), [`icon-registry.json`](../../Companion%20Files/icon-registry.json).
