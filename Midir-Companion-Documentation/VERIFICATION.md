## 0.3.12r — Grade-colored Rune inventory borders (2026-11-25)

- **PASS:** `tests/ogham0312q_compact_inventory_browser_test.py` at 1200/390/320px: compact tracked/simulated inventory panes remain bounded and scrollable, drag/group behavior remains intact, and Fine/Exquisite/Masterwork/ungraded sample tiles render blue/purple/gold/gray borders respectively.

## 0.3.12q — Compact Rune inventory (2026-11-25)

- **PASS:** `tests/ogham0312q_compact_inventory_browser_test.py` at 1200/390/320px: seeded 32 tracked and 24 simulated instances; bounded panes, no horizontal overflow, compact multiple columns, desktop edge reorder and center grouping/dissolution, mobile tap-to-equip, scroll retention after favorite/edit, search reset and matching, and inline Set B selection from 56 instances. Desktop combined inventory column remains at or below 590px. Tests use an injected fixture state mounted in the actual Ogham page, not a real migrated profile.
- **PASS:** `tests/ogham0312l_layout_browser_test.py` and `tests/ogham0312l_inventory_ev_browser_test.py` at 1200/390/320px; nine Ogham Node rule suites; core 17/17 and general interaction 9/9; JavaScript syntax.
- **Remaining checks:** physical touch drag/scroll ergonomics, keyboard reorder and sustained edge autoscroll on real devices, large real-profile migration and hosted PWA refresh are not certified. The previously documented ordinary Reforge Item Type navigation edge case remains outside this visual adjustment.

## 0.3.12p — Release-version reconciliation (2026-11-25)

- **PASS (fresh rerun):** `python tests/regression_companion.py .` (17/17) and `python tests/interaction_test.py .` (9/9).
- **PASS (fresh rerun):** `python tests/0312l_shared_herb_sprites_browser_test.py`, `python tests/ogham0312l_layout_browser_test.py` and `python tests/ogham0312l_inventory_ev_browser_test.py` at 1200/390/320px.
- **PASS:** syntax checks for the three modified JavaScript files; all 75 service-worker CORE paths resolve. The 1,642 original files are retained and four release records are added. Only release metadata, version-label localization and documentation changed from the prior herb-correction archive; no save-schema changes.
- Historical verification entries below retain their original test filenames. Physical devices, hosted PWA refresh and independent official art confirmation remain unverified; the documented direct Item Type navigation edge case remains outside this metadata-only pass.

## 0.3.12p — White/Golden Herb artwork correction (2026-11-25)

- Inspected the original files: former `golden.png` is static; former `white.gif` has six frames alternating pale and gold imagery. Renamed the files without altering their contents, corrected the existing ID-to-asset mapping and updated both service-worker cache namespaces and precache entries. No new official game-art verification is claimed.
- Extended `tests/0312l_shared_herb_sprites_browser_test.py`: PASS at 1200/390/320px using the real Herb Collection and EV modules. Checks exact corrected file paths and formats, successful image loading across views, distinct White/Golden counts, Golden-only locked-reroll spending and Disassemble credit, no White deduction/refund, and no horizontal overflow.
- Hosted PWA cache replacement and physical-device checks remain unverified.

## 0.3.12o — Ogham layout follow-up (2026-11-25)

- `tests/ogham0312l_layout_browser_test.py` verifies the new Ogham desktop layout (inventory to the right of the equipped pentagon board), the stacked mobile fallback at 390×844 and 320×900, and the inline compare inventory appearing directly beneath the Set A / Set B rows after choosing a Set B slot.
- `tests/ogham0312l_inventory_ev_browser_test.py` and `tests/ogham0312l_shared_chest_browser_test.py` were rerun and still pass at 1200/390/320 widths, confirming that inventory editing, unified Rune EV navigation, and shared-chest spending/refund behavior still work after the layout move.
- The pre-existing offline browser limitation remains: the HTTP-based art/offline test can be blocked by administrator policy in this environment, so hosted PWA cache refresh remains a deployment check rather than a claimed automated pass.



# 0.3.12n — Shared herb sprites (2026-11-25)

- **PASS:** `python tests/0312l_shared_herb_sprites_browser_test.py` at 1200/390/320px: real gathering and EV modules; all eight canonical local images load in gathering and shared Storage Chest (Reforge, Echostone, Rune); free gathering target and Precision Harvest prompt, live collected balance, one/two-lock costs, spending and Disassemble previews, post-refund balance parity and responsive layout; no page errors. Images are served from local files through browser request interception.
- **PASS:** shared-chest test using the real herb module, combined inventory/EV browser test at all three widths, core 17/17, general interaction 9/9, nine Ogham Node suites, JS syntax and all 75 service-worker CORE paths.
- **Separate pre-existing issue:** direct ordinary Reforge/Echostone rerenders can omit the app-level Rune choice. Cross-view sprite test enters Rune via the existing inventory action; direct navigation bug left unchanged in this asset-focused patch. Hosted service-worker refresh and physical devices remain unverified. All eight herb assets are precached, but actual offline installation was not tested in this pass.

