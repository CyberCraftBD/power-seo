// @power-seo/content-analysis — Title Readability Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

const POSITIVE_WORDS = [
  'best', 'top', 'great', 'amazing', 'ultimate', 'essential', 'proven',
  'powerful', 'effective', 'easy', 'simple', 'free', 'new', 'guide',
  'tips', 'secrets', 'complete', 'perfect', 'incredible',
];

const NEGATIVE_WORDS = [
  'worst', 'avoid', 'never', 'stop', 'mistake', 'wrong', 'bad', 'fail',
  'warning', 'danger', 'risk', 'problem', 'error', 'crisis', 'scam',
];

const POWER_WORDS = [
  'ultimate', 'essential', 'proven', 'powerful', 'effective', 'incredible',
  'complete', 'perfect', 'best', 'top', 'amazing', 'great',
  'unleash', 'exclusive', 'guaranteed', 'instantly', 'revolutionary',
  'breakthrough', 'limited', 'urgent', 'remarkable', 'extraordinary',
  'unbelievable', 'insider', 'confidential', 'shocking', 'little-known',
  'behind-the-scenes', 'bizarre', 'free', 'new', 'guide', 'tips',
  'secrets', 'simple', 'easy',
];

export function checkTitleReadability(input: ContentAnalysisInput): AnalysisResult[] {
  const results: AnalysisResult[] = [];
  const { title } = input;

  const titleText = title && title.trim().length > 0 ? title.trim() : '';
  const titleLower = titleText.toLowerCase();
  const titleWords = titleLower.split(/[\s\-]+/);

  // --- Check 1: Title contains a number ---
  if (/\d/.test(titleText)) {
    results.push({
      id: 'title-number',
      title: 'Title number',
      description: 'Title contains a number. Titles with numbers get higher click-through rates.',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'title-number',
      title: 'Title number',
      description: 'Consider adding a number to your title to increase CTR.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  }

  // --- Check 2: Title sentiment ---
  const hasPositive = POSITIVE_WORDS.some((word) => titleWords.includes(word));
  const hasNegative = NEGATIVE_WORDS.some((word) => titleWords.includes(word));

  if (hasPositive) {
    results.push({
      id: 'title-sentiment',
      title: 'Title sentiment',
      description: 'Title has positive sentiment. Emotional titles attract more clicks.',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else if (hasNegative) {
    results.push({
      id: 'title-sentiment',
      title: 'Title sentiment',
      description: 'Title has negative sentiment. This can drive curiosity and clicks.',
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'title-sentiment',
      title: 'Title sentiment',
      description:
        'Title lacks emotional sentiment. Add positive or negative emotion words to improve CTR.',
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  }

  // --- Check 3: Title contains a power word ---
  const foundPowerWord = POWER_WORDS.find((word) => titleWords.includes(word));

  if (foundPowerWord) {
    results.push({
      id: 'title-power-word',
      title: 'Title power word',
      description: `Title contains a power word ('${foundPowerWord}'). Power words make titles more compelling.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    });
  } else {
    results.push({
      id: 'title-power-word',
      title: 'Title power word',
      description:
        "No power words found in your title. Add words like 'ultimate', 'essential', or 'proven' to make it more compelling.",
      status: 'ok',
      score: 3,
      maxScore: 5,
    });
  }

  return results;
}
