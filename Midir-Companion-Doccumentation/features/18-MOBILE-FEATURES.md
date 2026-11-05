# Mobile Features and Touch Support

**Applies to:** Midir Companion 0.3.9.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Installation and persistence

- Midir Companion can be served over HTTPS (including GitHub Pages) and installed from a compatible mobile browser. Its cached application shell can run offline after the assets have been fetched.
- User profiles, detailed reports and achievements live in each browser's local storage / IndexedDB; there is no mobile-to-PC cloud synchronization. Export full-profile backups before clearing storage or changing devices.
- Importing large reports can exhaust mobile memory even below the 90 MiB per-file cap. Mobile keeps up to ten active detailed reports by default, with older reports archived.

## Mobile interface and controls

- Mobile navigation, preparation calculators, simulations and report viewer use narrower touch-oriented layouts. The report viewer supports full-screen reading and independent chart zoom/navigation.
- Crom Bás Invaders: portrait positions the game above nine skill buttons (left) and joystick (right); landscape positions controls beside the game. Charge skills are hold/release, other unlocked skills are tap. Buttons display cooldowns, the joystick alternation resolves Irusan's power struggle, and compact colored elemental orbs sit by the top-right HUD.
- Subject Theta: four rhythm lanes (Thunder, Thunderblight, Shadow Flare, Twilight Surge), touch-responsive notes and target regions, lane buttons, a separate utility bar, and a charge indicator for Twilight Surge. The desktop keyboard bindings remain supported.
- Other module/game input models can still rely on physical keyboards, pointer precision or different touch gestures; do not assume all games have complete touch parity.

## Verification and limits