# 0.3.12m — Rune and Reforge visual refinement (2026-11-25)

- **PASS:** `python tests/ogham0312l_visual_polish_browser_test.py` at 1200/390/320px: 9/10 and 18/20 gold, 17/20 normal, 10/10 and 20/20 perfect, locked row preserves quality text, touch/keyboard toggling, EN/KO/ES accessible lock labels, no horizontal overflow.
- **PASS:** `python tests/ogham0312l_inventory_ev_browser_test.py` at all three widths. The earlier timeout occurred because the test tried to lock an empty line immediately after Start Over. The revised test funds the shared chest, performs an initial paid roll, checks disabled/available locks and live costs, opens all 26 centered local images, exercises grouping, Rune → Echostone → Rune → Hat → Shoe and the single current-item panel. This is not exhaustive coverage of the full inventory/save/update/Disassemble lifecycle.
- **PASS:** `ogham0312i_word_picker_browser_test.py` and `ogham0312h_glyph_balance_browser_test.py` at all three widths (26 local PNG slots, 16 original and 10 provisional; actual loading/centering in combined test, picker cancel/create/edit/socket flow). Historical assertions for removed nickname controls and font placeholders updated.
- **PASS:** `ogham0312l_shared_chest_browser_test.py`, `ogham0312l_disassemble_browser_test.py`, `ogham0312l_awakening_50_browser_test.py` at 1200/390/320px. All nine Ogham Node rule suites, core regression (17/17), general interaction (9/9), JS syntax checks and all service-worker CORE paths verified.
- **BLOCKED / NOT VERIFIED:** `ogham0312l_offline_art_browser_test.py` could not reach the local HTTP test server in this environment (Chromium `ERR_BLOCKED_BY_ADMINISTRATOR`). Cache keys refreshed and local art included in CORE; actual offline service-worker installation and hosted update behavior still require a normal browser. Physical iOS/Android drag and device behavior remain unverified. Ten new artworks are provisional reconstructions, not source-confirmed images. Older level/dual-inventory tests still need modernization for read-only simulator controls. No effect data, economy or storage schema changes in this pass.

# 0.3.12l correction — Ogham Awakening Level 0–50 (2026-11-24)

- **PASS:** `python tests/ogham0312l_awakening_50_browser_test.py` in Chromium at **1200px, 390px, and 320px**: 51 choices (0–50), unchanged existing default 20, fifth socket still unlocks at 20, no additional sockets at 21/35/50, unchanged rune combination/Set B results relative to level 20, independent persisted per-Arcana levels (including 35 and 50) in the existing profile key, no horizontal overflow or page errors.
- **PASS:** `node tests/ogham0312e_rules_test.js`, `node tests/ogham0312k_loadout_compare_test.js`, `node tests/ogham0312l_shared_cost_rules_test.js`, `python tests/regression_companion.py .` (17/17 core), `python tests/interaction_test.py .` (9/9 interactions), and JavaScript syntax checks. This correction changes only the Ogham level-picker bound and its `0–50` save clamp, plus documentation, the targeted test, and a cache-namespace refresh.
- **Unchanged limitations:** Physical-device tests and full combined inventory-to-EV navigation are not newly validated. Reroll bonus curves remain reconstructed from Nexon endpoints.

# 0.3.12l — Visual Rune Groups and Unified EV Rune Rerolls (2026-11-24)

- Node `ogham0312l_groups_rules_test.js` PASS (reorder, group migration, dissolve non-destructively, shared source collections), `ogham0312l_shared_cost_rules_test.js` PASS (gold-only zero-lock, no herb precondition, locked-line herb preflight, independent Arcana equipment).
- Chromium `ogham0312l_inventory_ev_browser_test.py` PASS at 1200/390/320px for compact lines, group box, unified Item Type, Rune word chooser, lock price changes and absent Rune Arcana field.
- Additional regression results and known limitations are retained below; exact tier curve, smartphone tests and hosted cache refresh remain separate.

## 0.3.12l — Rune Disassemble, automatic lines and shared Storage Chest (2026-11-24)

