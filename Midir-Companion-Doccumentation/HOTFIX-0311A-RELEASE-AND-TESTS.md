# Midir Companion 0.3.11a — Release and Development Handoff

**Date:** November 5, 2026  
**Cumulative authoritative source:** `Midir-Companion-0.3.11a-GitHub-Ready.zip`  
**Previous local release:** `Midir-Companion-0.3.11-GitHub-Ready.zip`  
**Deployment:** not verified; local Chromium checks are not physical-phone certification.

## Completed in this hotfix

### 1. Explosive Vanguard — mobile tutorial and controls

- Completed the four-stage tutorial flow with a second **I understand — start playing** control inside the open Base Manager. The confirmation closes the drawer, clears the tutorial, and leaves **Start Wave** accessible.
- Fixed a previously untested **320px** intrinsic-width overflow in EV's game shell/mobile patrol pad, which pushed the forward patrol arrow outside the phone screen.
- In short mobile landscape, anchored the drawer/final confirmation to the viewport instead of allowing the stage's centering transform to move those controls offscreen.
- End-to-end Chromium checks navigate through all four stages and start Wave 1 at **320×568, 390×844, and 844×390**. This does not substitute for physical phone pinch/placement checks.
- **Sources:** `Companion Files/ev-defense.js`, `Companion Files/styles.css`, `tests/mobile0311a_viewports_test.py`.

### 2. Music Calculator — reusable items, gear tabs and reforges

- Changed the old split enchant editor plus floating reforge fields into **named buff-set tabs**, each with eight gear slots: Accessory 1/2, Wings, Hat, Body, Boots, Gloves, Instrument. Each physical item has a user-editable name, its allowed Prefix/Suffix enchants and chosen rolls, and up to three separately selected reforge lines. A chosen instrument also owns its instrument upgrades, item quality and special upgrades.
- Each set equips existing item IDs from a reusable library. **Copy tab** initially shares physical item IDs; editing a shared item updates all tabs. **Make separate copy** detaches one slot so it can carry different enchants and reforges. **New item** creates a separate blank gear piece. In each set, a physical accessory cannot be equipped twice at the same time.
- The calculator previews the active set's selected music effect and provides a side-by-side results table for all buff tabs. Per-set manual Enchant Effects values take precedence until **Use equipped total** resets them.
- Removed **March Song Mount Speed** from available calculator selections and contributions. Retained **March Song Walking Speed**; added **Enduring Melody Defense Reforge** (+1 base Defense per level, maximum 3).
- 0.3.11 saved enchants migrate to item records. Old flat reforges remain **visible, counted and unassigned** pending an explicit slot assignment (nothing is guessed). Allocation to a copied set first detaches a shared item, preventing double-counting. Values exceeding a single item's reforge maximum retain their unallocated remainder. Previous manual Enchant Effects override is preserved. The old duplicate Musical Knowledge reforge remains excluded.
- **Sources:** `Companion Files/app.js` (`MUSIC_GEAR_REFORGES`, `musicGearState`, `musicGearCompare`, `musicCalcForKey`), `Companion Files/styles.css`, `Companion Files/i18n.js`, `tests/mobile0311a_hotfix_test.py`, `tests/music0311a_migration_test.py`, `tests/mobile0311_music_test.py`.

**Example:** The Battlefield set can equip a Dynamic +2, Inspiring Effect 3 accessory; a March Song set can *copy the tab* and then *make a separate copy of Accessory 1*, replacing it with Cadenza +1 and March Walking Speed 3. The old set retains Dynamic/Inspiring while March gains Cadenza/Walking. Both tabs may keep the same linked instrument, or clone it for different enchant and reforge rolls.

### 3. Dark Diviner — Theta mobile performance pass

