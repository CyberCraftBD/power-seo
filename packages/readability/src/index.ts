// @power-seo/readability — Public API
// ----------------------------------------------------------------------------

export { analyzeReadability } from './analyzer.js';
export { fleschReadingEase, fleschKincaidGrade } from './algorithms/flesch-kincaid.js';
export { gunningFog } from './algorithms/gunning-fog.js';
export { colemanLiau } from './algorithms/coleman-liau.js';
export { automatedReadability } from './algorithms/automated-readability.js';

export type {
  ReadabilityInput,
  ReadabilityOutput,
  TextStatistics,
  AnalysisResult,
  AnalysisStatus,
  AlgorithmScore,
} from './types.js';