- Chromium browser tests verify touch controls and UI logic in portrait/landscape. Physical device tests are still needed for responsiveness, multi-touch, browser gesture conflicts, install behavior and frame pacing.
- For any new mobile game controls, audit every context-sensitive mechanic (e.g., Irusan's rapid alternating movement) in addition to ordinary movement and attacks.

## Source references

1. Mobile/game controls: [`as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js), [`styles.css`](../../Companion%20Files/styles.css), [`theta-rhythm.js`](../../Companion%20Files/theta-rhythm.js) and [`theta-rhythm.css`](../../Companion%20Files/theta-rhythm.css).
2. Shared app and viewer: [`app.js`](../../Companion%20Files/app.js), [`pwa.js`](../../Companion%20Files/pwa.js) and [`service-worker.js`](../../service-worker.js).
3. Focused mobile gameplay check: [`release033_gameplay.py`](../../tests/release033_gameplay.py).

## Mobile Rotation Crafter controls

On touchscreens, the hotkey bar is laid out in six columns per row and the Skills drawer opens from the bottom of the screen. Drag a skill tile to a hotkey slot, or tap a skill and then tap a slot. Existing assigned slots can be dragged to move or swap skills, and long-pressed during setup to clear the slot. During an active practice session, tap a populated hotkey to cast; hold and release it for charged skills. Touch inputs use the same cooldown, combo-stage, and charge behavior as keyboard shortcuts. The desktop key layout and drag-and-drop remain available.

**References:** `Companion Files/app.js` (`craftTouchBind`, `craftKeyDown`, `craftKeyUp`, `craftAssign`, `craftMove`); `Companion Files/styles.css` (mobile `.craft-layout` rules). Physical-device gestures still require verification.

## Mobile movement controls (0.3.6 current behavior)

Crom Bás Invaders and Vertrag share a device-local analog/D-pad mode preference. The analog stick has immediate proportional movement with pointer capture; the D-pad supports diagonals from two simultaneous directions. Users can switch modes from each game’s movement panel. Vertrag places the field above potion and movement controls in portrait and between them in landscape; its field supports two-finger pinch zoom. The potion button displays its remaining cooldown. Giant occupation, difficulty selection, and menus remain touch-accessible. The mobile control preference is local to the device and does not change the desktop keyboard bindings. Physical-device validation is still recommended for responsiveness and ergonomics.

Source references: [1] `Companion Files/mobile-movement.js`; [2] `Companion Files/vertrag-survival.js`; [3] `Companion Files/as-chicken-invaders.js`; [4] `Companion Files/styles.css`.

## AS / AG Positioning Labs (0.3.6)

Alchemic Sharpshooter and Arsenal Gunner positioning labs have touch-drag interactions for player, targets (free mode) and aim controls. AG distinguishes **Detonation Field** placement with orange dashed circles and an orange button from **Heavy Artillery** targeting with a purple circle/button. The Target Frames challenge uses the same distinction, with fixed targets and touch-friendly Fire/Next controls. Existing geometry and scoring are unchanged.

Source references: [1] `Companion Files/app.js` (`bindPositionEvents`, `bindAgPosition`); [2] `Companion Files/frame-bowling.js` (`bind`, `paint`, `results`); [3] `Companion Files/styles.css`. Verify target selection and finger dragging on physical phones.

## Rate Isn’t a Lie performance (0.3.8)

The Harmonic Saint music calculator and the playful performance simulator are both available on mobile. Bard skills can be assigned from the bottom skill drawer using a touch drag or by tapping a skill and then an empty hotkey slot. Assigned skills can be dragged to rearrange; a long press during setup clears a slot. During a running performance, hotkey taps activate the same skill and cooldown logic as desktop keyboard keys, and active cooldowns appear on each button. The hotbar uses six columns per row in mobile layouts. These controls do not change buff-calculator values or in-game rate assumptions.

The mobile hub restriction list now contains only Cutting Chorus Rhythm and the legacy generic drill; older gates for Rotation Crafter, Subject Theta, Vertrag and AS/AG positioning have been removed. The legacy generic drill route remains restricted. These changes need physical-device usability checks.

Source references: [1] `Companion Files/app.js` (`musicTouchBind`, `musicBuffFire`, `musicBuffBegin`, `MIDIR_MOBILE_DESKTOP_ONLY`); [2] `Companion Files/styles.css`; [3] `tests/music037_touch_test.py`.

## Pig Pursuit — dual-stick riding

Pig Pursuit provides separate touch sticks beneath the game: **Carrot direction** controls the direction the pig chases, and **Rider balance** applies independent counterbalancing corrections to keep the rider seated. Both can be held simultaneously with separate fingers. Keyboard and mouse controls remain available on desktop. The mobile controls reuse the game’s existing speed, collision, hard-mode maze, and balance rules.

## EV Tower Range Lab — mobile controls and zoom

EV provides a dedicated two-direction patrol pad beneath the battlefield, plus direct skill buttons with live cooldown readouts for every implemented tower skill. Tower selection is a single tap; double-tap a selected tower then tap a valid destination to move it, or hold and drag it. Shop purchases can be placed using the Inventory **Place on map** button followed by a battlefield tap. Tap the shop, inventory and base controls to open their existing drawers. Desktop scroll-wheel zoom stays centered at the pointer; mobile two-finger pinch zoom anchors around the midpoint of the gesture. The existing zoom buttons and Fit remain available.

Physical-device validation is pending for simultaneous two-stick riding, long-press tower moving, precise map placement, pinch/scroll gesture conflicts and narrow landscape screens. EV’s skill ranges and damage remain experimental.

**References:** `Companion Files/ek-pig-pursuit.js`, `Companion Files/ev-defense.js`, `Companion Files/styles.css`, `Companion Files/app.js`; focused test `tests/mobile038_pig_ev_test.py`.

## Cutting Chorus rhythm controls (0.3.9 current)

Mobile play preserves independent aiming and tapping: touch-drag the playfield to aim, then activate a individual skill or Cutting Chorus button using another finger at the correct time. No direct tap-to-hit mode is provided because it would bypass the positioning/timing split. Desktop controls are unchanged. [1] `Companion Files/mp-rhythm.js`; [2] `Companion Files/styles.css`.

## Cutting Chorus skill trigger panel

On touch screens, the trigger panel lists Melodic Puppeteer skills and base puppet skills separately, with a dedicated Cutting Chorus button. Each button displays its current **cooldown** state based on the current Rotation Highlights minimum rules; numbered Puppet Acts have a provisional +3s added. Hard mode tracks the last two distinct skill inputs, and aiming and triggering remain separate touches. PC mouse-and-keyboard play is preserved. Source: `Companion Files/mp-rhythm.js`, `Companion Files/styles.css`.
