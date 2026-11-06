# Explosive Vanguard — Tower Range Lab

**Applies to:** Midir Companion 0.3.11i.

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

## Beginner wave vitality

With the starter weapon, wave 1 enemies have 12 HP and wave 2 enemies have 17 HP to support learning tower placement. Subsequent waves continue using the weapon-relative scaling model, and advanced weapon tiers are not affected by this beginner-specific override. [1] `Companion Files/ev-defense.js`.

## Mobile first-wave onboarding and shop (current)

The four onboarding stages retain their required actions, but present concise touch-specific instructions. The tutorial docks to the lower battlefield edge on mobile, scrolls within a limited height when needed, and keeps its confirmation control visible. The mobile shop uses compact two-column tower choices inside an independently scrollable drawer. Tower prices, damage, saved campaign data and later-wave scaling are unchanged. [1] `Companion Files/ev-defense.js`; [2] `Companion Files/styles.css`.

## Mobile tutorial completion (0.3.11a)

When tutorial step 3 opens the Base Manager, step 4 now provides its own prominent **I understand — start playing** control inside that drawer, avoiding the previous overlap with the underlying fixed tutorial panel. Confirming finishes onboarding and closes the drawer automatically, making the Start Wave control available. Chromium mobile automation has completed all four steps and begun Wave 1 with normal clicks. Physical-phone pinch/tower-placement ergonomics remain unverified. [1] `Companion Files/ev-defense.js`, [2] `Companion Files/styles.css`.
