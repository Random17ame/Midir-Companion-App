## Companion 97 — Melodic Puppeteer rotation reference
- Reframed the landing page around three simultaneous puppets, Live Wire uptime, Downbeat Drop and Act 7 as core damage, and frequent Cutting Chorus weaving during puppet attacks.
- Added Act 4 and Act 6 as rotation fillers; refreshed Act 2, Act 7, Showstopper, Echo, and Tempo descriptions.
- Removed Pierrot Marionette, Colossus Marionette, and Marionette Summoning from the landing-page skill cards only. Simulator mechanics unchanged.

### Companion 96 · Header cleanup
- Removed the duplicate header Arcana dropdown. The Rotation Lab selector remains the single Arcana switcher; it updates saved selection and resets practice timers without affecting other modules.

## Companion 96 — Rotation Lab Arcana selector
- Added Arcana selection directly on the Rotation Lab landing page, synchronized with the existing header selector. Switching Arcana stops practice timers and returns to the selected Arcana’s skill reference.

## Companion 96 — Immersive language and Debuff Academy refresh

- Rebuilt the Academy landing page with Rotation Lab-style activity tiles and an embedded Debuff Field Guide.
- Renamed the missing-effect exercise **New Debuff, Who This?** and simplified **Flash Cards**.
- Upgraded the guided debuff opening with visible lesson progress and direct step navigation.
- Simplified development-facing text, normalized Rotation Lab return buttons, and refreshed the header tagline to **“Make every encounter count.”**
- Removed numeric bracket IDs from displayed Reforge attribute names without changing roll weights or levels.
- Standardized the exact rate disclaimer across music, Erg, and Reforge simulators.

## Companion 95 — Forbidden Alchemist skill strategy
- Rewrite FA Rotation Lab skill cards around pre-combat formulas, full four-element amplification, orb spending by Serpentcall and enemy-targeted Chemical Carnival, and Fangs/Water Cannon/Heat Buster rotation priorities.
- Group Elemental Wave beside Heat Buster; explain Shock as Brionac activation and Flame Burst as Serpentcall support.
- Remove Sand Burst and Life Drain from the Rotation Lab landing skill reference only; preserve simulator skill availability and combat behavior.

## Companion 94 — Arsenal Gunner energy reference
- Rewrote AG Rotation Lab landing skill cards to explain verified energy generation, full-bullet consumption, Crest dual-gun generation, and Fatal Scope aim/re-aim.
- Clarified that Tracer Pod and Detonation Field halve full aim time without stacking, and that Heavy Artillery and Calamity Cannon generate rather than spend energy.
- Reference wording only; no simulator or Vault behavior changed.

## Companion 93 — Bri gate survivor achievements
- Add Sole Survivor: verified Bri gate clear, selected player zero recorded deaths, every other party member at least one death in that gate.
- Add Last One Standing: selected player deathless, all other identified non-Harmonic Saint party members have two deaths in the gate (normal revival exhausted); a Harmonic Saint may survive.
- Add Against All Odds: verified Bri gate clear with at least two confirmed non-Harmonic Saint teammates recording two deaths each in that gate.
- Require complete timestamped party records; never treat negative HP or Deadly as a death. Missing Arcana information prevents permanent-down awards from being inferred.
- Keep achievement history in existing storage and preserve original interactive HTML viewer.

## Companion 92 — Gate pacing and debuff teamwork achievements
- Add Perfectly Dressed: nine boss effects overlap continuously for six minutes on a verified clear.
- Add Clockwork: five distinct verified Bri Leitt gate boss combats below half their gate mission allowances (20/20/30 minutes). Clearly label that measurement as observed boss combat, not complete mission duration.
- Add The Long Haul: verified Gate 1/2 boss fights at least 17 minutes; Gate 3 fights over 25 minutes. Threshold omitted from in-app description.
- Add Burst of Brilliance (10-second personal recorded hit group peak) and Never Off Duty (attributed debuff streak).
- Solo-survivor/only-deathless-party-member and finishing-strong boss-phase awards deferred: current exports do not prove continuous party alive state or boss-targeted final-phase hits.

## Companion 91 — Retire provisional debuff achievement
- Removed Reference Coverage Together from the active achievement catalog and new award generation. Full Party Coverage and To the Nines now cover meaningful observed and sustained boss debuff coverage.
- Existing historical award records remain untouched in saved profiles; the retired type no longer counts toward active catalog completion.

## Companion 90 — Full Party Coverage clarity and pet debuff grouping

- Full Party Coverage achievement detail now displays a nine-item bulleted debuff checklist; removed “required” from its description and associated messaging.
- Distinguished pet defense debuff groups: Bone Dragon/Purrling and Mir Dragon/Ceraunus; pet damage amplification uses Bunbun/Foxyquin. Each group occupies one of the existing nine independent slots.
- The same corrected grouping applies to To the Nines simultaneous coverage calculations. The seven-of-nine for 97% threshold is unchanged.

## Companion 89 — Report Storage, Performance and Recovery

- Structured imported reports are now stored individually in IndexedDB; localStorage keeps a lightweight index and achievement/profile data.
- Existing report data is migrated only after IndexedDB write and readback verification; localStorage is not rewritten when migration fails.
- On startup the existing achievement system hydrates its report evidence from IndexedDB; report cards are paginated 25 at a time.
- The Vault includes Storage Management immediately before Previously Imported Reports, with browser quota estimates and persistent storage requests.
- Full profile backup can include existing archived HTML reports and the original structured report data.
- Imports write structured data before committing the new profile index; removed reports clear their stored detail record.
- Archived interactive HTML viewer remains unchanged. Vault awards remain in localStorage.
- Known limitation: all reports still need to hydrate for existing achievement calculations; incremental achievement indexing is a future optimization.

