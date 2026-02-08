# @ccbd-seo/content-analysis

> Yoast-style SEO content analysis engine with React components.

Scores titles, descriptions, keyphrase usage, headings, word count, images, and links with actionable suggestions.

## Installation

```bash
npm install @ccbd-seo/content-analysis @ccbd-seo/core
```

## Usage

### Full Analysis

```ts
import { analyzeContent } from '@ccbd-seo/content-analysis';

const result = analyzeContent({
  title: 'Best Coffee Shops in NYC',
  metaDescription: 'Discover the top coffee shops in New York City.',
  content: '<h2>Top Picks</h2><p>Your article HTML here...</p>',
  keyphrase: 'coffee shops nyc',
  url: 'https://example.com/coffee-shops-nyc',
});

console.log(result.score);    // Total points earned
console.log(result.maxScore); // Maximum possible points
console.log(result.status);   // "good" | "ok" | "poor"
console.log(result.results);  // Array of check results with status and feedback
```

### Individual Checks

```ts
import { checkTitle, checkKeyphraseUsage, checkWordCount } from '@ccbd-seo/content-analysis';

const titleResult = checkTitle({
  title: 'Best Coffee Shops in NYC',
  keyphrase: 'coffee shops nyc',
});
```

### React Components

```tsx
import { ScorePanel, CheckList, ContentAnalyzer } from '@ccbd-seo/content-analysis/react';

// Option 1: All-in-one component
<ContentAnalyzer
  input={{
    title: 'My Title',
    metaDescription: 'My description',
    content: '<p>Content...</p>',
    keyphrase: 'my keyphrase',
    url: 'https://example.com/page',
  }}
/>

// Option 2: Individual components
<ScorePanel score={15} maxScore={21} />
<CheckList results={result.results} />
```

## API Reference

### Main Analyzer

- `analyzeContent(input, config?)` — Run all 7 checks and return scored results

### Individual Checks

- `checkTitle(input)` — Title length, pixel width, keyphrase presence
- `checkMetaDescription(input)` — Description length, keyphrase presence
- `checkKeyphraseUsage(input)` — Keyword density and distribution analysis
- `checkHeadings(input)` — Heading structure and keyphrase usage
- `checkWordCount(input)` — Content length evaluation
- `checkImages(input)` — Image alt text and keyphrase checks
- `checkLinks(input)` — Internal and external link analysis

### React Components (`@ccbd-seo/content-analysis/react`)

| Component | Props | Purpose |
|-----------|-------|---------|
| `ScorePanel` | `{ score: number, maxScore: number }` | Colored progress bar with percentage and label |
| `CheckList` | `{ results: AnalysisResult[] }` | List of check results with status icons |
| `ContentAnalyzer` | `{ input: ContentAnalysisInput, config?: AnalysisConfig, children?: ReactNode }` | All-in-one: runs analysis, renders ScorePanel + CheckList |

### Types

```ts
import type {
  CheckId,
  AnalysisConfig,
  ContentAnalysisInput,
  ContentAnalysisOutput,
  AnalysisResult,
  AnalysisStatus,
} from '@ccbd-seo/content-analysis';
```

## License

[MIT](../../LICENSE)
