// @power-seo/content-analysis — Content Analyzer Orchestrator
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, ContentAnalysisOutput, AnalysisResult } from '@power-seo/core';
import type { AnalysisConfig, CheckId } from './types.js';
import { checkTitle } from './checks/title.js';
import { checkMetaDescription } from './checks/meta-description.js';
import { checkKeyphraseUsage } from './checks/keyphrase-usage.js';
import { checkHeadings } from './checks/headings.js';
import { checkWordCount } from './checks/word-count.js';
import { checkImages } from './checks/images.js';
import { checkLinks } from './checks/links.js';
import { checkParagraphLength } from './checks/paragraph-length.js';
import { checkSentenceLength } from './checks/sentence-length.js';
import { checkSubheadingDistribution } from './checks/subheading-distribution.js';
import { checkTransitionWords } from './checks/transition-words.js';
import { checkCanonicalUrl } from './checks/canonical-url.js';
import { checkKeyphraseIntroduction } from './checks/keyphrase-introduction.js';
import { checkKeyphraseSlug } from './checks/keyphrase-slug.js';
import { checkKeyphraseLength } from './checks/keyphrase-length.js';
import { checkTitleReadability } from './checks/title-readability.js';
import { checkKeyphraseTitlePosition } from './checks/keyphrase-title-position.js';
import { checkUrlLength } from './checks/url-length.js';
import { checkTextPresence } from './checks/text-presence.js';
import { checkMediaCount } from './checks/media-count.js';
import { checkTableOfContents } from './checks/table-of-contents.js';
import { checkNofollowLinks } from './checks/nofollow-links.js';
import { checkSecondaryKeyphrases } from './checks/secondary-keyphrases.js';

// E-E-A-T: Experience
import { checkExperienceDepth } from './checks/eeat-experience-depth.js';
import { checkOriginalResearch } from './checks/eeat-original-research.js';
import { checkSpecificityDepth } from './checks/eeat-specificity-depth.js';
import { checkMultimediaEvidence } from './checks/eeat-multimedia-evidence.js';
import { checkCaseStudyPatterns } from './checks/eeat-case-study-patterns.js';

// E-E-A-T: Expertise
import { checkAuthorSchema } from './checks/eeat-author-schema.js';
import { checkTopicalAuthority } from './checks/eeat-topical-authority.js';
import { checkTechnicalVocabulary } from './checks/eeat-technical-vocabulary.js';
import { checkExpertHedging } from './checks/eeat-expert-hedging.js';
import { checkMethodologyTransparency } from './checks/eeat-methodology-transparency.js';

// E-E-A-T: Authoritativeness
import { checkAuthorSocial } from './checks/eeat-author-social.js';
import { checkOrganization } from './checks/eeat-organization.js';
import { checkPublishedWorks } from './checks/eeat-published-works.js';
import { checkExpertSourcing } from './checks/eeat-expert-sourcing.js';
import { checkEditorialReview } from './checks/eeat-editorial-review.js';

// E-E-A-T: Trustworthiness
import { checkSourceQuality } from './checks/eeat-source-quality.js';
import { checkYmylCompliance } from './checks/eeat-ymyl-compliance.js';
import { checkConflictDisclosure } from './checks/eeat-conflict-disclosure.js';
import { checkContentAccuracy } from './checks/eeat-content-accuracy.js';
import { checkCorrectionPolicy } from './checks/eeat-correction-policy.js';
import { checkPrivacySafety } from './checks/eeat-privacy-safety.js';

// E-E-A-T: Meta
import { checkEeatOverallScore } from './checks/eeat-overall-score.js';
import { checkYmylMultiplier } from './checks/eeat-ymyl-multiplier.js';

// Non-E-E-A-T
import { checkPreviouslyUsedKeyphrase } from './checks/previously-used-keyphrase.js';
import { checkKeyphraseEvenDistribution } from './checks/keyphrase-even-distribution.js';
import { checkSingleH1 } from './checks/single-h1.js';
import { checkWordComplexity } from './checks/word-complexity.js';
import { checkInclusiveLanguage } from './checks/inclusive-language.js';
import { checkCompetingLinks } from './checks/competing-links.js';
import { checkContentFreshness } from './checks/content-freshness.js';
import { checkKeyphraseMarkup } from './checks/keyphrase-markup.js';
import { checkHeadlineAnalyzer } from './checks/headline-analyzer.js';
import { checkInboundInternalLinks } from './checks/inbound-internal-links.js';

// Intent: Detection
import { checkIntentKeywordClassification } from './checks/intent-keyword-classification.js';
import { checkIntentSubType } from './checks/intent-sub-type.js';
import { checkIntentModifierAnalysis } from './checks/intent-modifier-analysis.js';
import { checkIntentMultiDetection } from './checks/intent-multi-detection.js';