## Companion 86 — Import and profile protection
- Validated backup structure, size, and record counts before replacement; added confirmation preview and rollback on failed storage save.
- Added bounded Vault imports (40 MB per file, 250,000 NDJSON events, entity-count caps).
- Roll back unsaved imported records and awards rather than presenting transient progress as saved.
- Preserved the existing sandboxed interactive HTML report viewers and IndexedDB HTML archive.
- Note: browser-stored structured records are not yet migrated to IndexedDB; full migration needs a dedicated tested release.

## Companion 85 — Integrity and security audit
- Prevented a repeated Midir session import from generating another set of achievements, even under a new file name; retains a warning and prevents duplicate storage.
- Included conditions that started before the boss-combat window but remained active inside it in debuff attribution/coverage observations. To the Nines already clipped intervals correctly.
- Archived HTML reports opened in a separate tab now run in a sandboxed iframe with an opaque origin (scripts permitted for legacy interactive plots, but no same-origin access to Companion data), consistent with the existing inline viewer. Note that untrusted scripts may still make network requests; do not import untrusted HTML.
- Remaining risks: local browser storage quotas, lack of cryptographic authenticity for offline imports, comprehensive malformed-file validation, and full browser regression tests.

## Companion 84 — Achievement boundary and evidence audit
- Stronger Defense now also celebrates repeated verified zero-damage-taken clears, without fabricating zero damage when the metric is missing. Both the report and attempt award paths support this.
- Quick Setup now enforces its advertised first-ten-seconds window; late attributed debuffs no longer qualify.
- Reviewed zero-boundary and repeatability across Vault awards: Fewer Falls already covers repeated deathless clears; Reliable Finisher uses explicit streak thresholds; record achievements retain genuine improvement requirements; Full Party Coverage and To the Nines remain evidence-based.
- No changes to imports or stored achievement records.

## Companion 83 — Fewer Falls recognizes deathless consistency
- Fewer Falls now counts improvements all the way to zero deaths rather than excluding zero.
- Successive verified zero-death clears also qualify as maintaining zero falls.
- Deathless Improvement remains a separate award for improving from deaths to a verified deathless clear.
- Requires recorded death counts; never infers zero when death data is missing.

## Companion 82 — To the Nines
- Added To the Nines: >=97% of verified boss combat duration with seven or more of the nine Full Party Coverage effects simultaneously active.
- Uses recorded condition start/end timestamps across the encounter; pet alternatives share one slot and the Brionac/Fragarach pair requires both icons simultaneously.
- Shows exact qualified seconds and percentage per attempt. Missing/unfinished debuff timing disqualifies the attempt instead of inventing uptime.
- Retains Full Party Coverage as the separate once-observed achievement and requires verified clear for To the Nines.

## Companion 81 — Kart Bomb and Fateweaver accuracy
- Clarified Kart Bomb condition 598 as a distinct defense reduction, never shared damage amplification, throughout Debuff Academy and achievement references.
- Clarified Aspect of Reversal condition 515 as 100 HP healing to the attacker per hit on afflicted target; it proves Fateweaver presence but is neither amplification nor defense reduction. Listed all five Fateweaver aspects.
- Added both separate icon categories to the missing-debuff trainer; Full Party Coverage remains nine condition-based checks and does not require caster attribution.

## Companion 80 — Personal Achievement Track and nine-slot party coverage
- Activated Full Party Coverage using observed boss condition icons, regardless of attacker/source; nine slots include Kart Bomb ID 598 and Aspect of Reversal ID 515.
- Added Personal Best Streak, Reliable Finisher, Skill Specialist, Debuff Regular, The Comeback and Speedrunner’s Journey milestones.
- Added Bronze/Silver/Gold track labeling, a per-attempt coverage checklist and evidence-aware achievement descriptions.
- Previously imported sessions are re-evaluated when the tracked character is confirmed; no implicit attribution or simultaneous-uptime claims.

## Companion 79 — Evidence-grounded achievement expansion
- Added First Boss Clear for the first verified clear of each recorded encounter.
- Added Versatile Support for two or more distinct attributable boss debuff categories in one attempt.
- Added Attempt Damage Breakthrough for a 20% or greater increase in timestamped personal damage across comparable attempt windows, clearly distinguished from boss-only DPS.
- Existing award rules, private Vault, imports, and collectible accounting preserved.
- All newly awarded achievements explicitly identify their available evidence; repeat imported sessions remain independently counted under existing Vault policy.

## Companion-78 — Arsenal Gunner energy and aimed shots
- Confirmed Heavy Artillery and Calamity Cannon grant 100 Transmutation Energy each.
- Tracer Pod, Detonation Field, and Gunner’s Crest spend one full bullet; Crest runs for 240 seconds and grants 50 energy from Dual Gun skills.
- Fatal Scope initial shot grants 100 energy; fully aiming allows subsequent re-aim shots at a cost of one full bullet each.
- Normal aim takes two seconds; bonus aim rate from a relevant Tracer Pod or Detonation Field doubles speed to one second rather than allowing instant aim.
- Active setup is modeled on the practice target; Tracer Pod and field durations remain provisional where not yet provided.

## Companion 77 — Transmutation bullet readiness colors
- AG energy bullet indicators are turquoise/light blue until 100 energy and turn gold only when full. Keep fractional fills, all existing resource costs, and Bullet Barrage charge timing unchanged.

## Companion 76 — Bullet Barrage charge and fractional energy
- Bullet Barrage is now held for 0.5–3 seconds, automatically firing at 3 seconds. Energy scales linearly from 60 to 300 (100 per bullet mark). Cooldown scales linearly from 1 to 9 seconds.
- The five AG resource marks support partial filling; other AG skills retain provisional training values.

