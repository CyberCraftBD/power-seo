# @power-seo/readability — Readability Scoring for TypeScript — Flesch-Kincaid, Gunning Fog, Coleman-Liau & ARI

Multi-algorithm readability analysis for web content — compute grade levels, reading ease, and actionable improvement recommendations in Node.js or the browser.

[![npm version](https://img.shields.io/npm/v/@power-seo/readability)](https://www.npmjs.com/package/@power-seo/readability)
[![npm downloads](https://img.shields.io/npm/dm/@power-seo/readability)](https://www.npmjs.com/package/@power-seo/readability)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![tree-shakeable](https://img.shields.io/badge/tree--shakeable-yes-brightgreen)](https://bundlephobia.com/package/@power-seo/readability)

`@power-seo/readability` implements four industry-standard readability formulas as pure TypeScript functions with zero runtime dependencies. Use `analyzeReadability()` for a comprehensive report, or import individual algorithm functions (Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, Coleman-Liau Index, Automated Readability Index) for granular use. Works anywhere JavaScript runs.

> **Zero runtime dependencies** — no external libraries needed.

## Features

- **Flesch Reading Ease** — score 0–100; higher = easier to read; targets general audience at 60–70
- **Flesch-Kincaid Grade Level** — US school grade equivalent (e.g. 8.0 = 8th grade reading level)
- **Gunning Fog Index** — grade level based on complex word (3+ syllable) density
- **Coleman-Liau Index** — character-based formula, not syllable-dependent
- **Automated Readability Index (ARI)** — uses character and word counts for grade estimation
- **Unified `analyzeReadability()` API** — run all five algorithms in one call, get composite status
- **Text statistics** — sentence count, word count, syllable count, character count, avg sentence length
- **Status labels** — each score maps to `'good'` / `'improvement'` / `'error'` with a human message
- **Zero dependencies** — pure TypeScript, no NLP libraries, works in Node and browser
- **Tree-shakeable** — import only the algorithms you need
- **Full TypeScript support** — typed inputs, outputs, and score objects

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Running All Algorithms](#running-all-algorithms)
  - [Running Individual Algorithms](#running-individual-algorithms)
  - [Interpreting Results](#interpreting-results)
- [API Reference](#api-reference)
  - [`analyzeReadability()`](#analyzereadability)
  - [Individual Algorithm Functions](#individual-algorithm-functions)
  - [Types](#types)
- [The @power-seo Ecosystem](#the-power-seo-ecosystem)
- [About CyberCraft Bangladesh](#about-cybercraft-bangladesh)

## Installation

```bash
npm install @power-seo/readability
```

```bash
yarn add @power-seo/readability
```

```bash
pnpm add @power-seo/readability
```

## Quick Start

```ts
import { analyzeReadability } from '@power-seo/readability';

const result = analyzeReadability({
  text: 'Search engine optimization is the practice of improving web pages to rank higher in search results. Good content uses clear sentences and relevant keywords.',
});

console.log(result.fleschReadingEase.score);    // e.g. 58.4
console.log(result.fleschKincaidGrade.score);   // e.g. 10.2
console.log(result.overall.status);             // 'improvement'
console.log(result.overall.message);            // 'Content may be difficult for some readers...'
```

## Usage

### Running All Algorithms

`analyzeReadability()` returns scores from all five algorithms plus text statistics and an overall status:

```ts
import { analyzeReadability } from '@power-seo/readability';

const result = analyzeReadability({ text: bodyText });

// result.fleschReadingEase      → { score: number, status, message }
// result.fleschKincaidGrade     → { score: number, status, message }
// result.gunningFog             → { score: number, status, message }
// result.colemanLiau            → { score: number, status, message }
// result.automatedReadability   → { score: number, status, message }
// result.stats                  → TextStatistics
// result.overall                → { status, message }
```

### Running Individual Algorithms

Import only the algorithms you need for maximum tree-shaking:

```ts
import { fleschReadingEase, fleschKincaidGrade, gunningFog } from '@power-seo/readability';

const stats = { sentences: 10, words: 150, syllables: 220, characters: 900 };

const ease = fleschReadingEase(stats);
// { score: 62.3, status: 'good', message: 'Fairly easy to read.' }

const grade = fleschKincaidGrade(stats);
// { score: 8.1, status: 'good', message: 'Suitable for 8th grade readers.' }

const fog = gunningFog(stats);
// { score: 10.2, status: 'improvement', message: 'Consider simplifying complex words.' }
```

### Interpreting Results

| Flesch Reading Ease | Audience |
|--------------------|---------|
| 90–100 | Very easy (5th grade) |
| 70–90 | Easy (6th grade) |
| 60–70 | Standard (7th–8th grade) — ideal for most web content |
| 50–60 | Fairly difficult (high school) |
| 30–50 | Difficult (college) |
| 0–30 | Very difficult (academic/professional) |

| Grade Level Score | Meaning |
|------------------|---------|
| ≤8 | `'good'` — accessible to general audiences |
| 9–12 | `'improvement'` — high school level; consider simplifying |
| >12 | `'error'` — college+ level; likely too complex for most web readers |

## API Reference

### `analyzeReadability()`

```ts
function analyzeReadability(input: ReadabilityInput): ReadabilityOutput
```

#### `ReadabilityInput`

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Plain text or HTML string to analyze (HTML tags are stripped automatically) |

#### `ReadabilityOutput`

| Field | Type | Description |
|-------|------|-------------|
| `fleschReadingEase` | `AlgorithmScore` | Flesch Reading Ease result |
| `fleschKincaidGrade` | `AlgorithmScore` | Flesch-Kincaid Grade Level result |
| `gunningFog` | `AlgorithmScore` | Gunning Fog Index result |
| `colemanLiau` | `AlgorithmScore` | Coleman-Liau Index result |
| `automatedReadability` | `AlgorithmScore` | ARI result |
| `stats` | `TextStatistics` | Underlying text statistics |
| `overall` | `AnalysisResult` | Composite status and message |

### Individual Algorithm Functions

All functions accept a `TextStatistics` object and return `AlgorithmScore`:

```ts
function fleschReadingEase(stats: TextStatistics): AlgorithmScore
function fleschKincaidGrade(stats: TextStatistics): AlgorithmScore
function gunningFog(stats: TextStatistics): AlgorithmScore
function colemanLiau(stats: TextStatistics): AlgorithmScore
function automatedReadability(stats: TextStatistics): AlgorithmScore
```

### Types

| Type | Description |
|------|-------------|
| `ReadabilityInput` | `{ text: string }` |
| `ReadabilityOutput` | Full analysis result with all algorithm scores |
| `TextStatistics` | `{ sentences, words, syllables, characters, avgWordsPerSentence }` |
| `AlgorithmScore` | `{ score: number; status: AnalysisStatus; message: string }` |
| `AnalysisStatus` | `'good' \| 'improvement' \| 'error'` |
| `AnalysisResult` | `{ status: AnalysisStatus; message: string }` |

## The @power-seo Ecosystem

All 17 packages are independently installable — use only what you need.

| Package | Install | Description |
|---------|---------|-------------|
| [`@power-seo/core`](https://www.npmjs.com/package/@power-seo/core) | `npm i @power-seo/core` | Framework-agnostic utilities, types, validators, and constants |
| [`@power-seo/react`](https://www.npmjs.com/package/@power-seo/react) | `npm i @power-seo/react` | React SEO components — meta, Open Graph, Twitter Card, breadcrumbs |
| [`@power-seo/meta`](https://www.npmjs.com/package/@power-seo/meta) | `npm i @power-seo/meta` | SSR meta helpers for Next.js App Router, Remix v2, and generic SSR |
| [`@power-seo/schema`](https://www.npmjs.com/package/@power-seo/schema) | `npm i @power-seo/schema` | Type-safe JSON-LD structured data — 20 builders + 18 React components |
| [`@power-seo/content-analysis`](https://www.npmjs.com/package/@power-seo/content-analysis) | `npm i @power-seo/content-analysis` | Yoast-style SEO content scoring engine with React components |
| [`@power-seo/readability`](https://www.npmjs.com/package/@power-seo/readability) | `npm i @power-seo/readability` | Readability scoring — Flesch-Kincaid, Gunning Fog, Coleman-Liau, ARI |
| [`@power-seo/preview`](https://www.npmjs.com/package/@power-seo/preview) | `npm i @power-seo/preview` | SERP, Open Graph, and Twitter/X Card preview generators |
| [`@power-seo/sitemap`](https://www.npmjs.com/package/@power-seo/sitemap) | `npm i @power-seo/sitemap` | XML sitemap generation, streaming, index splitting, and validation |
| [`@power-seo/redirects`](https://www.npmjs.com/package/@power-seo/redirects) | `npm i @power-seo/redirects` | Redirect engine with Next.js, Remix, and Express adapters |
| [`@power-seo/links`](https://www.npmjs.com/package/@power-seo/links) | `npm i @power-seo/links` | Link graph analysis — orphan detection, suggestions, equity scoring |
| [`@power-seo/audit`](https://www.npmjs.com/package/@power-seo/audit) | `npm i @power-seo/audit` | Full SEO audit engine — meta, content, structure, performance rules |
| [`@power-seo/images`](https://www.npmjs.com/package/@power-seo/images) | `npm i @power-seo/images` | Image SEO — alt text, lazy loading, format analysis, image sitemaps |
| [`@power-seo/ai`](https://www.npmjs.com/package/@power-seo/ai) | `npm i @power-seo/ai` | LLM-agnostic AI prompt templates and parsers for SEO tasks |
| [`@power-seo/analytics`](https://www.npmjs.com/package/@power-seo/analytics) | `npm i @power-seo/analytics` | Merge GSC + audit data, trend analysis, ranking insights, dashboard |
| [`@power-seo/search-console`](https://www.npmjs.com/package/@power-seo/search-console) | `npm i @power-seo/search-console` | Google Search Console API — OAuth2, service account, URL inspection |
| [`@power-seo/integrations`](https://www.npmjs.com/package/@power-seo/integrations) | `npm i @power-seo/integrations` | Semrush and Ahrefs API clients with rate limiting and pagination |
| [`@power-seo/tracking`](https://www.npmjs.com/package/@power-seo/tracking) | `npm i @power-seo/tracking` | GA4, Clarity, PostHog, Plausible, Fathom — scripts + consent management |

---

## About CyberCraft Bangladesh

**CyberCraft Bangladesh** is a Bangladesh-based enterprise-grade software engineering company specializing in ERP system development, AI-powered SaaS and business applications, full-stack SEO services, custom website development, and scalable eCommerce platforms. We design and develop intelligent, automation-driven SaaS and enterprise solutions that help startups, SMEs, NGOs, educational institutes, and large organizations streamline operations, enhance digital visibility, and accelerate growth through modern cloud-native technologies.

| | |
|---|---|
| **Website** | [ccbd.dev](https://ccbd.dev) |
| **GitHub** | [github.com/cybercraftbd](https://github.com/cybercraftbd) |
| **npm Organization** | [npmjs.com/org/power-seo](https://www.npmjs.com/org/power-seo) |
| **Email** | [info@ccbd.dev](mailto:info@ccbd.dev) |

© 2026 CyberCraft Bangladesh · Released under the [MIT License](../../LICENSE)
