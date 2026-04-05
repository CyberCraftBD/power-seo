// @power-seo/content-analysis — Public API
// ----------------------------------------------------------------------------

export { analyzeContent } from './analyzer.js';
export { checkTitle } from './checks/title.js';
export { checkMetaDescription } from './checks/meta-description.js';
export { checkKeyphraseUsage } from './checks/keyphrase-usage.js';
export { checkHeadings } from './checks/headings.js';
export { checkWordCount } from './checks/word-count.js';
export { checkImages } from './checks/images.js';
export { checkLinks } from './checks/links.js';
export { checkParagraphLength } from './checks/paragraph-length.js';
export { checkSentenceLength } from './checks/sentence-length.js';
export { checkSubheadingDistribution } from './checks/subheading-distribution.js';
export { checkTransitionWords } from './checks/transition-words.js';
export { checkCanonicalUrl } from './checks/canonical-url.js';
export { checkKeyphraseIntroduction } from './checks/keyphrase-introduction.js';
export { checkKeyphraseSlug } from './checks/keyphrase-slug.js';
export { checkKeyphraseLength } from './checks/keyphrase-length.js';
export { checkTitleReadability } from './checks/title-readability.js';
export { checkKeyphraseTitlePosition } from './checks/keyphrase-title-position.js';
export { checkUrlLength } from './checks/url-length.js';
export { checkTextPresence } from './checks/text-presence.js';
export { checkMediaCount } from './checks/media-count.js';
export { checkTableOfContents } from './checks/table-of-contents.js';
export { checkNofollowLinks } from './checks/nofollow-links.js';
export { checkSecondaryKeyphrases } from './checks/secondary-keyphrases.js';

// E-E-A-T: Experience
export { checkExperienceDepth } from './checks/eeat-experience-depth.js';
export { checkOriginalResearch } from './checks/eeat-original-research.js';
export { checkSpecificityDepth } from './checks/eeat-specificity-depth.js';
export { checkMultimediaEvidence } from './checks/eeat-multimedia-evidence.js';
export { checkCaseStudyPatterns } from './checks/eeat-case-study-patterns.js';

// E-E-A-T: Expertise
export { checkAuthorSchema } from './checks/eeat-author-schema.js';
export { checkTopicalAuthority } from './checks/eeat-topical-authority.js';
export { checkTechnicalVocabulary } from './checks/eeat-technical-vocabulary.js';
export { checkExpertHedging } from './checks/eeat-expert-hedging.js';
export { checkMethodologyTransparency } from './checks/eeat-methodology-transparency.js';

// E-E-A-T: Authoritativeness
export { checkAuthorSocial } from './checks/eeat-author-social.js';
export { checkOrganization } from './checks/eeat-organization.js';
export { checkPublishedWorks } from './checks/eeat-published-works.js';
export { checkExpertSourcing } from './checks/eeat-expert-sourcing.js';
export { checkEditorialReview } from './checks/eeat-editorial-review.js';

// E-E-A-T: Trustworthiness
export { checkSourceQuality } from './checks/eeat-source-quality.js';
export { checkYmylCompliance } from './checks/eeat-ymyl-compliance.js';
export { checkConflictDisclosure } from './checks/eeat-conflict-disclosure.js';
export { checkContentAccuracy } from './checks/eeat-content-accuracy.js';
export { checkCorrectionPolicy } from './checks/eeat-correction-policy.js';
export { checkPrivacySafety } from './checks/eeat-privacy-safety.js';

// E-E-A-T: Meta
export { checkEeatOverallScore } from './checks/eeat-overall-score.js';
export { checkYmylMultiplier } from './checks/eeat-ymyl-multiplier.js';

// Non-E-E-A-T
export { checkPreviouslyUsedKeyphrase } from './checks/previously-used-keyphrase.js';
export { checkKeyphraseEvenDistribution } from './checks/keyphrase-even-distribution.js';
export { checkSingleH1 } from './checks/single-h1.js';
export { checkWordComplexity } from './checks/word-complexity.js';
export { checkInclusiveLanguage } from './checks/inclusive-language.js';
export { checkCompetingLinks } from './checks/competing-links.js';
export { checkContentFreshness } from './checks/content-freshness.js';
export { checkKeyphraseMarkup } from './checks/keyphrase-markup.js';
export { checkHeadlineAnalyzer } from './checks/headline-analyzer.js';
export { checkInboundInternalLinks } from './checks/inbound-internal-links.js';

// Intent: Detection
export { checkIntentKeywordClassification } from './checks/intent-keyword-classification.js';
export { checkIntentSubType } from './checks/intent-sub-type.js';
export { checkIntentModifierAnalysis } from './checks/intent-modifier-analysis.js';
export { checkIntentMultiDetection } from './checks/intent-multi-detection.js';

// Intent: Content Alignment
export { checkIntentContentAlignment } from './checks/intent-content-alignment.js';
export { checkIntentTitleMatch } from './checks/intent-title-match.js';
export { checkIntentMetaMatch } from './checks/intent-meta-match.js';
export { checkIntentHeadingMatch } from './checks/intent-heading-match.js';
export { checkIntentOpeningMatch } from './checks/intent-opening-match.js';
export { checkIntentConclusionMatch } from './checks/intent-conclusion-match.js';

// Intent: Specific Requirements
export { checkIntentInformationalCompleteness } from './checks/intent-informational-completeness.js';
export { checkIntentTransactionalElements } from './checks/intent-transactional-elements.js';
export { checkIntentCommercialElements } from './checks/intent-commercial-elements.js';
export { checkIntentNavigationalClarity } from './checks/intent-navigational-clarity.js';
export { checkIntentFormatMatch } from './checks/intent-format-match.js';

// Intent: Signal Quality
export { checkIntentSignalDensity } from './checks/intent-signal-density.js';
export { checkIntentSignalDistribution } from './checks/intent-signal-distribution.js';
export { checkIntentDepthMatch } from './checks/intent-depth-match.js';
export { checkIntentMixedWarning } from './checks/intent-mixed-warning.js';
export { checkIntentCtaAlignment } from './checks/intent-cta-alignment.js';

// Intent: SERP Features
export { checkIntentSnippetReadiness } from './checks/intent-snippet-readiness.js';
export { checkIntentSchemaReadiness } from './checks/intent-schema-readiness.js';
export { checkIntentPaaCoverage } from './checks/intent-paa-coverage.js';

// Intent: User Journey
export { checkIntentSatisfactionScore } from './checks/intent-satisfaction-score.js';
export { checkIntentFunnelPosition } from './checks/intent-funnel-position.js';
export { checkIntentRelatedCoverage } from './checks/intent-related-coverage.js';
export { checkIntentEngagementSignals } from './checks/intent-engagement-signals.js';

// AEO: Answer Engine Optimization
export { checkAeoDirectAnswer } from './checks/aeo-direct-answer.js';
export { checkAeoFaqSection } from './checks/aeo-faq-section.js';
export { checkAeoFactDensity } from './checks/aeo-fact-density.js';
export { checkAeoTldrSummary } from './checks/aeo-tldr-summary.js';
export { checkAeoConciseAnswers } from './checks/aeo-concise-answers.js';
export { checkAeoStructuredDataHints } from './checks/aeo-structured-data-hints.js';
export { checkAeoCitationReadiness } from './checks/aeo-citation-readiness.js';
export { checkAeoEntityCoverage } from './checks/aeo-entity-coverage.js';

export type {
  CheckId,
  AnalysisConfig,
  ContentAnalysisInput,
  ContentAnalysisOutput,
  AnalysisResult,
  AnalysisStatus,
} from './types.js';