- **PASS:** `node tests/ogham0312l_disassemble_rules_test.js .` — per-rune spending and count; saved copy isolation, Disassemble %/whole-unit refund and removal of a disassembled instance without affecting other tracked runes.
- **PASS:** `python tests/ogham0312l_disassemble_browser_test.py` — read-only effect-line UI, Disassemble confirmation/refund and no viewport overflow at 1200/390/320px.
- **PASS:** `python tests/ogham0312l_shared_chest_browser_test.py` — Reforge/Rune Storage Chest parity, Gold and Herb balances updated after each roll and refund, no reforge-only purchase/withdraw controls in Rune mode, and no viewport overflow at 1200/390/320px.
- **PASS:** `node tests/ogham0312l_groups_rules_test.js .`, `node tests/ogham0312l_shared_cost_rules_test.js .`, and legacy Ogham `ogham0312e_rules_test.js`, `ogham0312f_chest_rules_test.js`, `ogham0312g_levels_test.js`, `ogham0312k_dual_inventory_rules_test.js`, `ogham0312k_loadout_compare_test.js`.
- **NOT VERIFIED:** `tests/ogham0312l_inventory_ev_browser_test.py` exceeded the combined full-app Playwright timeout. Do not interpret it as a successful end-to-end check; narrower browser cases above pass independently. Physical-device drag/touch and hosted PWA refresh remain untested.

# 0.3.12k — Ogham Organization, Dual Inventory and Equipped-vs-Alternate Comparison (2026-11-24)

- Core regressions: **17/17 PASS**; general interactions: **9/9 PASS**.
- Node: `ogham0312j_inventory_rules_test.js`, `ogham0312k_dual_inventory_rules_test.js`, `ogham0312k_loadout_compare_test.js` PASS; existing Ogham rules (`ogham0312e`, `0312f`, `0312g`), Music `music0312c_upgrade_enchant_test.js`, and Litany `hs_litany_0312d_gear_rules_test.js` PASS.
- Chromium: `ogham0312k_dual_inventory_browser_test.py` and `ogham0312k_loadout_compare_browser_test.py` PASS at **1200/390/320px** for simulator→saved collection→equipment, live equipped Set A, seeded and persistent alternate Set B, overlapping rune IDs, no overflowing UI or JS exceptions. Physical devices not validated.
- Saved-state key unchanged; two collections remain under `state.ogham` and the existing profile/backup mechanism. Comparing never modifies Set A or the simulator's chest balances.
- Source evidence: Level curves are still reconstructed endpoints, material herbs are practice-only, region-specific December names not independently finalized.

# 0.3.12i — Visual Rune Picker and Game Stone Tiles (2026-11-25)

- **New UI test:** `tests/ogham0312i_word_picker_browser_test.py` at 1200/390/320px. Verified all 26 word choices, 16 screenshot-backed PNGs loaded, word/grade editor via touch/click, cancel-safe create/edit drafts, special Masterwork-only grade, independent saved inventory, 2-tap socket unequip and no overflow.
- **Compatibility:** 17/17 core regression checks, 9/9 interaction checks, Ogham rule/lock-cost/effect-level checks, Music 0.3.12c upgrade/enchant test, and EN/KO/ES localization browser test **PASS**.
- **Backward interactions:** updated prior `ogham0312g_pentagon_browser_test.py`, `ogham0312g_levels_browser_test.py` and `ogham0312e_browser_fixture_test.py` use the new word chooser while retaining all old assertions. The 0.3.12h glyph gallery now covers ten remaining Unicode fallbacks and sixteen named screenshot-derived stones.
- **Boundary:** User screenshot art is low resolution, not an official game sprite package. No change to reroll, shared chest, Arcana damage, healing, existing imports or profile data format. Physical-device and hosted PWA testing remain separate.

# 0.3.12h — Ogham Glyph Visual Balance (2026-11-25)

- **New visual regression:** `python tests/ogham0312h_glyph_balance_browser_test.py` covers all 26 Unicode rune symbols. Chromium validates optical ink-bound center alignment and confined scaling in the inventory-style tile at 1200, 390 and 320 px, with no horizontal overflow. Glyph rendering uses the visitor's local font; physical mobile OS font renders may differ.
- **Existing socket UI:** `python tests/ogham0312g_pentagon_browser_test.py` covers tap-to-equip, first-tap details, second-tap unequip, drag/drop, swap and independent Arcana loadouts at 1200/390/320px. There is no extra socket X.
- **Compatibility:** 17/17 core regression checks, 9/9 interaction checks, all 0.3.12e–g Ogham rule/browser tests, localized browser test, Music 0.3.12c migration/upgrade tests and Harmonic Saint v4 draft tests passed.
- The release only changes visual glyph rendering, display/metadata documentation, and offline cache version. Stored rune instances and IDs, level effects, reroll rules, chests, profile keys and other modules are not changed.

# 0.3.12g — Ogham Discrete Effect Levels and Two-Tap Socket UI (2026-11-24)

