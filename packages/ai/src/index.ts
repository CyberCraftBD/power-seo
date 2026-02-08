// ============================================================================
// @ccbd-seo/ai — Public API
// ============================================================================

export { buildMetaDescriptionPrompt, parseMetaDescriptionResponse } from './prompts/meta-description.js';
export { buildContentSuggestionsPrompt, parseContentSuggestionsResponse } from './prompts/content-suggestions.js';
export { buildSerpPredictionPrompt, parseSerpPredictionResponse, analyzeSerpEligibility } from './prompts/serp-prediction.js';
export { buildTitlePrompt, parseTitleResponse } from './prompts/title-generation.js';

export type {
  PromptTemplate,
  MetaDescriptionInput,
  MetaDescriptionResult,
  ContentSuggestionInput,
  ContentSuggestionType,
  ContentSuggestion,
  SerpFeature,
  SerpFeatureInput,
  SerpFeaturePrediction,
  TitleInput,
  TitleResult,
} from './types.js';
