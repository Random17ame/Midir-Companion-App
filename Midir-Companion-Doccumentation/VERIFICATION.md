# Current verification scope and known limitations — 0.3.11d

## Confirmed from the shipped source

- 90 MiB single-file import guard; HTML structured-data parser avoids an extra full HTML DOM but still reads the file text into memory.
- Mobile defaults to 10 active detailed reports; desktop defaults to 30. Browser storage is local and backups do not create remote synchronization.
- Theta base MP 2,500, Dorcha cap 15, five **fallen-note** misses with three-success reset (empty presses harmless), icon-first controls, and flat on-track timing receivers.
- Vertrag Trial/Endless arena picker, clickable giant occupancy, four defensive states, overhead HP display, `H` potion default, full-distance locked-target charge and 20%-expanded quiet-zone radius.
- In-app games and equipment rates remain simulated, not live game calculations.

## Limits that must remain explicit

- A 90 MiB threshold is not a guaranteed successful import on lower-memory devices; there is no gate-at-a-time import feature.
- PWA install, persistent storage and imported HTML behavior depend on browser/OS support, origin and quota. Test on the target mobile device.
- Full-profile backups are not a substitute for original raw reports once compacted. The app cannot synchronize browser data between devices.
- Imported combat records can be incomplete, ambiguous or missing. Don't infer actor identity, Arcana, boss clear or skill use without matching evidence.
- Training rewards, survival damage multipliers, and upgrade chances are Companion mechanics, not certified Mabinogi values.

## Mobile game access verification

- Implemented touch support includes Rotation Crafter, Rate Isn’t a Lie, Crom, Vertrag, Theta, positioning labs, Pig Pursuit and EV. Cutting Chorus has separate touch aim and trigger controls and is accessible from its mobile Arcana hub entry. Physical-phone multi-touch responsiveness is still pending verification; only the legacy generic drill remains in the `MIDIR_MOBILE_DESKTOP_ONLY` restriction set.
- EV waves 1 and 2 use reduced starting-tier HP (12 and 17 respectively); these are simulation balance parameters, not official combat values.
- Confirm two-finger controls on physical phones: EV pinch zoom and tower placement, Pig Pursuit two-stick input, Vertrag zoom and emergency movement, and Cutting Chorus independent aim/trigger once routed.

## Rotation Highlights skill-rule confidence

- Current cooldown floors and shape budgets are implemented analysis heuristics, not a verified catalogue of all Mabinogi cooldowns and hitboxes. See [rule inventory](ROTATION-SKILL-RULES-INVENTORY.md) before modifying interpretation.
- Boss-only evidence is prioritized over Gate 2 fallback; critical hits are normalized to the same per-skill non-critical reference damage. Crit-only references use a player-specific multiplier where supported by other normal/critical observations.

## Regression entry points

Run current `tests/regression_companion.py`, `tests/module_binding_test.py`, Theta/Vertrag test suites and mobile-specific browser tests before publication. Also perform a manual phone smoke test over HTTPS.

## 0.3.11a hotfix verification

- Chromium mobile-browser UI test: complete EV tutorial steps 1–4 with the Base Manager drawer open and start Wave 1.
- Music gear sets: create alternate accessory with different enchant and reforge, share an instrument then detach it, add Enduring Defense reforge, compare results, override and reset enchants. Revised eight-slot editor tests and seven baseline mobile layout tests pass.
- Theta renderer: touch/small-screen mode uses reduced backing pixels and starts/responds; logic loop and skill timing constants were not intentionally changed. No frame-rate measurement or physical-device result is claimed.
- Tested JavaScript syntax, 17 baseline UI regressions, module binding, and pre-existing localization/Theta modules (see tests).
- Limitations: isolated Chromium tests do not establish sustained performance on slower phones, real storage behavior over a deployed HTTPS origin, service-worker upgrade behavior or all possible gear roll restrictions. Save/reload/backups should be verified before retiring the previous source release.
- The previous separate AG landing-scroll anomaly on the narrowest test viewport is not claimed fixed by this hotfix.

## 0.3.11c equipment/editor acceptance (browser)

- Music sets use a slot board at 320 × 568, 390 × 844 and 844 × 390; each slot has a direct item editor. Reforge options and normal/limit-break caps come from the simulator’s reference table; duplicates on the same item are disallowed and wings have no reforge editor.
- Same-name set bonus precedence is verified: Seraphic BFO +5% overrides Troubadour BFO +3% while Troubadour Enduring Melody +3% remains active; removing Seraphic restores Troubadour BFO +3%.
- The 0.3.11a gear swap, saved-state migration and EV/Theta checks are rerun for the cumulative release. Actual phone ergonomics, live gameplay performance, hosted PWA cache refresh and profile backup/restore remain separate field checks.

## 0.3.11c compact calculator and override tests

- `tests/music0311c_compact_override_test.py` checks automatic versus typed per-item enchant contributions, explicit zero, clear/reset, preservation of set-only overall override precedence, shared-item behavior, copied-item independence and simulated localStorage reload.
- At 320×568, 390×844 and 844×390 Chromium touch/viewport configurations, checked no horizontal overflow, 3×3 slot board access, pinned live results after scrolling, and result preview inside the slot editor. Collapsed advanced sources and set management remain accessible; the existing 0.3.11b reforge and named set effect tests are rerun.
- These automated checks do not prove real device ergonomics, actual saved-profile backup/restore, or GitHub Pages service-worker replacement.

## 0.3.11c Murias Water follow-up

- `tests/music0311c_murias_slots_test.py`: both accessories, hat, body, boots, gloves and instrument can add +1 each; wings have no checkbox. Exactly +7 automatic maximum, whole-set override (including intentional zero) and automatic reset are checked.
- The same test checks a shared instrument, independent copies, simulated localStorage reload and migration of a formerly flat Murias value into a visible per-set override; it does not add a second global contribution.
- Checks run in Chromium at 320×568, 390×844 and 844×390, with no horizontal overflow. Physical-phone usage and deployed site migration still require human confirmation.

## 0.3.11d Theta timing and mobile-browser checks

- `tests/theta0311d_judgment_test.py` validates ring placement, full-note Perfect containment, all partial tiers, stronger late judgments, ignored extra/mis-timed inputs, visible on-deck note (including while another note approaches), track-exit miss deadline, five-miss failure, three-hit reset, and overall historical Miss total at 320×568, 390×844 and 844×390.
- Updated `tests/theta282_test.py` to test the newly intended harmless unmatched press behavior, replacing its now-obsolete wrong-time overheat assertion. All nine preexisting Theta tests remain release-gating.
- Physical-device latency, sustained FPS, touch/keyboard timing feel and deployed cache refresh must still be tested after publishing. Automated Chromium tests do not prove smoothness on a particular phone.
