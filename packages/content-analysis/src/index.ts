// ============================================================================
// @power-seo/content-analysis — Public API
// ============================================================================

export { analyzeContent } from './analyzer.js';
export { checkTitle } from './checks/title.js';
export { checkMetaDescription } from './checks/meta-description.js';
export { checkKeyphraseUsage } from './checks/keyphrase-usage.js';
export { checkHeadings } from './checks/headings.js';
export { checkWordCount } from './checks/word-count.js';
export { checkImages } from './checks/images.js';
export { checkLinks } from './checks/links.js';

export type {
  CheckId,
  AnalysisConfig,
  ContentAnalysisInput,
  ContentAnalysisOutput,
  AnalysisResult,
  AnalysisStatus,
} from './types.js';
