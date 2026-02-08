# @ccbd-seo/links

> Internal link graph analysis, orphan page detection, link suggestions, and equity scoring.

## Installation

```bash
npm install @ccbd-seo/links @ccbd-seo/core
```

## Usage

### Build Link Graph

```ts
import { buildLinkGraph, findOrphanPages } from '@ccbd-seo/links';

const graph = buildLinkGraph([
  { url: 'https://example.com/', links: ['https://example.com/about', 'https://example.com/blog'] },
  { url: 'https://example.com/about', links: ['https://example.com/'] },
  { url: 'https://example.com/blog', links: [] },
  { url: 'https://example.com/orphan', links: [] },
]);

const orphans = findOrphanPages(graph);
// [{ url: 'https://example.com/orphan', inboundCount: 0 }]
```

### Link Suggestions

```ts
import { suggestLinks } from '@ccbd-seo/links';

const suggestions = suggestLinks({
  pages: [
    { url: '/react-seo', title: 'React SEO Guide', content: 'Learn about meta tags...' },
    { url: '/meta-tags', title: 'Meta Tags', content: 'How to use meta tags in React...' },
  ],
});
// Suggests linking between related pages based on keyword overlap
```

### Link Equity Analysis

```ts
import { analyzeLinkEquity } from '@ccbd-seo/links';

const equity = analyzeLinkEquity(graph);
// PageRank-style scores for each page in the graph
```

## API Reference

- `buildLinkGraph(pages)` — Construct directed graph from page data
- `findOrphanPages(graph)` — Find pages with zero inbound internal links
- `suggestLinks(options)` — Keyword-based internal link suggestions
- `analyzeLinkEquity(graph, options?)` — PageRank-style link value distribution

### Types

```ts
import type {
  PageData,
  LinkNode,
  LinkGraph,
  OrphanPage,
  LinkSuggestion,
  LinkSuggestionOptions,
  LinkEquityScore,
  LinkEquityOptions,
} from '@ccbd-seo/links';
```

## License

[MIT](../../LICENSE)
