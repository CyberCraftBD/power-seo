# @ccbd-seo/readability

> Readability scoring algorithms with configurable thresholds.

Implements Flesch-Kincaid, Gunning Fog, Coleman-Liau, and Automated Readability Index with a combined analyzer that returns traffic-light ratings.

## Installation

```bash
npm install @ccbd-seo/readability @ccbd-seo/core
```

## Usage

### Combined Analysis

```ts
import { analyzeReadability } from '@ccbd-seo/readability';

const result = analyzeReadability({
  content: '<p>Your article content here. Use short sentences for better readability.</p>',
});

console.log(result.status);     // "good" | "ok" | "poor"
console.log(result.statistics); // { wordCount, sentenceCount, avgWordsPerSentence, ... }
console.log(result.scores);     // Per-algorithm scores with grade levels
```

### Individual Algorithms

```ts
import {
  fleschReadingEase,
  fleschKincaidGrade,
  gunningFog,
  colemanLiau,
  automatedReadability,
} from '@ccbd-seo/readability';

const ease = fleschReadingEase(stats);  // 0-100 score (higher = easier)
const grade = fleschKincaidGrade(stats); // US grade level
const fog = gunningFog(stats);           // Gunning Fog Index
const cl = colemanLiau(stats);           // Coleman-Liau Index
const ari = automatedReadability(stats); // ARI score
```

## API Reference

### Main Analyzer

- `analyzeReadability(input)` — Combined scoring with traffic-light rating

### Algorithm Functions

- `fleschReadingEase(stats)` — Flesch Reading Ease score (0-100, higher = easier)
- `fleschKincaidGrade(stats)` — Flesch-Kincaid Grade Level (US school grade)
- `gunningFog(stats)` — Gunning Fog Index (years of education needed)
- `colemanLiau(stats)` — Coleman-Liau Index (character-based grade level)
- `automatedReadability(stats)` — Automated Readability Index

### Types

```ts
import type {
  ReadabilityInput,
  ReadabilityOutput,
  TextStatistics,
  AnalysisResult,
  AnalysisStatus,
  AlgorithmScore,
} from '@ccbd-seo/readability';
```

## License

[MIT](../../LICENSE)
