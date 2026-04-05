// @power-seo/content-analysis — Secondary Keyphrases Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

/**
 * Strip HTML tags from a string.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if secondary keyphrases (seed keywords) appear in the content.
 *
 * Secondary keyphrases are related terms that support the primary focus keyphrase.
 * They help search engines understand the topic depth and relevance of the content.
 */
export function checkSecondaryKeyphrases(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { secondaryKeyphrases, content, title, metaDescription } = input;

  if (!secondaryKeyphrases || secondaryKeyphrases.length === 0) {
    results.push({
      id: 'secondary-keyphrases',
      title: 'Secondary keyphrases',
      description:
        'No secondary keyphrases (seed keywords) set. Add related keywords to broaden your topic coverage.',
      status: 'ok',
      score: 2,
      maxScore: 5,
    });
    return results;
  }

  const plainContent = stripHtml(content || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();
  const metaLower = (metaDescription || '').toLowerCase();
  const combinedText = `${titleLower} ${metaLower} ${plainContent}`;

  const found: string[] = [];
  const missing: string[] = [];

  for (const kp of secondaryKeyphrases) {
    const trimmed = kp.trim();
    if (!trimmed) continue;
    if (combinedText.includes(trimmed.toLowerCase())) {
      found.push(trimmed);
    } else {
      missing.push(trimmed);
    }
  }

  const total = found.length + missing.length;
  if (total === 0) {
    results.push({
      id: 'secondary-keyphrases',
      title: 'Secondary keyphrases',
      description:
        'No valid secondary keyphrases provided. Add related keywords to broaden your topic coverage.',
      status: 'ok',
      score: 2,
      maxScore: 5,
    });
    return results;
  }

  const foundRatio = found.length / total;

  if (missing.length === 0) {
    results.push({
      id: 'secondary-keyphrases',
      title: 'Secondary keyphrases',
      description: `All ${found.length} secondary keyphrase${found.length === 1 ? '' : 's'} found in your content. Great topic coverage!`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (foundRatio >= 0.5) {
    results.push({
      id: 'secondary-keyphrases',
      title: 'Secondary keyphrases',
      description: `${found.length} of ${total} secondary keyphrases found. Missing: ${missing.join(', ')}. Try to include them naturally.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'secondary-keyphrases',
      title: 'Secondary keyphrases',
      description: `Only ${found.length} of ${total} secondary keyphrases found. Missing: ${missing.join(', ')}. Add these related terms to improve topic depth.`,
      status: 'poor',
      score: 1,
      maxScore: 5,
    });
  }

  return results;
}
