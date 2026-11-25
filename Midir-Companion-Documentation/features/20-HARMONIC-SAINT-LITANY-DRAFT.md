# Harmonic Saint — Resonant Litany / Dissonance Lab (0.3.12d)

**Applies to:** Midir Companion 0.3.13, cumulative release. The feature is reached from Harmonic Saint beside **Rate Isn't a Lie**. The calculation is a configurable planning tool, not a certified reproduction of the game engine. User-facing mechanics commentary is limited to one footer disclaimer and optional hover tooltips. [1]

## Compact display and navigation

- The pinned result strip shows **Healing min–max** and **Party Healing min–max** as independent amounts. Two adjacent buttons swap the strip to **Dissonance Protection/M.Protection** and **Defense/M.Defense**, displaying per-stack and total values and a 1–5 stack selector. It remains on-screen when the page scrolls. Each open equipment/boost editor separately pins a small live Healing/Party Healing maximum preview. [1,2]
- The ten-slot interactive board uses the Music Buff Equipment visual pattern: Accessory 1, Hat, Accessory 2 / Healing Wand, Body, Offhand / Gloves, Boots, Robe / Echostone (fourth row, right column, beneath Robe). The wand/offhand are physically adjacent. Each slot opens a compact modal editor without scrolling the dialog to the top after any field change. Scroll/focus recovery preserves keyboard editing and restores page scroll as well. [1,2,5]
- Slot items store a name; Prefix and Suffix enchant names with **whole-number Healing + and Magic Attack** (no direct Party Healing or Potency input); **Murias Water Healing Potency 1–10% only**, whole-number on/off selection (no flat Healing or Party Healing); up to **three reforge lines** (one for Echostone) and other manual values. Echostones have **no enchants, Murias Water, or set points**. Accessories have no set points. The robe is available with custom values, but has no fabricated automatic healing bonus. [1,3]
- **Healing Enhancement Set** counts enabled points from non-accessory, non-Echostone slots. The Healing Wand cannot contribute Healing Enhancement points, even if older saved state contained them. Only a combined total of **10 or more** across eligible items activates the single **+20%** healing potency bonus; no automatic per-item 10/10 assumption is made. Points remain attached to their configured item when disabled. [1]
- **SG Oath-style boost cards** show compact checkboxes, skill icons, short active-effect summaries and an Edit action for configurable boosts. The available cards are Title, **Pulse of Purification** (fixed +20% shared potency, checkbox only), Bri Leith Coin, Totem, **Amulet** (Healing flat **integer 0–12**, no Party Healing), **Spirit Weapon**, **Relics**, Duskbound and Extra. There are no separate Spirit Cultivation, Spirit Refinement or Dark Erg cards; their relevant values now live in the Spirit editor and Healing Wand slot. [1,4,5]

## 0.3.12d equipment roll corrections and saved-state migration

- **Murias Water:** each eligible enabled item has only Healing Potency **1–10%**. The toggle reveals a single level selector with integer options; disabled water contributes zero. Previously entered `murias.heal` and `murias.party` are ignored and removed on hydration. Former percent rolls are bounded to the new legal range when active. Echostone has no water.
- **Equipment enchants:** each Prefix/Suffix has a name, **Healing + (integer)** and **Magic Attack (integer)**. The former `party` and `pct` editable enchant properties are discarded. Tracked Magic Attack is kept distinct and never interpreted as direct Healing/Party Healing or Dissonance without an independent formula; names and valid Healing rolls are preserved. Custom Murias relic enchants follow the same rule; the named **Gift +5% potency** remains a special case.
- **All editable equipment numbers are whole-number values** including grade overrides, Erg modifiers, Murias, enchants, custom reforge lines, item extras, spirit/relic custom fields, and ordinary boost Healing/Potency. Grade preset coefficients, Party Healing +2.5/level reforge math, restored duration +0.5/level and final calculated displays are **not rounded to integers**. The dedicated Dissonance calibration/breakpoint fields retain their necessary fractional precision.
- **Board layout:** 3×3 equipment: `Accessory 1 | Hat | Accessory 2` / `Wand | Body | Offhand` / `Gloves | Boots | Robe`. Echostone is shown at the far right of a fourth row, beneath Robe. Existing scroll retention, storage key and exact effect selectors are preserved.
- **Migration:** schema-v6 hydration sanitizes formerly unsupported water/enchant fields without changing unrelated profiles or data. Old string names, flat Healing values, reforges, quality and selected slots survive; unsupported old recovery contributions intentionally stop applying. [1,2,5]

## Healing Wand, grades and Erg