## Companion-75 — SG/AG knowledge and Gunner field practice
- Remove retired Martyr’s Consecration; place Fateweaver, Golden Magic Wool and Virtuous Oath together in the correct order, with the user-provided wool icon. Add SG Bash and Rage Impact entries.
- Detonation Field layering and Grapple Shot i-frame guidance; remove Shooting Rush from AG landing reference.
- Add Arsenal Gunner Field & Firing Lane Lab, with multiple independently placed medium fields, an enemy-centered larger attack circle, draggable targets and linear shots (no cones).
- Add five-mark resource training display to AG Rotation Crafter. Clearly mark as simplified because game tooltip uses numerical Transmutation Energy, and exact generation/spend conversions are unverified.

## Companion-74 — Practical skill-reference revision
- Correct Terra Scourge as target-selected area damage, not ground-targeted; note the long cast opportunity cost.
- Rework Hexshroud around attacking afflicted enemies for Dorcha generation.
- Rewrite Elemental Knight and Harmonic Saint skills in short, actionable terms.
- Replace Harmonic Saint Playing Instrument reference card with Encore and its real icon.
- Rephrase the other Arcana references around real rotation decisions rather than dense tooltips; preserve provisional EV details.
- Reference-only changes; existing simulator behavior retained.

## Companion-73 — Encounter Study hidden
- Hide the standalone Encounter Study navigation and homepage entry points pending its future redesign.
- Keep its implementation and encounter-derived Vault records intact; requests to open the hidden module route back to the Vault.
- Preserve Rotation Lab, Debuff Academy and the Vault.

## Companion-72 — Always-visible skill modifying reforges
- The Harmonic Saint music calculator now has one permanently visible “Skill modifying reforges” section for all eight inputs.
- Inputs remain independent of skill selection, retained in persistent settings, and affect only the matching effects.
- Removed the conditional reforge panel inside the selected result card.

## Companion-71 — Music calculator input cleanup
- Consolidate three Musical Knowledge tier-specific Reforge inputs into one Musical Knowledge - Reforge field that applies to all tiers. Migrate old saved tier values by taking the largest to avoid inadvertent stacking.
- Put contextual March Song, Enduring Melody, Harvest Song, and Vivace reforges next to the Rank 1 effect results rather than burying them in the lower modifier sections.

## Companion-70 — Arcana Rotation Lab landing page cleanup
- Removed source-note cards mistakenly rendered as skills (Field evidence / tooltip pass).
- Merged tooltip information into named skills; rebuilt Arsenal Gunner, Forbidden Alchemist, Puppeteer and Brawler skill lists with named, illustrated actions.
- Rewrote all ten landing page summaries to reflect actual resource, movement, cooldown and timing interactions, distinguishing known mechanics from provisional interpretations.
- Added missing icon aliases for applicable skill references.

## Companion-69 — BB multi-hit critical checks
- Pummel and Somersault Kick register three separate damage hit events for critical-hit and Fighter cooldown reset checks, regardless of global hit-count setting.
- Pummel rapid input count remains separate from damage hit count.

## Companion-68 — Fighter timings and Pummel inputs
- Updated Fighter base cooldowns from player-measured values at Erg S50: Focused Fist/Tumble 7s, Charging Strike/Spinning Uppercut 6s, Drop Kick 10s, Somersault Kick 8s, Pummel 12s. Base values are doubled before the optional S50 reduction to avoid double-halving.
- Focused Fist supports optional early release or full charge. Pummel now accepts up to ten repeated activation-key presses during a five-second action, displaying a live counter.

## Companion-67 — BB combo availability
- Stage 2/3 combo choices remain visible while cooling, but grey out and cannot activate.
- Live tenths-of-a-second countdowns refresh during practice and react immediately to Fighter cooldown resets.
- Normal key overrides and combo progression remain unchanged.

## Companion-66 — Blazing Brawler contextual combo keys
- 1–3 override assigned hotbar skills only during an active Stage 2 or Stage 3 combo selection.
- Stage 1: Charging Strike, Focused Fist, Flurry of Fists; Stage 2: Spinning Uppercut, Somersault Kick, Cyclone Drive; Stage 3: Pummel, Drop Kick, Hammerblow.
- Add on-screen selectable combo cards, preserve normal hotbar outside combos, prevent cancelled/cooling actions from advancing a stage.
- Avoid binding browser-reserved F1-F3 for the combo.

## Companion-65 — EK, SG, BB mechanics clarification
- Flashing Steel only consumes a Bash stack when activated during its existing cooldown, without resetting the cooldown timer. Bash stacks decay one every 20 seconds without a new Bash.
- SG gains Virtue from Pledge, Ardent, Rend, Judgment, and a three-stage Zealous, with Retribution only at 100 Virtue and full consumption; added persistent Pledge ground indicator and capped duration extensions.
- A successful SG dummy parry during Rend’s 1.5-second window grants the additional Rend Virtue bonus.
- Blazing Brawler critical-reset events refresh Fighter skills only, not Arcana skills; configurable critical rate retained.

## Companion-64 — Sacred Guardian reactive parry dummy
- Automatic, randomized 3–10 second dummy strikes during Sacred Guardian Rotation Crafter sessions.
- Weapon winds up visibly over 1.7 seconds; final 1.5 seconds allows a reaction parry.
- Successful parries grant 7 Virtue and reset Rend Armor; missed strikes are harmless.
- The attack loop stops cleanly when practice ends.

## Companion 63 — Rotation mechanics correction pass
- EK selectable two-handed, sword-and-shield, dual-wield Bash generation; hit verification toggle and configurable two-handed spirit Rage Impact resets.
- SG continuous Oath Virtue generation, configurable Murias Relic generation, parry event and Virtue meter.
- MP independent puppet reductions (each 50%), separate Link X Cutting Chorus reduction, summon minimum.
- BB hit-count-aware critical reset evaluation.
- AG spirit option distinguishes bullets from Transmutation Energy.
- Practice-model uncertainties documented separately.

