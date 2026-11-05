# Current verification scope and known limitations — 0.3.4

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

## Regression entry points

Run current `tests/regression_companion.py`, `tests/module_binding_test.py`, Theta/Vertrag test suites and mobile-specific browser tests before publication. Also perform a manual phone smoke test over HTTPS.
