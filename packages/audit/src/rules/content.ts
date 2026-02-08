// ============================================================================
// @ccbd-seo/audit — Content Rules
// ============================================================================

import { analyzeContent } from '@ccbd-seo/content-analysis';
import { analyzeReadability } from '@ccbd-seo/readability';
import type { PageAuditInput, AuditRule, AuditSeverity } from '../types.js';
import type { AnalysisStatus } from '@ccbd-seo/core';

function statusToSeverity(status: AnalysisStatus): AuditSeverity {
  switch (status) {
    case 'good':
      return 'pass';
    case 'ok':
      return 'warning';
    case 'poor':
      return 'error';
  }
}

export function runContentRules(input: PageAuditInput): AuditRule[] {
  const rules: AuditRule[] = [];

  if (!input.content) {
    rules.push({
      id: 'content-missing',
      category: 'content',
      title: 'Page content',
      description: 'No content provided for analysis.',
      severity: 'warning',
    });
    return rules;
  }

  // Content analysis
  const contentResult = analyzeContent({
    title: input.title,
    metaDescription: input.metaDescription,
    content: input.content,
    focusKeyphrase: input.focusKeyphrase,
    internalLinks: input.internalLinks,
    externalLinks: input.externalLinks,
    images: input.images?.map((img) => ({ src: img.src, alt: img.alt })),
  });

  for (const result of contentResult.results) {
    rules.push({
      id: `content-${result.id}`,
      category: 'content',
      title: result.title,
      description: result.description,
      severity: statusToSeverity(result.status),
    });
  }

  // Readability analysis
  const readabilityResult = analyzeReadability({ content: input.content });

  for (const result of readabilityResult.results) {
    rules.push({
      id: `readability-${result.id}`,
      category: 'content',
      title: result.title,
      description: result.description,
      severity: statusToSeverity(result.status),
    });
  }

  return rules;
}
