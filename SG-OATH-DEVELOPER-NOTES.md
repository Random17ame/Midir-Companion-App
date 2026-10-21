# Sacred Guardian Oath Workshop — development reference (Companion 128)

This is a design note, not a player-facing explanation. Keep EV notes for expert review unchanged.

## Music mapping
- Assume rank 1 BFO 20 base and rank 1 Enduring Melody 5 Protection / 11 Defense base (use existing in-app Music Lab formula).
- Target observed ally Inspiring/Haunting BFO 65% through 75%, inclusive. Do not show Music Buff Effect or Inspiring Effect as user inputs.
- Infer equivalent Music Buff Effect by solving the Music Lab's BFO formula with 16 Inspiring Effect (10 instrument + 3 per accessory). The inferred modifier is used only as an approximation for the same ally's Enduring Melody.
- Boots provide up to 3 Enduring Protection reforge ranks without replacing Inspiring accessories. The first accessory provides up to 3 more and loses 3 Inspiring Effect; second provides up to 3 more and loses another 3. Gear allocation 0–9 is boots 0–3, accessory 1 levels 4–6, accessory 2 levels 7–9. Only Inspiring/Haunting matters.
- Exact performance rounding/ally's gear unknown; calculation is illustrative. Don't count other Music Lab sources twice.

## Defense observations and assumptions
- Cloud/Nimbus static +20 DEF, +5 Protection regardless of pet visual type, lasts ~1m and must be used before Divine Link if switching pets.
- Lovable Yip requires different pet before Divine Link. Divine Link values depend on player and pet: UI asks directly for observed deltas from Character Info (sample +618 HP, +3 DEF, +17 M.DEF), accepting small inaccuracies. These are not universal constants.
- Transformation provides race/rank-dependent flat stats; source sample Fury of Connous rank 2 had +450 HP, +3 DEF, +18 Prot, +20 M.DEF. Rank 1 generally stronger; reuse ~36m.
- Catering lasts 10m; mid-fight application and pet swapping are generally unrealistic. Doll Bags typically remain active through combat; total weight <=1.
- Shield of Trust and Magic Dampening share a brief window. Orbital Pulse conjunction level bonuses additive, combined +30 DEF/M.DEF and +3 Prot/M.Prot.
- Fateweaver 3152 +12% snapshot; Magic Golden Wool +20% snapshot; Virtuous Oath recursively inherits frozen prior bonuses. Current planner only approximates first Oath bonus and cap headroom; it does not calculate true multi-generation final snapshots. Caps: Oath bonus +3,000 HP; +150 DEF/M.DEF, +15 Prot/M.Prot. The pre-Oath input thresholds that reach those caps are 20,000 HP; 1,500 DEF/M.DEF; 150 Prot/M.Prot. Do not confuse input thresholds with bonus caps.

## Scenario priorities
- Full: prepare persistent/long effects (meal/bags) before combat, summon cloud and cast Yip before Link, coordinate ally melody, time Shield and Pulse for snapshot chain F→O→F→O→W→F→O.
- Emergency: prefer existing bags and already-active bonuses, quick Shield/Pulse if available; do not delay to resummon pets, recater, seek ally melody, or set up Link. Early Oath with short F→O→W→F→O or no-wool F→O→F→O.
- Wool readiness: save rare consumable when capped, underprepared or unable to receive ally buff.
- Recommended steps are a proposed plan, not compulsory mechanics. User can edit selected preparation checkboxes.

User-edited per-scenario rotation notes are in-memory only; they do not alter the protected snapshot-chain verification and do not persist across page reloads.


## Companion 129 checklist UI
The drag-and-drop checklist (`sgChecklistView`, `sgChecklistBind`) has two independent modes, full and quick. Local state persists under `midir-sg-checklist-v1`. Users may remove/add and reorder arbitrary steps; this is a *visual preparation plan*, not a change to the snapshot rehearsal sequence (`SG_CORE`, `SG_QUICK`). Native skill icons are referenced through MIDIR_ROTATION_ICONS when bundled; generated fantasy art crops live in assets/oath-reminders for other buff reminders. Timing and pet-swap constraints are hints only, not enforced ordering. For keyboard accessibility, Alt+Up/Down moves a focused step. Checklist modes are synced with the rehearsal toggle. The legacy Wool Readiness page is not offered as a separate mode.