- **PASS:** 17/17 Companion core regressions, 9/9 interaction checks.
- **PASS:** `ogham0312e_rules_test.js`, `ogham0312f_chest_rules_test.js`, `ogham0312g_levels_test.js`, Music special upgrade/enchant regression.
- **PASS:** Pentagonal equipment browser at 1200, 390 and 320px. Checks inventory select/socket equip, desktop drag/drop, socket swap, correct first-click detail panel, grade and Lv. 7 effect bonus, deselection by picking another inventory rune, **second-click same-socket unequip**, mobile touch tap, preservation of inventory and other Arcana loadouts, and absence of socket X controls. No page errors/overflow.
- **PASS:** Discrete-effect browser suite at 1200, 390 and 320px including EN/KO switching; one simulator effect dropdown is changed via the DOM's native `change` event rather than Playwright's `select_option`, which incorrectly reported an existing enabled option as unavailable. Integrated older Ogham fixture also **PASS** at all three widths after updating the obsolete socket dropdown selector.
- **Evidence boundary:** Bundled Lv. 1–10/20 intermediate values are **reconstructed from Nexon's printed endpoints**; they do not claim Prilus's exact data snapshot. Language placeholders are deliberate for unverified regional proper names. Device-specific touch and deployed PWA tests remain separate.

# 0.3.12f — Ogham Reroll Chest Economy (2026-11-24)

- 17/17 core regressions, 9/9 interaction checks **PASS**.
- `node tests/ogham0312f_chest_rules_test.js` and updated `tests/ogham0312e_rules_test.js` **PASS**.
- `python tests/ogham0312e_browser_fixture_test.py` **PASS** at 1200, 390 and 320px, including shared chest gold and herb spend, persistent owned inventory, and EN/KO/ES controls.
- `node tests/music0312c_upgrade_enchant_test.js` **PASS**. `node tests/burst0312c_real_schema_test.js <supplied comparison file>` **PASS**.
- No complete live Prilus ability database or iOS/Android physical-device validation; see Ogham guide and release notes.

# 0.3.12e Draft — Ogham inventory and reroll test scope

- `node tests/ogham0312e_rules_test.js`: 26 rune words, 30 recipes, grade points, loadout isolation/unlocks, no shared physical rune twice per Arcana, 0/1/2-lock reroll costs, simulator/inventory isolation.
- `python tests/ogham0312e_browser_fixture_test.py`: injected full application scripts into a browser test context at 1200/390/320. Real Ogham UI and EV simulator mode pass with simulated localStorage persistence. **Not equivalent to an HTTPS-hosted or deployed phone test.**
- Reroll pool is a limited practice example and does not provide official odds; no real rune icons were verified. Existing calculators and Rotation Highlights do not automatically consume manually equipped rune data.

# 0.3.12d — Harmonic Saint Litany equipment rolls / layout (2026-11-24)

- **Focused Node:** `hs_litany_0312d_gear_rules_test.js`, `hs_litany_draft_test.js`, and `hs_litany_0312a_test.js`: **PASS**. Verified water potency-only 1–10 whole-number bounds, enchant Healing/Magic Attack only, prohibited saved fields stripped with schema-v6 hydration, separately tracked Magic Attack, relic Gift exception, integer grade/Erg overrides, unchanged fractional EV reforge math, and EN/KO/ES strings.
- **Focused Chromium:** `hs_litany_0312d_gear_browser_test.py`: **PASS** at 1200×850, 390×844 and 320×568. Verified Robe bottom-right of 3×3, Echostone directly beneath, no Echostone enchant/water, conditional 1–10% Murias selector, integer input step/keyboard, results, persisted edits, editor-scroll retention and translated Magic Attack controls.
- **Litany backward compatibility:** `hs_litany_v3_browser_test.py` **PASS** at three viewports; `hs_litany_v4_browser_test.py` **PASS** at three viewports; `hs_litany_0312a_browser_test.py` **PASS** at three viewports; `hs_litany_reforge_echo_browser_test.py` **PASS** at mobile viewport. An additional older wrapper, `hs_litany_browser_test.py`, completed its first desktop pass but exceeded a combined regression-run timeout; its executed target (`hs_litany_v3_browser_test.py`) passed independently at all three viewports.
- **Unrelated regressions:** `regression_companion.py .` **17/17 PASS**, `interaction_test.py .` **9/9 PASS**, `music0311i_editor_scroll_test.py .`, `music0312c_browser_test.py .`, `music0311b_slot_rules_test.py .`, `companion0312_boost_cards_test.py .`, `localization0310_browser_test.py .`, `module_binding_test.py .`, `companion277_archive_ui_test.py .` **PASS**. Crit-neutral Rotation Highlights, Wireless Puppet, encounter Arcana, archive rules/compaction/fingerprint, localization VM and the 0.3.12c music upgrade/enchant Node test **PASS**.
- **External import regression:** `burst0312c_real_schema_test.js` using the user-supplied Midir-46.b HTML: **PASS**, five players, 244 individual hits, 25 observed-use markers and rolling 10s reconciliation. `burst0312c_real_browser_test.py` passed at 1200px and 390px; `mobile0312b_burst_orientation_test.py` passed orientation, zoom, comparison import and independent Vault data.
- **Release integrity:** 0.3.12c cumulative baseline ZIP passed integrity. The 0.3.12d source comparison preserves **1,566 unchanged** files, updates **14** files, adds **two** focused tests, and removes **none**. The 0.3.12d ZIP passes integrity checking with **1,582 entries**. The offline cache namespace is versioned, and exported report/user files remain outside caching.
- **Scope:** No changes to Music or Sacred Guardian calculators, Rotation Highlights, boss-only prioritization, Arcana attribution, leaderboard, stored report formats or unrelated app functionality. Profile storage key unchanged; only Litany nested object upgrades its persisted `version` from 5 to 6. Existing unsupported enchant Party/Potency and water flat values are intentionally dropped. Enchant Magic Attack is tracked as a distinct stat and does not affect current Healing/Dissonance math. Physical-device PWA/rotation verification remains an outstanding deployment check.

