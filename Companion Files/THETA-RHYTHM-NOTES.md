# Companion 256 — Subject: Theta Containment

Integrated Dark Diviner first-person rhythm trainer. Open Arcana Simulators and choose Dark Diviner.

## Content
- Ten progressive levels, each retaining learned skills: Thunder → Thunderblight → Shadow Flare → Render Dorcha → laser reaction → Twilight Surge → Hexshroud → Polar Vortex → Render Mana → combined sequences.
- Eight color-coded skill lanes with editable hotkeys; configurable mechanic response and Seething Mana keys.
- Perspective note highway, hand/staff POV layers, animated Theta sprite and spell effects, procedural telegraphs, synth metronome, accuracy judgments, combo multiplier, stability meter.
- MP and Dorcha resource models, Seething Mana toggle (spend Dorcha for more score), Hexshroud temporary Dorcha generation, upgrade shop using Dark Sigils, ten achievements included in the main Achievement Book.
- Independent localStorage profile key `midir-theta-rhythm-v1`, preserving other minigame data.

## Balancing notes
- Cooldown defaults are seeded from the Companion's `RH_MIN_COOLDOWNS` DD entries (Thunder 0, Thunderblight 15, Shadow Flare 10, Render Dorcha 10, Twilight Surge 30, Hexshroud 30, Polar Vortex 20, Render Mana 0). They are user-editable within this game's Settings.
- Thunder cadence, skill action delays, Dorcha gains/spends, MP costs, attack durations, scoring bonuses, boss mechanic timing and exact judgments are **practice model values**, not independently verified game mechanic data.
- Audio uses generated metronome tones; no copyrighted music embedded.
- The player is exclusively first-person (animated hand/staff foreground). No third-person playable character is drawn.
- Boss animation is a composited illustrated sprite with bob/flinch/spell interactions, **not** a fully hand-authored multi-pose sprite atlas. Theta-inspired encounters are intentionally not exact simulations.

## Testing
- `node --check` for `app.js` and `theta-rhythm.js`.
- Standalone Chromium functional checks of levels, start, pause/end, keybinding, canvas rendering and UI without page errors.
- Chromium in this environment blocks opening full local Companion HTML; full integration playtest remains necessary.
