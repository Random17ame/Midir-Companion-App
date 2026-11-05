# Current verification scope and known limitations — 0.3.10

## Confirmed from the shipped source

- 90 MiB single-file import guard; HTML structured-data parser avoids an extra full HTML DOM but still reads the file text into memory.
- Mobile defaults to 10 active detailed reports; desktop defaults to 30. Browser storage is local and backups do not create remote synchronization.
- Theta base MP 2,500, Dorcha cap 15, five overheat misses with three-success reset, icon-first controls, and flat timing receivers.
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