# 0.3.12c — Music Special Upgrade, instrument enchants and real Midir-46.b comparison (2026-11-24)

- New named-test results: **28/28** test commands passed. Evidence logs were captured outside the release package during testing.
- Browser: Music 1200×800, 390×844 and 320×568 passes settings disclosure retention, Polyphony 6–9/Tempo 4–5 and exclusive upgrade scope BFO/Vivace. External real Midir-46.b export imports in headless Chromium at desktop and mobile viewport; five players, 244 hit events and 25 recorded use markers correctly rendered with exported skill names.
- Numerical: current-hit totals and separate per-skill summaries reconcile to <0.001 for all five exported players. Independent rolling 10-second scan confirms exported 30-second bounds and adapter outputs; no event totals doubled; no 60s reconstruction.
- Migration: old version-4 physical instrument enchant rolls are shifted exactly once, with item/set manual overrides preserved.
- Companion v1 47 MB standard export and previous rotation, Arcana, archive, music, Harmonic Saint, Sacred Guardian, locale and profile regressions are included in the run below.
- Tests conducted against Playwright Chromium in this environment, not iOS Safari or a physical Android device. Full-app 47 MB mobile stress and hosted HTTPS PWA cache refresh still require deployment checks.
- Exact source: Nexon *Renovation: Season 8* (Polyphony +6–9, Tempo +4–5) and Nexon *February Quality of Life Update* (Instrument Exclusive Special Upgrade BFO/Vivace only). See current Music guide for links.

**Executed commands:** music-rule: PASS; burst-real-numeric: PASS; burst-original: PASS; import-sunday: PASS; rotation-crit: PASS; rotation-wireless: PASS; arcana: PASS; archive-rules: PASS; compaction: PASS; localization-vm: PASS; litany-0312a: PASS; music-browser-new: PASS; burst-real-browser-new: PASS; music-scroll: PASS; music-slot-rules: PASS; music-murias: PASS; music-echo: PASS; music-migration: PASS; music-legacy: PASS; music-override: PASS; mobile-0312b: PASS; sg-boost: PASS; litany-0312a-browser: PASS; regression: PASS; interaction: PASS; localization-browser: PASS; module-bindings: PASS; archive-ui: PASS.

# 0.3.12b — Midir-46.b handoff / mobile orientation checks (2026-11-24)

- `tests/import0312b_sunday_test.js`: **PASS** — real test export Sunday 4, six player records, seven recognized attempts, 20,020 hits, 1,774 observed uses, 99,603 protocol observations, three observed zero-HP clears.
- `tests/burst0312b_parser_test.js`: **PASS** — isolated `burst-data` comparison adapter, 10s half-open rolling intervals, skill totals once, separate observed uses, error paths and synthetic comparator.
- `tests/mobile0312b_burst_orientation_test.py`: **PASS** — portrait/landscape/portrait, retained zoom, chart jump and close; synthetic comparison import, player switch, 10s scores and independent report count.
- The user-supplied real 47 MB HTML rendered directly in Chromium (6 players, 8 encounter dropdown options, chart, zero page exceptions) using `page.set_content`. Local `file://` navigation was blocked by the test environment.
- A full-app 47MB mobile iframe stress check exceeded the local test runner limit; direct report Chromium rendering and smaller sandboxed reader rotation checks passed. No genuine 46.b `burst-data` export is available; its field-level schema and live import compatibility remain outstanding. Physical iOS/Android auto-rotation and deployed PWA orientation testing remain outstanding.

# 0.3.12a — Litany Spirit Weapon and Murias Relic verification (2026-11-16)

