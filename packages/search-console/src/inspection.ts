// @power-seo/search-console — URL Inspection
// ----------------------------------------------------------------------------

import type { GSCClient, InspectionRequest, InspectionResult } from './types.js';
import { sanitizeErrorSnippet } from '@power-seo/core';

const INSPECTION_BASE = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

export async function inspectUrl(
  client: GSCClient,
  request: InspectionRequest,
): Promise<InspectionResult> {
  // The URL Inspection API lives at a different base URL (`INSPECTION_BASE`,
  // the `v1/urlInspection` endpoint) than the webmasters/v3 client base, so we
  // cannot route it through `client.request`. Delegate to `inspectUrlDirect`,
  // reusing the client's token manager for auth.
  return inspectUrlDirect(
    () => client.auth.getToken(),
    client.siteUrl,
    request.inspectionUrl,
    request.languageCode,
  );
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
    throw new Error(`URL Inspection API error: ${response.status} ${sanitizeErrorSnippet(text)}`);
  }

  const data = (await response.json()) as { inspectionResult: InspectionResult };
  return data.inspectionResult;
}
