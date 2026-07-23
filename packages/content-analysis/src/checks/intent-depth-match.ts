// @power-seo/content-analysis — Content Depth-Intent Match Check
// ----------------------------------------------------------------------------
// Verifies that the content length is appropriate for the detected search
// intent type. Different intents have different ideal word count ranges.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { getWords } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Ideal word count ranges per intent type
// ---------------------------------------------------------------------------

interface DepthRange {
  idealMin: number;
  idealMax: number;
  label: string;
}

const DEPTH_RANGES: Record<string, DepthRange> = {
  informational: { idealMin: 1000, idealMax: 5000, label: '1,000–5,000' },
  transactional: { idealMin: 300, idealMax: 1500, label: '300–1,500' },
  'commercial-investigation': {
    idealMin: 1500,
    idealMax: 5000,
    label: '1,500–5,000',
  },
  navigational: { idealMin: 100, idealMax: 800, label: '100–800' },
};

/**
 * Evaluate informational intent depth.
 * - < 500 = poor
 * - 500-999 = ok
 * - 1000-5000 = good
 * - > 5000 = ok (above the ideal range)
 */
function evaluateInformational(wordCount: number): {
  status: 'good' | 'ok' | 'poor';
  score: number;
  note: string;
} {
  if (wordCount < 500) {
    return {
      status: 'poor',
      score: 2,
      note: `${wordCount} words is well under the ideal range. Informational content needs depth — expand to at least 1,000 words.`,
    };
  }
  if (wordCount < 1000) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is slightly below the ideal range. Consider expanding to 1,000+ words for comprehensive coverage.`,
    };
  }
  if (wordCount > 5000) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is above the ideal range for informational content. Consider trimming or splitting the topic into multiple focused articles.`,
    };
  }
  return {
    status: 'good',
    score: 8,
    note: `${wordCount} words is within the ideal range for informational content. Good depth for thorough topic coverage.`,
  };
}

/**
 * Evaluate transactional intent depth.
 * - < 200 = poor
 * - 200-299 = ok
 * - 300-1500 = good
 * - > 2000 = ok (over-length for transactional)
 */
function evaluateTransactional(wordCount: number): {
  status: 'good' | 'ok' | 'poor';
  score: number;
  note: string;
} {
  if (wordCount < 200) {
    return {
      status: 'poor',
      score: 2,
      note: `${wordCount} words is too short for transactional content. Add product details, benefits, and trust signals.`,
    };
  }
  if (wordCount < 300) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is slightly under the ideal range. Consider adding more product details to reach 300+ words.`,
    };
  }
  if (wordCount <= 1500) {
    return {
      status: 'good',
      score: 8,
      note: `${wordCount} words is within the ideal range for transactional content. Concise enough for action-oriented users.`,
    };
  }
  if (wordCount > 2000) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words may be over-length for transactional content. Buyers want quick decisions — consider trimming to under 1,500 words.`,
    };
  }
  // 1501-2000: above the ideal 300–1,500 range — acceptable but not ideal
  return {
    status: 'ok',
    score: 5,
    note: `${wordCount} words is above the ideal range for transactional content. Consider trimming toward 1,500 words for action-oriented buyers.`,
  };
}

/**
 * Evaluate commercial investigation intent depth.
 * - < 800 = poor
 * - 800-1499 = ok
 * - 1500-5000 = good
 * - > 5000 = ok (above the ideal range)
 */
function evaluateCommercial(wordCount: number): {
  status: 'good' | 'ok' | 'poor';
  score: number;
  note: string;
} {
  if (wordCount < 800) {
    return {
      status: 'poor',
      score: 2,
      note: `${wordCount} words is well under the ideal range. Comparison and review content needs depth — expand to 1,500+ words.`,
    };
  }
  if (wordCount < 1500) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is slightly below the ideal range. Add more detail to comparisons and evaluations to reach 1,500+ words.`,
    };
  }
  if (wordCount > 5000) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is above the ideal range for commercial investigation content. Consider trimming or splitting into separate comparison pages.`,
    };
  }
  return {
    status: 'good',
    score: 8,
    note: `${wordCount} words is within the ideal range for commercial investigation content. Provides thorough comparison depth.`,
  };
}

/**
 * Evaluate navigational intent depth.
 * - < 50 = poor
 * - > 1000 = ok (too verbose)
 * - 100-800 = good
 * - 50-99 = ok (slightly short)
 * - 801-1000 = ok (slightly long)
 */
function evaluateNavigational(wordCount: number): {
  status: 'good' | 'ok' | 'poor';
  score: number;
  note: string;
} {
  if (wordCount < 50) {
    return {
      status: 'poor',
      score: 2,
      note: `${wordCount} words is too short. Add at least basic navigation cues and directions.`,
    };
  }
  if (wordCount < 100) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is slightly under the ideal range. Consider adding brief context to help users navigate.`,
    };
  }
  if (wordCount <= 800) {
    return {
      status: 'good',
      score: 8,
      note: `${wordCount} words is within the ideal range for navigational content. Concise and focused on directing users.`,
    };
  }
  if (wordCount > 1000) {
    return {
      status: 'ok',
      score: 5,
      note: `${wordCount} words is too verbose for navigational content. Users want to get somewhere quickly — consider trimming to under 800 words.`,
    };
  }
  // 801-1000: borderline
  return {
    status: 'ok',
    score: 5,
    note: `${wordCount} words is slightly over the ideal range. Navigational pages should be concise.`,
  };
}

/**
 * Check whether the content length (word count) is appropriate for the
 * detected search intent of the focus keyphrase.
 *
 * Each intent type has a different ideal word count range:
 * - Informational: 1,000–5,000 words
 * - Transactional: 300–1,500 words
 * - Commercial: 1,500–5,000 words
 * - Navigational: 100–800 words
 */
export function checkIntentDepthMatch(input: ContentAnalysisInput): AnalysisResult {
  const { focusKeyphrase, content } = input;

  if (!focusKeyphrase || focusKeyphrase.trim().length === 0) {
    return {
      id: 'intent-depth-match',
      title: 'Content depth-intent match',
      description: 'No focus keyphrase set. Set one to analyze content depth relative to intent.',
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const detected = detectIntent(focusKeyphrase.trim());
  const intentKey = detected.primary;
  const range = DEPTH_RANGES[intentKey];

  if (!range) {
    return {
      id: 'intent-depth-match',
      title: 'Content depth-intent match',
      description: `Unable to determine depth range for intent "${intentKey}".`,
      status: 'na',
      score: 0,
      maxScore: 8,
    };
  }

  const words = getWords(content);
  const wordCount = words.length;

  let evaluation: { status: 'good' | 'ok' | 'poor'; score: number; note: string };

  switch (intentKey) {
    case 'informational':
      evaluation = evaluateInformational(wordCount);
      break;
    case 'transactional':
      evaluation = evaluateTransactional(wordCount);
      break;
    case 'commercial-investigation':
      evaluation = evaluateCommercial(wordCount);
      break;
    case 'navigational':
      evaluation = evaluateNavigational(wordCount);
      break;
    default:
      evaluation = {
        status: 'ok',
        score: 5,
        note: `${wordCount} words. Unable to determine ideal range for this intent type.`,
      };
  }

  return {
    id: 'intent-depth-match',
    title: 'Content depth-intent match',
    description: `${evaluation.note} Expected range for ${intentKey} intent: ${range.label} words.`,
    status: evaluation.status,
    score: evaluation.score,
    maxScore: 8,
  };
}
