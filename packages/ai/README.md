# @power-seo/ai

![AI-assisted SEO toolkit banner — LLM-agnostic prompt builders and response parsers for meta descriptions, titles, and SERP features](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/banner.svg)

LLM-agnostic SEO prompt builders and structured response parsers — works with OpenAI, Anthropic Claude, Google Gemini, Mistral, and any other provider.

[![npm version](https://img.shields.io/npm/v/@power-seo/ai)](https://www.npmjs.com/package/@power-seo/ai)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/ai)](https://www.npmjs.com/package/@power-seo/ai)
[![Socket](https://socket.dev/api/badge/npm/package/@power-seo/ai)](https://socket.dev/npm/package/@power-seo/ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/ai)

[`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai) is a TypeScript library of SEO prompt templates and response parsers for developers who want AI-assisted meta descriptions, title tags, content suggestions, and SERP feature predictions without coupling their code to one LLM vendor. Prompt builders return a plain `{ system, user, maxTokens }` object you pass to whatever LLM client you already use; parsers turn the raw text response back into typed results. No LLM SDK is bundled, no API keys are managed, and this package makes no network calls itself.

![How @power-seo/ai works — build a provider-agnostic prompt, send it with your own LLM client, parse the raw response into typed SEO results](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/header.svg)

One export needs no LLM at all: `analyzeSerpEligibility` is a fully deterministic, rule-based check that inspects a page's content structure and schema markup to score its eligibility for FAQ, How-To, Product, Review, Video, and Featured Snippet SERP features — free to run on every build.

---

## Why @power-seo/ai?

|                      | Without                     | With                                                          |
| -------------------- | --------------------------- | ------------------------------------------------------------- |
| Meta descriptions    | ❌ Write manually           | ✅ LLM-generated candidate validated against real SERP limits |
| Title optimization   | ❌ Guesswork                | ✅ 5 keyphrase-focused variants with char + pixel metadata    |
| Content gaps         | ❌ Manually identified      | ✅ Typed, prioritized AI improvement suggestions              |
| SERP eligibility     | ❌ Unknown                  | ✅ Rule-based + LLM prediction with likelihood scores         |
| Provider flexibility | ❌ Vendor-locked to one SDK | ✅ Any LLM: OpenAI, Claude, Gemini, Mistral, Ollama           |
| Structured output    | ❌ Ad-hoc raw text parsing  | ✅ Parsers handle JSON, code fences, and numbered lists       |
| CI integration       | ❌ Manual review            | ✅ Deterministic SERP eligibility check with zero API cost    |

![Before and after workflow comparison: manual SEO copywriting versus an automated pipeline built with power-seo ai prompt builders and parsers](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/roi.svg)

---

## Features

- **LLM-agnostic design** — prompt builders return `{ system, user, maxTokens }`; parsers accept raw text strings; no SDK bundled
- **Works with any provider** — OpenAI, Anthropic Claude, Google Gemini, Mistral, Cohere, local Ollama models, or any HTTP-based LLM
- **Meta description generation** — `buildMetaDescriptionPrompt` targets a configurable character limit (default 160) with focus keyphrase and call-to-action; `parseMetaDescriptionResponse` returns the candidate with character count, estimated pixel width, and validation status from `@power-seo/core`
- **SEO title generation** — `buildTitlePrompt` requests 5 title tag variants capped at 60 characters each; `parseTitleResponse` accepts JSON arrays or numbered lists and returns `TitleResult[]`
- **Content improvement suggestions** — `buildContentSuggestionsPrompt` includes word count and prior analysis context; `parseContentSuggestionsResponse` returns typed suggestions for headings, paragraphs, keywords, and links with 1–5 priority
- **SERP feature prediction** — `buildSerpPredictionPrompt` / `parseSerpPredictionResponse` predict eligibility across 9 SERP features with likelihood scores, requirements, and met criteria
- **Rule-based SERP eligibility** — `analyzeSerpEligibility` is deterministic: no LLM, no cost, instant; scores FAQ, How-To, Product, Review, Video, and Featured Snippet eligibility from schema markup and content patterns
- **Robust output parsing** — parsers strip surrounding quotes, unwrap markdown code fences, fall back from JSON to numbered-list parsing, and return empty arrays instead of throwing on malformed responses
- **Character and pixel width metadata** — generated titles and descriptions include `charCount` and `pixelWidth` computed with the same font-width tables used by [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview)
- **Type-safe throughout** — every input, output, and union (`ContentSuggestionType`, `SerpFeature`) is exported
- **Zero third-party runtime dependencies** — depends only on [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)

![AI content suggestions UI concept — prioritized heading, paragraph, keyword, and link improvements rendered from typed parser output](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/suggestions-ui.svg)

---

## Comparison

| Feature                          | @power-seo/ai | LangChain | Vercel AI SDK | Custom prompts |
| -------------------------------- | :-----------: | :-------: | :-----------: | :------------: |
| SEO-specific prompt templates    |      ✅       |    ❌     |      ❌       |     Manual     |
| Provider-agnostic prompt objects |      ✅       |  Partial  |      ❌       |       ❌       |
| Structured SEO response parsers  |      ✅       |  Partial  |    Partial    |     Manual     |
| Rule-based SERP eligibility      |      ✅       |    ❌     |      ❌       |       ❌       |
| Char + pixel width metadata      |      ✅       |    ❌     |      ❌       |       ❌       |
| Zero LLM SDK dependencies        |      ✅       |    ❌     |      ❌       |       ✅       |
| TypeScript-first                 |      ✅       |  Partial  |      ✅       |       —        |
| Tree-shakeable                   |      ✅       |    ❌     |    Partial    |       —        |

![Comparison of @power-seo/ai with LangChain, Vercel AI SDK, and hand-written prompts for SEO tasks](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/comparison.svg)

---

## Installation

```bash
npm install @power-seo/ai
```

```bash
yarn add @power-seo/ai
```

```bash
pnpm add @power-seo/ai
```

Requires Node.js 18 or newer. Ships dual ESM + CJS builds with TypeScript declarations.

---

## Usage

Every workflow follows the same three steps: build a prompt, send it with your own LLM client, parse the raw text that comes back.

### How do I generate an SEO meta description with an LLM?

Call `buildMetaDescriptionPrompt` with the page title, content, and optional focus keyphrase. It returns a `PromptTemplate` with a system role, a user message (content is excerpted to the first 500 characters), and a `maxTokens` budget of 200. Send those to any chat-completion API, then pass the model's raw reply to `parseMetaDescriptionResponse`, which strips surrounding quotes and validates the result against real Google SERP limits — 160 characters and 920 pixels by default, via `@power-seo/core`.

```ts
import { buildMetaDescriptionPrompt, parseMetaDescriptionResponse } from '@power-seo/ai';
import type { MetaDescriptionResult } from '@power-seo/ai';

const prompt = buildMetaDescriptionPrompt({
  title: 'How to Optimize React Apps for SEO',
  content: 'Full article HTML or plain text about React SEO strategies...',
  focusKeyphrase: 'react seo optimization',
});
// { system: 'You are an expert SEO specialist...', user: 'Write a compelling meta description...', maxTokens: 200 }

const rawResponse = await yourLLM.complete(prompt.system, prompt.user, prompt.maxTokens);
const result: MetaDescriptionResult = parseMetaDescriptionResponse(rawResponse);

console.log(`"${result.description}"`);
console.log(`  ${result.charCount} characters, ~${result.pixelWidth}px`);
console.log(`  Valid: ${result.isValid}`);
if (result.validationMessage) console.log(`  Message: ${result.validationMessage}`);
```

### How do I generate SEO title tags with AI?

`buildTitlePrompt` asks the model for 5 title variants — question, how-to, list, benefit, and action approaches — each capped at 60 characters, with the focus keyphrase placed near the beginning. `parseTitleResponse` accepts either a JSON array (of strings or `{ title }` objects) or a numbered list (`1. Title`) and returns each candidate with its character count and estimated pixel width, so you can filter to titles that fit Google's display limits.

```ts
import { buildTitlePrompt, parseTitleResponse } from '@power-seo/ai';
import type { TitleResult } from '@power-seo/ai';

const prompt = buildTitlePrompt({
  content: 'Article about the best tools for keyword research...',
  focusKeyphrase: 'keyword research tools',
  tone: 'informative',
});

const rawResponse = await yourLLM.complete(prompt.system, prompt.user, prompt.maxTokens);
const results: TitleResult[] = parseTitleResponse(rawResponse);

results.forEach(({ title, charCount }, i) => {
  const status = charCount <= 60 ? 'OK' : 'TOO LONG';
  console.log(`${i + 1}. "${title}" — ${charCount} chars [${status}]`);
});
```

### How do I get AI content improvement suggestions?

`buildContentSuggestionsPrompt` strips HTML from the content, includes the word count and an 800-character excerpt, and can carry prior analysis results (for example a score from [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis)) so the model targets known weaknesses. `parseContentSuggestionsResponse` unwraps markdown code fences, parses the JSON array, filters out malformed entries, and returns `ContentSuggestion[]` — or an empty array if the response is unusable, never an exception.

```ts
import { buildContentSuggestionsPrompt, parseContentSuggestionsResponse } from '@power-seo/ai';
import type { ContentSuggestion } from '@power-seo/ai';

const prompt = buildContentSuggestionsPrompt({
  title: 'React SEO Best Practices',
  content: '<h1>React SEO</h1><p>React is a JavaScript library...</p>',
  focusKeyphrase: 'react seo best practices',
  analysisResults: 'Current score: 58/100. Missing headings structure.',
});

const rawResponse = await yourLLM.complete(prompt.system, prompt.user, prompt.maxTokens);
const suggestions: ContentSuggestion[] = parseContentSuggestionsResponse(rawResponse);

suggestions.forEach(({ type, suggestion, priority }) => {
  console.log(`[Priority ${priority}] ${type}: ${suggestion}`);
});
```

| Suggestion type | Description                                    |
| --------------- | ---------------------------------------------- |
| `heading`       | Heading structure improvements and additions   |
| `paragraph`     | Paragraph content improvements and rewrites    |
| `keyword`       | Keyphrase density and placement optimization   |
| `link`          | Internal linking opportunities and suggestions |

### How do I predict SERP features with an LLM?

`buildSerpPredictionPrompt` sends the page title, an 800-character content excerpt, any schema.org types present, and an optional content-type hint. The model returns a JSON array that `parseSerpPredictionResponse` validates into `SerpFeaturePrediction[]` — one entry per feature with a 0–1 likelihood, the requirements for that feature, and which requirements the page already meets. Nine features are covered: `featured-snippet`, `faq-rich-result`, `how-to`, `product`, `review`, `video`, `image-pack`, `local-pack`, and `sitelinks`.

```ts
import { buildSerpPredictionPrompt, parseSerpPredictionResponse } from '@power-seo/ai';
import type { SerpFeaturePrediction } from '@power-seo/ai';

const prompt = buildSerpPredictionPrompt({
  title: 'How to Make Cold Brew Coffee at Home',
  content: '<h1>Cold Brew Coffee</h1><h2>Step 1: Grind the Coffee</h2><p>...</p>',
  schema: ['HowTo', 'Recipe'],
  contentType: 'guide',
});

const rawResponse = await yourLLM.complete(prompt.system, prompt.user, prompt.maxTokens);
const predictions: SerpFeaturePrediction[] = parseSerpPredictionResponse(rawResponse);

predictions.forEach(({ feature, likelihood, met }) => {
  console.log(`${feature}: ${(likelihood * 100).toFixed(0)}% — met: ${met.join(', ')}`);
});
```

### How do I check SERP eligibility without an LLM?

Use `analyzeSerpEligibility`. It is entirely deterministic — no API call, no cost, no variance between runs — which makes it safe for CI pipelines. It scores six features from a 0.1 baseline: matching schema markup adds 0.4 (FAQ, How-To) or 0.5 (Product, Review, Video), question or step patterns in the content add 0.3, and Featured Snippet eligibility adds 0.1 each for a 300+ word count and h2–h4 heading structure.

```ts
import { analyzeSerpEligibility } from '@power-seo/ai';

// How-To: HowTo schema (+0.4) plus step-sequence wording (+0.3)
const howto = analyzeSerpEligibility({
  title: 'How to Install Node.js on Ubuntu',
  content: '<p>First, update apt. Next, install nvm. Finally, verify the version.</p>',
  schema: ['HowTo'],
});
// Includes: { feature: 'how-to', likelihood: 0.8, requirements: [...], met: ['HowTo schema markup', 'Step-by-step content'] }

// FAQ: FAQPage schema (+0.4) plus question-pattern content (+0.3)
const faq = analyzeSerpEligibility({
  title: 'React SEO FAQ',
  content: '<h2>What is React SEO?</h2><p>...</p><h2>How to add meta tags?</h2><p>...</p>',
  schema: ['FAQPage'],
});
// Includes: { feature: 'faq-rich-result', likelihood: 0.8, requirements: [...], met: [...] }
```

### How do I use @power-seo/ai with OpenAI, Claude, or Gemini?

The same `PromptTemplate` maps onto every provider's chat API: `system` becomes the system message or parameter, `user` becomes the user message, and `maxTokens` becomes the token budget. Swap providers without changing any prompt or parsing code.

![LLM-agnostic benefit — one SEO prompt template works unchanged across OpenAI, Anthropic Claude, Google Gemini, and local models](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/llm-agnostic-benefit.svg)

```ts
import { buildMetaDescriptionPrompt, parseMetaDescriptionResponse } from '@power-seo/ai';

const prompt = buildMetaDescriptionPrompt({
  title: 'My Article',
  content: '...',
  focusKeyphrase: 'my topic',
});

// OpenAI
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openaiResponse = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: prompt.system },
    { role: 'user', content: prompt.user },
  ],
  max_tokens: prompt.maxTokens,
});
const result = parseMetaDescriptionResponse(openaiResponse.choices[0].message.content ?? '');

// Anthropic Claude
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const claudeResponse = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  system: prompt.system,
  messages: [{ role: 'user', content: prompt.user }],
  max_tokens: prompt.maxTokens ?? 200,
});
const result2 = parseMetaDescriptionResponse(
  claudeResponse.content[0].type === 'text' ? claudeResponse.content[0].text : '',
);

