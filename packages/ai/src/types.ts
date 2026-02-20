// ============================================================================
// @power-seo/ai — Types
// ============================================================================

export interface PromptTemplate {
  system: string;
  user: string;
  maxTokens?: number;
}

export interface MetaDescriptionInput {
  title: string;
  content: string;
  focusKeyphrase?: string;
  tone?: string;
  maxLength?: number;
}

export interface MetaDescriptionResult {
  description: string;
  charCount: number;
  pixelWidth: number;
  isValid: boolean;
  validationMessage?: string;
}

export interface ContentSuggestionInput {
  title: string;
  content: string;
  focusKeyphrase?: string;
  analysisResults?: string;
}

export type ContentSuggestionType = 'heading' | 'paragraph' | 'keyword' | 'link';

export interface ContentSuggestion {
  type: ContentSuggestionType;
  suggestion: string;
  priority: number;
  reason?: string;
}

export type SerpFeature =
  | 'featured-snippet'
  | 'faq-rich-result'
  | 'how-to'
  | 'product'
  | 'review'
  | 'video'
  | 'image-pack'
  | 'local-pack'
  | 'sitelinks';

export interface SerpFeatureInput {
  title: string;
  content: string;
  schema?: string[];
  contentType?: string;
}

export interface SerpFeaturePrediction {
  feature: SerpFeature;
  likelihood: number;
  requirements: string[];
  met: string[];
}

export interface TitleInput {
  content: string;
  focusKeyphrase?: string;
  tone?: string;
}

export interface TitleResult {
  title: string;
  charCount: number;
  pixelWidth: number;
}