Wand controls are located inside the **Healing Wand equipment-slot editor**, not in a separate panel below the equipment board. Reset is in the pinned top strip. Wand selection: No Wand, Tikka Wood Healing Wand, **Nightbringer Savior**, and **Soul Liberator Healing Wand**. Selecting a wand selects its default item and resets quality override; it does not alter music or other equipment. Grade tiers and numeric override are independent of special-upgrade stage. [1,6]

| Wand quality tier | Equipment Level | Default max Healing Potency | Supported range |
|---|---:|---:|---:|
| Nightbringer Common | 170 | +12% | +12% |
| Nightbringer Sturdy | 280 | +30% | +13.8 to +30% |
| Nightbringer Fine | 385 | +48% | +31.8 to +48% |
| Nightbringer Exquisite | 495 | +66% | +49.8 to +66% |
| Nightbringer Masterwork | 600 | **+84%** | +67.8 to +84% |
| Soul Liberator Masterwork **only** | 1025 | **+112%** | +90.4 to +112% |

Typed quality override accepts the specific item's actual roll, including a lower-than-default Masterwork value. Setting a new tier resets the override to the tier's maximum. Soul Liberator is deliberately restricted to a single Masterwork quality. [1,6]

- Special Upgrade is a stage dropdown **0–8**, applying the established +0 / +2 / +3 / +5 / +7 / +10 / +13 / +16 / +20% Healing Potency sequence on Nightbringer/Soul. It is hidden for No Wand and Tikka. [1,7]
- Erg offers **B, A, S** and a **level 1–50** dropdown. B/A are modeled as **no flat Healing or Party Healing recovery increase** (their additional-recovery proc or cast-time effects are distinct). S50 uses the documented **+20% Healing Potency** endpoint. At **S41–49**, users can type their actual potency percentage; absent an input, no unknown potency is invented. Other levels do not receive the S-potency boost. B/A/S proc outcomes are not included as a flat recovery amount. [1,7]
- Nightbringer grants its existing +5% Healing and Party Healing skill recovery; Soul grants +10% both, plus **direct Dissonance +0.8 Protection and +2 Defense *per stack***. The calculator separates these from the quality bonus. [1,6,7]
- **Dark Erg** is selected **inside the Healing Wand editor** and is only exposed if the currently equipped wand has **Erg rank S, level 50**. Dark Erg can be 0 (off) or Lv1–50. The documented Lv50 endpoint is +25% Healing Potency; the default 0.5 percentage points per level at Lv1–49 is a provisional linear interpolation, not an independently sourced progression. A typed override permits other values. Switching away from S50 clears the currently selected Dark Erg level; hidden stored values never contribute. [1,7,12]


## Spirit Weapon augment tree (0.3.12a)

The **Spirit Weapon** SG-style boost card opens a three-column augment editor. Augment names and group labels were transcribed from the user-supplied Spirit Weapon hover video `2026-11-11 03-48-07.mp4` (the unrelated spirit weapon list on the left was not used). Selecting the overall Spirit Weapon checkbox is required before any of these passive upgrades contribute, and the Healing Wand must be equipped; this control is independent from the extra **Spirit Healing Wand Awakening active** checkbox for its temporary buff. [1,5,13]

| Path | Augment | Levels | Effect in this calculator |
|---|---|---:|---|
| Attack | Spirit Training | 0–5 | Flat Healing recovery +2 per level (+10 max) |
| Attack | Spirit Attunement | 0–5 | Healing/Party Healing shared potency +1 percentage point per level (+5% max) |
| Attack | Spirit Control | 0–5 | Adds 0.4% of entered base MP per level to each **maximum** recovery amount, cap +15 |
| Attack | Spirit Unleashing (ultimate) | 0–1 | Shown/configured; no additional unconditional recovery |
| Exclusive | Healing Wand: Mana Flow, Critical Care, Lucky Blessing, Focused Healing | 0–5 each | Skill/proc/condition-oriented; not included in unconditional Healing/Party Healing |
| Exclusive | Ultimate Healing Wand | 0–1 | Shown/configured; no additional unconditional recovery |
| Awakening | Awakening Recovery Enhancement, Range Enhancement, Duration Enhancement | 0–5 each | Timed Awakening-specific recovery/range/duration; not included as always-on generic recovery |
| Awakening | Awakening Buff Enhancement | 0–5 | +3 percentage points per level to the **active** Awakening bonus |
| Awakening | Awakening Acceleration (ultimate) | 0–1 | Shown/configured; no additional unconditional recovery |

