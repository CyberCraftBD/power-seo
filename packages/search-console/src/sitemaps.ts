// ============================================================================
// @power-seo/search-console — Sitemaps
// ============================================================================

import type {
  GSCClient,
  SitemapEntry,
  SitemapListResponse,
} from './types.js';

export async function listSitemaps(
  client: GSCClient,
): Promise<SitemapEntry[]> {
  const siteUrl = encodeURIComponent(client.siteUrl);
  const response = await client.request<SitemapListResponse>(
    `/sites/${siteUrl}/sitemaps`,
  );
  return response.sitemap ?? [];
}

export async function submitSitemap(
  client: GSCClient,
  feedpath: string,
): Promise<void> {
  const siteUrl = encodeURIComponent(client.siteUrl);
  const encodedFeed = encodeURIComponent(feedpath);
  await client.request<void>(
    `/sites/${siteUrl}/sitemaps/${encodedFeed}`,
    { method: 'PUT' },
  );
}

export async function deleteSitemap(
  client: GSCClient,
  feedpath: string,
): Promise<void> {
  const siteUrl = encodeURIComponent(client.siteUrl);
  const encodedFeed = encodeURIComponent(feedpath);
  await client.request<void>(
    `/sites/${siteUrl}/sitemaps/${encodedFeed}`,
    { method: 'DELETE' },
  );
}
