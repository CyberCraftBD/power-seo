// ============================================================================
// @ccbd-seo/search-console — Analytics
// ============================================================================

import type {
  GSCClient,
  SearchAnalyticsRequest,
  SearchAnalyticsResponse,
  SearchAnalyticsRow,
} from './types.js';

const MAX_ROW_LIMIT = 25000;
const DEFAULT_ROW_LIMIT = 1000;

export async function querySearchAnalytics(
  client: GSCClient,
  request: SearchAnalyticsRequest,
): Promise<SearchAnalyticsResponse> {
  const siteUrl = encodeURIComponent(client.siteUrl);
  const body = {
    ...request,
    rowLimit: Math.min(request.rowLimit ?? DEFAULT_ROW_LIMIT, MAX_ROW_LIMIT),
  };

  return client.request<SearchAnalyticsResponse>(
    `/sites/${siteUrl}/searchAnalytics/query`,
    { method: 'POST', body },
  );
}

export async function querySearchAnalyticsAll(
  client: GSCClient,
  request: Omit<SearchAnalyticsRequest, 'startRow' | 'rowLimit'>,
): Promise<SearchAnalyticsRow[]> {
  const allRows: SearchAnalyticsRow[] = [];
  let startRow = 0;

  while (true) {
    const response = await querySearchAnalytics(client, {
      ...request,
      rowLimit: MAX_ROW_LIMIT,
      startRow,
    });

    const rows = response.rows ?? [];
    allRows.push(...rows);

    if (rows.length < MAX_ROW_LIMIT) {
      break;
    }

    startRow += rows.length;
  }

  return allRows;
}
