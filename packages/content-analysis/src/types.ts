// ============================================================================
// @ccbd-seo/content-analysis — Types
// ============================================================================

export type { ContentAnalysisInput, ContentAnalysisOutput, AnalysisResult, AnalysisStatus } from '@ccbd-seo/core';

/** Union of all built-in check IDs. */
export type CheckId =
  | 'title-presence'
  | 'title-keyphrase'
  | 'meta-description-presence'
  | 'meta-description-keyphrase'
  | 'keyphrase-density'
  | 'keyphrase-distribution'
  | 'heading-structure'
  | 'heading-keyphrase'
  | 'word-count'
  | 'image-alt'
  | 'image-keyphrase'
  | 'internal-links'
  | 'external-links';

/** Optional configuration to enable/disable individual checks. */
export interface AnalysisConfig {
  /** Checks to skip. If omitted, all checks run. */
  disabledChecks?: CheckId[];
}
