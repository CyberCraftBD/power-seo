# API Research

Integration reference for `@power-seo/*` packages. Covers Google Search Console, Semrush, and Ahrefs APIs.

---

## Google Search Console API

| Detail           | Value                                                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| **Cost**         | Free                                                                                                        |
| **Auth**         | OAuth 2.0 (user consent) or Service Account (server-to-server)                                              |
| **Base URL**     | `https://www.googleapis.com/webmasters/v3/` (legacy) / `https://searchconsole.googleapis.com/v1/` (current) |
| **API Explorer** | https://developers.google.com/webmaster-tools/v1/api_reference                                              |

### Authentication

**OAuth 2.0 (recommended for user-facing apps):**

1. Create credentials in Google Cloud Console
2. Request scope: `https://www.googleapis.com/auth/webmasters.readonly` (read) or `https://www.googleapis.com/auth/webmasters` (read/write)
3. Exchange authorization code for access + refresh tokens
4. Refresh tokens do not expire unless revoked

**Service Account (recommended for server-to-server):**

1. Create service account in Google Cloud Console
2. Download JSON key file
3. Add service account email as user in Search Console property
4. Use JWT to obtain access tokens -- no user interaction required

### Endpoints

| Endpoint                      | Method                                                             | Description                                                        |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `searchAnalytics.query`       | POST `/sites/{siteUrl}/searchAnalytics/query`                      | Query search performance data (clicks, impressions, CTR, position) |
| `urlInspection.index.inspect` | POST `/v1/urlInspection/index:inspect`                             | Get index status, crawl info, mobile usability for a URL           |
| `sitemaps.list`               | GET `/sites/{siteUrl}/sitemaps`                                    | List submitted sitemaps                                            |
| `sitemaps.get`                | GET `/sites/{siteUrl}/sitemaps/{feedpath}`                         | Get details for a specific sitemap                                 |
| `sitemaps.submit`             | PUT `/sites/{siteUrl}/sitemaps/{feedpath}`                         | Submit a sitemap                                                   |
| `sitemaps.delete`             | DELETE `/sites/{siteUrl}/sitemaps/{feedpath}`                      | Remove a sitemap                                                   |
| `sites.list`                  | GET `/sites`                                                       | List all properties the authenticated user has access to           |
| `sites.get`                   | GET `/sites/{siteUrl}`                                             | Get permission level for a specific site                           |
| Indexing API                  | POST `https://indexing.googleapis.com/v3/urlNotifications:publish` | Request indexing/removal of a URL (separate API, separate quota)   |

### Search Analytics Query Parameters

```json
{
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "dimensions": ["query", "page", "country", "device", "date", "searchAppearance"],
  "type": "web",
  "dimensionFilterGroups": [
    {
      "filters": [
        {
          "dimension": "query",
          "operator": "contains",
          "expression": "keyword"
        }
      ]
    }
  ],
  "rowLimit": 25000,
  "startRow": 0,
  "dataState": "final"
}
```

- `rowLimit` max: 25,000 per request. Paginate with `startRow`.
- `type` options: `web`, `image`, `video`, `news`, `discover`, `googleNews`
- Data available for last 16 months

### Rate Limits

| Limit                    | Value                                   |
| ------------------------ | --------------------------------------- |
| Search Analytics queries | 1,200 queries per minute per site       |
| URL Inspection           | 2,000 inspections per day per property  |
| URL Inspection           | 600 inspections per minute per property |
| Indexing API             | 200 publish requests per day (default)  |
| Indexing API batch       | Up to 100 URLs per batch request        |

### npm Packages

| Package                     | Notes                                                                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `googleapis`                | Official Google API client. Full Search Console support via `google.searchconsole('v1')` and `google.webmasters('v3')`. Large bundle (~45MB installed). |
| `@googleapis/searchconsole` | Standalone Search Console client. Much smaller than full `googleapis`.                                                                                  |
| `google-auth-library`       | Handles OAuth 2.0 and Service Account auth. Required by both packages above.                                                                            |

---

## Semrush API

| Detail       | Value                                          |
| ------------ | ---------------------------------------------- |
| **Cost**     | Business plan required ($499.95/mo as of 2026) |
| **Auth**     | API key (query parameter `key=XXXXX`)          |
| **Base URL** | `https://api.semrush.com/`                     |
| **Docs**     | https://developer.semrush.com/api/             |

### Authentication

Simple API key passed as a query parameter. No OAuth flow.

```
https://api.semrush.com/?type=domain_ranks&key=YOUR_API_KEY&domain=example.com
```

API units are consumed per request. Unit cost varies by report type (1-100+ units per row).

### Endpoints (Key Reports)

| Category      | Report Type              | Description                                 | Units/Row |
| ------------- | ------------------------ | ------------------------------------------- | --------- |
| **Domain**    | `domain_ranks`           | Domain overview (traffic, keywords, cost)   | 10        |
| **Domain**    | `domain_organic`         | Organic keyword positions                   | 10        |
| **Domain**    | `domain_adwords`         | Paid keyword positions                      | 20        |
| **Domain**    | `domain_organic_organic` | Organic competitors                         | 40        |
| **Keyword**   | `phrase_all`             | Keyword overview (volume, CPC, competition) | 10        |
| **Keyword**   | `phrase_organic`         | Organic results for a keyword               | 10        |
| **Keyword**   | `phrase_related`         | Related keywords                            | 40        |
| **Keyword**   | `phrase_questions`       | Question-based keywords                     | 40        |
| **Keyword**   | `keyword_difficulty`     | Keyword difficulty score                    | 50        |
| **Backlinks** | `backlinks_overview`     | Backlink profile summary                    | 20        |
| **Backlinks** | `backlinks`              | Individual backlinks list                   | 20        |
| **Backlinks** | `backlinks_refdomains`   | Referring domains list                      | 20        |