// Google Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({ model: 'gemini-1.5-pro' });
const geminiResponse = await model.generateContent(`${prompt.system}\n\n${prompt.user}`);
const result3 = parseMetaDescriptionResponse(geminiResponse.response.text());
```

---

## API Reference

Prompt budgets and excerpt limits (verified from source):

| Builder                         | Content excerpt limit | `maxTokens` | Parser return type        |
| ------------------------------- | --------------------- | ----------- | ------------------------- |
| `buildMetaDescriptionPrompt`    | 500 characters        | 200         | `MetaDescriptionResult`   |
| `buildTitlePrompt`              | 500 characters        | 500         | `TitleResult[]`           |
| `buildContentSuggestionsPrompt` | 800 characters        | 1000        | `ContentSuggestion[]`     |
| `buildSerpPredictionPrompt`     | 800 characters        | 1000        | `SerpFeaturePrediction[]` |

![Structured response parsing — quotes stripped, code fences unwrapped, JSON validated, numbered lists handled as fallback](https://raw.githubusercontent.com/CyberCraftBD/power-seo/main/image/ai/parsing-accuracy.svg)

### `buildMetaDescriptionPrompt(input)` / `parseMetaDescriptionResponse(text)`

| Parameter              | Type     | Default  | Description                        |
| ---------------------- | -------- | -------- | ---------------------------------- |
| `input.title`          | `string` | required | Page title for context             |
| `input.content`        | `string` | required | Page content (HTML or plain text)  |
| `input.focusKeyphrase` | `string` | —        | Focus keyphrase to include         |
| `input.maxLength`      | `number` | `160`    | Maximum character length requested |
| `input.tone`           | `string` | —        | Tone hint for the LLM              |

`buildMetaDescriptionPrompt` returns `PromptTemplate`. `parseMetaDescriptionResponse(text)` returns `MetaDescriptionResult` — validation uses `validateMetaDescription` and `calculatePixelWidth` from `@power-seo/core` (limits: 160 characters, 920 px).

### `buildTitlePrompt(input)` / `parseTitleResponse(text)`

| Parameter              | Type     | Default  | Description                   |
| ---------------------- | -------- | -------- | ----------------------------- |
| `input.content`        | `string` | required | Page content for context      |
| `input.focusKeyphrase` | `string` | —        | Focus keyphrase for the title |
| `input.tone`           | `string` | —        | Tone hint for the LLM         |

`buildTitlePrompt` returns `PromptTemplate` requesting 5 variants of at most 60 characters. `parseTitleResponse(text)` returns `TitleResult[]`; it tries JSON first, then falls back to numbered-list parsing (`1. Title` / `1) Title`).

### `buildContentSuggestionsPrompt(input)` / `parseContentSuggestionsResponse(text)`

| Parameter               | Type     | Default  | Description                        |
| ----------------------- | -------- | -------- | ---------------------------------- |
| `input.title`           | `string` | required | Page title                         |
| `input.content`         | `string` | required | Page HTML or plain text content    |
| `input.focusKeyphrase`  | `string` | —        | Focus keyphrase                    |
| `input.analysisResults` | `string` | —        | Prior analysis results for context |

`buildContentSuggestionsPrompt` returns `PromptTemplate`. `parseContentSuggestionsResponse(text)` returns `ContentSuggestion[]`; entries missing a valid `type`, `suggestion`, or numeric `priority` are filtered out, and malformed responses yield `[]`.

### `buildSerpPredictionPrompt(input)` / `parseSerpPredictionResponse(text)`

| Parameter           | Type       | Default  | Description                              |
| ------------------- | ---------- | -------- | ---------------------------------------- |
| `input.title`       | `string`   | required | Page title                               |
| `input.content`     | `string`   | required | Page content                             |
| `input.schema`      | `string[]` | —        | Schema.org types present on the page     |
| `input.contentType` | `string`   | —        | Content type hint (guide, article, etc.) |

`buildSerpPredictionPrompt` returns `PromptTemplate`. `parseSerpPredictionResponse(text)` returns `SerpFeaturePrediction[]` with `likelihood` in the 0–1 range.

### `analyzeSerpEligibility(input)`

Takes the same `SerpFeatureInput` as `buildSerpPredictionPrompt`. Returns `SerpFeaturePrediction[]` for six features, computed deterministically:

| Feature            | Baseline | Schema signal                     | Content signal                                       |
| ------------------ | -------- | --------------------------------- | ---------------------------------------------------- |
| `faq-rich-result`  | 0.1      | `FAQPage` +0.4                    | 2+ question patterns +0.3                            |
| `how-to`           | 0.1      | `HowTo` +0.4                      | 2+ step patterns (step N, first, next, finally) +0.3 |
| `product`          | 0.1      | `Product` +0.5                    | —                                                    |
| `review`           | 0.1      | `Review` / `AggregateRating` +0.5 | —                                                    |
| `video`            | 0.1      | `VideoObject` +0.5                | —                                                    |
| `featured-snippet` | 0.1      | —                                 | 300+ words +0.1; h2–h4 headings +0.1                 |

Likelihood is capped at 1. No LLM, no network, no cost.

---

## Types

```ts
import type {
  PromptTemplate, // { system: string; user: string; maxTokens?: number }
  MetaDescriptionInput, // { title, content, focusKeyphrase?, tone?, maxLength? }
  MetaDescriptionResult, // { description, charCount, pixelWidth, isValid, validationMessage? }
  ContentSuggestionInput, // { title, content, focusKeyphrase?, analysisResults? }
  ContentSuggestionType, // 'heading' | 'paragraph' | 'keyword' | 'link'
  ContentSuggestion, // { type: ContentSuggestionType; suggestion: string; priority: number; reason? }
  SerpFeature, // 'featured-snippet' | 'faq-rich-result' | 'how-to' | 'product' | 'review' | 'video' | 'image-pack' | 'local-pack' | 'sitelinks'
  SerpFeatureInput, // { title, content, schema?, contentType? }
  SerpFeaturePrediction, // { feature: SerpFeature; likelihood: number; requirements: string[]; met: string[] }
  TitleInput, // { content, focusKeyphrase?, tone? }
  TitleResult, // { title: string; charCount: number; pixelWidth: number }
} from '@power-seo/ai';
```

---

## Use Cases

- **Headless CMS editors** — generate meta description and title candidates at publish time and present validated options to authors before going live
- **Programmatic page pipelines** — automate meta generation for large sets of generated pages, with every candidate checked against real character and pixel limits
- **Content quality dashboards** — feed low scores from [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) into `analysisResults` and surface prioritized AI improvement suggestions
- **SERP feature regression checks** — run `analyzeSerpEligibility` in CI so schema changes that drop rich-result eligibility fail the build, at zero API cost
- **Multi-LLM evaluation** — compare output quality across OpenAI, Claude, and Gemini using identical prompt builders and identical parsers

---

## Architecture Overview

- **Pure TypeScript** — no compiled binary, no native modules
- **Provider-agnostic contract** — builders emit `PromptTemplate`; parsers consume raw strings; the LLM client is entirely yours
- **Defensive parsing** — quote stripping, code-fence unwrapping, JSON-then-list fallback, entry-level validation; parsers never throw on bad model output
- **Shared SEO engine** — character limits, pixel-width estimation, and validation come from [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core), so AI-generated meta matches what the rest of the ecosystem measures
- **Framework-agnostic** — works in Next.js, Remix, Vite, Node.js, or any JS runtime
- **SSR and Edge safe** — no browser-specific or Node-specific APIs
- **Tree-shakeable** — `"sideEffects": false` with named per-function exports
- **Dual ESM + CJS** — ships both formats with TypeScript declarations

---

## Supply Chain Security

- Published to npm with **provenance attestation** — every release is built and signed by the verified `github.com/CyberCraftBD/power-seo` GitHub Actions workflow, so you can trace each tarball back to its exact source commit
- **Zero third-party runtime dependencies** — packages depend only on other `@power-seo` packages, nothing else gets pulled in
- **No network access at runtime** — pure computation on the inputs you pass; nothing is fetched, phoned home, or telemetered
- No install scripts (`postinstall`, `preinstall`)
- No `eval` or dynamic code execution
- Safe for SSR, Edge, and server environments

---

## The [@power-seo](https://www.npmjs.com/org/power-seo) Ecosystem

All 17 packages are independently installable — use only what you need.

| Package                                                                                    | Install                             | Description                                                                        |
| ------------------------------------------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------- |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai)                             | `npm i @power-seo/ai`               | LLM-agnostic prompt templates and response parsers for AI-assisted SEO             |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics)               | `npm i @power-seo/analytics`        | Merge Search Console data with audit results — trends and ranking insights         |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit)                       | `npm i @power-seo/audit`            | SEO site health auditing with meta, content, structure, and performance rules      |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content analysis engine with scoring, checks, and React components |
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core)                         | `npm i @power-seo/core`             | Framework-agnostic SEO analysis engines, types, validators, and utilities          |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images)                     | `npm i @power-seo/images`           | Image SEO analysis — alt text quality, lazy loading, formats, image sitemaps       |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations)         | `npm i @power-seo/integrations`     | Semrush and Ahrefs API clients with a shared rate-limited HTTP client              |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links)                       | `npm i @power-seo/links`            | Internal link graph analysis — orphan detection, suggestions, equity scoring       |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta)                         | `npm i @power-seo/meta`             | SSR meta tag helpers for Next.js App Router, Remix v2, and generic SSR             |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview)                   | `npm i @power-seo/preview`          | SERP, Open Graph, and Twitter Card preview generators with React components        |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react)                       | `npm i @power-seo/react`            | React SEO components — meta tags, Open Graph, Twitter Card, breadcrumbs            |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability)           | `npm i @power-seo/readability`      | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI               |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects)               | `npm i @power-seo/redirects`        | Redirect rule engine with Next.js, Remix, and Express adapters                     |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema)                     | `npm i @power-seo/schema`           | Type-safe JSON-LD structured data — 23 schema.org builders plus React components   |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console)     | `npm i @power-seo/search-console`   | Google Search Console API client — OAuth2, service accounts, rate limiting, retry  |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap)                   | `npm i @power-seo/sitemap`          | XML sitemap generation, streaming, and validation with image, video, news support  |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking)                 | `npm i @power-seo/tracking`         | Analytics script builders with consent management and React components             |

---

## Keywords

ai seo, llm seo, seo prompts, prompt templates, meta description generator, seo title generator, content suggestions, serp features, serp prediction, featured snippet, provider-agnostic, openai, anthropic claude, google gemini, ai content optimization, seo automation, typescript seo, structured output parsing, rich results, edge runtime

---

## About [CyberCraft Bangladesh](https://ccbd.dev)

**[CyberCraft Bangladesh](https://ccbd.dev)** is a Bangladesh-based enterprise-grade software development and Full Stack SEO service provider company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

[![Website](https://img.shields.io/badge/Website-ccbd.dev-blue?style=for-the-badge)](https://ccbd.dev)
[![GitHub](https://img.shields.io/badge/GitHub-cybercraftbd-black?style=for-the-badge&logo=github)](https://github.com/cybercraftbd)
[![npm](https://img.shields.io/badge/npm-power--seo-red?style=for-the-badge&logo=npm)](https://www.npmjs.com/org/power-seo)
[![Email](https://img.shields.io/badge/Email-info@ccbd.dev-green?style=for-the-badge&logo=gmail)](mailto:info@ccbd.dev)

© 2026 [CyberCraft Bangladesh](https://ccbd.dev) · Released under the [MIT License](../../LICENSE)
