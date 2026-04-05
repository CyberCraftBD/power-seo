// @power-seo/audit — Performance Rules

import type { PageAuditInput, AuditRule } from '../types.js';

export function runPerformanceRules(input: PageAuditInput): AuditRule[] {
  const rules: AuditRule[] = [];

  if (input.responseTime !== undefined) {
    rules.push({
      id: 'perf-response-time',
      category: 'performance',
      title: 'Response time',
      description:
        input.responseTime > 3000
          ? `Response time is ${input.responseTime}ms (> 3000ms). This page loads very slowly.`
          : input.responseTime > 1000
            ? `Response time is ${input.responseTime}ms (> 1000ms). Consider optimizing for faster load times.`
            : `Response time is ${input.responseTime}ms. Good performance.`,
      severity:
        input.responseTime > 3000 ? 'error' : input.responseTime > 1000 ? 'warning' : 'pass',
    });
  }

  if (input.contentLength !== undefined) {
    rules.push({
      id: 'perf-content-size',
      category: 'performance',
      title: 'Content size',
      description:
        input.contentLength > 100_000
          ? `Content size is ${Math.round(input.contentLength / 1024)}KB (> 100KB). Consider reducing page weight.`
          : `Content size is ${Math.round(input.contentLength / 1024)}KB. Acceptable page weight.`,
      severity: input.contentLength > 100_000 ? 'warning' : 'pass',
    });
  }

  if (input.images) {
    rules.push({
      id: 'perf-image-count',
      category: 'performance',
      title: 'Image count',
      description:
        input.images.length > 50
          ? `Page has ${input.images.length} images (> 50). Consider lazy loading or reducing image count.`
          : `Page has ${input.images.length} image(s). Acceptable count.`,
      severity: input.images.length > 50 ? 'warning' : 'pass',
    });

    const missingAlt = input.images.filter((img) => !img.alt);
    rules.push({
      id: 'perf-image-alt',
      category: 'performance',
      title: 'Image alt text',
      description:
        missingAlt.length > 0
          ? `${missingAlt.length} image(s) are missing alt text. Add descriptive alt attributes for accessibility and SEO.`
          : 'All images have alt text.',
      severity: missingAlt.length > 0 ? 'warning' : 'pass',
    });
  }

  if (input.statusCode !== undefined) {
    rules.push({
      id: 'perf-status-code',
      category: 'performance',
      title: 'HTTP status code',
      description:
        input.statusCode >= 400
          ? `Page returned status ${input.statusCode}. This indicates a client or server error.`
          : input.statusCode >= 300
            ? `Page returned status ${input.statusCode} (redirect). Ensure this is intentional.`
            : `Page returned status ${input.statusCode}. OK.`,
      severity: input.statusCode >= 400 ? 'error' : input.statusCode >= 300 ? 'warning' : 'pass',
    });
  }

  return rules;
}
