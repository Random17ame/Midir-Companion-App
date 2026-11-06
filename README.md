# Midir Companion 0.3.11d

An offline-capable Mabinogi companion for analyzing compatible combat reports, tracking achievements, preparing characters, and practicing Arcana encounters and minigames. Version 0.3.11d adds on-track geometric Theta judgments, late-overlap scoring, miss-only failure and a visible on-deck note to the cumulative 0.3.11c release. English, Korean, and Spanish interface support is retained. AI was used in developing this application.

## Launch

- **Desktop (offline):** Extract the entire package and open `Midir Companion.html` in Chrome or Edge. Keep the assets in `Companion Files/` beside the launcher.
- **Mobile and web:** Publish the **contents of this application directory** to a static HTTPS host such as GitHub Pages. Open `index.html` (the site root), then use the browser's **Add to Home Screen / Install App** option. The app shell can work offline after its assets have been cached; first-time visits to uncached assets still require connectivity.
- **Settings and imports:** The Vault is available by default. Enable **See Secret Sauce** in Settings to reveal report import and advanced analysis controls.

## Data and privacy

Imports, achievements, and profiles are saved locally in your browser. GitHub Pages does **not** store or synchronize user profiles or combat reports. Back up your full profile periodically and retain original combat exports; clearing site/browser storage can erase local data. A different browser, device, domain, or file origin has separate storage. Never commit personal reports or backups to your public repository.

## Documentation

The current feature guides, source references, verification limits, and historical release log are maintained in one place:

- **[Documentation home](Midir-Companion-Doccumentation/README.md)**
- [Feature map and 19 feature guides](Midir-Companion-Doccumentation/CURRENT-FEATURES.md)
- [Architecture, imports, backup, and storage](Midir-Companion-Doccumentation/COMPANION-REFERENCE.md)
- [Current verification limits](Midir-Companion-Doccumentation/VERIFICATION.md)
- [Rotation skill cooldown and shape inventory](Midir-Companion-Doccumentation/ROTATION-SKILL-RULES-INVENTORY.md)
- [Historical changelog](Midir-Companion-Doccumentation/CHANGELOG.md)

Source code and art live under `Companion Files/`. The accompanying `tests/` directory contains development regression tests and fixtures rather than required website resources.

## Notes

Midir Companion is independent of the Midir combat logger and does not capture live game traffic. Minigame resource costs, simulated damage and economy models are practice tools, not verified Mabinogi combat calculations. Browser storage capacity and large-report import memory use depend on the device and browser.


### 0.3.11d current release

Theta's flat target rings now sit on the playable highway. Perfect requires the entire elliptical note inside the target, with Great / Good / OK for partial overlaps. Late partial overlaps outrank comparable early overlaps; late non-Perfect notes also receive a small score preference. Empty presses do not count as misses. A note becomes a miss only after falling past the bottom edge; five accumulated misses end a run, while three consecutive successful judgments clear the active miss stack. The next real scheduled note remains on deck at the far end until it enters its approach, with no fabricated activations. Rhythm cooldowns, skills, saved-state keys, low-cost mobile rendering and Rotation Highlights rules remain unchanged.

### 0.3.11c prior release

The Music Calculator has an optional **manual enchant subtotal override on each physical equipment item**. Leave the item value blank for its automatic Prefix/Suffix total, or reset with **Use this item’s enchants**. The existing **overall Enchant Effects override for the active set** retains final precedence. Slot-specific reforges, grade and upgrades, and named equipment combination effects remain separate and are never overridden by an enchant entry.

The calculator puts the live Normal / Excellent / Inspiring buff output first and keeps it visible during scrolling. The slot editor has a pinned live preview; compact 3×3 equipment tiles remove redundant Copy/New shortcuts (still accessible inside an item editor). Extra source fields and set management/comparison are available in collapsible sections. No changes were made to Theta gameplay or Rotation Highlights mechanics in 0.3.11c.

### 0.3.11b prior release

This historical 0.3.11b release retained 0.3.11a EV onboarding, equipment sets and Theta performance updates, and added:
- Music buff equipment board: tap any of eight slots to configure physical items, including their enchantments, three reforge lines with simulator slot eligibility and limit-break caps, and slot-specific set effects.
- Same-name combination bonuses use the highest active value; Battlefield Overture Seraphic +5% overrides Troubadour +3% without canceling Troubadour Enduring Melody +3%.
- Seraphic gloves, Troubadour pieces, and Special Ethereal Chiffon Wings effects; instrument-only grade/upgrade settings. Duration and Fantastic Chorus effects intentionally omitted.

The previous 0.3.11a changes also include:
- EV Tower Defense final tutorial confirmation inside the Base Manager so Wave 1 is reachable without dismissing an obstructing drawer.
- Music buff sets: eight equipment slots with individual Prefix/Suffix enchants and up to three reforge lines each; reusable physical equipment can be shared between sets or independently copied for alternate accessories, boots, gloves and instruments. Live set comparison, per-set enchant override, and controlled migration of old flat reforges are included. March Song mount speed is removed from the calculator; Enduring Melody Defense reforge is added.
- Subject Theta: Containment mobile rendering performance mode (automatic on touch/small screens), optional full quality, and preserved input/timing logic. Physical-phone performance still needs confirmation.

Follow [current verification notes](Midir-Companion-Doccumentation/VERIFICATION.md) before deployment. The planned Rotation Highlights research remains separate and unchanged.
