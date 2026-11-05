# Midir Companion 287

This archive contains the **Companion 287 offline browser application**, its assets and tests, the existing application changelog (updated for readability and current-version accuracy), and the **verified 275 documentation pack**.

## Getting started

1. Extract all files together.
2. Open **`Midir Companion.html`** in Chrome or Edge; the `index.html` entry point is also included.
3. Read the [application README](Companion%20Files/README.md) for features, save-data precautions and usage notes.

## Documentation

- [Documentation home](Midir-Companion-Documentation-275/README.md)
- [Current features (17 feature guides)](Midir-Companion-Documentation-275/CURRENT-FEATURES.md)
- [Architecture and evidence reference](Midir-Companion-Documentation-275/COMPANION-REFERENCE.md)
- [Verification and pack history](Midir-Companion-Documentation-275/VERIFICATION-AND-PACK-HISTORY.md)
- [Application changelog](Companion%20Files/CHANGELOG.md)
- [Documentation integration audit](DOCUMENTATION-INTEGRATION-NOTES.md)

The application build is **288** (GitHub **0.2.89**). Archived report summaries and lifetime achievements survive the deletion of old raw reports; reactivating an archived session requires a verified re-selection of the original export file. Rotation Highlights and survival-achievement attribution now use encounter-specific Arcana skill evidence instead of relying solely on the session-level Arcana label. Backup v2 and existing saved-game keys remain compatible. Keep your original Midir HTML exports and an external 277 backup. See `tests/COMPANION-278-ARCHIVE-AND-ARCANA.md` for details and limitations.


### Mobile browser foundation (279)

Open the Companion through a secure HTTPS host in a mobile browser, enable optional report features in Settings, and import HTML exports downloaded from Discord. Phone mode defaults to **10 active reports** rather than 30, displays warnings for large imports and tight browser quota, provides touch access to the **SG Oath checklist**, and disables keyboard-intensive games. Desktop behavior and backup format remain unchanged. These are initial browser-emulation results, not a physical-phone validation. See [Companion 279 tests](tests/mobile279_test.py).


## Build 280 — Home-screen PWA and mobile games
- HTTPS-hosted Companion can be installed on the home screen, including offline app-shell support after the first complete online load. Open `index.html` from a web host, not `file://`.
- On-demand game artwork is cached as requested, rather than preloading the 82 MB art library. The first offline visit to unvisited artwork may lack images.
- Existing HTML imports, profiles and backups stay client-side; service worker never intercepts imported files or backup downloads.
- Mobile Bandit Hunt enabled using existing on-screen Counter Punch / Charging Strike / Tumble controls, with larger targets and scrollable board. Herb Collection and Reforge Simulator were already mobile-enabled and receive touch-friendly layout support.
- 10 active reports remain the default on phones; desktop remains 30. The pre-import warning and archive consent are unchanged.
- Installing the PWA does **not** sync profile data between mobile and PC. Use backup export/restore. Android/iOS installation and real-device 20+ MB imports are pending verification.


## Build 281 — Mobile Crom Bás Invaders
- Crom Bás Invaders now works on mobile using left-side press-and-hold Aqua Volley, Terra Scourge and Anchor Rush; right-side analog directional stick; landscape recommended. The playfield retains its 800×620 aspect ratio and does not stretch.
- Unlock skills in the existing Dark Erg Shop. Locked touch buttons are disabled.
- The touch layer does not modify keyboard controls; touch gameplay and PWA installation still require real-device validation.


## Build 284 — Subject Theta first gameplay-feedback pass
- Timing has permanent circular receivers at the strike line, green judgment pulses and a live nearest-note countdown in milliseconds; recorded judgment windows and key bindings are preserved.
- Render Dorcha, Render Mana and Hexshroud are independent utility activations with cooldown display; Seething Mana remains a toggle. They no longer generate timed notes, score or overheat.
- Dorcha maximum 15 (start 10); provisional generation/costs adjusted to keep Twilight Surge and Polar Vortex usable. MP starts at 250 plus existing Mana Reservoir purchases; Render Mana replenishes 80 MP with a provisional 12s cooldown.
- Lucky Strike is a one-level, 400-Sigil shop upgrade: successful Thunder casts have a 10% chance to restore 20% of maximum MP. Existing saved profiles receive the upgrade at level zero.
- Other shop upgrades and achievements remain intact. Values are preliminary and will be reviewed individually.

