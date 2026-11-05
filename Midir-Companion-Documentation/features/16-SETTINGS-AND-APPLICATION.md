# Companion Shell, Settings, Languages and UI — Feature Log

**Purpose:** Maintain a stable offline entry point while separating optional importer analysis from general gameplay.

**Baseline:** Midir Companion 275. This is a grouped record of implemented behavior, not an inferred commit history. Source references identify files rather than specific revisions.

## Application shell

- **Offline launch:** ZIP contains entry-point HTML and relative `Companion Files/` scripts/assets for local browser use; no running Midir process is required. [^1]
- **Arcana navigation:** One shared hub routes to Arcana Simulators, universal training, Debuff Academy and other local practice features. [^2]
- **Arcana selection:** The active Arcana is chosen from the **Arcana Simulators** landing page, not a redundant header dropdown; switching updates skill references and available activities and stops an active practice timer. Subpages return using **Return to the Arcana Simulators**. [^2]
- **Secret Sauce:** Optional setting hides the **importer, report analysis, collectibles and importer-specific awards**, not the entire Vault. The Vault still offers a compact Achievement Book and read-only personal milestones when the setting is off. Hidden data is not erased. [^2]
- **Header and tone:** The title is **Mabinogi Companion** when Secret Sauce is off and **Midir Companion** when it is enabled. The shared tagline is **“Make every encounter count.”** Descriptions favor gameplay advice over raw packet IDs or tooltip-stat repetition. [^2]

## Default navigation and Overview drawer

- **Vault first:** The application initializes its route to The Vault. If Secret Sauce is off, its visible Vault contents are reduced to non-importer achievements and personal milestones; this does not change or erase underlying saves. [^2]
- **Overview as a sidebar:** The ☰ control opens a collapsible drawer of games/simulators and recent training; it is not a separate dedicated page. It closes through the dedicated × button, the ☰ toggle, **Escape**, or clicking outside the drawer. Route choices inside also close the drawer. [^2]
- **One primary navigation:** The main nav exposes The Vault, Arcana Simulators and Debuff Academy. The Games & Simulators links reside in the Overview drawer; legacy home/records/imports routes are redirected into The Vault. [^2]


## Presentation and safeguards

- **Preferences:** Accent palette, text sizing, reduced motion and configurable tooltip delay are persisted. [^2]
- **Languages:** English, Korean and Spanish text support with acknowledged incomplete translation coverage. [^3]
- **Action dispatch:** Delegated `data-act` controls and consolidated render handlers reduce duplicate event binding. [^2] [^4]

## UI and navigation decisions preserved from development

- **Game-first composition:** The primary view is the playfield or immediately useful action; navigation and buttons should be short, readable and spatially consistent. Avoid crowding the screen with developer commentary, implementation caveats or repeated instructions. Important lock/destructive warnings remain visible at the exact decision point.
- **Progressive disclosure:** Simple hover hints precede advanced mechanics; extended hover (the EV game uses about eight seconds for numbers), compact `?` details or a Help panel are preferred over dense page copy. Do so sparingly. Do not expose artificial drop odds or internal probability models in a normal gameplay surface unless they are essential to informed choices.
- **Mabinogi-inspired art:** Use coherent fantasy pixel-art/item icons, readable silhouettes and distinctive spell tells across Crom, EV, Oath, Herb/Pig/Bandit, and the Achievement Book. Preserve the supplied item icon identities and transparent pixel art. Custom graphics should add tactile feedback rather than override mechanics or obstruct telegraphs.
- **Crom navigation regression:** Test **both** the Alchemic Sharpshooter shortcut and the global Games & Simulators menu. Both must open the actual `MIDIR_AS_INVADERS` game canvas/camp, not the shared Rotation Crafter. A visually present shortcut is insufficient proof that the target route works. [^2] [^4]
- **Language integrity:** Translations should carry the same compact voice in Korean and Spanish; dynamic text from standalone games may bypass the shared exact-phrase dictionary. Treat English fallbacks as a localization gap rather than silently describing the whole app as fully translated. [^3]

## Verification and outstanding limits

- Offline file origins can differ by browser and extraction path, affecting access to saved local browser data.
- UI refactors should verify Secret Sauce, keyboard focus, all major Arcana links, and profile backup even when imports are hidden.
- Avoid inserting a new navigation category for a single universal trainer without explicit product approval.

## Source references

References identify the current Companion 275 files or included release notes; they are not commit citations.

[^1]: Entry and styling: [`README.md`](../../Companion%20Files/README.md), [`styles.css`](../../Companion%20Files/styles.css).
[^2]: Routing and preferences: [`app.js`](../../Companion%20Files/app.js).
[^3]: Localization: [`i18n.js`](../../Companion%20Files/i18n.js).
[^4]: Structural regression notes: [`tests/COMPANION-263-STRUCTURE-REPORT.md`](../../tests/COMPANION-263-STRUCTURE-REPORT.md).