// Intent: Content Alignment
import { checkIntentContentAlignment } from './checks/intent-content-alignment.js';
import { checkIntentTitleMatch } from './checks/intent-title-match.js';
import { checkIntentMetaMatch } from './checks/intent-meta-match.js';
import { checkIntentHeadingMatch } from './checks/intent-heading-match.js';
import { checkIntentOpeningMatch } from './checks/intent-opening-match.js';
import { checkIntentConclusionMatch } from './checks/intent-conclusion-match.js';

// Intent: Specific Requirements
import { checkIntentInformationalCompleteness } from './checks/intent-informational-completeness.js';
import { checkIntentTransactionalElements } from './checks/intent-transactional-elements.js';
import { checkIntentCommercialElements } from './checks/intent-commercial-elements.js';
import { checkIntentNavigationalClarity } from './checks/intent-navigational-clarity.js';
import { checkIntentFormatMatch } from './checks/intent-format-match.js';

// Intent: Signal Quality
import { checkIntentSignalDensity } from './checks/intent-signal-density.js';
import { checkIntentSignalDistribution } from './checks/intent-signal-distribution.js';
import { checkIntentDepthMatch } from './checks/intent-depth-match.js';
import { checkIntentMixedWarning } from './checks/intent-mixed-warning.js';
import { checkIntentCtaAlignment } from './checks/intent-cta-alignment.js';

// Intent: SERP Features
import { checkIntentSnippetReadiness } from './checks/intent-snippet-readiness.js';
import { checkIntentSchemaReadiness } from './checks/intent-schema-readiness.js';
import { checkIntentPaaCoverage } from './checks/intent-paa-coverage.js';

// Intent: User Journey
import { checkIntentSatisfactionScore } from './checks/intent-satisfaction-score.js';
import { checkIntentFunnelPosition } from './checks/intent-funnel-position.js';
import { checkIntentRelatedCoverage } from './checks/intent-related-coverage.js';
import { checkIntentEngagementSignals } from './checks/intent-engagement-signals.js';

// AEO: Answer Engine Optimization
import { checkAeoDirectAnswer } from './checks/aeo-direct-answer.js';
import { checkAeoFaqSection } from './checks/aeo-faq-section.js';
import { checkAeoFactDensity } from './checks/aeo-fact-density.js';
import { checkAeoTldrSummary } from './checks/aeo-tldr-summary.js';
import { checkAeoConciseAnswers } from './checks/aeo-concise-answers.js';
import { checkAeoStructuredDataHints } from './checks/aeo-structured-data-hints.js';
import { checkAeoCitationReadiness } from './checks/aeo-citation-readiness.js';
import { checkAeoEntityCoverage } from './checks/aeo-entity-coverage.js';

/** Options for {@link analyzeContent}. Extends {@link AnalysisConfig} for backward compatibility. */
export interface AnalyzeOptions extends AnalysisConfig {
  /** Reference date for freshness calculations — inject a fixed date in tests. */
  now?: Date;
}

/**
 * Run all SEO content analysis checks and return aggregated results.
 *
 * @example
 * ```ts
 * const output = analyzeContent({
 *   title: 'My Blog Post',
 *   metaDescription: 'A description of my blog post about SEO.',
 *   content: '<h1>My Blog Post</h1><p>Content goes here...</p>',
 *   focusKeyphrase: 'blog post',
 * });
 * console.log(output.score, output.maxScore, output.recommendations);
 * ```
 */
