// ============================================================================
// @ccbd-seo/content-analysis — Headings Check
// ============================================================================

import type { ContentAnalysisInput, AnalysisResult } from '@ccbd-seo/core';
import { stripHtml } from '@ccbd-seo/core';

interface HeadingInfo {
  level: number;
  text: string;
}

function parseHeadings(html: string): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const regex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]!, 10),
      text: stripHtml(match[2]!),
    });
  }
  return headings;
}

export function checkHeadings(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { content, focusKeyphrase } = input;
  const headings = parseHeadings(content);

  // --- H1 & structure check ---
  const h1s = headings.filter((h) => h.level === 1);

  if (h1s.length === 0) {
    results.push({
      id: 'heading-structure',
      title: 'Heading structure',
      description: 'No H1 heading found. Add exactly one H1 as the main heading of your page.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    });
  } else if (h1s.length > 1) {
    results.push({
      id: 'heading-structure',
      title: 'Heading structure',
      description: `Found ${h1s.length} H1 headings. Use exactly one H1 per page for proper SEO.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else {
    // Check heading hierarchy
    let hasSkippedLevel = false;
    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1]!;
      const curr = headings[i]!;
      if (curr.level > prev.level + 1) {
        hasSkippedLevel = true;
        break;
      }
    }

    if (hasSkippedLevel) {
      results.push({
        id: 'heading-structure',
        title: 'Heading structure',
        description:
          'The heading hierarchy skips levels (e.g., H2 to H4). Use sequential heading levels for better accessibility and SEO.',
        status: 'ok',
        score: 3,
        maxScore: 5,
      });
    } else {
      results.push({
        id: 'heading-structure',
        title: 'Heading structure',
        description: 'The heading structure looks good with a single H1 and proper hierarchy.',
        status: 'good',
        score: 5,
        maxScore: 5,
      });
    }
  }

  // --- Keyphrase in headings check ---
  if (focusKeyphrase && focusKeyphrase.trim().length > 0) {
    const kp = focusKeyphrase.toLowerCase().trim();
    const subheadings = headings.filter((h) => h.level >= 2);
    const hasKeyphraseInSubheading = subheadings.some((h) => h.text.toLowerCase().includes(kp));

    if (subheadings.length === 0) {
      results.push({
        id: 'heading-keyphrase',
        title: 'Keyphrase in subheadings',
        description:
          'No subheadings (H2-H6) found. Add subheadings to structure your content and include the focus keyphrase.',
        status: 'ok',
        score: 2,
        maxScore: 5,
      });
    } else if (hasKeyphraseInSubheading) {
      results.push({
        id: 'heading-keyphrase',
        title: 'Keyphrase in subheadings',
        description: 'The focus keyphrase appears in at least one subheading. Nice!',
        status: 'good',
        score: 5,
        maxScore: 5,
      });
    } else {
      results.push({
        id: 'heading-keyphrase',
        title: 'Keyphrase in subheadings',
        description:
          'The focus keyphrase does not appear in any subheading. Consider adding it to an H2 or H3.',
        status: 'ok',
        score: 2,
        maxScore: 5,
      });
    }
  }

  return results;
}
