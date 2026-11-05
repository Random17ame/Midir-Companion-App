# Music Lab and Melodic Puppeteer

**Applies to:** Midir Companion 0.3.2 (build 305).

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Music tools

- The Music Buff Effect Calculator models input stats and bonuses. A separate playful “Rate Isn’t a Lie” performance activity is displayed on the same page. The calculator works on phones, while the keyboard-driven performance **Begin** action is disabled in phone mode.
- Calculated and simulated values are training estimates and should not be presented as verified in-game buff rates.

## Rhythm practice

- Melodic Puppeteer activities include rhythm timing and performance exercises. Keyboard-dependent modes remain desktop-oriented where indicated; saved records use the Companion’s existing profile integrations.

## Source references

1. Music calculator and routing: [`app.js`](../../Companion%20Files/app.js).
2. Puppeteer rhythm engine: [`mp-rhythm.js`](../../Companion%20Files/mp-rhythm.js).