### Response Format

Default response is semicolon-separated text. Add `&export_columns=...` to select fields and `&display_limit=N` to limit rows.

```
// Example response (domain_ranks)
Database;Organic Keywords;Organic Traffic;Organic Cost;...
us;52345;128903;245600;...
```

JSON output is **not** natively supported for most endpoints. Parse CSV/TSV responses.

### Rate Limits

| Limit               | Value                                                |
| ------------------- | ---------------------------------------------------- |
| Requests per second | 10                                                   |
| API units per month | Depends on plan (Business: 50,000 units/mo included) |
| Rows per request    | 10,000 max (`display_limit`)                         |

### npm Package

| Package       | Notes                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `semrush-api` | Community wrapper. Handles request formatting and response parsing. Not officially maintained by Semrush. Verify before production use. |

**Recommendation:** Build a thin wrapper in `@power-seo/integrations` rather than depending on the community package. The API is simple enough (HTTP GET + CSV parsing) that a direct implementation is more reliable.

---

## Ahrefs API v3

| Detail       | Value                                             |
| ------------ | ------------------------------------------------- |
| **Cost**     | Enterprise plan only ($1,499/mo as of 2026)       |
| **Auth**     | Bearer token (`Authorization: Bearer YOUR_TOKEN`) |
| **Base URL** | `https://api.ahrefs.com/v3/`                      |
| **Docs**     | https://docs.ahrefs.com/api                       |

### Authentication

Bearer token in the `Authorization` header. Tokens are generated in Ahrefs dashboard under API settings.

```
GET https://api.ahrefs.com/v3/site-explorer/overview?target=example.com
Authorization: Bearer YOUR_API_TOKEN
```

Integration units are consumed per request. Monthly allocation depends on plan.

### Endpoints (Key Resources)

| Resource              | Endpoint                                  | Description                                  |
| --------------------- | ----------------------------------------- | -------------------------------------------- |
| **Site Explorer**     | `GET /v3/site-explorer/overview`          | Domain/URL metrics (DR, traffic, backlinks)  |
| **Site Explorer**     | `GET /v3/site-explorer/backlinks`         | List of backlinks to a target                |
| **Site Explorer**     | `GET /v3/site-explorer/refdomains`        | Referring domains                            |
| **Site Explorer**     | `GET /v3/site-explorer/organic-keywords`  | Organic keyword rankings                     |
| **Site Explorer**     | `GET /v3/site-explorer/top-pages`         | Top pages by organic traffic                 |
| **Site Explorer**     | `GET /v3/site-explorer/pages-by-traffic`  | Pages sorted by estimated traffic            |
| **Keywords Explorer** | `GET /v3/keywords-explorer/overview`      | Keyword metrics (volume, KD, CPC)            |
| **Keywords Explorer** | `GET /v3/keywords-explorer/keyword-ideas` | Related keyword suggestions                  |
| **Domain Rating**     | `GET /v3/site-explorer/domain-rating`     | Domain Rating (DR) score                     |
| **Batch Analysis**    | `POST /v3/site-explorer/overview/batch`   | Batch URL/domain metrics (up to 200 targets) |

### Common Query Parameters

| Parameter  | Description                                    |
| ---------- | ---------------------------------------------- |
| `target`   | Domain, URL, or path to analyze                |
| `mode`     | `exact`, `prefix`, `domain`, `subdomains`      |
| `country`  | Two-letter country code for keyword data       |
| `limit`    | Max rows returned (default varies by endpoint) |
| `offset`   | Pagination offset                              |
| `output`   | `json` (default)                               |
| `order_by` | Field to sort by, e.g., `ahrefs_rank:asc`      |

### Response Format

JSON by default. Paginated responses include an `items` array and pagination metadata.

```json
{
  "metrics": {
    "organic_traffic": 125000,
    "domain_rating": 72,
    "backlinks": 48293,
    "refdomains": 3891
  }
}
```

### Rate Limits

| Limit               | Value                                          |
| ------------------- | ---------------------------------------------- |
| Rows per month      | 500,000 (Enterprise) / 1,000,000+ (negotiable) |
| Requests per second | Not publicly documented; throttled server-side |
| Batch size          | 200 targets per batch request                  |

### npm SDK

**No official npm SDK.** Ahrefs does not publish a client library.

**Recommendation:** Build a typed HTTP client in `@power-seo/integrations` using `fetch` or `undici`. The API is RESTful JSON -- straightforward to wrap. Key concerns:

- Handle rate limiting with exponential backoff
- Cache responses aggressively (Ahrefs data updates ~daily)
- Track unit consumption to avoid surprise overages

---

## Integration Priority for @power-seo/\*

| API                   | Priority              | Rationale                                                         |
| --------------------- | --------------------- | ----------------------------------------------------------------- |
| Google Search Console | **P0 -- Ship first**  | Free, broad adoption, essential for any SEO tool                  |
| Semrush               | **P1 -- Ship second** | Most popular paid SEO tool, Business plan is accessible           |
| Ahrefs                | **P2 -- Ship third**  | Enterprise-only pricing limits adoption; build when demand exists |

---

_Last updated: 2026-02-06_
