// ============================================================================
// @ccbd-seo/readability — Types
// ============================================================================

export type {
  ReadabilityInput,
  ReadabilityOutput,
  TextStatistics,
  AnalysisResult,
  AnalysisStatus,
} from '@ccbd-seo/core';

/** Individual algorithm result. */
export interface AlgorithmScore {
  name: string;
  score: number;
  grade?: string;
  description: string;
}
