# Vertrag — Giant Phase Survival Grounds — Feature Log

**Purpose:** An Arcana-neutral dodge and endurance trainer, taught thematically by Sacred Guardian.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Arena, movement and modes

- **Approved arena:** Build 275 embeds the pale stone eight-dot landmark map as `assets/vertrag/giant-phase-arena.png`; dots align to 12, 1, 3, 5, 6, 7, 9 and 11 o’clock. Four giant stand-ins sit at 1, 5, 7 and 11. [^1] [^2]
- **Player camera:** Hard-centers on the player with mouse-wheel zoom, full-map minimum zoom, 265% maximum, and camera-corrected click-to-move; WASD remains available. [^1] [^3]
- **Endless/Time Trial:** Endless keeps giants alive; Time Trial advances giant defeat only during Vertrag-aura overlap and never revives a defeated giant. Eight focused drills also remain available. [^1]
- **Giant suppression:** A living giant contributes no new stomps while the player is within twice the stomp radius; leaving restores activity. Pending telegraphs still resolve. [^1] [^4]

## Combat and progression

- **Stomps and attacks:** Fixed-position warning circles, overlapping sequential hits and vulnerability changes, directed charge/uppercut tell, teleport opening strike, and delayed circular follow-up. [^1]
- **Blue Hemorrhage:** Maximum ten stacks; new damage-bearing stacks refresh a shared 30-second timer, and all stacks clear together when it expires. [^1]
- **Recovery:** Selectable durability, deadly negative-HP logic, hitstun/knockdown, full recovery potions with 30-second cooldown, and fixed 500-damage aura ticks. [^1]
- **Visuals:** Masked knuckle-form Vertrag, ten Arcana player archetypes with walking/hit frames, and temporary mage Disciple giants. [^1] [^5]
- **Persistence:** LocalStorage `midir-vertrag-survival-v1` holds controls, settings, results, achievements and progression; profile backup includes `trainingExtras.vertrag`. [^1] [^6]

## Verification and outstanding limits

- Damage curve and aura tick interval are selectable/estimated values, not verified exact game formulas.
- Camera, giant suppression/defeat, visual map and navigation have regression scripts; a real full-length gameplay/animation/achievement validation remains useful.
- The approved floor is already implemented in build 275. Earlier map images and notes may show superseded floor markers or cardinal giant positions.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Vertrag gameplay, camera and assets: [`vertrag-survival.js`](../../Companion%20Files/vertrag-survival.js), [`vertrag-survival.css`](../../Companion%20Files/vertrag-survival.css), [`assets/vertrag/giant-phase-arena.png`](../../Companion%20Files/assets/vertrag/giant-phase-arena.png).
[^2]: Current approved floor evidence: [`tests/COMPANION-275-VERTRAG-ARENA.md`](../../tests/COMPANION-275-VERTRAG-ARENA.md).
[^3]: Camera tests: [`tests/COMPANION-272-CAMERA.md`](../../tests/COMPANION-272-CAMERA.md).
[^4]: Giant behavior and tests: [`tests/COMPANION-274-VERTRAG-GIANT-RULES.md`](../../tests/COMPANION-274-VERTRAG-GIANT-RULES.md), [`tests/vertrag_giant_rules_test.js`](../../tests/vertrag_giant_rules_test.js).
[^5]: Sprite assets: [`assets/vertrag/idle0.png`](../../Companion%20Files/assets/vertrag/idle0.png), [`assets/crom/sprites/disciple-staff-atlas.png`](../../Companion%20Files/assets/crom/sprites/disciple-staff-atlas.png).
[^6]: Shared backup: [`app.js`](../../Companion%20Files/app.js).
