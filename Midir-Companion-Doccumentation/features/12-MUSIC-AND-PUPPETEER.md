# Music Lab and Melodic Puppeteer

**Applies to:** Midir Companion 0.3.9a.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Music tools

- The Music Buff Effect Calculator models input stats and bonuses. A separate playful “Rate Isn’t a Lie” performance activity is displayed on the same page. The calculator and the performance simulator work on phones. Assign Bard skills by dragging a tile onto a hotkey slot or tapping a skill then a slot; drag to rearrange, long-press to clear during setup, and tap an assigned hotkey during a performance to cast. The on-slot cooldown display and desktop keyboard inputs use the same performance engine.
- Calculated and simulated values are training estimates and should not be presented as verified in-game buff rates.

## Rhythm practice

- Melodic Puppeteer Cutting Chorus practice works on desktop using separate mouse aiming and keyboard activation, and has implemented touch-aim pointer plus distinct skill trigger buttons. The activity is accessible through the mobile Arcana hub, with separate touch aiming and skill triggers. Saved records use the Companion’s existing profile integrations.

## Source references

1. Music calculator and routing: [`app.js`](../../Companion%20Files/app.js).
2. Puppeteer rhythm engine: [`mp-rhythm.js`](../../Companion%20Files/mp-rhythm.js).

## Cutting Chorus touch input

On touch screens, aim by dragging a finger or stylus inside the playfield and trigger timing independently with the individual Melodic Puppeteer and base puppet skill buttons below it. Dragging or tapping a note in the playfield never scores it; a note is credited only when a separate rhythm button is pressed while the aiming cursor is near it within its timing window. Distinct skill buttons allow Hard mode to enforce its existing no-repeat rules. Desktop mouse aiming plus keyboard timing remain unchanged. [1] `Companion Files/mp-rhythm.js`; [2] `Companion Files/styles.css`.

## Cutting Chorus skill trigger panel

On touch screens, the trigger panel lists Melodic Puppeteer skills and base puppet skills separately, with a dedicated Cutting Chorus button. Each button displays a **cooldown** based on current Rotation Highlights minimums; numbered Puppet Acts have a provisional fixed +3s penalty. Cutting Chorus retains the 4s/2s Link toggle. For base skills without a known minimum, the provisional value may be zero. Hard mode tracks the last two distinct skill inputs, and aiming and triggering remain separate touches. PC mouse-and-keyboard play is preserved. Source: `Companion Files/mp-rhythm.js`, `Companion Files/styles.css`.

## Mobile access

Cutting Chorus is available from the mobile Arcana hub. The skill trigger panel preserves separate aim and timing inputs; direct tap-to-hit is not supported. The legacy generic keyboard-only drill remains restricted on mobile. Physical-device multi-touch comfort and responsiveness still need verification. [1] `Companion Files/app.js` (`MIDIR_MOBILE_DESKTOP_ONLY`); [2] `Companion Files/mp-rhythm.js`.
