// @power-seo/content-analysis — Keyphrase in URL/Slug Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkKeyphraseSlug(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, slug } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'keyphrase-slug',
      title: 'Keyphrase in URL',
      description: 'No focus keyphrase set.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  if (!slug || slug.trim().length === 0) {
    return {
      id: 'keyphrase-slug',
      title: 'Keyphrase in URL',
      description: 'No slug set. Set a URL slug containing your focus keyphrase.',
      status: 'ok',
      score: 2,
      maxScore: 5,
    };
  }

  // Convert keyphrase to slug format (lowercase, spaces to hyphens)
  const keyphraseSlug = focusKeyphrase.toLowerCase().trim().replace(/\s+/g, '-');
  const slugLower = slug.toLowerCase().trim();

  if (slugLower.includes(keyphraseSlug)) {
    return {
      id: 'keyphrase-slug',
      title: 'Keyphrase in URL',
      description: 'The focus keyphrase appears in the URL. Great for SEO!',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // Also check if keyphrase words appear in slug individually (word order may
  // differ). Match against whole slug tokens, not substrings — otherwise the
  // word "seo" would falsely match a slug like "season-guide".
  const slugTokens = slugLower.split(/[^a-z0-9]+/i).filter(Boolean);
  const keyphraseWords = focusKeyphrase.toLowerCase().trim().split(/\s+/);
  const allWordsPresent = keyphraseWords.every((word) => slugTokens.includes(word));

  if (allWordsPresent) {
    return {
      id: 'keyphrase-slug',
      title: 'Keyphrase in URL',
      description: 'The focus keyphrase appears in the URL. Great for SEO!',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  return {
    id: 'keyphrase-slug',
    title: 'Keyphrase in URL',
    description:
      'The focus keyphrase does not appear in the URL. Add it to improve search visibility.',
    status: 'ok',
    score: 2,
    maxScore: 5,
  };
}
