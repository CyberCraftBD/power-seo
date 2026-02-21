// ============================================================================
// @power-seo/analytics — Merge GSC + Audit Data
// ============================================================================

import { normalizeUrl } from '@power-seo/core';
import type { GscPageData, PageInsight, AuditCategory, CategoryResult } from './types.js';

interface AuditData {
  url: string;
  score: number;
  categories: Record<AuditCategory, CategoryResult>;
  recommendations: string[];
}

export function mergeGscWithAudit(
  gscData: GscPageData[],
  auditResults: AuditData[],
): PageInsight[] {
  const auditMap = new Map<string, AuditData>();
  for (const result of auditResults) {
    auditMap.set(normalizeUrl(result.url), result);
  }

  const gscMap = new Map<string, GscPageData>();
  for (const page of gscData) {
    gscMap.set(normalizeUrl(page.url), page);
  }

  const allUrls = new Set([...auditMap.keys(), ...gscMap.keys()]);
  const insights: PageInsight[] = [];

  for (const url of allUrls) {
    const gsc = gscMap.get(url);
    const audit = auditMap.get(url);
    const opportunities: string[] = [];

    if (gsc && audit) {
      if (gsc.clicks > 50 && audit.score < 70) {
        opportunities.push(
          `High-traffic page (${gsc.clicks} clicks) with low audit score (${audit.score}). Fixing issues could significantly boost organic performance.`,
        );
      }
      if (gsc.position > 10 && gsc.impressions > 100) {
        opportunities.push(
          `Page has ${gsc.impressions} impressions at position ${gsc.position.toFixed(1)}. Improving to page 1 could unlock significant traffic.`,
        );
      }
      if (audit.recommendations.length > 0) {
        opportunities.push(...audit.recommendations.slice(0, 3));
      }
    } else if (gsc && !audit) {
      opportunities.push(
        'Page receives search traffic but has not been audited. Run an audit to identify improvement opportunities.',
      );
    } else if (!gsc && audit) {
      if (audit.score < 50) {
        opportunities.push(
          `Page has a low audit score (${audit.score}) and no search traffic. Consider improving or removing the page.`,
        );
      }
    }

    insights.push({
      url,
      gscMetrics: gsc
        ? { clicks: gsc.clicks, impressions: gsc.impressions, ctr: gsc.ctr, position: gsc.position }
        : undefined,
      auditScore: audit?.score,
      auditCategories: audit?.categories,
      opportunities,
    });
  }

  return insights;
}

export function correlateScoreAndTraffic(insights: PageInsight[]): {
  correlation: number;
  topOpportunities: PageInsight[];
} {
  const paired = insights.filter((i) => i.gscMetrics && i.auditScore !== undefined);

  if (paired.length < 2) {
    return { correlation: 0, topOpportunities: [] };
  }

  const scores = paired.map((i) => i.auditScore!);
  const clicks = paired.map((i) => i.gscMetrics!.clicks);

  const n = scores.length;
  const meanScore = scores.reduce((a, b) => a + b, 0) / n;
  const meanClicks = clicks.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomScore = 0;
  let denomClicks = 0;

  for (let i = 0; i < n; i++) {
    const diffScore = (scores[i] ?? 0) - meanScore;
    const diffClicks = (clicks[i] ?? 0) - meanClicks;
    numerator += diffScore * diffClicks;
    denomScore += diffScore * diffScore;
    denomClicks += diffClicks * diffClicks;
  }

  const denominator = Math.sqrt(denomScore * denomClicks);
  const correlation = denominator === 0 ? 0 : numerator / denominator;

  // Top opportunities: high traffic, low score
  const topOpportunities = [...paired]
    .filter((i) => i.gscMetrics!.clicks > 0)
    .sort((a, b) => {
      const scoreA = a.gscMetrics!.clicks / (a.auditScore! || 1);
      const scoreB = b.gscMetrics!.clicks / (b.auditScore! || 1);
      return scoreB - scoreA;
    })
    .slice(0, 10);

  return { correlation: Math.round(correlation * 1000) / 1000, topOpportunities };
}
