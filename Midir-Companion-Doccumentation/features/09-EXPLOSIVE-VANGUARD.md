# Explosive Vanguard — Tower Range Lab

**Applies to:** Midir Companion 0.3.4.

**Scope:** Current implemented behavior only. Historical changes are recorded in [`CHANGELOG.md`](../CHANGELOG.md).

## Current activity

- Experimental Explosive Vanguard training game featuring route/pressure management, towers, patrols, upgrades and Mana Shell resources.
- Its gameplay is a self-contained simulation with local saved progress and shared reward hooks where available.

## Current mobile inputs

- The patrol pad uses backward/forward buttons and is separate from map navigation.
- Every tower skill has a mobile activation button with a live cooldown readout. Skills remain dependent on owning a placed tower, a valid target, shells and cooldown.
- Tap to select towers; hold-drag or double-tap and choose an open location to relocate. Bought inventory towers can be placed by tapping **Place on map** and then a valid map location. Base, shop and inventory drawers support touch.
- Use two fingers to pinch zoom around their midpoint; on desktop the mouse wheel zooms around the pointer. Existing zoom and Fit controls remain.

## Limits

- Rates, damage and enemy rules are game-specific training mechanics. The Tower Range Lab is explicitly experimental and does not establish official Mabinogi skill performance.

## Source references

1. Gameplay: [`ev-defense.js`](../../Companion%20Files/ev-defense.js).
2. Shell routing and achievements: [`app.js`](../../Companion%20Files/app.js).

## Beginner wave vitality (0.3.9 current)

With the starter weapon, wave 1 enemies have 12 HP and wave 2 enemies have 17 HP to support learning tower placement. Subsequent waves continue using the weapon-relative scaling model, and advanced weapon tiers are not affected by this beginner-specific override. [1] `Companion Files/ev-defense.js`.