### 0.2.84 — Theta cast timing and documented resources
- Dark Erg Exchange adds eight +10% Vivace casting-speed tiers (up to +80%) for Shadow Flare and Twilight Surge. Offensive notes cannot overlap casting; Thunder is scheduled after cast completion. Base cast durations (Flare 1.8s, Surge 2.5s) remain provisional.
- Replaces arbitrary Dorcha costs with documented costs for Shadow Flare (1), Thunderblight (1.5), Polar Vortex (3), Hexshroud (0.7), Render Mana (1), Seething Mana (0.6 per cast). Thunder has no innate Dorcha gain; Render Dorcha generates 5 Dorcha for 100 + 10% maximum MP. Twilight Surge direct cost remains unspecified; no fabricated charge.
- Render Mana restores 30% maximum MP and cuts spell MP spending 20% for 15s; boosts Render Dorcha by 1 during that period. Hexshroud attacks generate 0.5 Dorcha. Prior custom cooldown overrides remain preserved where identifiable.
- Existing keys, game progression, saved achievements, and non-Theta features unchanged.

### 0.2.84 — Theta Seething Mana toggle loop

A successful offensive hit while Seething Mana is OFF now restores a provisional 0.5 Dorcha; per-skill costs still apply. ON disables this baseline recovery, consumes the Seething surcharge, and awards the existing +30% score bonus when affordable. Hexshroud's independent recovery is unchanged. The provisional OFF gain will be tuned with gameplay feedback. See `tests/theta284_test.py`.

### 0.2.86 — Theta Shadow Flare Vivace rhythm calibration

Shadow Flare cast time is now 5.0 seconds at Vivace 0%, decreasing by exactly 0.5 seconds per purchased +10% tier to 1.0 second at +80%. This applies to scheduling and offensive cast locks; cooldown, resource costs, Thunder timing, and Twilight Surge timing are unchanged. All existing save keys and purchased Vivace levels are preserved. See `tests/theta285_cast_test.py`.
\n### 0.2.86 — Charge-based Twilight Surge\n\nTwilight Surge consumes a separate residual charge gauge, not ordinary Dorcha. Each completed spell cast while Seething Mana is ON adds 5 percentage points (never each hit); at 100% and after its 36-second cooldown, players activate Surge manually with the existing J key or header button. Surge uses no Dorcha or Seething surcharge, resets its gauge, and earns a large damage-weighted 1,600-point base burst before combo and upgrade multipliers. Surge no longer appears as a mandatory rhythm note. Shadow Flare Vivace timing remains unchanged. Exact Surge MP and cast timings remain provisional.\n
### 0.2.89 — Twilight Surge teaching note

Protocol 6 introduces a slow Twilight Surge reminder that approaches during the last eight seconds of its 36-second post-cast cooldown. At the due time it remains on the strike line, pulsing with increasing brightness and frequency, and expires after six seconds if Surge has not been cast, failing the lesson without reward. The first Surge must be completed to pass Protocol 6. Protocols 7–10 retain the note and cooldown countdown but wait indefinitely without failure; the note is not a normal rhythm judgment. Protocol 6 has a denser Thunder cadence and fewer Shadow Flare interruptions to make twenty Seething Mana casts attainable before a repeat deadline. The existing charge, cooldown, zero-Dorcha-cost and 1,600-point scoring behavior remains unchanged.

### 0.2.89 — Theta resource timing and S50 staff integration

- Thunder: Intermediate Magic Seething cost tier 1.3→0.6 Dorcha; other advanced/DD spells use their separate 1.6→0.6 tier. All eligible Magic talent casts generate +0.5 Dorcha per cast, even when Seething is ON. Turning Seething ON costs 50 MP.
- Six Thunder impacts are modeled independently for Hexshroud (+0.5 Dorcha per hit while affected). A full six-hit Seething Thunder with Hexshroud yields +2.2 Dorcha at baseline before the cap (0.5+6×0.5−1.3).
- Thunder's **provisional** timing: 1.30 s ordinary load/cadence, 1.00 s with Erg S50 (30% greater cast rate). Vivace never changes Thunder timing. These are playable estimates, not independently validated frame timings.
- Twilight Surge now shares the Shadow Flare 5.0-to-1.0-second Vivace progression; their established cooldown and charge requirements remain.
- Polar Vortex provides low, once-per-second point ticks for a 12-second Link-X-like duration, with extra point output while Seething is ON and +0.5 Dorcha per tick against Hexshroud-afflicted Theta. Tick magnitude is provisional.
- Dark Erg Exchange offers permanent S50 staff speed benefit for 950 Sigils OR by surrendering one **saved** S50 Staff from the Erg Simulator Storage Chest. Redemption validates type/route/level/saved state, consumes exactly one item, and preserves all other weapons.
- Render Mana/Render Dorcha remain reactive resource supports. Prior local saves and backup/export schema remain compatible.

