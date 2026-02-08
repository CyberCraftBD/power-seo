# @ccbd-seo/integrations

> Semrush and Ahrefs API clients with shared HTTP client, rate limiting, and pagination support.

## Installation

```bash
npm install @ccbd-seo/integrations @ccbd-seo/core
```

## Usage

### Semrush

```ts
import { createSemrushClient } from '@ccbd-seo/integrations';

const semrush = createSemrushClient({ apiKey: 'your-api-key' });

const overview = await semrush.getDomainOverview({ domain: 'example.com' });
const keywords = await semrush.getKeywordData({ keyword: 'react seo' });
const backlinks = await semrush.getBacklinks({ domain: 'example.com' });
const difficulty = await semrush.getKeywordDifficulty({ keyword: 'react seo' });
const related = await semrush.getRelatedKeywords({ keyword: 'react seo' });
```

### Ahrefs

```ts
import { createAhrefsClient } from '@ccbd-seo/integrations';

const ahrefs = createAhrefsClient({ apiKey: 'your-api-key' });

const overview = await ahrefs.getSiteOverview({ target: 'example.com' });
const keywords = await ahrefs.getOrganicKeywords({ target: 'example.com' });
const backlinks = await ahrefs.getBacklinks({ target: 'example.com' });
const difficulty = await ahrefs.getKeywordDifficulty({ keyword: 'react seo' });
const domains = await ahrefs.getReferringDomains({ target: 'example.com' });
```

### Shared HTTP Client

```ts
import { createHttpClient } from '@ccbd-seo/integrations';

const http = createHttpClient({
  baseUrl: 'https://api.example.com',
  rateLimiting: { maxRequests: 10, windowMs: 60000 },
});
```

## API Reference

### Semrush

- `createSemrushClient(config)` — Create Semrush API client
  - `.getDomainOverview(params)` — Domain traffic, keywords, backlinks summary
  - `.getKeywordData(params)` — Keyword volume, CPC, competition, SERP features
  - `.getBacklinks(params)` — Backlink data with follow/nofollow
  - `.getKeywordDifficulty(params)` — Keyword difficulty scores
  - `.getRelatedKeywords(params)` — Related keyword suggestions

### Ahrefs

- `createAhrefsClient(config)` — Create Ahrefs API client
  - `.getSiteOverview(params)` — Domain rating, organic traffic, backlinks
  - `.getOrganicKeywords(params)` — Ranking keywords with positions
  - `.getBacklinks(params)` — Backlink data with anchor text
  - `.getKeywordDifficulty(params)` — Keyword difficulty scores
  - `.getReferringDomains(params)` — Referring domains list

### Shared

- `createHttpClient(config)` — Base HTTP client with rate limiting and pagination

### Error Handling

- `IntegrationApiError` — Error class for API errors

### Types

```ts
import type {
  HttpClientConfig,
  HttpClient,
  PaginatedResponse,
  SemrushDomainOverview,
  SemrushKeywordData,
  SemrushBacklinkData,
  SemrushClient,
  AhrefsSiteOverview,
  AhrefsOrganicKeyword,
  AhrefsBacklink,
  AhrefsClient,
} from '@ccbd-seo/integrations';
```

## License

[MIT](../../LICENSE)
