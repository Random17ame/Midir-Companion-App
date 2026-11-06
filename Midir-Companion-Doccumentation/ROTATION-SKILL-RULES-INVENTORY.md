# Rotation Highlights skill-rule inventory — 0.3.11f

**Scope:** Current implementation snapshot, extracted from the bundled application source. This is **not** a verified catalogue of live Mabinogi cooldowns, effective hitbox geometry or range. Historical changes remain in [CHANGELOG.md](CHANGELOG.md).

## What each number means

- **Cooldown floor (s)**: a minimum interval used by Rotation Highlights candidate reconstruction; not necessarily the game’s base cooldown. `0` means the table enforces no positive minimum, **not** that the skill has a zero cooldown.
- **Duration (s), maximum hits, DoT**: explicit hit-use budgeting overrides for a small subset of skills. Missing entries do not imply single-target geometry or instantaneous effects.
- Skill-ID-specific usage rules, signatures, max-hit and action windows also live in `skill-use-rules.js`; the analysis merges those with the name-based tables below. The built-in game/crafter timing values are a different model and must not silently replace these floors.
- The Cutting Chorus trainer has a provisional **+3s** numbered Puppet Act penalty and 4s/2s Cutting Chorus toggle; this is a training assumption, not a verified cooldown registry entry.

## Current Arcana minimum cooldown floors

| Arcana key | Skill | Floor (s) |
|---|---|---:|
| `ag` | Bullet Barrage | 8 |
| `ag` | Bullet Storm | 12 |
| `ag` | Calamity Cannon | 8 |
| `ag` | Detonation Field | 0 |
| `ag` | Fatal Scope | 25 |
| `ag` | Grapple Shot | 8 |
| `ag` | Gunner's Crest | 0 |
| `ag` | Heavy Artillery | 9 |
| `ag` | Reload | 0 |
| `ag` | Shooting Rush | 4.8 |
| `ag` | Tracer Pod | 0 |
| `ag` | Way of the Gun | 144 |
| `as` | Aqua Volley | 10 |
| `as` | Arrow Revolver | 0.5 |
| `as` | Crash Shot | 3.75 |
| `as` | Final Shot | 140 |
| `as` | Golden Time | 162 |
| `as` | Ignis Plume | 6 |
| `as` | Magnum Shot | 0 |
| `as` | Mirage Missile | 1 |
| `as` | Support Shot | 6 |
| `as` | Terra Scourge | 24 |
| `as` | Tri-Assault | 36 |
| `as` | Urgent Shot | 6 |
| `as` | Ventus Howl | 10 |
| `bb` | Charging Strike | 0 |
| `bb` | Focused Fist | 0 |
| `bb` | Ignite: Cyclone Drive | 7.2 |
| `bb` | Ignite: Flurry of Fists | 7.2 |
| `bb` | Ignite: Hammerblow | 7.2 |
| `bb` | Piercing Gale | 15.4 |
| `bb` | Pummel | 0 |
| `bb` | Radiant Storm | 21 |
| `bb` | Spinning Uppercut | 0 |
| `dd` | Fireball | 0 |
| `dd` | Hexshroud | 30 |
| `dd` | Ice Spear | 0 |
| `dd` | Meteor Strike | 500 |
| `dd` | Polar Vortex | 20 |
| `dd` | Render Dorcha | 10 |
| `dd` | Render Mana | 0 |
| `dd` | Seething Mana | 0 |
| `dd` | Shadow Flare | 10 |
| `dd` | Thunder | 0 |
| `dd` | Thunderblight | 15 |
| `dd` | Twilight Surge | 30 |
| `ek` | Assault Slash | 0.6 |
| `ek` | Bash | 0 |
| `ek` | Blazing Assault Slash | 3 |
| `ek` | Charge | 6 |
| `ek` | Counterattack | 2.4 |
| `ek` | Dauntless Defense | 28 |
| `ek` | Dynavolt Smash | 14 |
| `ek` | Flashing Steel | 5 |
| `ek` | Instill Elements | 0 |
| `ek` | Rage Impact | 6 |
| `ek` | Shattering Windmill | 8 |
| `ek` | Smash | 0 |
| `ek` | Windmill | 0.3 |
| `ev` | Arc Impact | 8 |
| `ev` | Blast Zone | 6 |
| `ev` | Blaze of Glory | 30 |
| `ev` | Charge | 6 |
| `ev` | Dreadnought Burst | 7 |
| `ev` | Drill Charge | 0 |
| `ev` | Lance Charge | 0 |
| `ev` | Lance Counter | 3.5 |
| `ev` | Lance Impact | 2.1 |
| `ev` | Lance Leap | 4.2 |
| `ev` | Recharge Shells | 0 |
| `ev` | Relentless Thrust | 0 |
| `fa` | Compound Catalyst | 0 |
| `fa` | Elemental Amplification | 20 |
| `fa` | Elemental Compounding | 0 |
| `fa` | Fangs of Stone | 0 |
| `fa` | Flame Burst | 0 |
| `fa` | Hydra Transmutation | 8.3 |
| `fa` | Sand Burst | 2.1 |
| `fa` | Serpentcall | 42 |
| `fa` | Water Cannon | 0 |
| `fa` | Wind Blast | 4.4 |
| `hs` | Blessing of Protection | 120 |
| `hs` | Echoes of Salvation | 3 |
| `hs` | Hand of Restoration | 3 |
| `hs` | Healing | 0 |
| `hs` | Hymn of Resurrection | 4 |
| `hs` | Pall of Ruination | 180 |
| `hs` | Party Healing | 0 |
| `hs` | Pulse of Purification | 60 |
| `hs` | Voice of Vitality | 240 |
| `mp` | Act 2: Threshold Cutter | 0 |
| `mp` | Act 4: Rising Action | 0 |
| `mp` | Act 6: Crisis | 0 |
| `mp` | Act 7: Climactic Crash | 0 |
| `mp` | Cutting Chorus | 2 |
| `mp` | Death Mark | 0 |
| `mp` | Downbeat Drop | 4 |
| `mp` | Live Wire | 10 |
| `mp` | Relentless Tempo | 10 |
| `mp` | Showstopper | 45 |
| `mp` | Wire Pull | 0 |
| `sg` | Ardent Advance | 3 |
| `sg` | Bash | 0 |
| `sg` | Charge | 6 |
| `sg` | Counterattack | 2.4 |
| `sg` | Defense | 0 |
| `sg` | Deliver Judgment | 9 |
| `sg` | Divine Retribution | 0 |
| `sg` | Pledge of Penance | 40 |
| `sg` | Provoke | 20 |
| `sg` | Rend Armor | 0 |
| `sg` | Virtuous Oath | 0 |
| `sg` | Zealous Conviction | 0 |

