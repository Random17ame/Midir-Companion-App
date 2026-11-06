# Midir Companion 0.3.11c — Documentation

This is the **current-state** documentation for the Midir Companion 0.3.11d application, maintained as a description of the current application behavior.

This pack is intended for the GitHub repository root alongside `index.html` and `Companion Files/`. It contains no obsolete build-specific feature descriptions. Prior release changes belong in the **[historical changelog](CHANGELOG.md)**.

## Start here

- [Current feature map — all 19 feature guides](CURRENT-FEATURES.md)
- [Architecture, import and save reference](COMPANION-REFERENCE.md)
- [Design and verification principles](DESIGN-AND-TESTING-PRINCIPLES.md)
- [Current verification limits](VERIFICATION.md)
- [Rotation Highlights cooldown and skill-shape inventory](ROTATION-SKILL-RULES-INVENTORY.md)
- [Historical changelog](CHANGELOG.md)

## Run and publish

For local desktop use, extract the full application together and open `Midir Companion.html` in Chrome/Edge. For mobile/home-screen installation, host the contents of the application folder at the root of an HTTPS GitHub Pages site; GitHub Pages serves `index.html`. The manifest and service worker provide an offline-capable app shell after resources are cached. Imported reports and player profiles live in **local browser storage**, not on GitHub or a shared server.

The Companion is an independent training and analysis application. It does not capture live gameplay or authenticate Mabinogi accounts. Simulated economy rates and training damage models are not official game data.

**Data safety:** Export full-profile backups regularly, retain original combat-report exports, and do not assume mobile and desktop saves synchronize. Different browser origins store separate profiles. AI was used in developing the application.

## Next development phase

The [Rotation Highlights next-chat handoff](ROTATION-HIGHLIGHTS-NEXT-CHAT-HANDOFF.md) describes the skill-cooldown, shape and activation-detection research plan. This is forward planning, separate from verified 0.3.11d behavior.

**0.3.11a historical release:** [Hotfix release and tests](HOTFIX-0311A-RELEASE-AND-TESTS.md).  **0.3.11b release:** [Equipment editor and set-bonus changes](HOTFIX-0311B-EQUIPMENT-EDITOR-AND-TESTS.md). **0.3.11c release:** [Compact calculator and manual slot overrides](HOTFIX-0311C-COMPACT-MUSIC-CALCULATOR.md). **0.3.11d release:** [Theta judgment and on-deck notes](HOTFIX-0311D-THETA-TIMING.md).