## Companion-62 — In-game tooltip reference and key rotation mechanics
- Replaced provisional skill references for EK, SG, AG, FA, MP, BB and HS with user-supplied in-game screenshot transcription and mechanic notes.
- Added EK Bash stack tracking and Flashing Steel cooldown reset/stack consumption in Rotation Crafter.
- Added opt-in MP Erg / puppet set cooldown modifiers and BB Erg / critical-reset simulation controls.
- Excluded Explosive Vanguard, as requested. Source tooltips and screenshot conclusions should be checked against user corrections.

## Companion-61 — Enduring Melody MP/Stamina recovery reforges
- Added independent MP Recovery Speed and Stamina Recovery Speed inputs (footwear cap level 10; accessories cap level 3).
- Enduring Melody calculator and on-stage buff announcements now use separate values.

# Midir Companion — Consolidated Changelog

## Companion-60 — More Bard skill modifiers
- Add Enduring Melody Protection reforge (+1 flat base per level), Harvest Song Gathering Speed reforge, and independent Vivace Magic/Alchemy Casting Speed reforges (+1 percentage point of base per level for speed modifiers).
- Apply modifiers to their corresponding base skill results only, preserving separately calculated performance tiers and local persistence.
- Show the relevant modifier controls dynamically and reflect them in Harmonic Saint simulator text.

## Companion-59 — Rate isn't a Lie · additional modifiers
- Add March Song-specific walking/mount speed reforge controls drawn from the supplied mabi.gg calculator, and apply the values exclusively to their matching speed result.
- Add Normal/Excellent/Inspiring tier-specific effect bonuses without treating them as generic music buff stat.
- Persist the new settings in the existing calculator profile.

## Companion-58 — Restore Sacred Guardian Oath Workshop
- Restore the Oath Workshop as a separate Rotation Lab page alongside Rotation Crafter.
- Reuse the original full / quick / Wool modes and interactive snapshot controls.

## Companion-57 — Full ally figures for Harmonic Saint
- Update Harmonic Saint's Rotation Crafter so randomly spawned heal targets display full-body cartoon ally figures with their weapon silhouettes, instead of simple abstract blocks.
- Preserve target labels, health bars, and healing pop feedback.

## Companion-56 — Direct Session Import
- The Vault accepts Midir `.ndjson` session recordings, parses their raw event stream offline, and converts them into the existing Companion encounter/report model.
- Group damage hits by second and preserve HP/condition evidence; avoid fabricating verified death/clear evidence where the event data is insufficient.
- Preserve multiple-import behavior, repeat warnings, existing HTML import, awards and local profile state.

## Companion-55 — Forbidden Alchemist Herb Collection returns
- Restore Herb Collection as its own Rotation Lab page.
- Add eight randomly spawning colored herbs, randomized positions and a persistent counted-herb Storage Chest.
- Keep herbs as quantities only; no special effects or sale mechanics.


## Companion-54 — Erg Break and reforge pity
- Keep reforge odds undisclosed in the UI, apply a normal-Reforge limit-break pity after 2,500 attempts without a limit break.
- Add an Erg Break Simulator for Melodic Puppeteer with B/A/S starting routes, nine tiered taps per rank, rank promotion B50→A30 and A50→S30, S50 completion, variable success probabilities from saved Erg table, escalating secret fail stacks, an assist-potion inventory and shared gold, and a persistent weapon chest.
- Allow transferring owned Reforge Storage Chest weapons into Erg Storage Chest while preserving reforge lines.


## Companion-53 — Storage Chest and Auction House
- Save rolled items with their exact reforge/stim lines; keep in a persistent Storage Chest or list on the Auction House (not both).
- Independently resolve each listing after a random 15–250 subsequent Reforge/Stim attempts and pay fictional gold based on the best eligible line.
- Remove sold items from active listings and require a blocking Auction House sale notification to be acknowledged before further rolls. Completed sales remain visible in sales history.
- Display earned gold, saved collection and pending listings in the simulator; preserve persistent progress across reloads.

## Companion-52 — Reforge roll distribution
- Adjust the normal weighted level RNG so a 1–20 range averages approximately level 7 (expected 7.0017), while lower levels remain more common.
- Preserve Echostone one-line Stims, three-line Reforges, and the existing limit-break chance and ranges.
- This weighting remains a custom simulator choice, not real game odds.

## Companion-51 — Correct simulator item icons
- Corrected swapped assets: the green bottle now represents the Echostone Stimulant (Stim), and the tool-shaped icon represents the Reforging Tool (Reforge). No changes to roll logic.

## Companion-50 — Echostone talent reforges
- Echostone Stim remains a single line with no limit break.
- Add talent-related effects drawn from the 777-row Full Reforge List, grouped by the Echostone page's color/talent descriptions.
- Preserve exclusive color-specific effects, adding shared talent-related lines (including for Silver).
- Per-effect normal level maxima are drawn from source rows. Chance weights remain illustrative.
- Talent mapping is generalized: individual Echostone pages may contain exceptions and should be audited later.

## Companion-49 — Saved wiki reforge tables and one-line Stims
- Extract 777 reforge rows with item eligibility, default level ranges and limit break ranges from the user-saved Reforge/Full List HTML.
- Extract 56 Echostone-exclusive rows with per-color eligibility and level caps from the user-saved Echostone HTML.
- Correct Stimulant rolls to **one** attribute, while retaining **three** for Reforge. Never apply limit breaks to Stims.
- Note that the saved wiki has no Silver-exclusive rows; the exclusive-only simulator correctly does not invent them.
- Keep simulator probability model as user-requested fiction, not game odds.

