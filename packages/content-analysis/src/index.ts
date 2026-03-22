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

export type {
  CheckId,
  AnalysisConfig,
  ContentAnalysisInput,
  ContentAnalysisOutput,
  AnalysisResult,
  AnalysisStatus,
} from './types.js';
