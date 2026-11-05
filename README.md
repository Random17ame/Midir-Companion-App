# Midir Companion 0.3.10

An offline-capable Mabinogi companion for analyzing compatible combat reports, tracking achievements, preparing characters, and practicing Arcana encounters and minigames. Version 0.3.10 expands Korean and Spanish localization of current pages and minigame interface text. AI was used in developing this application.

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
