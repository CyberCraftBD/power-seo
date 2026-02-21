import { describe, it, expect, vi } from 'vitest';
import { toNextRedirects } from '../adapters/nextjs.js';
import { createRemixRedirectHandler } from '../adapters/remix.js';
import { createExpressRedirectMiddleware } from '../adapters/express.js';
import type { RedirectRule } from '@power-seo/core';

describe('toNextRedirects', () => {
  it('maps 301 to permanent: true', () => {
    const rules: RedirectRule[] = [{ source: '/old', destination: '/new', statusCode: 301 }];
    const result = toNextRedirects(rules);
    expect(result).toEqual([{ source: '/old', destination: '/new', permanent: true }]);
  });

  it('maps 308 to permanent: true', () => {
    const rules: RedirectRule[] = [{ source: '/old', destination: '/new', statusCode: 308 }];
    const result = toNextRedirects(rules);
    expect(result[0]!.permanent).toBe(true);
  });

  it('maps 302 to permanent: false', () => {
    const rules: RedirectRule[] = [{ source: '/old', destination: '/new', statusCode: 302 }];
    const result = toNextRedirects(rules);
    expect(result[0]!.permanent).toBe(false);
  });

  it('maps 307 to permanent: false', () => {
    const rules: RedirectRule[] = [{ source: '/old', destination: '/new', statusCode: 307 }];
    const result = toNextRedirects(rules);
    expect(result[0]!.permanent).toBe(false);
  });

  it('filters out 410 (Gone) rules', () => {
    const rules: RedirectRule[] = [
      { source: '/old', destination: '', statusCode: 410 },
      { source: '/kept', destination: '/new', statusCode: 301 },
    ];
    const result = toNextRedirects(rules);
    expect(result).toHaveLength(1);
    expect(result[0]!.source).toBe('/kept');
  });

  it('handles regex patterns', () => {
    const rules: RedirectRule[] = [
      { source: '/old/(.*)', destination: '/new/$1', statusCode: 301, isRegex: true },
    ];
    const result = toNextRedirects(rules);
    expect(result[0]!.source).toBe('/old/(.*)');
    expect(result[0]!.destination).toBe('/new/$1');
  });
});

describe('createRemixRedirectHandler', () => {
  it('returns redirect Response for matching rule', () => {
    const handler = createRemixRedirectHandler([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    const request = new globalThis.Request('https://example.com/old');
    const response = handler(request);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(301);
  });

  it('returns null for non-matching rule', () => {
    const handler = createRemixRedirectHandler([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    const request = new globalThis.Request('https://example.com/other');
    const response = handler(request);
    expect(response).toBeNull();
  });

  it('handles 410 Gone with empty response', () => {
    const handler = createRemixRedirectHandler([
      { source: '/gone', destination: '', statusCode: 410 },
    ]);
    const request = new globalThis.Request('https://example.com/gone');
    const response = handler(request);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(410);
  });
});

describe('createExpressRedirectMiddleware', () => {
  it('calls res.redirect for matching rule', () => {
    const middleware = createExpressRedirectMiddleware([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    const req = { url: '/old' };
    const res = {
      redirect: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith(301, '/new');
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() for non-matching rule', () => {
    const middleware = createExpressRedirectMiddleware([
      { source: '/old', destination: '/new', statusCode: 301 },
    ]);
    const req = { url: '/other' };
    const res = {
      redirect: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });

  it('handles 410 Gone by setting status', () => {
    const middleware = createExpressRedirectMiddleware([
      { source: '/gone', destination: '', statusCode: 410 },
    ]);
    const req = { url: '/gone' };
    const res = {
      redirect: vi.fn(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn(),
    };
    const next = vi.fn();

    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(410);
    expect(res.end).toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