## Companion-48 — Explosive Vanguard Reforge Simulator (starter pool)
- Removes placeholder Practice Workshop links from Arcana landing pages. Other Arcana pages retain Rotation Crafter, while unique future tools can be designed separately.
- Adds Explosive Vanguard “Reforge Simulator” with the requested tagline, 9 equipment types, grouped weapon subtype dropdown, tool subtype dropdown and five Echostone colors.
- Uses supplied Reforging Tool and Echostone Stimulant artwork, rolls three distinct starter attributes with low-value-weighted RNG. Custom sandbox chance 1/1000 for a limit-break attempt, one exceeding value and full-screen fireworks; no limit breaks on Echostones.
- Important limitation: the full linked wiki reforge and exclusive Echostone tables were not retrievable (403). The embedded pools are explicitly labeled partial starter examples; full item eligibility, exact ranges and rates are not verified. More complete data import remains pending.

## Companion-47 — Skill icon resolution and animation refinement
- Remove the Bard/music overlay skill icon so buff announcements return to text-only presentation.
- Resolve the remaining ambiguous skill icons by selecting the most modern-looking Midir variants for Charge, Counterattack, Natural Shield, and Stomp.
- Remove Recovery from Harmonic Saint.
- Bring melee Arcana closer to the strawman and refine Arcana-specific training animations: forward-facing swords for Elemental Knight, close shield-bash posture for Sacred Guardian, punch/kick motion for Blazing Brawler, forward recoil for Arsenal Gunner, a thrusting spear motion for Explosive Vanguard, no string lines and cross-shaped control bars for Melodic Puppeteer, and keep Forbidden Alchemist focused on projectile output.

## Companion-46 — Complete verified skill artwork mapping
- Remove the large icon from the Harmonic Saint on-screen buff announcement; retain clean center-stage buff text.
- Expand local Midir skill icon mapping across the complete Rotation Crafter and Music simulator drawers and hotbars, including verified fighter `Combo:` name aliases.
- Leave unknown or missing skill art as a neutral icon placeholder; no arbitrary substitutions.

## Companion-45 — In-game style music skill icons
- Add the active Bard skill icon to the center-stage overlay in **Rate isn't a Lie**, matching the in-game presentation more closely.
- Continue using local Midir skill icons where available so the simulator resembles the actual buff pop-up style.

## Companion-44 — Maximum-energy Bard performances
- Keep Bard dance animations continuously intense with repeated leaps, exaggerated movement, arm strumming, kicks and instrument swings until the performance is interrupted.
- Move the music-buff announcement into the middle of the simulator field with contrast for readability, retaining all skill-specific buff lines.
- Respect reduced-motion preferences and preserve Escape, pointer-away and next-skill interruption behavior.

## Companion-43 — Harvest Song included in the buff simulator
- Refine the **Rate isn't a Lie** simulator so **Harvest Song** displays all requested support lines: Gathering Success Rate, Production Success Rate, and Gathering Speed.
- Keep the calculator expanded by default while preserving the ability to collapse it.
- Preserve Escape and pointer-interrupt behavior so users can stop one performance and immediately play another.

## Companion-42 — Rate isn't a Lie
- Add Harmonic Saint's Music Buff Effect calculator (wiki-style inputs and performance tiers) and its Bard hotbar performance simulator.
- Calculator begins expanded and can be collapsed without losing the stored settings.
- Performances are associated with individual skill effects; Escape, clicking elsewhere, or starting a new skill interrupts the current animation without stopping the session.
- Name in the performance banner comes from the Vault character field, or uses “your” when empty.


## Companion-41 — Active talent skill audit
- Add all active skills identified in the supplied Combat, Puppetry, Music, Magic, Fighter, Dual Guns, Alchemy, Lance Combat and Holy Arts category/talent lists to the corresponding Arcana crafter pools, excluding passives and crafting.
- Keep Arcana skills and existing customized cooldowns intact. New unverified cooldowns default to simulation zero (not a game mechanics claim) and can be edited in the builder.
- Use user-matched Midir KartRider Water Balloon condition 598 art for the Kart Bomb Academy card.
- Wiki is the explicit source for skill membership; skills are not assumed to be usable with every selected weapon/race/character.

## Companion-40 — All-Arcana Rotation Crafter expansion
- Fix the Rotation Crafter **Clear rotation** control so it clears the entire planned sequence reliably.
- Add **per-skill customization** inside Build a Rotation, including editable cooldown, action-delay, and charged-skill hold time values. This supports user adjustments such as an Erg-modified Urgent Shot cooldown.
- Expand **Alchemic Sharpshooter** with additional bow skills including Crash Shot, Mirage Missile, Arrow Revolver, Final Shot, and Support Shot.
- Generalize the **Rotation Crafter** so every Arcana now has a themed version using the same hotbar/rotation system with Arcana-appropriate visuals: bow archer, dual swords, staff caster, shield user, pistols, brawler, lance user, hand-cannon alchemist, puppeteer, and Harmonic Saint healer.
- Add a first-pass **Harmonic Saint** party-healing scene that spawns 1–3 random ally targets with health bars when Begin is pressed, then shows healing feedback on relevant skills.
- Preserve hidden research/source tracking for Skill Knowledge while keeping those citations out of the player-facing UI.
- Add **Kart Bomb** coverage to Debuff Academy as a provisional increased-damage-taken source in the library and missing-debuff exercise; a temporary placeholder condition icon is used until a verified Midir icon is mapped.

