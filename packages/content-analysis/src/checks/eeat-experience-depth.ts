// @power-seo/content-analysis — E-E-A-T: First-Person Experience Depth
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countDistinctMatches } from '@power-seo/core';
import { TEMPORAL_EXPERIENCE_PATTERNS } from './shared-patterns.js';

// First-person experience phrases (regex patterns)
const EXPERIENCE_PATTERNS: RegExp[] = [
  // Direct experience verbs
  /\bi\s+tested\b/gi,
  /\bi\s+used\b/gi,
  /\bi\s+tried\b/gi,
  /\bi\s+found\s+that\b/gi,
  /\bi\s+noticed\b/gi,
  /\bi\s+discovered\b/gi,
  /\bi\s+experienced\b/gi,
  /\bi\s+observed\b/gi,
  /\bi\s+realized\b/gi,
  /\bi\s+learned\b/gi,
  /\bi\s+personally\b/gi,
  /\bi\s+recommend\b/gi,
  /\bi\s+prefer\b/gi,
  /\bi\s+chose\b/gi,
  /\bi\s+built\b/gi,
  /\bi\s+created\b/gi,
  /\bi\s+implemented\b/gi,
  /\bi\s+configured\b/gi,
  /\bi\s+set\s+up\b/gi,
  /\bi\s+installed\b/gi,
  /\bi\s+measured\b/gi,
  /\bi\s+achieved\b/gi,
  /\bi\s+ran\b/gi,
  /\bi\s+compared\b/gi,

  // Experience phrases
  /\bin\s+my\s+experience\b/gi,
  /\bfrom\s+my\s+experience\b/gi,
  /\bbased\s+on\s+my\s+experience\b/gi,
  /\bhaving\s+used\b/gi,
  /\bhaving\s+tested\b/gi,
  /\bhaving\s+worked\s+with\b/gi,
  /\bfrom\s+my\s+testing\b/gi,
  /\bwhat\s+i\s+found\b/gi,

  // Temporal experience markers (shared with eeat-overall-score)
  ...TEMPORAL_EXPERIENCE_PATTERNS,

  // Outcome reporting
  /\bthe\s+results?\s+showed\b/gi,
  /\bthe\s+results?\s+were\b/gi,
  /\bi\s+saw\s+improvements?\b/gi,
  /\bi\s+saw\s+a\s+\d+%?\b/gi,
  /\bthe\s+outcome\s+was\b/gi,
  /\bthis\s+resulted\s+in\b/gi,
  /\bperformance\s+improved\b/gi,
  /\bwe\s+achieved\b/gi,

  // Comparison from use
  /\bwhen\s+i\s+switched\b/gi,
  /\bcompared\s+to\s+my\s+previous\b/gi,
  /\bi\s+preferred\s+.+\s+over\b/gi,
  /\bbefore\s+and\s+after\b/gi,
  /\bi\s+migrated\s+from\b/gi,
  /\bside.by.side\s+comparison\b/gi,

  // Process narration
  /\bhere['’]?s?\s+what\s+happened\b/gi,
  /\bstep\s+by\s+step\b/gi,
  /\bthe\s+process\s+involved\b/gi,
  /\bhere['’]?s?\s+how\s+i\b/gi,
  /\bmy\s+approach\s+was\b/gi,
  /\bwhat\s+worked\s+for\s+me\b/gi,
  /\bi\s+walked\s+through\b/gi,
  /\bmy\s+workflow\b/gi,
  /\bin\s+practice\b/gi,
  /\bhands.on\b/gi,
  /\breal.world\b/gi,
];

export function checkExperienceDepth(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-experience-depth',
      title: 'Experience signals',
      description: 'Content is too short to analyze experience depth.',
      status: 'na',
      score: 0,
      maxScore: 9,
    };
  }

  // Overlapping hits across patterns count once
  const totalMatches = countDistinctMatches(plainText, EXPERIENCE_PATTERNS);
  const matchedPhrases: string[] = [];

  for (const pattern of EXPERIENCE_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) {
      // Collect unique phrase examples (max 3)
      for (const m of matches) {
        const normalized = m.trim().toLowerCase();
        if (!matchedPhrases.includes(normalized) && matchedPhrases.length < 5) {
          matchedPhrases.push(normalized);
        }
      }
    }
  }

  // Density: experience markers per 500 words
  const density = (totalMatches / wordCount) * 500;

  if (density >= 3) {
    return {
      id: 'eeat-experience-depth',
      title: 'Experience signals',
      description: `Strong first-hand experience signals detected (${totalMatches} markers). Phrases like "${matchedPhrases.slice(0, 3).join('", "')}" demonstrate real experience.`,
      status: 'good',
      score: 9,
      maxScore: 9,
    };
  }

  if (density >= 1) {
    return {
      id: 'eeat-experience-depth',
      title: 'Experience signals',
      description: `Some experience signals found (${totalMatches} markers). Add more first-person experience phrases like "I tested", "in my experience", or outcome reporting to strengthen E-E-A-T.`,
      status: 'ok',
      score: 5,
      maxScore: 9,
    };
  }

  return {
    id: 'eeat-experience-depth',
    title: 'Experience signals',
    description:
      'No first-hand experience signals detected. Add personal experience, testing outcomes, temporal markers ("after 6 months of using..."), and process narration to demonstrate real experience with the topic.',
    status: 'poor',
    score: 0,
    maxScore: 9,
  };
}