export function analyzeContent(
  input: ContentAnalysisInput,
  options?: AnalyzeOptions,
): ContentAnalysisOutput {
  const disabled = new Set<CheckId>(options?.disabledChecks ?? []);

  const allResults: AnalysisResult[] = [];

  // Run each check group and collect results
  const titleResults = checkTitle(input);
  const metaResults = checkMetaDescription(input);
  const keyphraseResults = checkKeyphraseUsage(input);
  const headingResults = checkHeadings(input);
  const wordCountResult = checkWordCount(input);
  const imageResults = checkImages(input);
  const linkResults = checkLinks(input);
  const paragraphResult = checkParagraphLength(input);
  const sentenceResult = checkSentenceLength(input);
  const subheadingResult = checkSubheadingDistribution(input);
  const transitionResult = checkTransitionWords(input);
  const canonicalResult = checkCanonicalUrl(input);
  const keyphraseIntroductionResult = checkKeyphraseIntroduction(input);
  const keyphraseSlugResult = checkKeyphraseSlug(input);
  const keyphraseLengthResult = checkKeyphraseLength(input);
  const titleReadabilityResults = checkTitleReadability(input);
  const keyphraseTitlePositionResult = checkKeyphraseTitlePosition(input);
  const urlLengthResult = checkUrlLength(input);
  const textPresenceResult = checkTextPresence(input);
  const mediaCountResult = checkMediaCount(input);
  const tableOfContentsResult = checkTableOfContents(input);
  const nofollowLinksResult = checkNofollowLinks(input);
  const secondaryKeyphrasesResults = checkSecondaryKeyphrases(input);

  // E-E-A-T: Experience
  const experienceDepthResult = checkExperienceDepth(input);
  const originalResearchResult = checkOriginalResearch(input);
  const specificityDepthResult = checkSpecificityDepth(input);
  const multimediaEvidenceResult = checkMultimediaEvidence(input);
  const caseStudyResult = checkCaseStudyPatterns(input);

  // E-E-A-T: Expertise
  const authorSchemaResult = checkAuthorSchema(input);
  const topicalAuthorityResult = checkTopicalAuthority(input);
  const technicalVocabularyResult = checkTechnicalVocabulary(input);
  const expertHedgingResult = checkExpertHedging(input);
  const methodologyResult = checkMethodologyTransparency(input);

  // E-E-A-T: Authoritativeness
  const authorSocialResult = checkAuthorSocial(input);
  const organizationResult = checkOrganization(input);
  const publishedWorksResult = checkPublishedWorks(input);
  const expertSourcingResult = checkExpertSourcing(input);
  const editorialReviewResult = checkEditorialReview(input);

  // E-E-A-T: Trustworthiness
  const sourceQualityResult = checkSourceQuality(input);
  const ymylComplianceResult = checkYmylCompliance(input);
  const conflictDisclosureResult = checkConflictDisclosure(input);
  const contentAccuracyResult = checkContentAccuracy(input);
  const correctionPolicyResult = checkCorrectionPolicy(input);
  const privacySafetyResult = checkPrivacySafety(input);

  // E-E-A-T: Meta
  const eeatOverallResult = checkEeatOverallScore(input);
  const ymylMultiplierResult = checkYmylMultiplier(input);

  // Non-E-E-A-T
  const previouslyUsedKeyphraseResult = checkPreviouslyUsedKeyphrase(input);
  const keyphraseEvenDistributionResult = checkKeyphraseEvenDistribution(input);
  const singleH1Result = checkSingleH1(input);
  const wordComplexityResult = checkWordComplexity(input);
  const inclusiveLanguageResult = checkInclusiveLanguage(input);
  const competingLinksResult = checkCompetingLinks(input);
  const contentFreshnessResult = checkContentFreshness(input, options?.now ?? new Date());
  const keyphraseMarkupResult = checkKeyphraseMarkup(input);
  const headlineAnalyzerResult = checkHeadlineAnalyzer(input);
  const inboundInternalLinksResult = checkInboundInternalLinks(input);

  // Intent: Detection
  const intentKeywordClassificationResult = checkIntentKeywordClassification(input);
  const intentSubTypeResult = checkIntentSubType(input);
  const intentModifierAnalysisResult = checkIntentModifierAnalysis(input);
  const intentMultiDetectionResult = checkIntentMultiDetection(input);

  // Intent: Content Alignment
  const intentContentAlignmentResult = checkIntentContentAlignment(input);
  const intentTitleMatchResult = checkIntentTitleMatch(input);
  const intentMetaMatchResult = checkIntentMetaMatch(input);
  const intentHeadingMatchResult = checkIntentHeadingMatch(input);
  const intentOpeningMatchResult = checkIntentOpeningMatch(input);
  const intentConclusionMatchResult = checkIntentConclusionMatch(input);

  // Intent: Specific Requirements
  const intentInformationalResult = checkIntentInformationalCompleteness(input);
  const intentTransactionalResult = checkIntentTransactionalElements(input);
  const intentCommercialResult = checkIntentCommercialElements(input);
  const intentNavigationalResult = checkIntentNavigationalClarity(input);
  const intentFormatMatchResult = checkIntentFormatMatch(input);

  // Intent: Signal Quality
  const intentSignalDensityResult = checkIntentSignalDensity(input);
  const intentSignalDistributionResult = checkIntentSignalDistribution(input);
  const intentDepthMatchResult = checkIntentDepthMatch(input);
  const intentMixedWarningResult = checkIntentMixedWarning(input);
  const intentCtaAlignmentResult = checkIntentCtaAlignment(input);

  // Intent: SERP Features
  const intentSnippetReadinessResult = checkIntentSnippetReadiness(input);
  const intentSchemaReadinessResult = checkIntentSchemaReadiness(input);
  const intentPaaCoverageResult = checkIntentPaaCoverage(input);

  // Intent: User Journey
  const intentSatisfactionResult = checkIntentSatisfactionScore(input);
  const intentFunnelPositionResult = checkIntentFunnelPosition(input);
  const intentRelatedCoverageResult = checkIntentRelatedCoverage(input);
  const intentEngagementSignalsResult = checkIntentEngagementSignals(input);

  // AEO: Answer Engine Optimization
  const aeoDirectAnswerResult = checkAeoDirectAnswer(input);
  const aeoFaqSectionResult = checkAeoFaqSection(input);
  const aeoFactDensityResult = checkAeoFactDensity(input);
  const aeoTldrSummaryResult = checkAeoTldrSummary(input);
  const aeoConciseAnswersResult = checkAeoConciseAnswers(input);
  const aeoStructuredDataResult = checkAeoStructuredDataHints(input);
  const aeoCitationResult = checkAeoCitationReadiness(input);
  const aeoEntityResult = checkAeoEntityCoverage(input);

  // Flatten all results
  const candidateResults = [
    ...titleResults,
    ...metaResults,
    ...keyphraseResults,
    ...headingResults,
    wordCountResult,
    ...imageResults,
    ...linkResults,
    paragraphResult,
    sentenceResult,
    subheadingResult,
    transitionResult,
    canonicalResult,
    keyphraseIntroductionResult,
    keyphraseSlugResult,
    keyphraseLengthResult,
    ...titleReadabilityResults,
    keyphraseTitlePositionResult,
    urlLengthResult,
    textPresenceResult,
    mediaCountResult,
    tableOfContentsResult,
    nofollowLinksResult,
    ...secondaryKeyphrasesResults,
    // E-E-A-T: Experience
    experienceDepthResult,
    originalResearchResult,
    specificityDepthResult,
    multimediaEvidenceResult,
    caseStudyResult,
    // E-E-A-T: Expertise
    authorSchemaResult,
    topicalAuthorityResult,
    technicalVocabularyResult,
    expertHedgingResult,
    methodologyResult,
    // E-E-A-T: Authoritativeness
    authorSocialResult,
    organizationResult,
    publishedWorksResult,
    expertSourcingResult,
    editorialReviewResult,
    // E-E-A-T: Trustworthiness
    sourceQualityResult,
    ymylComplianceResult,
    conflictDisclosureResult,
    contentAccuracyResult,
    correctionPolicyResult,
    privacySafetyResult,
    // E-E-A-T: Meta
    eeatOverallResult,
    ymylMultiplierResult,
    // Non-E-E-A-T
    previouslyUsedKeyphraseResult,
    keyphraseEvenDistributionResult,
    singleH1Result,
    wordComplexityResult,
    inclusiveLanguageResult,
    competingLinksResult,
    contentFreshnessResult,
    keyphraseMarkupResult,
    headlineAnalyzerResult,
    inboundInternalLinksResult,
    // Intent: Detection
    intentKeywordClassificationResult,
    intentSubTypeResult,
    intentModifierAnalysisResult,
    intentMultiDetectionResult,
    // Intent: Content Alignment
    intentContentAlignmentResult,
    intentTitleMatchResult,
    intentMetaMatchResult,
    intentHeadingMatchResult,
    intentOpeningMatchResult,
    intentConclusionMatchResult,
    // Intent: Specific Requirements
    intentInformationalResult,
    intentTransactionalResult,
    intentCommercialResult,
    intentNavigationalResult,
    intentFormatMatchResult,
    // Intent: Signal Quality
    intentSignalDensityResult,
    intentSignalDistributionResult,
    intentDepthMatchResult,
    intentMixedWarningResult,
    intentCtaAlignmentResult,
    // Intent: SERP Features
    intentSnippetReadinessResult,
    intentSchemaReadinessResult,
    intentPaaCoverageResult,
    // Intent: User Journey
    intentSatisfactionResult,
    intentFunnelPositionResult,
    intentRelatedCoverageResult,
    intentEngagementSignalsResult,
    // AEO: Answer Engine Optimization
    aeoDirectAnswerResult,
    aeoFaqSectionResult,
    aeoFactDensityResult,
    aeoTldrSummaryResult,
    aeoConciseAnswersResult,
    aeoStructuredDataResult,
    aeoCitationResult,
    aeoEntityResult,
  ];

  // Filter out disabled checks
  for (const result of candidateResults) {
    if (!disabled.has(result.id as CheckId)) {
      allResults.push(result);
    }
  }

  // Sum scores — exclude 'na' (not applicable) checks from both score and maxScore
  const applicableResults = allResults.filter((r) => r.status !== 'na');
  const score = applicableResults.reduce((sum, r) => sum + r.score, 0);
  const maxScore = applicableResults.reduce((sum, r) => sum + r.maxScore, 0);

  // Generate recommendations from poor/ok results (exclude 'na')
  const recommendations = applicableResults
    .filter((r) => r.status === 'poor' || r.status === 'ok')
    .map((r) => r.description);

  return {
    score,
    maxScore,
    results: allResults,
    recommendations,
  };
}
