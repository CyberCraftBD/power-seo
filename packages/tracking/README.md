# @ccbd-seo/tracking

> Analytics script builders, consent management, and API clients for GA4, Clarity, PostHog, Plausible, and Fathom.

Includes React components for consent-aware script injection and cookie consent banners.

## Installation

```bash
npm install @ccbd-seo/tracking @ccbd-seo/core
```

## Usage

### Script Builders

```ts
import { buildGA4Script, buildClarityScript, buildPlausibleScript } from '@ccbd-seo/tracking';

const ga4Scripts = buildGA4Script({ measurementId: 'G-XXXXXXX' });
// Returns ScriptConfig[] (multiple script tags for GA4)

const clarity = buildClarityScript({ projectId: 'abc123' });
// Returns ScriptConfig (single script tag)

const plausible = buildPlausibleScript({ domain: 'example.com' });
// Returns ScriptConfig (single script tag)
```

### Consent Management

```ts
import { createConsentManager } from '@ccbd-seo/tracking';

const manager = createConsentManager({
  necessary: true,    // Cannot be revoked
  analytics: false,
  marketing: false,
  preferences: false,
});

manager.grant('analytics');
manager.revoke('marketing');
manager.grantAll();
manager.revokeAll();

const unsubscribe = manager.onChange((state) => {
  console.log('Consent updated:', state);
});

const state = manager.getState();
// { necessary: true, analytics: true, marketing: false, preferences: false }
```

### Consent-Aware Script Loading

```ts
// Each ScriptConfig has a shouldLoad() method that checks consent
const ga4Scripts = buildGA4Script({ measurementId: 'G-XXXXXXX' });
const consent = manager.getState();

const loadable = ga4Scripts.filter((s) => s.shouldLoad(consent));
```

### API Clients

```ts
import { createGA4Client, createPlausibleClient, createFathomClient } from '@ccbd-seo/tracking';

const ga4Client = createGA4Client({ credentials: { ... } });
const report = await ga4Client.queryReport({ ... });

const plausible = createPlausibleClient({ apiKey: 'your-key' });
const stats = await plausible.getAggregate({ domain: 'example.com' });

const fathom = createFathomClient({ apiKey: 'your-key' });
const pageviews = await fathom.getPageviews({ siteId: '...' });
```

### React Components

```tsx
import { AnalyticsScript, ConsentBanner } from '@ccbd-seo/tracking/react';
import { createConsentManager, buildGA4Script, buildPlausibleScript } from '@ccbd-seo/tracking';

const manager = createConsentManager({ necessary: true, analytics: false });
const scripts = [...buildGA4Script({ measurementId: 'G-XXX' }), buildPlausibleScript({ domain: 'example.com' })];

// Renders only scripts that pass consent check
<AnalyticsScript scripts={scripts} consent={manager.getState()} />

// Cookie consent banner with accept/reject all
<ConsentBanner manager={manager} privacyPolicyUrl="/privacy" />
```

## API Reference

### Script Builders

- `buildGA4Script(config)` — Google Analytics 4 (returns `ScriptConfig[]` — multiple tags)
- `buildClarityScript(config)` — Microsoft Clarity (returns `ScriptConfig`)
- `buildPostHogScript(config)` — PostHog (returns `ScriptConfig`)
- `buildPlausibleScript(config)` — Plausible Analytics (returns `ScriptConfig`)
- `buildFathomScript(config)` — Fathom Analytics (returns `ScriptConfig`)

### Consent

- `createConsentManager(initialState)` — Create consent manager with `grant()`, `revoke()`, `grantAll()`, `revokeAll()`, `getState()`, `onChange()`

### API Clients

- `createGA4Client(config)` — GA4 Data API: `queryReport()`, `getRealtimeReport()`, `getMetadata()`
- `createClarityClient(config)` — Clarity API: `getProjects()`, `getInsights()`, `getHeatmapData()`
- `createPostHogClient(config)` — PostHog API: `queryEvents()`, `getTrends()`, `getFunnels()`, `getPersons()`
- `createPlausibleClient(config)` — Plausible Stats API: `getTimeseries()`, `getBreakdown()`, `getAggregate()`
- `createFathomClient(config)` — Fathom API: `getSites()`, `getPageviews()`, `getReferrers()`

### React Components (`@ccbd-seo/tracking/react`)

| Component | Props | Purpose |
|-----------|-------|---------|
| `AnalyticsScript` | `{ scripts: ScriptConfig[], consent: ConsentState }` | Renders script tags for scripts that pass consent check |
| `ConsentBanner` | `{ manager: ConsentManager, privacyPolicyUrl?: string }` | GDPR cookie consent banner with Accept All / Reject All buttons |

### Types

```ts
import type {
  ConsentCategory,
  ScriptConfig,
  ConsentState,
  ConsentManager,
  ConsentChangeCallback,
  GA4Config,
  GA4Client,
  ClarityConfig,
  ClarityClient,
  PostHogConfig,
  PostHogClient,
  PlausibleConfig,
  PlausibleClient,
  FathomConfig,
  FathomClient,
} from '@ccbd-seo/tracking';
```

## License

[MIT](../../LICENSE)
