# Midir Companion 0.3.13 — Native Offline Session ZIP Importing

**Baseline:** 0.3.12r cumulative GitHub-ready source. **Scope:** Midir 49.a universal HTML ZIP interoperability, stable recording identity, import feedback, original report retention and viewer isolation. Existing combat-evidence interpretation, game/simulator mechanics, profile backup version and database version remain unchanged.

## Current behavior

1. **Native ZIP input.** The existing chooser and drop target accept ZIPs and loose reports. Classic ZIP STORE and raw DEFLATE work locally; no external package/CDN is required. Legacy manifest-free HTML ZIPs are supported. Retired 49 data-only entries and nested bundles are explicitly unsupported. [1]; [2].
2. **Integrity and safety.** Validate central/local ZIP headers, paths, entry count/size, actual decompression size, CRC, v1 manifest, optional paired SHA-256 hashes and exact payload metadata/schema agreement. Invalid present manifests never fall back to legacy. [1]; [3].
3. **Identity and revision policy.** Durable recording ID is authoritative. Exact same scope/hash is skipped, other hashes and scopes are retained as metadata without additional recordings. First chosen equal/incomparable scope stays unchanged; strictly broader scope supersedes narrower evidence under the same local ID. No silent merging, no unselected revision HTML retention or revision-selection UI. Historical reports retain conservative overlap prompts. [2]; [3].
4. **Original viewer and persistence.** Use the same HTML parser, evidence interpretation, original interactive report viewer and local storage. Protected ZIP and identified HTML reports retain full detail and original HTML even in the Archive. CSP is applied to viewing copies only; sandbox remains opaque-origin. [2]; [4].
5. **Batch results.** Sequential per-entry validation and independent report/HTML writes; result summary separates imports, duplicates, revisions, scope variants, unsupported and rejected entries. Profile-index failure triggers rollback of that entry. [2].

## Verification

- `tests/0313_bundle_reader_test.js` — PASS: all nine producer ZIP fixtures, including 128 reports and one 6,000-hit recording; exact HTML and compression/hash parity; UTF-8, STORE/DEFLATE descriptors, path/duplicate/flag/link checks, declared/actual size limits, CRC, invalid manifest, nested ZIP rejection and SHA-256 fallback vectors.
- `tests/0313_bundle_browser_test.py` — PASS in offline Chromium at 1200px and 390px: chooser/drop, overlap/exact duplicates, scope order, revisions/hashless/corrupt manifests, legacy and retired entries, original HTML, encounter selection, skill highlighting, mobile zoom, 128 retained HTML files (118 archived), simulated storage quota rollback and hydration, CSP-blocked external requests. This uses a storage test double, not actual IndexedDB persistence.
- Core (17/17), general interactions (9/9), existing archive compaction and fingerprint regression suites — PASS. See [VERIFICATION.md](VERIFICATION.md) for exact scope and outstanding checks.
- Hosted PWA / actual browser-origin IndexedDB, physical-device performance, Firefox/Safari and real live recordings require deployment verification. Chromium normal page navigation is blocked by the execution environment. Raw DEFLATE requires browser support for `DecompressionStream('deflate-raw')`; unsupported older browsers receive an explicit error. Existing full-backup limits remain, and retained archives use additional storage/RAM.

## Numbered source references

[1] `Companion Files/session-bundle.js` — ZIP directory, bounded extraction, CRC and SHA, manifest/metadata validation.
[2] `Companion Files/app.js` — common importer, identity selection, storage, archive and report viewer.
[3] [Midir 49.a bundle specification](reference/midir-49a/SESSION-BUNDLE-SPEC.md), [manifest schema](reference/midir-49a/SESSION-BUNDLE-MANIFEST.schema.json), [producer handoff](reference/midir-49a/COMPANION-HANDOFF.md), [producer verification](reference/midir-49a/SESSION-BUNDLE-VERIFICATION.md).
[4] `Midir Companion.html`, `Companion Files/i18n.js`, `Companion Files/styles.css`, `service-worker.js` — input, local frame CSP, labels, status and cached reader.
[5] `tests/0313_bundle_reader_test.js`, `tests/0313_bundle_browser_test.py`, `tests/fixtures/Midir-49.a-Companion-Fixtures.zip` — reproducible synthetic test fixtures.