- **New mechanics:** `node tests/hs_litany_0312a_test.js .` — **PASS**: fixed Pulse, Amulet 0–12, wand-S50-only Dark Erg, Spirit Training/Attunement/Control and Awakening toggle, three independent relic effect/enchantment slots including Gift suffix, older v2/v4 state migration, and Korean/Spanish/English rendering.
- **New browser:** `python tests/hs_litany_0312a_browser_test.py .` — **PASS** at 1200×800, 390×844 and 320×568: wand S50 reveal/hide, restricted overrides, relic editors, augment groups, Spirit active gating, scroll stability, localization and overflow checks.
- **Compatibility UI:** `tests/companion0312_boost_cards_test.py`, `hs_litany_v4_browser_test.py` and `hs_litany_v3_browser_test.py` updated only for the intentional Pulse-no-Edit/nine-card behavior; original SG card, wand, offhand, equipment-set and music regressions remain.
- **Core:** `tests/regression_companion.py .` **17/17 PASS**; `tests/interaction_test.py .` **9/9 PASS**; `tests/music0311i_editor_scroll_test.py .`, localization UI, archive UI, module binding and previous Litany browser suites **PASS**. `tests/rotation032a_crit_neutral.js`, `rotation305_wireless.js`, `companion278_arcana_test.js`, archive and localization VM tests **PASS**.
- **Limits:** The Lv50 Dark Erg +25% endpoint is supported, but Lv1–49 values default to an editable linear what-if interpolation. No live intermediate-level table or independently verified Healing-to-Dissonance relation is claimed. Real device/PWA deployment tests remain required.

## Previous 0.3.12 verification (2026-11-11)

- `python tests/companion0312_boost_cards_test.py` — **PASS** (1200×850, 390×844, 320×568): three SG extra cards, original rank/rune/emergency/persona controls, relic-toggle rank persistence, separated full/quick assumptions, Harmonic Saint icon/checkbox/Edit cards and edited-value summaries, English/Korean/Spanish switching, overflow and JavaScript exceptions.
- `node tests/hs_litany_draft_test.js .` — **PASS**: previous Litany recovery, equipment quality, Erg, set points, Echostone/accessory precedence and original data computations preserved. `python tests/hs_litany_v4_browser_test.py .`, `hs_litany_v3_browser_test.py .`, `hs_litany_browser_test.py .` and `hs_litany_reforge_echo_browser_test.py .` — **PASS**, three viewport sizes for the main equipment/browser coverage.
- `python tests/music0311i_editor_scroll_test.py .` and `music0311b_slot_rules_test.py .` — **PASS** across 320, 390 and 844px viewports: existing Music editor scroll and equipment/Echostone behavior retained.
- `python tests/regression_companion.py .` — **17/17 PASS**; `python tests/interaction_test.py .` — **9/9 PASS**. `python tests/localization0310_browser_test.py .`, `module_binding_test.py .` and `companion277_archive_ui_test.py .` — **PASS**. Node `rotation032a_crit_neutral.js`, `rotation305_wireless.js`, `companion278_arcana_test.js`, `companion277_archive_rules_test.js`, `companion278_compaction_test.js`, `localization0310_vm_test.js` — **PASS**. `node --check` for modified JS — **PASS**.
- **Existing legacy test exception:** `tests/mobile293_utility_test.py` fails at its initial `#music-calculator` / `#music-begin` assertion **also on the untouched cumulative 0.3.11i v4 baseline**; the standalone mobile Music Calculator route was refactored after this test was written. The historical test was **left unchanged** and does not establish a new 0.3.12 UI regression.
- Physical phone verification and hosted HTTPS service worker refresh remain separate deployment checks. No new Dissonance recovery-to-debuff formula was introduced. 0.3.12 changes UI, translations, SG editable selection presentation, documentation and cache version; Rotation Highlights and combat calculations are unchanged.

## 0.3.11i Harmonic Saint Litany equipment draft v3 — supplemental verification (2026-11-11)

- `node tests/hs_litany_draft_test.js .` — calculator and equipment math, Soul Liberator +112% Masterwork only, Nightbringer quality tiers, S/B/A Erg behavior, EV reforges, 10-point Healing Enhancement set, Echo/accessory non-stacking, English/Korean source routing. **PASS.**
- `python tests/hs_litany_v3_browser_test.py .` — comprehensive Harmonic Saint board and editor UI at 1200×800, 390×844 and 320×568, wand quality dropdown/override, sticky Recovery/Dissonance switching, 1–5 stacks, scroll retention, English/Korean locales, and overflow. **PASS.**
- `python tests/hs_litany_reforge_echo_browser_test.py .` — EV-backed Healing/Party Healing reforge selector limits, accessory/Echostone precedence and independent wand reforge. **PASS.**
- `python tests/regression_companion.py .` (**17/17 PASS**) and `python tests/interaction_test.py .` (**9/9 PASS**). `node tests/rotation032a_crit_neutral.js .`, `rotation305_wireless.js .`, `companion278_arcana_test.js`, `localization0310_vm_test.js`: **PASS**.
- `python tests/music0311i_editor_scroll_test.py .` (**PASS** at 320×568, 390×844, and 844×390); `python tests/localization0310_browser_test.py .` (**PASS** at 390×844 and 1200×800).
- `python tests/module_binding_test.py .` and `python tests/companion277_archive_ui_test.py .`: see release regression logs. The calculator's existing-source preview was preserved without unrelated functional changes.
- Scope: this verifies source and UI consistency, not live game formula accuracy, physical phone behavior, hosted HTTPS service worker refresh or in-game healing/Dissonance measurements. The manual one-stack Dissonance value remains independent of the optional proportional comparison mode.