## Companion-39 — Verified Alchemic Sharpshooter orb gains
- Replace the provisional 25% per-skill orb increments with user-provided primary and secondary element gains: Ignis Plume Fire +36% / secondary +18%, Aqua Volley Water +52% / secondary +26%, Terra Scourge Earth +100% / secondary +62%, Ventus Howl Wind +78% / secondary +39%. Each orb is capped at 100%.
- Let players select a different secondary element for each skill; default Plume to Water, Volley to Fire, Terra to Wind, and Ventus to Earth. Selection persists locally. The grey-until-full orb display shows exact percentages, and existing Golden Time and Tri-Assault consumption rules remain.
- Values originate from prior user-supplied AS mechanics; no assumption about unverified skill activation packets is added.


## Companion-38 — Alchemy orbs and Tri-Assault sequence
- Swap the two Crafter hotbar rows: F1–F12 above 1–=.
- Add four in-session four-step Alchemy Orb meters, grey until full, then Fire red, Water blue, Wind white and Earth brown. For exploratory practice, Ignis Plume, Aqua Volley, Ventus Howl and Terra Scourge each add one to the matching element; Golden Time fills all. These increments are **illustrative trainer assumptions**, not verified exact game orb-generation values.
- Tri-Assault requires full Fire and Water orbs, spends both on activation, automatically animates three shots from one keypress, includes a 750ms pause between shots two and three, and displays brief edge fireworks on shot three. All other skill activations are suppressed until the third shot, and session termination cancels pending shots.
- Retains all Companion-37 features and assets.


## Companion-37 — Drag-and-drop hotbar Rotation Crafter
- Rebuilt AS Rotation Crafter with 1–= and F1–F12 hotbars, draggable skill drawer, drag-to-move/swap, click-to-assign fallback and right-click-to-clear.
- Collapsed rotation builder is empty by default for a new profile. A drafted rotation shows a next-skill cue; without one, free practice is available. Session duration, Begin/Finish and bow animation are consolidated below. Aqua Volley has hold/release charge indication and cooldown inputs are ignored.
- Removed the duplicate Skill Knowledge panel from the AS crafter. Skill reference pages use locally verified exact Midir icon matches when available and retain source evidence in internal reference data rather than in player-facing explanations.
- Existing Vault, collectibles and imported report/award calculations are unchanged.


## Companion-36 — Arcana skill-reference hubs and AS Positioning Lab
- Every Arcana's Rotation Lab now opens on the same **Skill Knowledge** landing structure, showing the Arcana's skills, roles, explanation and provenance. Existing AS Rotation Crafter, DD automaticity, Sacred Guardian Oath Workshop, and other Arcana practices remain accessible through **Available pages** buttons.
- Alchemic Sharpshooter and Dark Diviner skill entries use prior project/user research; February 2026 and July 2025 official Nexon update information is preferred for recently changed AS damage/cooldowns. All unverified exact effects and skills in other Arcanas are explicitly provisional; keep this reference editable in `rotation-reference.js`. Official references: https://www.nexon.com/mabinogi/news/35462/february-quality-of-life-update and https://www.nexon.com/mabinogi/news/28264/arcana-faith-and-fury-update.
- Add a separate AS **Positioning Lab** with 1–15 randomized enemies, placement/removal and drag-to-position controls, draggable character and aiming handle, adjustable firing angle/range, cone spread and line width, and an Attack action that briefly highlights and eliminates affected targets. Restore and randomize controls support repeated experiments. Geometry is intentionally illustrative and not calibrated to in-game Mabinogi hitboxes.
- Retain all current Vault imports, awards, records, Arcana practices, CSS and local storage schema. No Midir exporter changes.
- Verification: JS syntax and headless Chromium in-memory interaction tests across ten Arcana hubs, DD drill, AS crafter, and positioning interactions. Normal file-origin/IndexedDB workflow not re-verified in this release.


## Companion-35 — Compact layout refinement
- Tighten the header, navigation, Vault heading, character selector, form spacing, and report rows without reducing the prominence or changing the styling of the three achievement collectible cards.
- Keep import and milestone entry controls balanced on larger screens and stack cleanly on smaller screens. Maintain full-width saved milestones with Edit and Remove actions.
- Condense saved-report metadata and action rows into clearer responsive layouts, keeping report viewing and removal behavior unchanged.
- No changes to import formats, reward calculations, storage keys, game mechanics, or existing local artwork. Verification: source/JS syntax and package checks; test visually in normal Chrome or Edge as local browser navigation may be restricted in test environments.

## Companion-34 — Vault layout cleanup and right-side menu
- Move The Vault to the far-left position in the main navigation and preserve the requested tab order: **The Vault, Rotation Lab, Debuff Academy, Encounter Study**.
- Replace the old left-side Overview control with a compact **three-line menu icon on the right** of the navigation row. The slide-out panel now opens from the **right side** of the screen and no longer shows “Overview” on the toggle itself.
- Simplify the Vault header by removing the separate **Your Character** card. Character selection is now an inline field at the top of the Vault. A compact **Save** button appears only when the typed name differs from the currently saved tracked character.
- Condense the **Add to Your Vault** controls so report import and backup actions occupy less space, while keeping **My Milestones** beside them. Saved personal milestones now render in their own **full-width** section below, with existing edit and remove controls preserved.
- Keep existing encounter-aware records, debuff evidence, repeat-import behavior and collectible logic unchanged from Companion-33.
- Verification: JavaScript syntax validation plus package assembly checks. Full interactive browser-origin validation still recommended in normal Chrome/Edge.

