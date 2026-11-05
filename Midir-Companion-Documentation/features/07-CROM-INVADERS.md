# Alchemic Sharpshooter — Crom Bás Invaders — Feature Log

**Purpose:** An offline arcade combat game with progressive waves, enemies, resources and shop rewards.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Combat and encounters

- **Arcade structure:** Fifty-wave progression, camp/shop intervals, persistent skills, hotbar, enemy waves, bosses and checkpoint rewards. [^1]
- **Skill gameplay:** Urgent Shot, Ignis Plume, Aqua Volley, Crash Shot, Ventus Howl, Terra Scourge and other AS actions have separate modeled cooldown, area and damage behavior. [^1]
- **Enemy roster:** Includes Crom-associated enemies, Disciples, Irusan, Glas variants and Melci, with bespoke attack tells and art. [^1] [^2]
- **Level progression:** Purchasable cumulative Alchemic Sharpshooter Links and upgrades affect skills, character resources and survivability. [^1]

## Rewards and persistence

- **Shop and equipment:** Currency, stone rewards, purchases, reforge-related bonuses and customizable hotbar persist between runs. [^1]
- **Shared achievements:** In-game milestones contribute to relevant achievements and shared bonus systems. [^1] [^3]
- **Standalone storage:** `midir-as-crom-invaders-v1` plus global bonus key `midir-as-crom-global-bonuses-v1`. [^1]

## Arcade combat contract and pacing

- **Access and navigation:** The Alchemic Sharpshooter shortcut and Games & Simulators navigation must both enter the **actual Crom Bás Invaders game**, not Rotation Crafter. This is a critical regression check because a previously visible shortcut routed to the wrong view. The game has a walkable menu camp with Start and Shop locations; the shop is between attempts, not accessible while an active run is underway. [^1] [^3]
- **Wave loop:** Fifty-wave cycles repeat without resetting accumulated difficulty. Boss slots are 10/30 Irusan, 20/40 normal Glas Ghaibhleann, and 50 Giga Glas. Melci joins selected intervening waves (15/25/35/45) and accompanies Irusan. In early waves the main formation has one selected enemy type at a time; scripted additional spawns and Wraith appearances are separate behaviors. Enemies are mainly confined to the upper/middle field; the bottom-center is the player's normal safe area. Basic waves primarily move in horizontal/vertical formation paths. [^1]
- **Attack fairness:** Ordinary enemy attacks share a rolling three-second budget starting at three attacks, with fractional growth after later waves. Melci and bosses are deliberately governed by separate mechanics. A cleared wave cannot restart immediately: the implemented interval is at least five seconds. The intent is to make attacks legible rather than overwhelm players with simultaneous projectiles. [^1]
- **Archer controls:** Keyboard arrows/WASD or pointer following controls the archer. Magnum Shot auto-fires approximately once per second. Active skills use an assignable hotbar, including Urgent Shot (6s), Ignis Plume (6s), Aqua Volley (10s), Crash Shot (3.75s), Ventus Howl (10s), Terra Scourge (24s), Tri-Assault (36s), Golden Time (162s), and Anchor Rush (zero fixed cooldown with Dorcha cost). These are the **current arcade skill definitions**, not a claim of exhaustive live-game skill timing. [^1]
- **Skills and permanent purchases:** Fragments buy in-mode skills, reforges, Link and maximum-health progression; Chunks buy cross-mode bonuses or Special Upgrade stones. The code contains Crash Shot fragment count/radius/power upgrades, Magnum damage, and cumulative Link I–X purchases. Upgrades should remain earned and permanent across attempts; do not collapse the two currencies. [^1]

## Enemy reference — observable implemented behaviors

| Enemy | Role and behavior | Tactical concern |
|---|---|---|
| Ronaun / Dark Ronaun | One-point starting shield independent of HP scaling; attacks can overflow remaining shield into HP. Caster-owned intersecting lines slow the archer and three simultaneous contacts pin them until a line clears; the lines vanish on that caster's death. | Escape through movement/recoil; avoid miscounting shield damage. |
| Disciple / Dark Disciple | Formation movement; straight-down projectile; lateral dash with four diagonal shots and collision shoves; aimed recoil projectile that pushes nearby enemies. | Sideways reposition and close-range shoves. |
| Frozen Cari | Nearby non-Cari allies receive a two-point shielding aura, refreshed on a shared five-second window, not stacked by multiple Cari; downward slow Ice Spear freezes the player for three seconds. | Prioritize shielding source. |
| Wyneb | Low-health summons and repulsion, including Cari-paired spawns; hitting a corner can prompt three summon attempts. Spawn placement checks free space. | Control board growth. |
| Gwallgof | Extra base health, difficulty-scaling mitigation, accelerating W-shaped motion, and contact damage. | Durable mobile blocker. |
| Wraith | Arrives **during** waves rather than only in starting formation; backs away from nearby/incoming attacks. Arrival and cooldown-limited roar generate stackable, temporary attack buffs; can also fire freezing Ice Spear. | Suppress stacking attack buffs. |
| Melci Diafol | Scheduled miniboss uses V-like approach/retreat, independent of shared attack quota. At distance marks a target area for five Kunai Storm strikes; nearby uses five-hit Flame Burst across roughly three seconds with short hitstun. | Respond to telegraphs while other enemies remain active. |

