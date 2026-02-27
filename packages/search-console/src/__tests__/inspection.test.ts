import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inspectUrl } from '../inspection.js';
import type { GSCClient, InspectionResult } from '../types.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('inspectUrl', () => {
  it('should return inspection result', async () => {
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

    const client: GSCClient = {
      siteUrl: 'https://example.com',
      request: vi.fn().mockResolvedValue({ inspectionResult: mockResult }),
    };

    const result = await inspectUrl(client, {
      inspectionUrl: 'https://example.com/page',
    });

    expect(result.indexStatusResult.verdict).toBe('PASS');
    expect(result.indexStatusResult.coverageState).toBe('INDEXED');
    expect(result.inspectionResultLink).toBeDefined();
  });

  it('should pass language code', async () => {
    const client: GSCClient = {
      siteUrl: 'https://example.com',
      request: vi.fn().mockResolvedValue({
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
    };

    await inspectUrl(client, {
      inspectionUrl: 'https://example.com/fr/page',
      languageCode: 'fr',
    });

    expect(client.request).toHaveBeenCalledWith(
      '',
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({ languageCode: 'fr' }),
      }),
    );
  });

  it('should include mobile usability when available', async () => {
    const client: GSCClient = {
      siteUrl: 'https://example.com',
      request: vi.fn().mockResolvedValue({
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
    };

    const result = await inspectUrl(client, {
      inspectionUrl: 'https://example.com/page',
    });

    expect(result.mobileUsabilityResult?.verdict).toBe('PASS');
  });
});