## Companion-33 — Encounter records, observed debuff contributions, and runtime corrections
- Added pure offline encounter/attempt analysis (`analysis.js`) over actual Midir-41 `midir-companion` v1 payloads. Logical Vertrag 7600→7601 pairs remain one attempt; recognized Gate 2 and Gate 3 boss entities create separate attempts. Verify clears conservatively from the existing explicit evidence. Show fastest **verified boss-attempt** time per encounter rather than conflating a multi-gate recording with dungeon completion. Time-bounded player deaths and all-target hit-group damage are labeled as such, never cast counts or exact boss-only damage.
- Preserve observed **target and player condition intervals, attacker IDs, first-seen/spawn timestamps, skill IDs and grouped damage-hit timestamps** on import. In the Vault, list observed debuff categories per attempt, explain the provisional 10-group reference, and display evidence for selected character. Confirm source via the boss condition attacker entity ID, or infer a likely contributor only when a **unique** player has a recognized compatible skill hit within ±3 seconds of an ownerless condition. Do not give ownership to someone else if the packet has another attacker ID, infer unknown pet owners, or call hit events proven casts.
- Automatic encounter-specific rewards: **Debuff Contributor** for any defensible attributed application, **Quick Setup** for applications up to 10 seconds after recorded boss appearance, and **Reference Coverage Together** when all the currently listed groups were observed at least once. Last award is explicitly **provisional**, not a verified final full-game debuff set or continuous/simultaneous uptime; the complete set awaits user verification. Existing Bri survival collectibles retain their rules.
- Allow repeat-session HTML imports, each with its own Vault entry and its own collectible/reward counting; show **possible repeat** warnings for matching recording signatures. Retain JSON→HTML attachment for older data-only entries. Removal remains per import. These are not cryptographic deduplication guarantees.
- Correct initial language rerender failure caused by a hyphenated `aria-label` DOM dataset property. Restore Academy Flashcards by initializing the active deck IDs and valid icon set from the verified local condition-icon registry. Avoid stacking celebration dialogs on repeated imports. Improve confusing Gate 3 `Human` report label without altering original archived HTML.
- Preserve original graphical per-skill highest-hit fields from the HTML report while minimizing the redundant saved report summary (full original remains in IndexedDB). Restore record-high hit, skill-hit, raw damage-total and damage-taken comparisons where **both reports contain one recognized matching boss encounter and have the same export target scope**; clearly label these as recording-scoped metrics, not confirmed boss-only hits. Keep localStorage profile keys, training modules, local illustrations, user notes, and one rolling changelog unchanged.
- Verification: JS syntax, supplied sample export parsing, simulated Chromium UI navigation and repeated import/flashcard interaction. Full Windows EXE execution and live game verification not performed. Browser storage behavior needs validation in normal supported browser origin. No Midir-41 exporter changes in this release.

## Companion-32 — Overview sidebar closing
- Fix the sidebar Close button disappearing after opening: its static control now remains mounted while recent-training content rerenders in a separate child container.
- The Overview toggle opens and closes the panel. Escape and clicking outside the panel also dismiss it. Sidebar visibility and accessible expanded/hidden state remain synchronized.
- No Vault, awards, report parsing, character records, or Arcana mechanics changed.


**Source audited:** `Midir-Companion-31.zip`. This replaces the **27 historical `RELEASE-*.md` notes** (05–31) in the Companion archive with one maintained document. The application files are otherwise unchanged. Historic features are described by their **latest documented behavior**, with obsolete/failed intermediate fixes removed from the current-feature list. Earlier 01–04 history appears in `README.md`; no separate release notes for those versions were present in the audited archive.

## Current feature inventory

### Offline app, training, and Arcana modules
- Standalone offline HTML/JavaScript companion; local browser data and user-managed backups. Existing Alchemic Sharpshooter keyboard/action practice and spatial scenarios and Dark Diviner automaticity/audio routines remain. Practice supports reflection, not punitive rotation grades or fabricated measured in-game casts. [foundational README, 05–06]
- Ten selectable Arcana pages: Alchemic Sharpshooter, Dark Diviner, Elemental Knight, Harmonic Saint, Sacred Guardian, Explosive Vanguard, Arsenal Gunner, Forbidden Alchemist, Melodic Puppeteer and Blazing Brawler. Non-AS/DD pages include preliminary drills and placeholders rather than fully verified mechanical simulations. [07, 09]
- Sacred Guardian **Oath Workshop** provides guided full defensive setup, community snapshot cascade **F→O→F→O→W→F→O**, Fateweaver 3152 practice, quick/recovery routes, Wool commitment and snapshot inheritance cues. Timing approximations are practice aids; no claim of globally optimal verified in-game formula. [08–09]
- Melodic Puppeteer Cutting Chorus weaving rehearsal, Forbidden Alchemist herb-clicking minigame, and introductory drills for other Arcanas. [07, 09]
- Midir skill/condition artwork bundled locally, with verified ID associations and placeholders where missing. [06, 11–16]

### Debuff Academy
- Debuff reference/learning materials distinguish the three post-April shared status categories: Defense/Protection Decreased, Magic Defense/Magic Protection Decreased and Increased Damage Taken; Death Mark's own indicator remains distinct. Sources do **not** imply uniquely attributed casters or independent stacking. [12]
- Pet-specific condition recognition covers Bunbun/Clover Mark, Foxyquin's Mark, Bone Dragon/Devil's Dash, Purrling/Furious Charge and Ceraunus/Mir Dragon Lightning Debuff. The Lightning icon uses original Midir artwork (`gui_condition_change04_5_0.png`) rather than the earlier user-supplied screenshot. [13–16]
- Distinct Protection Max Decreased / Magic Protection Max Decreased icons for Brionac/Fragarach training; practice treats them as an **inseparable pair**. [14, 18–19]
- Icon flashcards use shuffled non-repeating rounds with optional locally persisted **set-aside / restore** choices. Cards without verified unique artwork remain explanatory entries rather than falsely exact icon cards. The Debuff Academy Flashcards Open action was revised to handle older profiles that lack `academySetAside`. [17, 21, 27]
- “Which debuff is missing?” is an unlimited randomized category/source-choice exercise: 1–3 missing groups, varied present icons, recently repeated scenarios avoided; players choose skill-source icons or labeled placeholders for pets/Brionac. Source mapping accounts for skills that cover several categories and configuration-dependent sources. [18–19]
- Guided debuff lessons and Explore Debuffs show available source skill icon images alongside condition icons. [27]