### 0.2.89 — Theta shop and Ice Bolt
- Retired Mana Reservoir, Dark Economy, Hexshroud Extension and Ritual Precision, preserving historical save fields without active benefits. Existing Containment Aura is cosmetic (+3 spell particles per rank) and is last in the shop.
- Gameplay upgrades appear ahead of cosmetic upgrades. Added one-time Ice Bolt purchase, five sequential 1-second Bolt Magic casts, Surge charging and Hexshroud interactions, and brief icy animation slowdown on Theta.
- Added Sigil-purchased red/blue and protective red/blue upgrade stones delivered to Special Upgrade, and Erg Unlock Assist Potions delivered to the shared Erg/Reforge inventory.

### Build 290 · Ice Bolt and Arcane Aesthetics
Ice Bolt has a 1.00-second charge followed by five guaranteed-hit casts at 0.30-second release spacing (1.20 seconds first to last). Cast-based Seething and Surge and hit-based Hexshroud remain distinct; Dorcha caps at 15. Arcane Aesthetics replaces extra-particle cosmetics with purchasable, switchable Thunder, Shadow Flare, and Polar Vortex color/animation themes. Existing cosmetic ranks carry forward.

### Build 291 · Theta cosmetic quality pass
Arcane Aesthetics received a visual quality pass: Thunder now uses layered colored strikes with highlight cores and impact halos; Shadow Flare variants use fuller projectile, ember, voidfire, and lingering-burn treatments; Polar Vortex seasonal styles now carry more distinct motion and themed particles. Cosmetics remain purely visual and fully toggleable.

### Build 292 · Thunder feel pass
Subject Theta received a dedicated Thunder feedback pass. Thunder now emphasizes the caster side with a bright charging source at the staff, multi-strand lightning travel, stronger target impact rings, subtle screen shake, and a layered cast / hit sound profile. The goal is to make both base Thunder and its cosmetic variants feel more satisfying and high-impact without changing scoring or timing rules.

### Build 293 · Mobile utility audit
Mobile home now links directly to Music Buff Effect Calculator (standalone, editable, auto-saving), Special Upgrade, Erg Simulator, SG Oath Max setup, Emergency Oath, and Oath checklist. The keyboard-based Bard stage remains desktop-only; other mobile-enabled utility interactions are touch based. Mobile-only responsive layouts were refined, desktop layouts preserved.

### Build 294 · Mobile navigation and Achievement Book
The Music Buff Calculator and Rate Isn't a Lie performance gag share one mobile-accessible page; only the performance Begin action is disabled on mobile. Achievement Book layout now keeps previous/next/close controls accessible while scrolling on small phones. Slide-out menu and Secret Sauce remain usable on mobile, including expanded book content.

### Build 295 · Mobile report viewing
Retains the same desktop dark/teal visual identity, typography, card and button styling while making imported HTML reports full-screen on phones. The phone reader includes pinned chart navigation and fit/zoom controls; charts remain interactive and archived originals are never rewritten. Desktop report inspection remains unchanged.

### Build 296 · Theta visual clarity pass
Subject Theta received a gameplay-readability pass: flatter timing rings that sit on the track, cleaner right-side HUD text, overheat shown by track-edge energy instead of large miss-counter text, and toned-down Thunder hit glow so Theta remains visible during impacts. Mechanics, scoring, and cooldown behavior are unchanged.

### Build 297 · Vertrag sprite cleanup
Vertrag's animation frames received an asset pass to remove stray neighboring-pose fragments that were bleeding in from the source sheet, and all boss frames were given extra transparent padding so movement/attack animations render more cleanly.

### Build 298 — large reports and Vertrag corrections
The Vault now accepts up to 90 MB for a single report, parsing HTML-embedded JSON without building a full document tree; storage and browser RAM remain device-dependent. The seven-encounter sample stays one report to avoid duplicate credit. Vertrag charges to the player location locked at windup (any distance), quiet-zone rings are 20% larger, and player animation fragments were cleaned.

Build 299: Theta interface uses skill icons and compact instructions; base MP is now 2,500. Vertrag setup uses a giant-select arena and prominent Trial/Endless buttons, an overhead HP bar, and default potion key H.

### Build 300 — Vertrag defense selection
After choosing Time Trial or Endless, select Easy (shield), Normal (heavy breastplate), Hard (leather armor), or Veteran (sunglasses). The existing damage multipliers are retained and the choice is saved.