## 0.3.11i Harmonic Saint Litany draft preview — supplemental verification

- `node tests/hs_litany_draft_test.js .` — independent Healing and Party Healing recovery, raw EV reforge tiers/limit breaks, accessory-total/Echo non-stacking, Wand independent stacking, direct wand per-stack benefits, workbook breakpoints, DPS-gain sign, source-module routing.
- `python tests/hs_litany_browser_test.py` — 1200×850 and 390×844 Chromium; module rendering, numeric inputs, wand, manually checked equipment, Korean translations and overflow.
- `python tests/hs_litany_reforge_echo_browser_test.py` — 1280×820 and 390×844 Chromium; EV reforge selectors and caps, accessory vs Echo precedence, independent Wand reforge, Korean labels and overflow.
- Formula status **unverified**: no live in-game Dissonance coefficients, healing-buff stacking or Echo conflict screenshot captured. Preview test PASS does not validate game-mechanics accuracy. See `features/20-HARMONIC-SAINT-LITANY-DRAFT.md`.

# Current verification scope and known limitations — 0.3.12a

## Confirmed from the shipped source

- 90 MiB single-file import guard; HTML structured-data parser avoids an extra full HTML DOM but still reads the file text into memory.
- Mobile defaults to 10 active detailed reports; desktop defaults to 30. Browser storage is local and backups do not create remote synchronization.
- Theta base MP 2,500, Dorcha cap 15, five **fallen-note** misses with three-success reset (empty presses harmless), icon-first controls, and flat on-track timing receivers.
- Vertrag Trial/Endless arena picker, clickable giant occupancy, four defensive states, overhead HP display, `H` potion default, full-distance locked-target charge and 20%-expanded quiet-zone radius.
- In-app games and equipment rates remain simulated, not live game calculations.

## Limits that must remain explicit

- A 90 MiB threshold is not a guaranteed successful import on lower-memory devices; there is no gate-at-a-time import feature.
- PWA install, persistent storage and imported HTML behavior depend on browser/OS support, origin and quota. Test on the target mobile device.
- Full-profile backups are not a substitute for original raw reports once compacted. The app cannot synchronize browser data between devices.
- Imported combat records can be incomplete, ambiguous or missing. Don't infer actor identity, Arcana, boss clear or skill use without matching evidence.
- Training rewards, survival damage multipliers, and upgrade chances are Companion mechanics, not certified Mabinogi values.

## Mobile game access verification

- Implemented touch support includes Rotation Crafter, Rate Isn’t a Lie, Crom, Vertrag, Theta, positioning labs, Pig Pursuit and EV. Cutting Chorus has separate touch aim and trigger controls and is accessible from its mobile Arcana hub entry. Physical-phone multi-touch responsiveness is still pending verification; only the legacy generic drill remains in the `MIDIR_MOBILE_DESKTOP_ONLY` restriction set.
- EV waves 1 and 2 use reduced starting-tier HP (12 and 17 respectively); these are simulation balance parameters, not official combat values.
- Confirm two-finger controls on physical phones: EV pinch zoom and tower placement, Pig Pursuit two-stick input, Vertrag zoom and emergency movement, and Cutting Chorus independent aim/trigger once routed.

## Rotation Highlights skill-rule confidence

- Current cooldown floors and shape budgets are implemented analysis heuristics, not a verified catalogue of all Mabinogi cooldowns and hitboxes. See [rule inventory](ROTATION-SKILL-RULES-INVENTORY.md) before modifying interpretation.
- Boss-only evidence is prioritized over Gate 2 fallback; critical hits are normalized to the same per-skill non-critical reference damage. Crit-only references use a player-specific multiplier where supported by other normal/critical observations.

## Regression entry points

Run current `tests/regression_companion.py`, `tests/module_binding_test.py`, Theta/Vertrag test suites and mobile-specific browser tests before publication. Also perform a manual phone smoke test over HTTPS.

## 0.3.11a hotfix verification

- Chromium mobile-browser UI test: complete EV tutorial steps 1–4 with the Base Manager drawer open and start Wave 1.
- Music gear sets: create alternate accessory with different enchant and reforge, share an instrument then detach it, add Enduring Defense reforge, compare results, override and reset enchants. Revised eight-slot editor tests and seven baseline mobile layout tests pass.
- Theta renderer: touch/small-screen mode uses reduced backing pixels and starts/responds; logic loop and skill timing constants were not intentionally changed. No frame-rate measurement or physical-device result is claimed.
- Tested JavaScript syntax, 17 baseline UI regressions, module binding, and pre-existing localization/Theta modules (see tests).
- Limitations: isolated Chromium tests do not establish sustained performance on slower phones, real storage behavior over a deployed HTTPS origin, service-worker upgrade behavior or all possible gear roll restrictions. Save/reload/backups should be verified before retiring the previous source release.
- The previous separate AG landing-scroll anomaly on the narrowest test viewport is not claimed fixed by this hotfix.

