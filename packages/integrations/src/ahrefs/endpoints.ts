// ============================================================================
// @power-seo/integrations — Ahrefs Endpoints
// ============================================================================

export const AHREFS_BASE_URL = 'https://api.ahrefs.com/v3';

export function siteOverviewPath(): string {
  return '/site-explorer/overview';
}

export function organicKeywordsPath(): string {
  return '/site-explorer/organic-keywords';
}

export function backlinksPath(): string {
  return '/site-explorer/backlinks';
}

export function keywordDifficultyPath(): string {
  return '/keywords-explorer/keyword-difficulty';
}

export function referringDomainsPath(): string {
  return '/site-explorer/referring-domains';
}

export function buildSiteOverviewParams(domain: string): Record<string, string> {
  return { target: domain, mode: 'domain' };
}

export function buildOrganicKeywordsParams(
  domain: string,
  limit: number,
  offset: number,
): Record<string, string> {
  return {
    target: domain,
    mode: 'domain',
    limit: String(limit),
    offset: String(offset),
  };
}

export function buildBacklinksParams(
  domain: string,
  limit: number,
  offset: number,
): Record<string, string> {
  return {
    target: domain,
    mode: 'domain',
    limit: String(limit),
    offset: String(offset),
  };
}

export function buildKeywordDifficultyParams(
  keywords: string[],
): Record<string, string> {
  return {
    keywords: keywords.join(','),
  };
}

export function buildReferringDomainsParams(
  domain: string,
  limit: number,
  offset: number,
): Record<string, string> {
  return {
    target: domain,
    mode: 'domain',
    limit: String(limit),
    offset: String(offset),
  };
}
