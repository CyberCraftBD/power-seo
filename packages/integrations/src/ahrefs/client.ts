// ============================================================================
// @ccbd-seo/integrations — Ahrefs Client
// ============================================================================

import type {
  AhrefsClient,
  AhrefsSiteOverview,
  AhrefsOrganicKeyword,
  AhrefsBacklink,
  AhrefsKeywordDifficulty,
  AhrefsReferringDomain,
  PaginatedResponse,
  AhrefsPaginationOptions,
  HttpClientConfig,
} from '../types.js';
import { createHttpClient } from '../http.js';
import {
  AHREFS_BASE_URL,
  siteOverviewPath,
  organicKeywordsPath,
  backlinksPath,
  keywordDifficultyPath,
  referringDomainsPath,
  buildSiteOverviewParams,
  buildOrganicKeywordsParams,
  buildBacklinksParams,
  buildKeywordDifficultyParams,
  buildReferringDomainsParams,
} from './endpoints.js';
import type {
  AhrefsRawSiteOverview,
  AhrefsApiResponse,
  AhrefsRawOrganicKeyword,
  AhrefsRawBacklink,
  AhrefsRawKeywordDifficulty,
  AhrefsRawReferringDomain,
} from './types.js';

const DEFAULT_LIMIT = 100;

export function createAhrefsClient(
  apiToken: string,
  config?: Partial<Omit<HttpClientConfig, 'baseUrl' | 'auth'>>,
): AhrefsClient {
  const http = createHttpClient({
    baseUrl: AHREFS_BASE_URL,
    auth: { type: 'bearer', token: apiToken },
    ...config,
  });

  return {
    async getSiteOverview(domain) {
      const params = buildSiteOverviewParams(domain);
      const raw = await http.get<AhrefsApiResponse<AhrefsRawSiteOverview>>(
        siteOverviewPath(),
        params,
      );
      const entry = raw.data[0];
      return {
        domain,
        domainRating: entry?.domain_rating ?? 0,
        urlRating: entry?.url_rating ?? 0,
        backlinks: entry?.backlinks ?? 0,
        referringDomains: entry?.referring_domains ?? 0,
        organicKeywords: entry?.organic_keywords ?? 0,
        organicTraffic: entry?.organic_traffic ?? 0,
        trafficValue: entry?.traffic_value ?? 0,
      } satisfies AhrefsSiteOverview;
    },

    async getOrganicKeywords(domain, options?: AhrefsPaginationOptions) {
      const limit = options?.limit ?? DEFAULT_LIMIT;
      const offset = options?.offset ?? 0;
      const params = buildOrganicKeywordsParams(domain, limit, offset);
      const raw = await http.get<AhrefsApiResponse<AhrefsRawOrganicKeyword>>(
        organicKeywordsPath(),
        params,
      );
      const data: AhrefsOrganicKeyword[] = (raw.data ?? []).map((r) => ({
        keyword: r.keyword,
        position: r.position,
        searchVolume: r.volume,
        cpc: r.cpc,
        url: r.url,
        traffic: r.traffic,
        trafficPercent: r.traffic_percent,
        difficulty: r.difficulty,
      }));
      return {
        data,
        total: raw.total ?? 0,
        offset,
        limit,
        hasMore: data.length === limit,
      } satisfies PaginatedResponse<AhrefsOrganicKeyword>;
    },

    async getBacklinks(domain, options?: AhrefsPaginationOptions) {
      const limit = options?.limit ?? DEFAULT_LIMIT;
      const offset = options?.offset ?? 0;
      const params = buildBacklinksParams(domain, limit, offset);
      const raw = await http.get<AhrefsApiResponse<AhrefsRawBacklink>>(
        backlinksPath(),
        params,
      );
      const data: AhrefsBacklink[] = (raw.data ?? []).map((r) => ({
        sourceUrl: r.url_from,
        targetUrl: r.url_to,
        anchorText: r.anchor,
        domainRating: r.domain_rating,
        urlRating: r.url_rating,
        isDoFollow: r.is_dofollow,
        firstSeen: r.first_seen,
        lastSeen: r.last_seen,
      }));
      return {
        data,
        total: raw.total ?? 0,
        offset,
        limit,
        hasMore: data.length === limit,
      } satisfies PaginatedResponse<AhrefsBacklink>;
    },

    async getKeywordDifficulty(keywords) {
      const params = buildKeywordDifficultyParams(keywords);
      const raw = await http.get<AhrefsApiResponse<AhrefsRawKeywordDifficulty>>(
        keywordDifficultyPath(),
        params,
      );
      return (raw.data ?? []).map((r): AhrefsKeywordDifficulty => ({
        keyword: r.keyword,
        difficulty: r.difficulty,
        searchVolume: r.volume,
        cpc: r.cpc,
        clicks: r.clicks,
        globalVolume: r.global_volume,
      }));
    },

    async getReferringDomains(domain, options?: AhrefsPaginationOptions) {
      const limit = options?.limit ?? DEFAULT_LIMIT;
      const offset = options?.offset ?? 0;
      const params = buildReferringDomainsParams(domain, limit, offset);
      const raw = await http.get<AhrefsApiResponse<AhrefsRawReferringDomain>>(
        referringDomainsPath(),
        params,
      );
      const data: AhrefsReferringDomain[] = (raw.data ?? []).map((r) => ({
        domain: r.domain,
        domainRating: r.domain_rating,
        backlinks: r.backlinks,
        firstSeen: r.first_seen,
        lastSeen: r.last_seen,
        isDoFollow: r.is_dofollow,
      }));
      return {
        data,
        total: raw.total ?? 0,
        offset,
        limit,
        hasMore: data.length === limit,
      } satisfies PaginatedResponse<AhrefsReferringDomain>;
    },
  };
}