**Spirit Healing Wand Awakening** contributes +10% Healing and Party Healing recovery while active, plus +3% per Awakening Buff Enhancement level, totaling **+25% at Lv5**. The separate awakening checkbox explicitly models whether the timed buff is active. A field for base MP is provided for the Spirit Control maximum-only addition. Tree selections are retained while the master checkbox is off, but contribute **zero**. [1,13]

## Murias Relics and restored skills (0.3.12a)

The **Relics** boost card opens three independent equipment editors: **Echoes of Salvation**, **Pulse of Purification**, **Pall of Ruination**. Each slot has enable/disable, restored effect Lv0–10, and named **Prefix** and **Suffix** enchant dropdowns with an optional custom name and numeric override. The named rank-6 Murias-prefix choices are Trusted, Piling, Memorial, Encroached and Chaste; suffix choices are Caretaker, Remorse, Snippet, Ego and Gift. **Gift suffix** adds +5% Healing Potency on its equipped relic. Other named prefixes/suffixes have no assumed Healing contribution; custom entries accept whole-number flat Healing and Magic Attack only. Magic Attack is tracked but does not add direct recovery or Dissonance. The named Gift +5% Healing Potency is a relic-specific documented exception, not an unrestricted custom potency roll. These are **relic** enchants, not extra generic boost categories. [1,14]

| Restored skill | Lv1 | Lv10 | Calculation behavior |
|---|---:|---:|---|
| Echoes of Salvation | +1% | +10% | Bonus equal to the corresponding percentage of calculated **maximum Party Healing**, displayed separately for Echoes; it is **not** added to ordinary Healing or Party Healing recovery |
| Pulse of Purification | +0.5 s | +5 s | Increases Pulse skill duration only; does not modify the fixed +20% Pulse recovery effect |
| Pall of Ruination | +0.5 s | +5 s | Increases Pall skill duration only; not added to generic Healing recovery |

The parent Relics checkbox gates all three slots. The scroll/focus preservation behavior applies to changes in the Spirit and Relics dialogs. Their values are stored in the existing `state.hsLitanyLab` profile object, with a version-6 schema (including v5 cleanup of unsupported water/enchant rolls) and migration of earlier stored v4 free-form Spirit/Dark Erg boosts where representable. [1,5]

## Offhand slot (Shield / Spellbook)

- A Healing Wand **can equip an offhand**: `None`, `Shield`, or `Spellbook`. The slot is disabled by default; changing from None to either item type enables it. Item name and enabled state are independently editable. The slot appears next to the wand and is fully preserved through ordinary Litany state hydration. [1,2]
- The editor provides **quality tiers** (Common, Sturdy, Fine, Exquisite, Masterwork), editable grade-related Healing Potency percentage (default 0; no unsupported automatic coefficient), named Prefix/Suffix enchant lines, editable Murias Water Healing Potency (whole-number 1–10% only), and future-safe extra flat/potency inputs. No offhand Healing/Party Healing reforge is counted or displayed because the documented reforge list has no relevant offhand entry. [1,3]
- Healing-set points can be entered for the offhand if the specific item carries Healing Enhancement. Its points contribute only while the offhand is enabled. **Healing Wand set points are always excluded**; stale wand values from v3 saved state are cleared on hydration. [1]
- Changing wand grade/Erg within its own editor or offhand type within its editor preserves the modal scroll offset and active field focus. The main page stays at the user’s current scroll position; a sticky Healing/Dissonance result strip remains visible. [1,2,5]

## Reforges and Echostone precedence

Uses `MIDIR_REFORGE_TABLE` from the EV Reforge Simulator. Only established Healing HP Recovery or Party Healing HP Recovery options are offered automatically in their eligible slots; each slot has room for three lines including manual future-safe Healing / Party Healing options. Exact physical-slot limits: accessories Healing/Party Lv1–3 (Limit Break 4); Body Healing Lv1–20 (Limit Break 25); Healing Wand Party Lv1–20 (Limit Break 25). Healing is +25 at Lv1 and +1 per level thereafter; Party Healing is +2.5 per level. The **Echostone supports exactly one Party Healing reforge, levels 1–20 only**, no enchant/water/set/LB. [1,3,8]

**Echostone rule:** `max(Party Healing accessory1 + accessory2, Party Healing Echostone)` + independently rolled Wand Party Healing. This differs from the existing music calculator's per-line replacement behavior, which remains unchanged; the user-provided requirement is to prevent the Echostone stacking with accessory Party Healing reforges. [1,3,8]

## Dissonance, breakpoint options and uncertainty