### Vault, imported Midir reports, and awards
- The **Vault is the default landing view**; Overview is a collapsible sidebar for recent training rather than a separate tab or an element inside Vault. [10, 20, 23, 28]
- Three visually illustrated Bri collectibles: **Giant Boots** (Gate 1 70%/25% Ancient Giant phases), **Bottled Horsepower** (Gate 2 Bronntanas 50% phase), **Halo Badges** (Gate 3 80%/40% halo phases). Calculations require appropriate observed clear, bounded phase/death evidence, and deduplication; confirmed survival adds one, relevant death subtracts one, unverified adds zero. The Gate 1 verifier reads **7600 70%** and **7601 25%** independently. [05, 24–26]
- Celebratory **See Awards** panels toggle open/closed; run links scroll to and highlight corresponding imports. Collectible labels show entity names, not race IDs. Final approved art replaces the *earlier* Giant Boots-with-adventurer image. [24–25]
- The Vault supports imported standalone Midir HTML (including embedded `midir-companion` data), legacy/data-only formats when recognized, archived full HTML and on-page sandboxed report viewing with minimize/switch, open-in-new-tab where permitted, and structured-data inspection. Older data-only imports can attach their original HTML on a matching fingerprint. [05, 22]
- Report removal uses confirmation, removes the archived HTML and associated imported auto-generated milestones, closes its viewer if active, and recalculates collectibles from remaining imports. User-written milestones and unrelated reports persist. [23]
- Character name setting performs case-insensitive **exact-name** matching within imported party reports, filters personal awards/stats and auto-generated milestones to that character, and reports no match instead of choosing a different player. Changing character recalculates derived milestones, not personal notes. [28]
- My Milestones can be added, edited and removed. Achievement Catalog uses earned counts, discovered/unearned states and expandable histories; upcoming unsupported party-debuff awards are marked not yet tracked. [29]
- Current Vault order: collectibles; **Add to Your Vault** (imports and My Milestones together); compact single-row Achievement Catalog above Earned Milestones; on-page report viewer **above** the imported-report list. [30]

### Language support
- English default, Korean and Spanish selectable in app header; choice stored locally. First-pass localization covers major navigation, controls, status/category labels and selected training interfaces. Existing skill names, character names, user text and imported reports are not rewritten. **Full translation of every Arcana explanation is not complete.** [31]

## Superseded / corrected history
- The flashcard shortcut briefly added to Overview in 20 was **removed in 21**; the intended entry is inside Debuff Academy. Later 27 addressed legacy-profile deck initialization. Do not count these as three separate training features.
- The Vault route initially showed Overview despite the Vault tab being selected; this was corrected in 20. Overview was subsequently converted to a sidebar in 28, and recent training is intentionally excluded from the Vault.
- The original 12 fixed missing-debuff scenarios were replaced by an indefinite procedural generator [18→19]. Early flashcard “shuffle” behavior was replaced by randomized-round deck management [17].
- Earlier screenshot-based Lightning Debuff art was superseded by an exact icon file from Midir [15→16].
- Earlier Gate 1 collectible evaluation checked both milestones on 7601; corrected to read 7600 at 70% and 7601 at 25% [26].
- Early standalone reports could only be inspected below other reports or lacked original HTML. The latest viewer appears above the list and supports attached original HTML [22→30].
- Earlier broad achievement list was replaced by owned/unearned gallery and condensed to one row [29→30].
- Final Giant Boots collectible artwork excludes the small adventurer [24→25].

## Audit limits and regression checklist
This is an audit of **27 release notes and the latest packaged application files**, not a claim of interactive browser verification. The notes document JavaScript syntax, file/icon existence and ZIP integrity checks, while multiple versions explicitly lacked full browser interaction tests; button behavior, `file://` storage, embedded HTML in iframes, multiple report switching, character matching and language rerenders should be checked in Chrome/Edge. Continue to treat condition/skill icon mappings as evidence-labeled, report HP phase windows as observational rather than explicit mechanic packets, and damage-hit groups as distinct from skill casts.

For quick local regression: open Vault on fresh/legacy profiles; test Overview sidebar; import a multi-player Midir HTML and set character name; verify three Gate 1 award checks, duplicate import and removal; open/switch/minimize the full report; edit/delete a personal milestone; navigate Debuff Academy → Flashcards → Open; set aside/restore; run several missing-debuff questions with paired protection icons; switch English/Korean/Spanish while staying on the page.

## Historical release trace
| Releases | Consolidated current result |
|---|---|
| Foundational README, 05–09 | Offline base, saved data, AS/DD and eight further Arcana pages, Sacred Guardian Oath Workshop, Arcana route corrections |
| 06, 11–16 | Icon library, post-April debuff categories, pet and protection icons; Midir Lightning image supersedes screenshot |
| 17–19, 21, 27 | Randomized flashcard deck and unlimited missing-debuff drills, inside-Academy navigation, legacy-profile handling and lesson art |
| 10, 20, 22–25 | Vault layout route, collectible pictures and panels, original HTML viewing, report removal |
| 26–28 | Gate 1 award correction, character attribution, Vault landing and Overview sidebar |
| 29–30 | Editable milestones, personalized compact achievement gallery and revised Vault order |
| 31 | English/Korean/Spanish first-pass localization |