- Added **Graphics Mode: Auto / Performance / Full** to Theta settings. Auto selects Performance on touch/small-screen devices; desktop retains its full renderer.
- Performance mode reduces canvas backing resolution, targets at most **30 canvas paints/sec** while continuing the main gameplay timing/input logic on animation frames, minimizes expensive glow/shadow/particles/thunder cosmestics, suppresses visual screen shake, and throttles HUD text changes.
- Does not intentionally change the hit-judgment windows, cooldowns, chart timing, resources, scoring or stage progression. Nine historical Theta tests pass in the revised release.
- At **320×568, 390×844 and 844×390**, Chromium confirms the optimized canvas starts, uses fewer physical pixels, updates the HUD and remains responsive to End. This is **not** an FPS benchmark on low-end hardware; additional user phone passes are expected.
- **Sources:** `Companion Files/theta-rhythm.js`, `Companion Files/theta-rhythm.css`, `tests/mobile0311a_viewports_test.py`.

## Verification summary

- Cumulative source and static archive to be checked with ZIP test and integrity hash during packaging.
- `tests/regression_companion.py`: **17/17 passed**.
- `tests/mobile0311_layout_test.py`: **7/7 passed**.
- `tests/mobile0311a_hotfix_test.py`: **passed** (EV finish, gear swapping/shared instruments, defense reforge/manual override, Theta performance).
- `tests/mobile0311a_viewports_test.py`: **3 of 3 mobile viewport sets passed** for EV and Theta.
- `tests/mobile0311_music_test.py`: **passed** (revised 0.3.11a editor).
- `tests/music0311a_migration_test.py`: **passed** (0.3.11 mock localStorage migration/reload, copied-tab attribution and no double counting).
- `tests/localization0310_browser_test.py`: **390px and desktop passed**; legacy + release static/VM checks passed.
- `tests/rotation305_wireless.js`: **passed**, Rotation Highlights unchanged.
- **Nine historical Theta test files passed** (`theta282` through `theta290`).
- Node syntax checks and additional module binding checks are final release gates.

## Remaining work and honest limits

1. **Physical-device Theta playtest** at the original problem phone: check sustained FPS, device heat, dropped input, sound responsiveness, rotation timing and background/power-save behavior. User expects extra Theta passes after this hotfix. If lag remains, collect device/browser details and a recording, then profile CPU/GPU draw cost without loosening timing windows.
2. **Physical-device EV onboarding**, shop/drawer/tower placement, zoom and mobile input check. The browser test is three sizes, not a real phone.
3. **Music profile backup/restore on the deployed origin**: mock localStorage migration/reload passed; the browser lab cannot navigate a genuine public origin. Check a saved old profile, new set edits and full profile backup/restore. Do not clear live browser site data; protect profiles and original report exports.
4. Previous audit's **Arsenal Gunner 320px initial-scroll visibility** remains a separate low-priority issue; this hotfix did not claim to solve it.
5. The application is not confirmed deployed to GitHub Pages. Service-worker shell cache was bumped to `midir-shell-311a` and art cache to `midir-art-311a` to load new resources; verify in deployment.

## Next planned research — Rotation Highlights

**Do not conflate future skill-shape/cooldown work with 0.3.11a.** The existing `Midir-Companion-Doccumentation/ROTATION-HIGHLIGHTS-NEXT-CHAT-HANDOFF.md` in this release points to 0.3.11a and preserves the planned evidence-first rollout starting with Melodic Puppeteer, Wireless Puppet attribution, then Arcana-by-Arcana cooldowns, hit shapes and activation grouping. Keep boss-only → Gate 2 fallback, critical-normalized skill comparisons, conservative provenance, and explicit verified/estimated/provisional/unknown tags.

## Publishing guidance

Use the full cumulative ZIP, not individual patch files. Copy out a separate backup of the currently deployed repo and preserve `.git` and personal repository management files; replace obsolete application files in the working directory, extract the entire ZIP contents at the repo root, inspect changes, commit/push, and confirm GitHub Pages. Keep user profiles and combat exports out of the public repository; browser local storage is separate and should not be cleared casually.