## Additional cross-Arcana cooldown floors

| Skill | Floor (s) |
|---|---:|
| Bullet Slide | 4 |
| Chemical Carnival | 0 |
| Drop Kick | 0 |
| Evasion | 0 |
| Final Hit | 120 |
| Flash Launcher | 4.8 |
| Frozen Blast | 15.4 |
| Heat Buster | 0 |
| Lightning Rod | 21 |
| Rain Casting | 48 |
| Resonana Litany | 1 |
| Shockwave | 0 |
| Somersault Kick | 0 |
| Spell Walk | 0 |
| Stampede | 9 |

## Explicit shape and duration budgets

| Skill | Duration (s) | Max hits | DoT |
|---|---:|---:|---|
| Hydra Transmutation | 18 | 100 | yes |
| Live Wire | 12 | 90 | yes |
| Pledge Of Penance | 40 | 120 | yes |
| Pulse Of Purification | 20 | 100 | yes |
| Resonant Litany | 4 | 7 | no |
| Terra Scourge | 23 | 24 | yes |
| Thunder | 3.5 | 35 | no |
| Thunderblight | 16 | 45 | yes |
| Tri Assault | 3 | 6 | no |

## Next verification pass — cooldowns and skill shapes

1. **Record a baseline:** capture the exact skill name, ID, Arcana, Link/Erg/reforge settings, equipment, buffs, target count, and test conditions.
2. **Capture independent evidence:** exporter hit/use timestamps, skill observations, and (where practical) controlled gameplay videos showing cooldown UI and targeting. A video alone may not reveal hidden server hitbox dimensions.
3. **Separate measures:** observed minimum between activations; base cooldown; action-lock/casting time; active damage duration; max hits per use; geometry (point, cone, line, target-centered, moving area, DoT, chain, etc.); and target attribution.
4. **Compare repeated trials:** use several clean repetitions, mark frame-rate / timestamp limitations, and distinguish observational bounds from exact game rules.
5. **Reconcile per skill:** update evidence-linked source tables, preserve user-specific cooldown modifications, add targeted tests and update this inventory. Never convert missing information into made-up defaults.

## Source references

1. [`app.js`](../Companion%20Files/app.js): `RH_MIN_COOLDOWNS`, `RH_EXTRA_COOLDOWNS`, `RH_SKILL_SHAPES`, `rhCooldownEvidence`.
2. [`skill-use-rules.js`](../Companion%20Files/skill-use-rules.js): skill ID signatures, usage grouping, max-hit/action windows.
3. [`analysis.js`](../Companion%20Files/analysis.js), [`skill-evidence.js`](../Companion%20Files/skill-evidence.js): recorded hits and actor evidence.
4. [`mp-rhythm.js`](../Companion%20Files/mp-rhythm.js): training-specific Puppet Act and Cutting Chorus cooldown assumptions.
