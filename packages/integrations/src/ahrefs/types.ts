// ============================================================================
// @ccbd-seo/integrations — Ahrefs Internal Types
// ============================================================================

export interface AhrefsRawSiteOverview {
  domain_rating: number;
  url_rating: number;
  backlinks: number;
  referring_domains: number;
  organic_keywords: number;
  organic_traffic: number;
  traffic_value: number;
}

export interface AhrefsRawOrganicKeyword {
  keyword: string;
  position: number;
  volume: number;
  cpc: number;
  url: string;
  traffic: number;
  traffic_percent: number;
  difficulty: number;
}

export interface AhrefsRawBacklink {
  url_from: string;
  url_to: string;
  anchor: string;
  domain_rating: number;
  url_rating: number;
  is_dofollow: boolean;
  first_seen: string;
  last_seen: string;
}

export interface AhrefsRawKeywordDifficulty {
  keyword: string;
  difficulty: number;
  volume: number;
  cpc: number;
  clicks: number;
  global_volume: number;
}

export interface AhrefsRawReferringDomain {
  domain: string;
  domain_rating: number;
  backlinks: number;
  first_seen: string;
  last_seen: string;
  is_dofollow: boolean;
}

export interface AhrefsApiResponse<T> {
  data: T[];
  total: number;
}