- **Manual:** user-entered one-stack Protection/M.Protection and Defense/M.Defense; direct wand/special boost values are added separately. Updating recovery does not silently change the manual Dissonance anchor.
- **Proportional:** the explicitly optional comparison `(Healing_max + Party_Healing_max)/(anchor_Healing_max + anchor_Party_Healing_max)` scales entered reductions; it is an exploratory comparison, **not an established Dissonance coefficient**. Recovery maxima are separate from critical healing, Magic Attack or actual player HP received. [1,9]
- The optional Midir physical/magical breakpoint panel uses the supplied Baptism workbook and guide with configurable debuffs and DPS change `(100 - reduction_after)/(100 - reduction_before) - 1`; no out-of-range lookup extrapolation. The worksheet's x.00 protection rounding caveat remains unresolved. [1,10]
- One concise **Disclaimer** appears at the bottom, followed immediately by attribution and link to **It's Mabinogi Healing Calculator**. Detailed mechanics are in tooltips and this source guide, not spread across the working interface. English, Korean and Spanish copy follows the app language selector, including field labels, tooltip explanations and disclaimer; the base language selector is localized. [1,2,11]

**Evidence required to turn what-if into an accurate Dissonance formula:** isolated tests separating Healing and Party Healing recovery changes, item grade/potency stacking order, S41–49 potency table, 1-stack vs 5-stack Dissonance rounding, remaining Murias Water stacking behavior, Magic Attack-to-recovery conversion, full Healing enchant catalog, and confirmation that the Healing Enhancement set effect contributes to the recovery stat used by Litany. Until then, the tool does not claim the estimates are exact. [9,10]

## Preservation and tests

No combat reports, per-encounter Arcana, boss-only priority / Gate 2 fallback, critical-neutral damage, Rotation Highlights, music simulator math, profiles, storage keys or unrelated features were intentionally altered. `state.hsLitanyLab` is the only persistent calculator object; `hydrate()` upgrades older states into schema v6, preserving valid names/Healing/reforges/grade settings while discarding formerly unsupported enchant Party Healing/potency and Murias flat rolls. Tests cover the compact four-column desktop / responsive mobile boost cards, visible configured boost summary, locale switching and prior grade caps, Soul-only Masterwork, Echostone replacement, set activation at 10 points, wand exclusion, offhand Shield/Spellbook state, editable offhand grade, Erg distinctions, locale-only display, per-slot wand controls, top Reset, 320/390/1200px viewports, modal and page scroll preservation. [1,5]

## Numbered sources

1. `Companion Files/hs-litany-lab.js` — current calculator inputs, equipment, boost state, math and UI.
2. `Companion Files/styles.css` — scoped pinned dashboard, equipment board and modal layout.
3. `Companion Files/reforge-data.js` — EV Reforge Simulator constraints.
4. `Companion Files/rotation-skill-icons.js` — existing bundled icons, including Pulse of Purification, Healing and Resonant Litany.
5. `tests/hs_litany_0312d_gear_rules_test.js`, `tests/hs_litany_0312d_gear_browser_test.py`, `tests/hs_litany_0312a_test.js`, `tests/hs_litany_0312a_browser_test.py`, `tests/hs_litany_v4_browser_test.py`, `tests/hs_litany_v3_browser_test.py` and `tests/hs_litany_draft_test.js` — current math, browser interaction and earlier controls regression.
6. User-provided Nightbringer Savior quality tiers and Soul Liberator Masterwork-only +112% correction; `https://mabi.labanyu.com/item/NDM3ODk5/` and `https://mabi.labanyu.com/item/NDM2NTc0/`.
7. `https://test.labanyu.com/global-official/notice/14279` (Renovation Season 8 healing-wand Erg and special upgrades); `https://mabi.gg/erg/healingwand` (Erg B/A/S outcomes).
8. User-provided Echostone Lv20 nonstacking rule and prior Litany draft specification.
9. `https://itsmabi.com/heal-calculator` — original calculator/source credit, separate Healing/Party Healing scenario and Dissonance estimates.
10. User-provided `Baptism Calculator.xlsx` and `Mabinogi Baptism Calculator Guide.docx`.
11. `Companion Files/i18n.js`, `Midir Companion.html` — language selector and app locale.
12. `tests/companion0312_boost_cards_test.py` — screenshot-style card controls, three-language labels, SG equipment and Litany interactions.

13. User-uploaded `2026-11-11 03-48-07.mp4` — Spirit Healing Wand video with on-screen English skill names and augment tree, level counts, and Awakening buff tooltip.
14. official Mabinogi Murias Relic release/patch information (rank-6 enchant choices and Gift healing effect), user-provided relic restored-effect design (Echoes 1–10%; Pulse/Pall +0.5–5 seconds) and Steam Murias notes.
