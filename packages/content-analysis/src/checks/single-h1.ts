// @power-seo/content-analysis — Single H1 Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

interface HeadingInfo {
  level: number;
  text: string;
  rawHtml: string;
}

/**
 * Parse all headings (h1-h6) from HTML using plain string search.
 * Avoids regex ReDoS on crafted inputs.
 */
function parseHeadings(html: string): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const lc = html.toLowerCase();
  let pos = 0;

  while (pos < lc.length) {
    let earliest = -1;
    let earliestLevel = 0;
    for (let level = 1; level <= 6; level++) {
      const idx = lc.indexOf(`<h${level}`, pos);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestLevel = level;
      }
    }
    if (earliest === -1) break;

    const contentStart = lc.indexOf('>', earliest);
    if (contentStart === -1) break;

    const closeTag = `</h${earliestLevel}>`;
    const closeIdx = lc.indexOf(closeTag, contentStart + 1);
    if (closeIdx === -1) {
      pos = contentStart + 1;
      continue;
    }

    const rawInner = html.slice(contentStart + 1, closeIdx);
    headings.push({
      level: earliestLevel,
      text: stripHtml(rawInner).trim(),
      rawHtml: rawInner,
    });
    pos = closeIdx + closeTag.length;
  }

  return headings;
}

/**
 * Check that the page has exactly 0-1 H1 tags, none are empty or duplicated,
 * and the heading hierarchy is correct (no skipped levels).
 */
export function checkSingleH1(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const headings = parseHeadings(content);
  const h1s = headings.filter((h) => h.level === 1);

  const issues: string[] = [];
  let severity: 'good' | 'ok' | 'poor' = 'good';

  // --- Multiple H1s ---
  if (h1s.length > 1) {
    issues.push(`Found ${h1s.length} H1 tags. Use exactly one H1 per page.`);
    severity = 'poor';
  }

  // --- Empty H1s ---
  const emptyH1s = h1s.filter((h) => h.text.length === 0);
  if (emptyH1s.length > 0) {
    issues.push(
      `Found ${emptyH1s.length} empty H1 tag${emptyH1s.length > 1 ? 's' : ''}. ` +
        'H1 tags should contain meaningful text.',
    );
    if (severity !== 'poor') severity = 'poor';
  }

  // --- Duplicate H1 text ---
  if (h1s.length > 1) {
    const h1Texts = h1s.map((h) => h.text.toLowerCase()).filter((t) => t.length > 0);
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const text of h1Texts) {
      if (seen.has(text)) {
        duplicates.add(text);
      }
      seen.add(text);
    }
    if (duplicates.size > 0) {
      issues.push(
        `Duplicate H1 text found: "${[...duplicates].join('", "')}". Each H1 should be unique.`,
      );
    }
  }

  // --- Heading hierarchy check ---
  // Only relevant if there are headings to check
  if (headings.length >= 2) {
    const hierarchyIssues: string[] = [];

    // Check if content starts with a non-H1 heading when there are no H1s
    if (h1s.length === 0 && headings.length > 0 && headings[0]!.level > 1) {
      hierarchyIssues.push(`Content starts with an H${headings[0]!.level} instead of an H1.`);
    }

    // Check for skipped levels (e.g., H1 -> H3, skipping H2)
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1]!;
      const curr = headings[i]!;
      if (curr.level > prev.level + 1) {
        hierarchyIssues.push(`H${curr.level} follows H${prev.level}, skipping H${prev.level + 1}.`);
        break; // Report only the first skip to avoid noise
      }
    }

    if (hierarchyIssues.length > 0) {
      issues.push(
        'Heading hierarchy issue: ' +
          hierarchyIssues.join(' ') +
          ' Use sequential heading levels (H1, H2, H3...) for better accessibility and SEO.',
      );
      if (severity === 'good') severity = 'ok';
    }
  }

  // --- Build result ---
  if (severity === 'good') {
    const h1Note =
      h1s.length === 0
        ? 'No H1 tag found in the content body, which is fine if the page title serves as the H1.'
        : 'The page has a single H1 with proper heading hierarchy.';
    return {
      id: 'single-h1',
      title: 'Single H1',
      description: h1Note,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (severity === 'ok') {
    return {
      id: 'single-h1',
      title: 'Single H1',
      description: issues.join(' '),
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'single-h1',
    title: 'Single H1',
    description: issues.join(' '),
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
