# Midir Companion 0.3.9 — Documentation

This is the **current-state** documentation for the Midir Companion 0.3.9 application, maintained as a description of the current application behavior.

This pack is intended for the GitHub repository root alongside `index.html` and `Companion Files/`. It contains no obsolete build-specific feature descriptions. Prior release changes belong in the **[historical changelog](CHANGELOG.md)**.

## Start here

- [Current feature map — all 18 feature guides](CURRENT-FEATURES.md)
- [Architecture, import and save reference](COMPANION-REFERENCE.md)
- [Design and verification principles](DESIGN-AND-TESTING-PRINCIPLES.md)
- [Current verification limits](VERIFICATION.md)
- [Historical changelog](CHANGELOG.md)

## Run and publish

For local desktop use, extract the full application together and open `Midir Companion.html` in Chrome/Edge. For mobile/home-screen installation, host the contents of the application folder at the root of an HTTPS GitHub Pages site; GitHub Pages serves `index.html`. The manifest and service worker provide an offline-capable app shell after resources are cached. Imported reports and player profiles live in **local browser storage**, not on GitHub or a shared server.

The Companion is an independent training and analysis application. It does not capture live gameplay or authenticate Mabinogi accounts. Simulated economy rates and training damage models are not official game data.

**Data safety:** Export full-profile backups regularly, retain original combat-report exports, and do not assume mobile and desktop saves synchronize. Different browser origins store separate profiles. AI was used in developing the application.