## Companion 130: three-page structure
Oath Max and Emergency Oath each own separate preparation sets. The Checklist is a third page with Full/Emergency toggle, reflecting the enabled preparation from the corresponding page, plus its fixed snapshot sequence. Reordering changes only the checklist presentation, never the rehearsal's snapshot logic. No named doll bag grants or fixed stat assumptions should be shown: the player enters measured totals. Skill icons originate from bundled Midir icon registry (including Shield of Trust, Divine Link, Lovable Yip, Orbital Pulse); absence of icon uses unobtrusive glyph.

## Companion 132: stat onboarding and cap-aware buff assessment
- First visit prompts a shared five-step character-sheet stat setup, with Begin and I'll do this later. Local key `midir-sg-player-stats-v1` stores the user's baseline and completion/dismissal state. Edit Player Stats reopens setup from any of the three SG pages.
- The Oath cap visualization displays calculated *Oath bonus* (15% HP, 10% other stats) against bonus caps; it is not a total stat cap. Inputs appear one-by-one with a fill animation and the threshold cue.
- Per-buff usefulness is a capped marginal comparison, one effect at a time, against the enabled buffs of the current page. If selected, compare current result against removal; if unselected, compare against adding it. A zero marginal gain says only that **this particular Oath bonus** receives no additional amount in affected capped stats. It does not advise against using the buff for defense, survivability, or other mechanics.
- Keep selected buffs usable, and keep Full and Emergency selections separate. The profile is shared. This first-Oath estimate does not numerically simulate recursive snapshots.

## Companion 133 UI
Bonus edit wizards update sgPlanner.dynamic including catering; checklist order remains authoritative for user-customized rotations. Music slider input handles keyboard arrows natively and wheel while hovered. Snapshot rehearsal remains separate.

## Companion 134 — music source
When `sgPlanner.melodyFromLab` is enabled, `sgMelodyAmount()` reads `musicCalcForKey('enduring_def').inspiring` and `musicCalcForKey('enduring_prot').inspiring` directly from the saved Rate Isn't a Lie inputs. This bypasses the ally-BFO heuristic; switch back to restore slider-derived results. `enduringProtectionReforge` in the Music Lab is its own saved parameter. The toggle is session-local.

## Companion 135 — Connected snapshot calculations
`sgSnapshotValues` uses prepared character-sheet totals at capture time, reads the currently frozen *other* types (Fateweaver, Oath, Wool), and replaces its own previous bonus. Fateweaver 3152 is modeled at 12%; Golden Magic Wool at 20%; Virtuous Oath at 15% for HP and 10% for the other stats with +3000 HP / +150 DEF and M.DEF / +15 Prot and M.Prot per Oath snapshot. The bonus cap is applied at each Oath cast; do not cap Fateweaver or Wool using Oath caps. The stat gauges show the latest frozen Oath bonus compared with Oath cap, and the prepared stat total plus currently active frozen values. Undo rebuilds history; Reset clears bonuses. These numbers are an **illustrative snapshot model**, not confirmed for in-game buff stacking, multiplicative evaluation, rounding, duration, or actual realized stats. If verified formulas become available, replace this snapshot routine before making optimization claims. For a changed base stat or preparation selection mid-sequence, already-frozen bonuses remain unchanged until recaptured.

## Companion 136 — precise buff coverage
Fateweaver 3152 captures 12% of Defense, Magic Defense, Protection and Magic Protection ONLY. Golden Magic Wool captures 20% of the same four stats ONLY. Neither grants HP. Virtuous Oath snapshots 15% Max HP (capped at +3000) and 10% each defensive stat (+150 Defense and Magic Defense, +15 Protection and Magic Protection caps). Each cast excludes the previous instance of its *own* buff while reading frozen bonuses of the other types. Snapshot values are frozen when cast, even if the reference character stats or other captured effects change later. Undo replays casts to reproduce their previous numerical effect. In-game durations, numerical rounding, timing and interactions outside the specified buff rules remain approximations.

## Companion 137
Emergency cast sequence is editable and saved separately in `midir-sg-emergency-sequence-v1`; its sequence drives both numerical snapshot captures and checklist cast entries. Separate preparation choices and drag ordering remain. Checklist is single-column, with leading high-contrast ordinal badges.
