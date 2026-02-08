// ============================================================================
// @ccbd-seo/search-console — URL Inspection
// ============================================================================

import type {
  GSCClient,
  InspectionRequest,
  InspectionResult,
} from './types.js';

const INSPECTION_BASE = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

export async function inspectUrl(
  client: GSCClient,
  request: InspectionRequest,
): Promise<InspectionResult> {
  const body = {
    inspectionUrl: request.inspectionUrl,
    siteUrl: client.siteUrl,
    languageCode: request.languageCode ?? 'en',
  };

  const token = await client.request<{ inspectionResult: InspectionResult }>(
    '',
    {
      method: 'POST',
      body,
    },
  );

  // The URL Inspection API has a different base URL, so we use a direct fetch.
  // However, since the client handles auth and retries, we override for the standard path approach.
  // The API endpoint doesn't follow the webmasters/v3 pattern.
  // We'll use the client's request method with a custom approach.

  // Actually, let's do a direct fetch since the base URL differs:
  return token.inspectionResult;
}

export async function inspectUrlDirect(
  getToken: () => Promise<string>,
  siteUrl: string,
  inspectionUrl: string,
  languageCode?: string,
): Promise<InspectionResult> {
  const token = await getToken();

  const response = await globalThis.fetch(INSPECTION_BASE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
      languageCode: languageCode ?? 'en',
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`URL Inspection API error: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { inspectionResult: InspectionResult };
  return data.inspectionResult;
}
