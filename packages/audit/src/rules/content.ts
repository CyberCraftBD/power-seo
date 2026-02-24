// @power-seo/audit — Content Rules
// ----------------------------------------------------------------------------

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

    if (typeof input.wordCount === 'number') {
      const wc = input.wordCount;
      rules.push({
        id: 'content-word-count',
        category: 'content',
        title: 'Word count',
        description:
          wc >= 300
            ? `Page has ${wc} words — meets the recommended minimum of 300.`
            : `Page has only ${wc} words. Aim for at least 300 words for substantive content.`,
        severity: wc >= 300 ? 'pass' : wc === 0 ? 'error' : 'warning',
      });
    }

    if (typeof input.keywordDensity === 'number') {
      const kd = input.keywordDensity;
      rules.push({
        id: 'content-keyphrase-density',
        category: 'content',
        title: 'Keyphrase density',
        description:
          kd >= 0.5 && kd <= 3.0
            ? `Keyphrase density is ${kd.toFixed(2)}% — within the recommended 0.5–3.0% range.`
            : kd > 3.0
              ? `Keyphrase density is ${kd.toFixed(2)}% — above 3.0%. Reduce keyphrase repetition to avoid over-optimisation.`
              : `Keyphrase density is ${kd.toFixed(2)}% — below the recommended 0.5%. Use the focus keyphrase more naturally in the content.`,
        severity: kd >= 0.5 && kd <= 3.0 ? 'pass' : 'warning',
      });
    }

    return rules;
  }

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
