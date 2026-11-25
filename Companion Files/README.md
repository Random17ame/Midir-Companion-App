# Midir Companion — Application Files (0.3.13 Draft)

This directory contains the scripts, CSS, icons, sprites, and other assets used by Midir Companion. The app is launched through `../index.html` for HTTPS hosting or `../Midir Companion.html` for local desktop use. Keep its directory name and asset structure unchanged.

**Application version:** 0.3.13 Draft. New features increment the numeric patch version and reset the letter (0.3.12r → 0.3.13); minor adjustments, fixes and visual changes increment the letter (0.3.12r → 0.3.12s). Historical release and test identifiers remain stable.

## Application overview

- The Vault, archived combat reports, Achievement Book, and Rotation Highlights handle evidence-backed combat records. **See Secret Sauce** in Settings reveals the advanced report tools.
- Arcana Simulators, Debuff Academy, and the Overview menu lead to class practice, skill references, equipment/economy tools, and minigames, including Theta Containment, Vertrag Survival Grounds, and Crom Bás Invaders.
- Mobile support includes responsive layouts, supported touch-oriented tools and minigames, and a full-screen imported-report reader. Keyboard-dependent activities remain desktop-focused.
- Import processing and player saves are local to the browser, not uploaded to GitHub Pages. Some large imports may still be limited by device memory or browser storage quota.
- Save compatibility and backup-format details are documented in the current reference. Retain original exports and regular full-profile backups.

## Authoritative documentation

For the current rules, architecture, 23 feature guides, and source references, see the [current documentation home](../Midir-Companion-Documentation/README.md). The [historical changelog](../Midir-Companion-Documentation/CHANGELOG.md) is maintained **only there**; older release notes are not a substitute for the current feature descriptions.

**Do not copy any personal profile backups, combat exports, or private reports into a public GitHub repository.**


### 0.3.11 prior release

Mobile UX refinements keep critical in-game controls visible for Vertrag, Pig Pursuit, Bandit Hunt, Cutting Chorus, EV, AG and Herb Collection. Music Calculator now includes an eight-slot enchant editor and no longer duplicates Musical Knowledge reforge values. See the updated `Midir-Companion-Documentation` current-state guides; release history remains in its `CHANGELOG.md`.


### 0.3.11e prior Vertrag correction

Time Trial has no selected countdown and is scored by fastest complete clear. The four remaining-progress bars remain attached to the giants, drain from full to empty, and render after terrain clipping and effects. Old countdown-trial times are preserved separately as legacy records. No additional giant-status HUD is displayed.

### 0.3.11d prior Theta correction

Flat timing rings sit inside the track, notes continue through the rings and beyond the track edge, and full enclosure is required for Perfect. Partial overlaps score Great / Good / OK, favoring late presses. Wrong/out-of-ring inputs are harmless; five genuinely unplayed notes cause failure, and three consecutive hits clear the active miss stack. A real queued note is drawn at the far end during timing gaps. No Rotation Highlights or gear calculations changed.

### 0.3.11c previous hotfix

See root README and current-state guides for EV onboarding, music equipment set switching, Enduring Defense reforge, and Theta mobile performance rendering. Rotation Highlights cooldown/shape evidence is unchanged.

### 0.3.11i current visible features

Vertrag has an in-bounds bouncing setup prompt and a Training Points shop using shared simulator inventories. Theta gives Thunderblight upkeep priority over Thunder (normal and S50 casting). The earlier time-trial, music equipment, and mobile-renderer mechanics are unchanged.

### 0.3.12d Harmonic Saint equipment input correction

Litany Murias Water now selects integer Healing Potency 1–10% only; ordinary equipment enchants now select integer Healing and Magic Attack only. Relic custom enchants use matching fields, while named Gift retains its +5% special effect. Robe is the final cell of the equipment 3×3 and Echostone sits directly beneath. All gear edit inputs use whole numbers without rounding the calculated EV reforge effects or separate Dissonance calibration. Previous persisted Litany state is sanitized by the module's schema-v6 hydration. Details and test IDs in the current [Harmonic Saint guide](../Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md).

### 0.3.12c Music Buff and real 46.b comparison

- Music calculation scopes instrument-exclusive Special Upgrade to BFO/Vivace only. Instrument Prefix Polyphony is +6–9 and Suffix Tempo +4–5; old saved physical instrument rolls migrate +2 exactly once, preserving manual overrides.
- Music extra-settings and set-management disclosure state persists when equipment and field controls rerender; modal scroll preservation remains.
- Real Midir 46.b leaderboard `skills[].id/name` maps correctly to individual hits and observed-use marker display. 30s totals and partial-window 10s sums are computed solely from hit evidence.

### 0.3.12b report viewing / leaderboard comparison

`burst-comparison.js` is a new isolated read-only importer for independent 30s boss comparisons (`script#burst-data`). It does not enter the normal full-session or Rotation Highlights award pathways. `app.js` also reflows the sandboxed imported-report reader on device orientation updates; `manifest.webmanifest` allows both orientations. See `../Midir-Companion-Documentation/features/21-LEADERBOARD-BURST-COMPARISONS.md`.
