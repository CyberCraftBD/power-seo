# @power-seo/redirects

## 1.0.18

### Patch Changes

- **Editor-selected target intent (`expectedIntent`)** and **diminishing returns for repeated signal phrases** (#152).
  - `analyzeContent()` accepts a new optional `expectedIntent` input
    (`'informational' | 'navigational' | 'transactional' | 'commercial' | 'commercial-investigation'`).
    When set, every intent-aware check scores the content against the selected
    intent instead of auto-detecting it from the focus keyphrase — letting
    editors who know a page's job (e.g. a pricing page) override classification.
    `'commercial'` is accepted as an alias for `'commercial-investigation'`.
    `detectIntent`, `ExpectedIntent`, `IntentType`, and `IntentResult` are now
    exported from `@power-seo/content-analysis` so UIs can show auto-detected vs
    target intent side by side.
  - **Phrase-stuffing no longer pays** (#152): `@power-seo/core` gains
    `countEffectiveMatches()`, a diminishing-returns counter — each distinct
    matched phrase earns full credit once, and identical repeats earn
    log2-scaled credit (10× "I recommend" ≈ 4.3 credits instead of 10). Applied
    to `eeat-experience-depth`, `eeat-methodology-transparency`, and
    `aeo-fact-density`, so ten varied experience markers now strictly outscore
    one marker repeated ten times, and pasting trigger-phrase lists can no
    longer buy top tiers. Identical phrases matched by multiple patterns are
    merged, removing same-phrase double-dipping inside a check.

  All packages are version-bumped together to keep the toolkit aligned.

### Patch Changes

- Updated dependencies
  - @power-seo/core@1.0.18
