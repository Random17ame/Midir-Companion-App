# Companion 274 — Vertrag giant stomp rules

- Giant locations: 1, 5, 7, and 11 o'clock on the outer edge, aligned with the inner-ring landmark dots.
- Each living giant stops contributing newly spawned stomp hazards when the player is within **2 × configured stomp radius** from that giant's center.
- A suppressed giant resumes its stomps when the player leaves the radius. Existing visible telegraphs still impact normally.
- Time Trial giants stop stomping permanently once defeated by the existing Vertrag aura coverage mechanic. Proximity itself does not damage/defeat giants.
- Endless giants never die, and a giant remains a stomp source whenever the player is away from it.
- Stomping giant count is displayed in the HUD; a nearby giant receives a `Quiet` label and a teal ring.
- No change to persistent profile data identifiers, non-Vertrag modules, or training records.

Verified: focused Node assertions for activation radius and edge, suppression and resumption, wave count, death, Endless persistence and Time Trial defeat; Vertrag Playwright interaction regression; 17 Companion navigation tests; JavaScript syntax; release ZIP integrity.
