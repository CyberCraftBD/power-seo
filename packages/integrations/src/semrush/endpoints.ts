// @power-seo/integrations — Semrush Endpoints
// ----------------------------------------------------------------------------

export const SEMRUSH_BASE_URL = 'https://api.semrush.com';

export function domainOverviewPath(): string {
  return '/analytics/v1/';
}

export function organicKeywordsPath(): string {
  return '/analytics/v1/';
}

export function backlinksPath(): string {
  return '/analytics/v1/';
}

export function keywordDifficultyPath(): string {
  return '/analytics/v1/';
}

export function relatedKeywordsPath(): string {
  return '/analytics/v1/';
}

export function buildDomainOverviewParams(
  domain: string,
  database: string,
): Record<string, string> {
  return {
    type: 'domain_ranks',
    domain,
    database,
    export_columns: 'Or,Ot,Oc,Ad,At,Ac,Bk,As',
  };
}

export function buildOrganicKeywordsParams(
  domain: string,
  database: string,
  limit: number,
  offset: number,
): Record<string, string> {
  return {
    type: 'domain_organic',
    domain,
    database,
    display_limit: String(limit),
    display_offset: String(offset),
    export_columns: 'Ph,Po,Pp,Nq,Cp,Ur,Tr,Tc,Co,Td',
  };
}

export function buildBacklinksParams(
  domain: string,
  limit: number,
  offset: number,
): Record<string, string> {
  return {
    type: 'backlinks',
    target: domain,
    target_type: 'root_domain',
    display_limit: String(limit),
    display_offset: String(offset),
    export_columns: 'source_url,target_url,anchor,nofollow,first_seen,last_seen,source_ascore',
  };
}

export function buildKeywordDifficultyParams(
  keywords: string[],
  database: string,
): Record<string, string> {
  return {
    type: 'phrase_all',
    phrase: keywords.join(';'),
    database,
    export_columns: 'Ph,Kd,Nq,Cp,Co,Nr',
  };
}

export function buildRelatedKeywordsParams(
  keyword: string,
  database: string,
): Record<string, string> {
  return {
    type: 'phrase_related',
    phrase: keyword,
    database,
    export_columns: 'Ph,Nq,Cp,Co,Nr,Rr',
  };
}
