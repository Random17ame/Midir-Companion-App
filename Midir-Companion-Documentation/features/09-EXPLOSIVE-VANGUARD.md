# Explosive Vanguard — Tower Range Lab — Feature Log

**Purpose:** Practice area targeting, resource pressure and Link progression in a standalone defensive/offensive challenge.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Challenge mechanics

- **Tower practice:** Has a dedicated arena, persistent records, equipment controls and customizable attacks/hotbar. [^1]
- **Skill/resource system:** Tracks shell/pressure progression, cooldowns and conditional skill behavior. Stamina is intentionally ignored in the module model. [^1]
- **Link progression:** Uses cumulative Link totals rather than summing each rank again, and saves equipment/upgrade state. [^1]

## Integration

- **Standalone saves:** Uses `midir-ev-tower-lab-v1`, with `exportState`/`importState` for profile backups. [^1] [^2]
- **Skill icons and scene art:** Uses its own artwork and shared Companion registries where appropriate. [^1]

## Battlefield design and resource behavior

- **Maps and placement:** The range-lab campaign offers multiple selectable paths (including procedural layouts), drag-and-place towers away from the road, tower rotation and zoom. A clickable Home Base controls shells and the linked skill rotation. Owned towers can be assigned to a customizable hotbar and sequence circuit; repeated links can be used. A shop drawer separates towers, upgrades and weapons; opening major drawers pauses combat. [^1]
- **Tactical resources:** A 100-capacity **Mana Shell** pool is reloaded manually from the Home Base with Recharge Shells; **Mana Pressure** accumulates on skill use and affects interaction with Heavy Stander above the pressure threshold. Skills executed by multiple same-type towers share a cooldown and pay one resource cost for the action rather than once per tower or struck target. [^1]
- **Loot and economy:** A/D advances a loot patrol marker along the path to claim coins/materials; tower purchases, upgrades, lances, Arcana Link I–X, wave survival and ticket rewards share one persistent game profile. The Soul Liberator Lance is also the condition checked for awarding level-8 Special Upgrade stones on cleared waves through the cross-game callback. [^1] [^2]
- **Mechanical exceptions:** Relentless Thrust has movement-dependent two-jab/follow-up behavior with short accumulation cooldown after repeated casts; Drill Charge accumulates heat and can overheat into a prolonged lockout. Lance Charge uses distance-scaled damage and a lane-like hit volume. These exceptions are **tower-defense-specific models** and must not silently overwrite universal Rotation Crafter or recorded-player rules. [^1]
- **Tooltip policy:** A short skill description appears after an initial hover; detailed numerical geometry waits for an extended hover (nominally eight seconds). Preserve this progressive disclosure when updating sprites, range indicators and balance. [^1]

## Verification and outstanding limits

- This is a simulator/practice approximation; the source does not establish a fully verified live-game conversion of pressure, cooldown or durability values.
- Test upgrade migrations, resource caps, tooltip behavior and controls after gameplay changes.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Tower Range Lab: [`ev-defense.js`](../../Companion%20Files/ev-defense.js).
[^2]: Shared route and backup: [`app.js`](../../Companion%20Files/app.js).
