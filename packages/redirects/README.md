# @ccbd-seo/redirects

> Redirect rule engine with exact, glob, and regex matching.

Includes framework adapters for Next.js, Remix, and Express.

## Installation

```bash
npm install @ccbd-seo/redirects @ccbd-seo/core
```

## Usage

### Redirect Engine

```ts
import { createRedirectEngine } from '@ccbd-seo/redirects';

const engine = createRedirectEngine({
  rules: [
    { source: '/old-page', destination: '/new-page', statusCode: 301 },
    { source: '/blog/:slug', destination: '/articles/:slug', statusCode: 301 },
    { source: '/docs/*', destination: '/documentation/*', statusCode: 302 },
  ],
});

const match = engine.match('/old-page');
// { destination: '/new-page', statusCode: 301 }
```

### Framework Adapters

```ts
import {
  toNextRedirects,
  createRemixRedirectHandler,
  createExpressRedirectMiddleware,
} from '@ccbd-seo/redirects';

// Next.js — use in next.config.js
const nextRedirects = toNextRedirects(rules);

// Remix — use as loader
const remixHandler = createRemixRedirectHandler(rules);

// Express — use as middleware
const expressMiddleware = createExpressRedirectMiddleware(rules);
app.use(expressMiddleware);
```

### Pattern Matchers

```ts
import { matchExact, matchGlob, matchRegex, substituteParams } from '@ccbd-seo/redirects';

matchExact('/old', '/old');            // true
matchGlob('/blog/*', '/blog/my-post'); // true
matchRegex('^/user/(\\d+)$', '/user/42'); // { match, groups }

substituteParams('/articles/:slug', { slug: 'my-post' });
// → "/articles/my-post"
```

## API Reference

### Engine

- `createRedirectEngine(config)` — Create redirect rule engine with `match()` method

### Matchers

- `matchExact(pattern, url)` — Exact string match
- `matchGlob(pattern, url)` — Glob pattern match (supports `*` and `:param`)
- `matchRegex(pattern, url)` — Regex pattern match with capture groups
- `substituteParams(template, params)` — Replace `:param` placeholders in destination

### Framework Adapters

- `toNextRedirects(rules)` — Convert rules to Next.js redirect config format
- `createRemixRedirectHandler(rules)` — Create Remix loader redirect handler
- `createExpressRedirectMiddleware(rules)` — Create Express redirect middleware

### Types

```ts
import type {
  RedirectStatusCode,
  RedirectRule,
  RedirectMatch,
  RedirectEngineConfig,
  RedirectEngine,
  NextRedirect,
} from '@ccbd-seo/redirects';
```

## License

[MIT](../../LICENSE)
