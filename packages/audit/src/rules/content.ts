// ============================================================================
// @power-seo/audit — Content Rules
// ============================================================================

import { analyzeContent } from '@power-seo/content-analysis';
import { analyzeReadability } from '@power-seo/readability';
import type { PageAuditInput, AuditRule, AuditSeverity } from '../types.js';
import type { AnalysisStatus } from '@power-seo/core';

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
    // If numeric proxies were supplied, generate rule results from them directly
    // instead of returning a generic "no content" warning.
    const hasProxies =
      typeof input.wordCount === 'number' || typeof input.keywordDensity === 'number';

    if (!hasProxies) {
      rules.push({
        id: 'content-missing',
        category: 'content',
        title: 'Page content',
        description: 'No content provided for analysis.',
        severity: 'warning',
      });
      return rules;
    }

    // Word-count rule from proxy value
    if (typeof input.wordCount === 'number') {
      const wc = input.wordCount;
      if (wc >= 300) {
        rules.push({
          id: 'content-word-count',
          category: 'content',
          title: 'Word count',
          description: `Page has ${wc} words — meets the recommended minimum of 300.`,
          severity: 'pass',
        });
      } else {
        rules.push({
          id: 'content-word-count',
          category: 'content',
          title: 'Word count',
          description: `Page has only ${wc} words. Aim for at least 300 words for substantive content.`,
          severity: wc === 0 ? 'error' : 'warning',
        });
      }
    }

    // Keyword density rule from proxy value
    if (typeof input.keywordDensity === 'number') {
      const kd = input.keywordDensity;
      if (kd >= 0.5 && kd <= 3.0) {
        rules.push({
          id: 'content-keyphrase-density',
          category: 'content',
          title: 'Keyphrase density',
          description: `Keyphrase density is ${kd.toFixed(2)}% — within the recommended 0.5–3.0% range.`,
          severity: 'pass',
        });
      } else if (kd > 3.0) {
        rules.push({
          id: 'content-keyphrase-density',
          category: 'content',
          title: 'Keyphrase density',
          description: `Keyphrase density is ${kd.toFixed(2)}% — above 3.0%. Reduce keyphrase repetition to avoid over-optimisation.`,
          severity: 'warning',
        });
      } else {
        rules.push({
          id: 'content-keyphrase-density',
          category: 'content',
          title: 'Keyphrase density',
          description: `Keyphrase density is ${kd.toFixed(2)}% — below the recommended 0.5%. Use the focus keyphrase more naturally in the content.`,
          severity: 'warning',
        });
      }
    }

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
