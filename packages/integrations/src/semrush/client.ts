// ============================================================================
// @power-seo/integrations — Semrush Client
// ============================================================================

import type {
  SemrushClient,
  SemrushDomainOverview,
  SemrushKeywordData,
  SemrushBacklinkData,
  SemrushKeywordDifficulty,
  SemrushRelatedKeyword,
  PaginatedResponse,
  SemrushPaginationOptions,
  HttpClientConfig,
} from '../types.js';
import { createHttpClient } from '../http.js';
import {
  SEMRUSH_BASE_URL,
  domainOverviewPath,
  organicKeywordsPath,
  backlinksPath,
  keywordDifficultyPath,
  relatedKeywordsPath,
  buildDomainOverviewParams,
  buildOrganicKeywordsParams,
  buildBacklinksParams,
  buildKeywordDifficultyParams,
  buildRelatedKeywordsParams,
} from './endpoints.js';
import type {
  SemrushRawDomainResponse,
  SemrushApiResponse,
  SemrushRawKeywordResponse,
  SemrushRawBacklinkResponse,
  SemrushRawKeywordDifficultyResponse,
  SemrushRawRelatedKeywordResponse,
} from './types.js';

const DEFAULT_LIMIT = 100;
const DEFAULT_DATABASE = 'us';

export function createSemrushClient(
  apiKey: string,
  config?: Partial<Omit<HttpClientConfig, 'baseUrl' | 'auth'>>,
): SemrushClient {
  const http = createHttpClient({
    baseUrl: SEMRUSH_BASE_URL,
    auth: { type: 'query', paramName: 'key', value: apiKey },
    ...config,
  });

  return {
    async getDomainOverview(domain, database = DEFAULT_DATABASE) {
      const params = buildDomainOverviewParams(domain, database);
      const raw = await http.get<SemrushApiResponse<SemrushRawDomainResponse>>(
        domainOverviewPath(),
        params,
      );
      const entry = raw.data[0];
      return {
        domain,
        organicKeywords: entry?.Or ?? 0,
        organicTraffic: entry?.Ot ?? 0,
        organicCost: entry?.Oc ?? 0,
        paidKeywords: entry?.Ad ?? 0,
        paidTraffic: entry?.At ?? 0,
        paidCost: entry?.Ac ?? 0,
        backlinks: entry?.Bk ?? 0,
        authorityScore: entry?.As ?? 0,
      } satisfies SemrushDomainOverview;
    },

    async getOrganicKeywords(domain, options?: SemrushPaginationOptions) {
      const limit = options?.limit ?? DEFAULT_LIMIT;
      const offset = options?.offset ?? 0;
      const database = options?.database ?? DEFAULT_DATABASE;
      const params = buildOrganicKeywordsParams(domain, database, limit, offset);
      const raw = await http.get<SemrushApiResponse<SemrushRawKeywordResponse>>(
        organicKeywordsPath(),
        params,
      );
      const data: SemrushKeywordData[] = (raw.data ?? []).map((r) => ({
        keyword: r.Ph,
        position: r.Po,
        previousPosition: r.Pp,
        searchVolume: r.Nq,
        cpc: r.Cp,
        url: r.Ur,
        traffic: r.Tr,
        trafficPercent: r.Td,
        trafficCost: r.Tc,
        competition: r.Co,
      }));
      return {
        data,
        total: raw.total ?? 0,
        offset,
        limit,
        hasMore: data.length === limit,
      } satisfies PaginatedResponse<SemrushKeywordData>;
    },

    async getBacklinks(domain, options?: SemrushPaginationOptions) {
      const limit = options?.limit ?? DEFAULT_LIMIT;
      const offset = options?.offset ?? 0;
      const params = buildBacklinksParams(domain, limit, offset);
      const raw = await http.get<SemrushApiResponse<SemrushRawBacklinkResponse>>(
        backlinksPath(),
        params,
      );
      const data: SemrushBacklinkData[] = (raw.data ?? []).map((r) => ({
        sourceUrl: r.source_url,
        targetUrl: r.target_url,
        anchorText: r.anchor,
        isNoFollow: r.nofollow,
        firstSeen: r.first_seen,
        lastSeen: r.last_seen,
        sourceAuthorityScore: r.source_ascore,
      }));
      return {
        data,
        total: raw.total ?? 0,
        offset,
        limit,
        hasMore: data.length === limit,
      } satisfies PaginatedResponse<SemrushBacklinkData>;
    },

    async getKeywordDifficulty(keywords, database = DEFAULT_DATABASE) {
      const params = buildKeywordDifficultyParams(keywords, database);
      const raw = await http.get<SemrushApiResponse<SemrushRawKeywordDifficultyResponse>>(
        keywordDifficultyPath(),
        params,
      );
      return (raw.data ?? []).map((r): SemrushKeywordDifficulty => ({
        keyword: r.Ph,
        difficulty: r.Kd,
        searchVolume: r.Nq,
        cpc: r.Cp,
        competition: r.Co,
        results: r.Nr,
      }));
    },

    async getRelatedKeywords(keyword, database = DEFAULT_DATABASE) {
      const params = buildRelatedKeywordsParams(keyword, database);
      const raw = await http.get<SemrushApiResponse<SemrushRawRelatedKeywordResponse>>(
        relatedKeywordsPath(),
        params,
      );
      return (raw.data ?? []).map((r): SemrushRelatedKeyword => ({
        keyword: r.Ph,
        searchVolume: r.Nq,
        cpc: r.Cp,
        competition: r.Co,
        results: r.Nr,
        relatedTo: r.Rr,
      }));
    },
  };
}
