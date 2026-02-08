# @ccbd-seo/ai

> LLM-agnostic prompt templates and response parsers for AI-assisted SEO.

Works with any LLM — OpenAI, Anthropic, Google, local models. No SDK dependency; prompt builders return `{ system, user, maxTokens }`, parsers accept raw response strings.

## Installation

```bash
npm install @ccbd-seo/ai @ccbd-seo/core
```

## Usage

### Meta Description Generation

```ts
import { buildMetaDescriptionPrompt, parseMetaDescriptionResponse } from '@ccbd-seo/ai';

const prompt = buildMetaDescriptionPrompt({
  title: 'Best Coffee Shops in NYC',
  content: 'Article content here...',
  keyphrase: 'coffee shops nyc',
});

// Send prompt.system + prompt.user to any LLM
const llmResponse = await yourLLM.chat(prompt);

const result = parseMetaDescriptionResponse(llmResponse);
// { descriptions: [{ text, charCount, pixelWidth }] }
```

### Title Generation

```ts
import { buildTitlePrompt, parseTitleResponse } from '@ccbd-seo/ai';

const prompt = buildTitlePrompt({
  content: 'Article about React SEO best practices...',
  keyphrase: 'react seo',
});

const result = parseTitleResponse(llmResponse);
// { titles: [{ text, charCount, pixelWidth }] }
```

### Content Suggestions

```ts
import { buildContentSuggestionsPrompt, parseContentSuggestionsResponse } from '@ccbd-seo/ai';

const prompt = buildContentSuggestionsPrompt({
  title: 'React SEO Guide',
  content: '<p>Your article HTML...</p>',
  keyphrase: 'react seo',
});

const suggestions = parseContentSuggestionsResponse(llmResponse);
// [{ type, suggestion, priority }]
```

### SERP Feature Prediction

```ts
import { analyzeSerpEligibility, buildSerpPredictionPrompt } from '@ccbd-seo/ai';

// Rule-based (no LLM needed — free)
const eligibility = analyzeSerpEligibility({
  title: 'How to Make Coffee',
  content: '<h2>Step 1</h2><p>...</p>',
  schema: { '@type': 'HowTo' },
});
// Checks FAQ, HowTo, Product, Article eligibility deterministically

// LLM-enhanced (more detailed predictions)
const prompt = buildSerpPredictionPrompt({ title: '...', content: '...' });
```

## API Reference

### Prompt / Parser Pairs

- `buildMetaDescriptionPrompt(input)` / `parseMetaDescriptionResponse(text)` — Meta description generation
- `buildTitlePrompt(input)` / `parseTitleResponse(text)` — SEO title generation
- `buildContentSuggestionsPrompt(input)` / `parseContentSuggestionsResponse(text)` — Content improvements
- `buildSerpPredictionPrompt(input)` / `parseSerpPredictionResponse(text)` — SERP feature prediction

### Rule-Based Analysis

- `analyzeSerpEligibility(input)` — Deterministic SERP feature eligibility check (no LLM required)

### Types

```ts
import type {
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
} from '@ccbd-seo/ai';
```

## License

[MIT](../../LICENSE)
