// @power-seo/content-analysis — AEO: Citation Readiness Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

/**
 * Checks signals that make content citable by AI engines: external source links,
 * attribution phrases, footnotes, and a sources section.
 * BrightEdge 2025: cited pages have 3.1× more external references than non-cited pages.
 */
function measureCitationSignals(html: string, plain: string): {
  externalLinks: number;
  hasSourcesSection: boolean;
  attributionPhrases: number;
  hasFootnotes: boolean;
  totalSignals: number;
} {
  // Count external links (href starting with http/https)
  const externalLinkMatches = html.match(/href=["']https?:\/\/[^"']+["']/gi);
  const externalLinks = externalLinkMatches?.length ?? 0;

  // Sources/references section heading
  const hasSourcesSection = /\b(?:sources?|references?|bibliography|further\s+reading|citations?)\b/i.test(plain);

  // Attribution phrases
  const attributionPattern = /\baccording\s+to\b|\bcited\s+by\b|\bsource[d]?\s*:\b|\bvia\b|\bper\b\s+[A-Z]|\bas\s+reported\s+by\b/gi;
  const attributionMatches = plain.match(attributionPattern);
  const attributionPhrases = attributionMatches?.length ?? 0;

  // Footnotes: [1], [2], or superscript numbers
  const footnotePattern = /\[\d+\]|<sup>\d+<\/sup>/g;
  const hasFootnotes = footnotePattern.test(html);

  const totalSignals = externalLinks + (hasSourcesSection ? 3 : 0) + attributionPhrases + (hasFootnotes ? 2 : 0);

  return { externalLinks, hasSourcesSection, attributionPhrases, hasFootnotes, totalSignals };
}

export function checkAeoCitationReadiness(input: ContentAnalysisInput): AnalysisResult {
  const { content } = input;
  const plain = stripHtml(content);
  const wordCount = getWords(plain).length;

  if (wordCount < 200) {
    return {
      id: 'aeo-citation-readiness',
      title: 'Citation readiness (AEO)',
      description: 'Add more content to evaluate citation readiness.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const { externalLinks, hasSourcesSection, attributionPhrases, hasFootnotes, totalSignals } = measureCitationSignals(content, plain);

  if (totalSignals >= 5 && (hasSourcesSection || externalLinks >= 3)) {
    return {
      id: 'aeo-citation-readiness',
      title: 'Citation readiness (AEO)',
      description: `Strong citation signals: ${externalLinks} external links${hasSourcesSection ? ', sources section' : ''}${attributionPhrases > 0 ? `, ${attributionPhrases} attribution phrase${attributionPhrases > 1 ? 's' : ''}` : ''}${hasFootnotes ? ', footnotes' : ''}. BrightEdge 2025: pages with this level of attribution are cited 3.1× more by AI engines.`,
      status: 'good',
      score: 8,
      maxScore: 8,
    };
  }

  if (totalSignals >= 2 || externalLinks >= 1) {
    return {
      id: 'aeo-citation-readiness',
      title: 'Citation readiness (AEO)',
      description: `Some citation signals present (${externalLinks} external links, ${attributionPhrases} attribution phrases). Strengthen citation readiness: add a "Sources" or "References" section, use "According to [Source]…" phrases, and link out to authoritative studies. Target: 3+ external links + a sources section.`,
      status: 'ok',
      score: 4,
      maxScore: 8,
    };
  }

  return {
    id: 'aeo-citation-readiness',
    title: 'Citation readiness (AEO)',
    description: 'No citation signals detected. AI engines (Perplexity, ChatGPT, Gemini) strongly prefer citing content that itself cites authoritative sources. Add: (1) 3–5 external links to authoritative sources, (2) "According to [source]…" attribution phrases, (3) a "Sources" section at the bottom. BrightEdge 2025: cited pages have 3.1× more external references.',
    status: 'poor',
    score: 0,
    maxScore: 8,
  };
}