## 0.3.11c equipment/editor acceptance (browser)

- Music sets use a slot board at 320 × 568, 390 × 844 and 844 × 390; each slot has a direct item editor. Reforge options and normal/limit-break caps come from the simulator’s reference table; duplicates on the same item are disallowed and wings have no reforge editor.
- Same-name set bonus precedence is verified: Seraphic BFO +5% overrides Troubadour BFO +3% while Troubadour Enduring Melody +3% remains active; removing Seraphic restores Troubadour BFO +3%.
- The 0.3.11a gear swap, saved-state migration and EV/Theta checks are rerun for the cumulative release. Actual phone ergonomics, live gameplay performance, hosted PWA cache refresh and profile backup/restore remain separate field checks.

## 0.3.11c compact calculator and override tests

- `tests/music0311c_compact_override_test.py` checks automatic versus typed per-item enchant contributions, explicit zero, clear/reset, preservation of set-only overall override precedence, shared-item behavior, copied-item independence and simulated localStorage reload.
- At 320×568, 390×844 and 844×390 Chromium touch/viewport configurations, checked no horizontal overflow, 3×3 slot board access, pinned live results after scrolling, and result preview inside the slot editor. Collapsed advanced sources and set management remain accessible; the existing 0.3.11b reforge and named set effect tests are rerun.
- These automated checks do not prove real device ergonomics, actual saved-profile backup/restore, or GitHub Pages service-worker replacement.

## 0.3.11c Murias Water follow-up

- `tests/music0311c_murias_slots_test.py`: both accessories, hat, body, boots, gloves and instrument can add +1 each; wings have no checkbox. Exactly +7 automatic maximum, whole-set override (including intentional zero) and automatic reset are checked.
- The same test checks a shared instrument, independent copies, simulated localStorage reload and migration of a formerly flat Murias value into a visible per-set override; it does not add a second global contribution.
- Checks run in Chromium at 320×568, 390×844 and 844×390, with no horizontal overflow. Physical-phone usage and deployed site migration still require human confirmation.

## 0.3.11d Theta timing and mobile-browser checks

- `tests/theta0311d_judgment_test.py` validates ring placement, full-note Perfect containment, all partial tiers, stronger late judgments, ignored extra/mis-timed inputs, visible on-deck note (including while another note approaches), track-exit miss deadline, five-miss failure, three-hit reset, and overall historical Miss total at 320×568, 390×844 and 844×390.
- Updated `tests/theta282_test.py` to test the newly intended harmless unmatched press behavior, replacing its now-obsolete wrong-time overheat assertion. All nine preexisting Theta tests remain release-gating.
- Physical-device latency, sustained FPS, touch/keyboard timing feel and deployed cache refresh must still be tested after publishing. Automated Chromium tests do not prove smoothness on a particular phone.

## 0.3.11e Vertrag verification

The 0.3.11e regression `tests/vertrag0311e_trial_bars_test.py` checks all four foreground bars outside the floor clip, drain percentage and defeated state, countdown removal, continued play past legacy duration, and fastest successful-clear records at phone portrait, landscape and desktop dimensions. Existing Vertrag survival, giant-rule, defense and arena-edge tests remain part of the release gate. **Physical-device legibility and deployed service-worker upgrades remain field checks.**

## 0.3.11f release checks

`tests/vertrag_theta_session0311f_test.py` exercises shared shop delivery, shared inventory delivery and non-overlap of Thunder and Thunderblight at normal/S50 cast speeds in three browser viewports. `tests/vertrag0311e_trial_bars_test.py` retains giant-bar and fastest-time coverage; legacy Theta mechanics and the general application regression suite are retained. The browser test uses synthetic storage for wallet setup; **deployed storage, shop ergonomics and Theta timing feel require field checks**. 

## 0.3.11h Blue Echostone checks

The dedicated Blue Echostone browser test verifies the ninth equipment cell, single-line restriction, absence of enchant/Murias inputs, max levels, gear/echo precedence, and no horizontal overflow at 320×568, 390×844 and 844×390. Physical-device use and hosted profile migration have not been tested.

## 0.3.11i music gear scroll behavior

- Chromium editor scroll preservation and numeric field focus confirmed at 320 × 568, 390 × 844, and 844 × 390; Blue Echostone and item override tests plus 17 application regressions pass. Physical-phone keyboard behavior remains a field check.
