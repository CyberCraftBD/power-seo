// @power-seo/audit — Page Audit

import type {
  PageAuditInput,
  PageAuditResult,
  AuditRule,
  AuditCategory,
  CategoryResult,
} from './types.js';
import { runMetaRules } from './rules/meta.js';
import { runContentRules } from './rules/content.js';
import { runStructureRules } from './rules/structure.js';
import { runPerformanceRules } from './rules/performance.js';

const CATEGORY_WEIGHTS: Record<AuditCategory, number> = {
  meta: 0.3,
  content: 0.3,
  structure: 0.25,
  performance: 0.15,
};

function calculateCategoryResult(rules: AuditRule[]): CategoryResult & { scored: boolean } {
  let passed = 0;
  let warnings = 0;
  let errors = 0;

  for (const rule of rules) {
    switch (rule.severity) {
      case 'pass':
        passed++;
        break;
      case 'warning':
        warnings++;
        break;
      case 'error':
        errors++;
        break;
    }
  }

  const total = passed + warnings + errors;
  return {
    score: total > 0 ? Math.round((passed / total) * 100) : 0,
    passed,
    warnings,
    errors,
    scored: total > 0,
  };
}

export function auditPage(input: PageAuditInput): PageAuditResult {
  const metaRules = runMetaRules(input);
  const contentRules = runContentRules(input);
  const structureRules = runStructureRules(input);
  const performanceRules = runPerformanceRules(input);

  const allRules = [...metaRules, ...contentRules, ...structureRules, ...performanceRules];

  const results: Record<AuditCategory, CategoryResult & { scored: boolean }> = {
    meta: calculateCategoryResult(metaRules),
    content: calculateCategoryResult(contentRules),
    structure: calculateCategoryResult(structureRules),
    performance: calculateCategoryResult(performanceRules),
  };

  // Only categories that produced at least one scoring rule (pass/warning/error)
  // contribute to the overall score; their weights are renormalized so unpopulated
  // categories don't inflate the page score with a synthetic value.
  const totalWeight = (Object.keys(results) as AuditCategory[]).reduce(
    (sum, cat) => (results[cat].scored ? sum + CATEGORY_WEIGHTS[cat] : sum),
    0,
  );

  const score =
    totalWeight > 0
      ? Math.round(
          (Object.keys(results) as AuditCategory[]).reduce(
            (sum, cat) =>
              results[cat].scored ? sum + results[cat].score * CATEGORY_WEIGHTS[cat] : sum,
            0,
          ) / totalWeight,
        )
      : 0;

  const toCategoryResult = (r: CategoryResult & { scored: boolean }): CategoryResult => ({
    score: r.score,
    passed: r.passed,
    warnings: r.warnings,
    errors: r.errors,
  });

  const categories: Record<AuditCategory, CategoryResult> = {
    meta: toCategoryResult(results.meta),
    content: toCategoryResult(results.content),
    structure: toCategoryResult(results.structure),
    performance: toCategoryResult(results.performance),
  };

  const recommendations = allRules
    .filter((r) => r.severity === 'error' || r.severity === 'warning')
    .map((r) => r.description);

  return { url: input.url, score, categories, rules: allRules, recommendations };
}
