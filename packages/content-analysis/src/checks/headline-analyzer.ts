// @power-seo/content-analysis — Headline Analyzer Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { getWords } from '@power-seo/core';

// --- Word Categories ---

const COMMON_WORDS = new Set([
  'the', 'is', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'it', 'that', 'this', 'was', 'are', 'be',
  'has', 'had', 'have', 'will', 'would', 'could', 'should', 'can', 'may', 'its',
  'not', 'no', 'up', 'out', 'if', 'how', 'what', 'when', 'where', 'why', 'who',
  'which', 'all', 'each', 'every', 'do', 'does', 'so', 'than', 'then', 'into',
  'over', 'after', 'your', 'our', 'my', 'you', 'we', 'they', 'he', 'she',
]);

const EMOTIONAL_WORDS = new Set([
  'amazing', 'devastating', 'thrilling', 'heartbreaking', 'incredible', 'shocking',
  'terrifying', 'inspiring', 'hilarious', 'painful', 'beautiful', 'horrible',
  'brilliant', 'awful', 'spectacular', 'tragic', 'magnificent', 'alarming',
  'delightful', 'frustrating', 'extraordinary', 'overwhelming', 'captivating',
  'disturbing', 'remarkable',
]);

const POWER_WORDS = new Set([
  'ultimate', 'essential', 'proven', 'powerful', 'effective', 'guaranteed',
  'instantly', 'revolutionary', 'breakthrough', 'exclusive', 'limited', 'urgent',
  'secret', 'free', 'new', 'discover', 'master', 'unleash', 'dominate', 'epic',
  'insane', 'jaw-dropping', 'life-changing', 'mind-blowing',
]);

/**
 * Categorize a word into one of the four categories.
 */
function categorizeWord(word: string): 'common' | 'emotional' | 'power' | 'uncommon' {
  const lower = word.toLowerCase().replace(/[^a-z-]/g, '');
  if (!lower) return 'common';
  if (EMOTIONAL_WORDS.has(lower)) return 'emotional';
  if (POWER_WORDS.has(lower)) return 'power';
  if (COMMON_WORDS.has(lower)) return 'common';
  return 'uncommon';
}

/**
 * Comprehensive headline scoring system.
 * Returns a score from 0-100 based on multiple factors.
 */
