import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inspectUrl } from '../inspection.js';
import type { GSCClient, InspectionResult, TokenManager } from '../types.js';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const INSPECTION_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

function createMockAuth(): TokenManager {
  return {
    getToken: vi.fn().mockResolvedValue('test-token'),
    invalidate: vi.fn(),
  };
}

function createMockClient(auth = createMockAuth()): GSCClient {
  return {
    siteUrl: 'https://example.com',
    auth,
    request: vi.fn(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('inspectUrl', () => {
  it('should POST to the URL Inspection endpoint, not the client request/v3 root (issue #144)', async () => {
    const mockResult: InspectionResult = {
      inspectionResultLink: 'https://search.google.com/search-console/inspect?resource_id=...',
      indexStatusResult: {
        verdict: 'PASS',
        coverageState: 'INDEXED',
        robotsTxtState: 'ALLOWED',
        indexingState: 'INDEXING_ALLOWED',
        lastCrawlTime: '2024-01-15T10:30:00Z',
        pageFetchState: 'SUCCESSFUL',
      },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ inspectionResult: mockResult }),
    });

    const client = createMockClient();
    const result = await inspectUrl(client, { inspectionUrl: 'https://example.com/page' });

    expect(result.indexStatusResult.verdict).toBe('PASS');
    expect(result.indexStatusResult.coverageState).toBe('INDEXED');
    expect(result.inspectionResultLink).toBeDefined();

    // Must hit the dedicated Inspection endpoint, and must NOT route through client.request.
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    expect(url).toBe(INSPECTION_ENDPOINT);
    expect(options.method).toBe('POST');
    expect(client.request).not.toHaveBeenCalled();
  });

  it('should send siteUrl, inspectionUrl and language code in the body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        inspectionResult: {
          inspectionResultLink: '',
          indexStatusResult: {
            verdict: 'PASS',
            coverageState: 'INDEXED',
            robotsTxtState: 'ALLOWED',
            indexingState: 'INDEXING_ALLOWED',
          },
        },
      }),
    });

    const auth = createMockAuth();
    await inspectUrl(createMockClient(auth), {
      inspectionUrl: 'https://example.com/fr/page',
      languageCode: 'fr',
    });

    const [, options] = mockFetch.mock.calls[0] as [string, globalThis.RequestInit];
    const body = JSON.parse(options.body as string) as {
      inspectionUrl: string;
      siteUrl: string;
      languageCode: string;
    };
    expect(body.inspectionUrl).toBe('https://example.com/fr/page');
    expect(body.siteUrl).toBe('https://example.com');
    expect(body.languageCode).toBe('fr');
    // Reuses the client's token manager for auth.
    expect(auth.getToken).toHaveBeenCalled();
  });

  it('should include mobile usability when available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        inspectionResult: {
          inspectionResultLink: '',
          indexStatusResult: {
            verdict: 'PASS',
            coverageState: 'INDEXED',
            robotsTxtState: 'ALLOWED',
            indexingState: 'INDEXING_ALLOWED',
          },
          mobileUsabilityResult: {
            verdict: 'PASS',
            issues: [],
          },
        },
      }),
    });

    const result = await inspectUrl(createMockClient(), {
      inspectionUrl: 'https://example.com/page',
    });

    expect(result.mobileUsabilityResult?.verdict).toBe('PASS');
  });
});