The roster is a game adaptation. The current regular-wave type array includes **Un Llygadog**, Dark Ronaun and Dark Disciple; not every name in a conceptual roster is necessarily selected by the normal wave generator. Track actual `waveStart()`/spawn behavior rather than extrapolating from sprite assets or older design descriptions. [^1]

## Irusan encounter — phase contract

- Alternates a teleport-to-player telegraphed swipe (then return) with a tracking laser that follows for about two seconds, fixes position, and fires after an additional warning. Attack cycle includes a recovery delay. Melci is present in Irusan's boss waves until defeated.
- Red circular delayed strikes occur from 90–55% HP and return below 40%; one can be centered on the player. They detonate approximately five seconds after marking.
- At 50% HP Irusan becomes invulnerable. Alternate **A/D** or **Left/Right** to complete the struggle; the implemented target is 20 valid alternating inputs. A cauldron then appears: destroy it in 20 seconds or suffer 20 seconds of transformation/no attacks. Irusan becomes vulnerable again after this resolution.
- Below 50%, Cari reinforcements spawn about every 30 seconds; below 10%, the attack pace progressively escalates with elapsed time. This is an intentional DPS pressure phase, not a one-time HP-threshold speed bump. [^1]

## Normal Glas Ghaibhleann — phase contract

- A large upper-field boss starts invulnerable behind **four elemental seals**. Fire/water/earth/air orbs accept matching elemental attacks; the same charge types are part of the Alchemic Sharpshooter elemental system and charged Tri-Assault. Break all four to remove initial invulnerability.
- Normal attacks alternate left+center and right+center swipe telegraphs; a center-lane laser appears intermittently.
- At 90% HP four elemental Disciples appear, supplying a renewable 5-HP shield every five seconds while alive. At 70% and 40%, additional ordinary mobs body-block attacks, with a boss aura that prevents piercing through them. At 10%, further reinforcements and elemental Disciples appear.
- Purple lethal puddles begin at 30%, disappear at 15%, return with greater coverage at 5%. Encounter design should preserve practical dodge routes and visibly telegraph strikes. [^1]

## Giga Glas Ghaibhleann — distinct phase contract

- Wave-50 variant starts **already awakened**, without the four-seal opening. Its elemental Disciples return 20 seconds after the group is eliminated, refreshing Glas's 5-HP shield in five-second cycles until the final phase.
- Lasers choose left, center or right lanes. A map-wide strike displays a **single safe lane** for two seconds. Swipes remain possible, but rare. Boss-protected ordinary mobs (70% and 40%) obstruct piercing attacks and reflect Aqua Volley in similar projectile shapes.
- Persistent purple puddles start at 90% HP and are added at 70, 50, 30 and 10%; they grow gradually and never define the required safe lane. At 10% HP Giga consumes surviving allied units, ceases reinforcements, speeds up, takes extra damage and changes elemental immunity/color every ten seconds; **Magnum Shot remains effective**. Puddles change from fatal terrain to HP-draining areas that heal the boss when the player enters them. [^1]

## Economy and external game hooks

- Defeated enemies/waves award Dark Erg **Fragments** and **Chunks** at scaling rates. Completed-wave gains are checkpointed for persistence; do not claim an in-progress wave survives a tab close.
- Chunk-shop options currently include red/blue stones, protective stones, Ladeca/Eweca variants and permanent bonuses to the Reforge Limit Break chance, Herb Collection's 20× Huge Lucky bonus, Bandit Hunt ducats, and EV Tower tickets. The game calls Special Upgrade's reward API for stones rather than creating a separate player item ledger. [^1] [^3]
- The source includes enemy and boss sprites, formation variation, camp art, activity achievements and independent state export/import. Visual upgrades must preserve hitbox/telegraph readability rather than merely increase detail. [^1]

## Verification and outstanding limits

- Enemy and boss patterns are an arcade training adaptation, not a packet-derived encounter replay.
- Visual layouts and combat responsiveness need browser playtests after sprite, HUD or wave-balancing edits.
- Do not change progression keys, cumulative Link rules, shop ownership or achievement identifiers without migration.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Crom Invaders engine: [`as-chicken-invaders.js`](../../Companion%20Files/as-chicken-invaders.js).
[^2]: Sprite library: [`assets/crom/sprites/disciple-staff-atlas.png`](../../Companion%20Files/assets/crom/sprites/disciple-staff-atlas.png).
[^3]: Achievement/profile connections: [`app.js`](../../Companion%20Files/app.js).
