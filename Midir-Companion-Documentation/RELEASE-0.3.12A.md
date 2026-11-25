# Midir Companion 0.3.12a — release notes

## Harmonic Saint / Resonant Litany

- **Pulse of Purification:** fixed +20% potency, checkbox only; Edit removed.
- **Amulet:** whole-number 0–12 bonus for **Healing only**.
- **Dark Erg:** moved under the Healing Wand editor; visible only on equipped Erg **S50** wands. Select 0 (off) or levels 1–50 and optionally enter potency. The published level-50 value is +25%; lower levels use a documented, editable default interpolation pending an exact tier table.
- **Murias Relics:** three independently enabled slots for Echoes of Salvation, Pulse of Purification and Pall of Ruination, with restored effect levels 0–10, Prefix/Suffix enchant selectors and custom name/roll inputs. Echoes grants a skill-specific +1–10% of Party Healing; Pulse/Pall grant +0.5–5 seconds to their own durations. The **Gift** suffix adds +5% Healing Potency.
- **Spirit Weapon:** Attack/Exclusive/Awakening trees, names derived from the submitted English hover video, five levels for normal augments and one level for their three ultimates. Spirit Training increases Healing flat, Attunement increases Healing and Party Healing potency, Control affects maximum recovery, and timed **Spirit Healing Wand Awakening** provides +10% plus up to +15% from Awakening Buff Enhancement (**+25% total**). Conditional, cooldown, proc, and duration effects are not incorrectly counted as always-on recovery.
- **Storage and presentation:** maintains the music-style gear editor, compact SG-style boost cards, sticky results, item-by-item modal scrolling, English/Korean/Spanish language switching, and older saved Litany state migration. The user-facing footer disclaimer and attribution remain.

## Testing

- Focused Node formula/migration test and prior Litany baseline test: pass.
- Desktop 1200×800, mobile 390×844 and narrow mobile 320×568 browser tests: pass for new mechanics, saved editor scroll and three locales.
- Existing SG boost cards, Litany v3/v4, accessory/Echostone reforge, Music editor, localization, archive UI and module-binding tests: pass.
- Core regression: **17/17 pass**. Interaction regression: **9/9 pass**. Rotation boss-only, Arcana and critical-neutral tests: pass.
- No physical-phone or deployed PWA upgrade test was performed in the container. Recovery-to-Dissonance scaling beyond the manual anchor remains an optional comparison, not a confirmed game coefficient.

## Current-state reference

- `Midir-Companion-Documentation/features/20-HARMONIC-SAINT-LITANY-DRAFT.md` explains all current input fields, grouped mechanics, temporary effects, relevant sources and open research questions.
- `Midir-Companion-Documentation/CHANGELOG.md` has numbered 0.3.12a source references.
- The 0.3.12a service-worker cache names differ from 0.3.12 so the GitHub-hosted application can refresh its shell.

The package contains the cumulative source, assets, translations, offline app shell, current documentation and test suite, not merely changed files. Preserve local profile backups and original reports separately from GitHub source deployment.