function analyzeHeadline(title: string): {
  score: number;
  wordCount: number;
  charCount: number;
  commonPct: number;
  uncommonPct: number;
  emotionalPct: number;
  powerWordCount: number;
  hasNumber: boolean;
  isQuestion: boolean;
  hasBrackets: boolean;
  details: string[];
} {
  const details: string[] = [];
  let score = 0;

  const words = getWords(title);
  const wordCount = words.length;
  const charCount = title.length;

  // Categorize words
  let commonCount = 0;
  let uncommonCount = 0;
  let emotionalCount = 0;
  let powerWordCount = 0;

  for (const word of words) {
    const cat = categorizeWord(word);
    switch (cat) {
      case 'common': commonCount++; break;
      case 'uncommon': uncommonCount++; break;
      case 'emotional': emotionalCount++; break;
      case 'power': powerWordCount++; break;
    }
  }

  const commonPct = wordCount > 0 ? Math.round((commonCount / wordCount) * 100) : 0;
  const uncommonPct = wordCount > 0 ? Math.round((uncommonCount / wordCount) * 100) : 0;
  const emotionalPct = wordCount > 0 ? Math.round((emotionalCount / wordCount) * 100) : 0;

  // --- Scoring ---

  // 1. Word count (max 20 points): 6-13 words is optimal
  if (wordCount >= 6 && wordCount <= 13) {
    score += 20;
    details.push(`Word count (${wordCount}) is in the optimal 6-13 range`);
  } else if (wordCount >= 4 && wordCount <= 15) {
    score += 10;
    details.push(`Word count (${wordCount}) is acceptable but not optimal (aim for 6-13)`);
  } else {
    score += 3;
    details.push(`Word count (${wordCount}) is outside the recommended range (6-13 words)`);
  }

  // 2. Character count (max 20 points): 50-60 chars optimal for SERP
  if (charCount >= 50 && charCount <= 60) {
    score += 20;
    details.push(`Character count (${charCount}) is optimal for search engine display`);
  } else if (charCount >= 40 && charCount <= 70) {
    score += 12;
    details.push(`Character count (${charCount}) is acceptable (50-60 is optimal for SERP)`);
  } else if (charCount < 40) {
    score += 5;
    details.push(`Title is too short (${charCount} characters). Aim for 50-60 characters`);
  } else {
    score += 5;
    details.push(`Title may be truncated in SERP (${charCount} characters). Aim for 50-60`);
  }

  // 3. Word balance (max 20 points)
  // Ideal: 20-30% common, 10-20% uncommon, some emotional
  if (commonPct >= 20 && commonPct <= 40) {
    score += 8;
  } else if (commonPct < 20) {
    score += 4;
  } else {
    score += 3;
  }

  if (uncommonPct >= 10 && uncommonPct <= 40) {
    score += 7;
  } else if (uncommonPct > 0) {
    score += 4;
  }

  if (emotionalPct > 0) {
    score += 5;
    details.push(`Contains ${emotionalCount} emotional word${emotionalCount === 1 ? '' : 's'} (${emotionalPct}%)`);
  } else {
    details.push('No emotional words — adding one can improve CTR');
  }

  // 4. Power words (max 15 points)
  if (powerWordCount >= 1) {
    score += Math.min(15, powerWordCount * 8);
    details.push(`Contains ${powerWordCount} power word${powerWordCount === 1 ? '' : 's'}`);
  } else {
    details.push('No power words — consider adding one like "ultimate", "proven", or "essential"');
  }

  // 5. Bonus features (max 25 points)
  const hasNumber = /\d/.test(title);
  if (hasNumber) {
    score += 8;
    details.push('Contains a number — numbers increase click-through rates');
  }

  const titleLower = title.toLowerCase().trim();
  const isQuestion =
    titleLower.startsWith('how to') ||
    titleLower.startsWith('what is') ||
    titleLower.startsWith('what are') ||
    titleLower.startsWith('why ') ||
    titleLower.startsWith('how ') ||
    titleLower.startsWith('when ') ||
    titleLower.startsWith('where ') ||
    titleLower.startsWith('who ') ||
    titleLower.startsWith('which ') ||
    title.trim().endsWith('?');

  if (isQuestion) {
    score += 8;
    details.push('Question format — questions engage reader curiosity');
  }

  const hasBrackets = /[[(].*[\])]/.test(title);
  if (hasBrackets) {
    score += 9;
    details.push('Contains brackets/parentheses — these increase CTR by ~38%');
  }

  // Cap at 100
  score = Math.min(100, score);

  return {
    score,
    wordCount,
    charCount,
    commonPct,
    uncommonPct,
    emotionalPct,
    powerWordCount,
    hasNumber,
    isQuestion,
    hasBrackets,
    details,
  };
}

export function checkHeadlineAnalyzer(input: ContentAnalysisInput): AnalysisResult {
  const { title } = input;

  if (!title || title.trim().length === 0) {
    return {
      id: 'headline-analyzer',
      title: 'Headline analyzer',
      description: 'No title provided. Add a title to get a headline analysis.',
      status: 'poor',
      score: 1,
      maxScore: 5,
    };
  }

  const analysis = analyzeHeadline(title.trim());
  const { score, wordCount, charCount, commonPct, uncommonPct, emotionalPct, powerWordCount, details } = analysis;

  const summary = [
    `Headline score: ${score}/100`,
    `${wordCount} words, ${charCount} characters`,
    `Word balance: ${commonPct}% common, ${uncommonPct}% uncommon, ${emotionalPct}% emotional, ${powerWordCount} power word${powerWordCount === 1 ? '' : 's'}`,
  ].join('. ');

  const feedback = details.join('. ');

  if (score >= 70) {
    return {
      id: 'headline-analyzer',
      title: 'Headline analyzer',
      description: `${summary}. ${feedback}.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 40) {
    return {
      id: 'headline-analyzer',
      title: 'Headline analyzer',
      description: `${summary}. ${feedback}. Improve the headline to score 70+ for optimal performance.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'headline-analyzer',
    title: 'Headline analyzer',
    description: `${summary}. ${feedback}. This headline needs significant improvement — aim for a score of 70+.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
