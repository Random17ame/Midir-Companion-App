# Music Lab and Melodic Puppeteer Rhythm — Feature Log

**Purpose:** Model music-buff effects and support timing, plus a separate rhythm practice game.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Music Lab

- **Rate isn’t a Lie:** Music performance laboratory calculates modelled rank/equipment/buff contributions and supports a playable stage with assigned music skills. [^1]
- **Skill modifying reforges:** One always-visible section contains **eight** independent inputs: March Song Walking/Mount Speed; Enduring Melody Protection, MP Recovery Speed and Stamina Recovery Speed; Harvest Song Gathering Speed; and Vivace Magic/Alchemy Casting Speed. Each applies only to its corresponding calculated effect. [^1]
- **Oath integration:** Sacred Guardian preparation can reference Music Lab output, maintaining the distinction between actual measured stats and estimates. [^1] [^2]
- **Performance inputs:** **Musical Knowledge - Reforge** is one shared field, not separate Normal/Excellent/Inspiring duplicates. The calculator keeps Normal, Excellent/Marvelous and Inspiring/Haunting outcomes distinct. Its playable music stage uses assigned skills and status effects; Encore belongs to the Harmonic Saint skill reference as a music-buff cooldown reset. [^1]

## Puppeteer rhythm

- **Cutting Chorus:** Independent note/cursor rhythm practice with skill binding, combos, misses and optional difficulty settings. [^3]
- **Local state:** Uses `midir-mp-rhythm-v1`, with profile backup handling and repeatable practice. [^3]
- **Puppeteer rotation context:** The landing-page field guide treats Live Wire, Downbeat Drop and Act 7 as central, with frequent Cutting Chorus weaves while a summoned puppet is attacking. Three puppets can act together; the rhythm game trains part of that execution rather than proving a complete high-APM rotation. [^1] [^3]

## Verification and outstanding limits

- Music output is a calculator estimate under configured inputs, not a verified buff on an imported player.
- Separate music calculator results from rhythmic-input scores and from direct evidence of spell use.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Music formulas, stage and settings: [`app.js`](../../Companion%20Files/app.js).
[^2]: Sacred Guardian cross-feature notes: [`SG-OATH-DEVELOPER-NOTES.md`](../../Companion%20Files/SG-OATH-DEVELOPER-NOTES.md).
[^3]: Puppeteer rhythm implementation: [`mp-rhythm.js`](../../Companion%20Files/mp-rhythm.js).
