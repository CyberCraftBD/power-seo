// @power-seo/content-analysis — Types
// ----------------------------------------------------------------------------

export type {
  ContentAnalysisInput,
  ContentAnalysisOutput,
  AnalysisResult,
  AnalysisStatus,
} from '@power-seo/core';

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
  | 'external-links'
  | 'paragraph-length'
  | 'sentence-length'
  | 'subheading-distribution'
  | 'transition-words'
  | 'canonical-url'
  | 'keyphrase-introduction'
  | 'keyphrase-slug'
  | 'keyphrase-length'
  | 'title-number'
  | 'title-sentiment'
  | 'title-power-word'
  | 'keyphrase-title-position'
  | 'url-length'
  | 'text-presence'
  | 'media-count'
  | 'table-of-contents'
  | 'nofollow-links'
  | 'secondary-keyphrases'
  // E-E-A-T: Experience
  | 'eeat-experience-depth'
  | 'eeat-original-research'
  | 'eeat-specificity-depth'
  | 'eeat-multimedia-evidence'
  | 'eeat-case-study-patterns'
  // E-E-A-T: Expertise
  | 'eeat-author-schema'
  | 'eeat-topical-authority'
  | 'eeat-technical-vocabulary'
  | 'eeat-expert-hedging'
  | 'eeat-methodology-transparency'
  // E-E-A-T: Authoritativeness
  | 'eeat-author-social'
  | 'eeat-organization'
  | 'eeat-published-works'
  | 'eeat-expert-sourcing'
  | 'eeat-editorial-review'
  // E-E-A-T: Trustworthiness
  | 'eeat-source-quality'
  | 'eeat-ymyl-compliance'
  | 'eeat-conflict-disclosure'
  | 'eeat-content-accuracy'
  | 'eeat-correction-policy'
  | 'eeat-privacy-safety'
  // E-E-A-T: Meta
  | 'eeat-overall-score'
  | 'eeat-ymyl-multiplier'
  // Non-E-E-A-T
  | 'previously-used-keyphrase'
  | 'keyphrase-even-distribution'
  | 'single-h1'
  | 'word-complexity'
  | 'inclusive-language'
  | 'competing-links'
  | 'content-freshness'
  | 'keyphrase-markup'
  | 'headline-analyzer'
  | 'inbound-internal-links'
  // Intent: Detection
  | 'intent-keyword-classification'
  | 'intent-sub-type'
  | 'intent-modifier-analysis'
  | 'intent-multi-detection'
  // Intent: Content Alignment
  | 'intent-content-alignment'
  | 'intent-title-match'
  | 'intent-meta-match'
  | 'intent-heading-match'
  | 'intent-opening-match'
  | 'intent-conclusion-match'
  // Intent: Specific Requirements
  | 'intent-informational-completeness'
  | 'intent-transactional-elements'
  | 'intent-commercial-elements'
  | 'intent-navigational-clarity'
  | 'intent-format-match'
  // Intent: Signal Quality
  | 'intent-signal-density'
  | 'intent-signal-distribution'
  | 'intent-depth-match'
  | 'intent-mixed-warning'
  | 'intent-cta-alignment'
  // Intent: SERP Features
  | 'intent-snippet-readiness'
  | 'intent-schema-readiness'
  | 'intent-paa-coverage'
  // Intent: User Journey
  | 'intent-satisfaction-score'
  | 'intent-funnel-position'
  | 'intent-related-coverage'
  | 'intent-engagement-signals'
  // AEO: Answer Engine Optimization
  | 'aeo-direct-answer'
  | 'aeo-faq-section'
  | 'aeo-fact-density'
  | 'aeo-tldr-summary'
  | 'aeo-concise-answers'
  | 'aeo-structured-data-hints'
  | 'aeo-citation-readiness'
  | 'aeo-entity-coverage';

/** Optional configuration to enable/disable individual checks. */
export interface AnalysisConfig {
  /** Checks to skip. If omitted, all checks run. */
  disabledChecks?: CheckId[];
}
