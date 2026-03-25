// @power-seo/content-analysis — E-E-A-T: YMYL Content Detection & Compliance
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

// YMYL category detection keywords
const YMYL_CATEGORIES: Array<{ category: string; keywords: RegExp[] }> = [
  {
    category: 'health/medical',
    keywords: [
      /\b(symptoms?|diagnosis|treatment|medication|disease|disorder|medical|clinical|patient|dosage|side\s+effects?|prescription|therapy|surgery|vaccine|illness|infection|chronic|acute|doctor|physician|healthcare|hospital|pharmaceutical)\b/gi,
    ],
  },
  {
    category: 'finance',
    keywords: [
      /\b(investment|mortgage|credit\s+score|retirement|pension|tax\s+(return|deduction|filing)|stock\s+market|cryptocurrency|loan|debt|bankruptcy|insurance\s+(claim|policy|premium)|financial\s+planning|portfolio)\b/gi,
    ],
  },
  {
    category: 'legal',
    keywords: [
      /\b(lawsuit|attorney|legal\s+(advice|rights|counsel)|court\s+order|litigation|contract\s+law|copyright|trademark|intellectual\s+property|liability|negligence|criminal|felony|misdemeanor)\b/gi,
    ],
  },
  {
    category: 'safety',
    keywords: [
      /\b(emergency|evacuation|first\s+aid|poison|hazardous|toxic|recall|warning\s+sign|danger|life[\s-]?threatening|safety\s+protocol|protective\s+equipment)\b/gi,
    ],
  },
  {
    category: 'news/civic',
    keywords: [
      /\b(election|voting|legislation|government\s+policy|international\s+relations|political\s+party|civil\s+rights|public\s+policy|regulatory|supreme\s+court)\b/gi,
    ],
  },
];

// Required disclaimers by category
const DISCLAIMER_PATTERNS: Record<string, RegExp[]> = {
  'health/medical': [
    /\bnot\s+(?:a\s+substitute\s+for\s+)?(?:medical|professional)\s+advice\b/gi,
    /\bconsult\s+(?:your|a)\s+(?:doctor|physician|healthcare|medical)\b/gi,
    /\bfor\s+informational\s+purposes?\s+only\b/gi,
    /\bseek\s+(?:immediate\s+)?medical\s+(?:attention|help|advice)\b/gi,
    /\bmedical\s+disclaimer\b/gi,
  ],
  'finance': [
    /\bnot\s+(?:a\s+substitute\s+for\s+)?financial\s+advice\b/gi,
    /\bconsult\s+(?:a|your)\s+(?:financial|tax)\s+(?:advisor|professional|consultant)\b/gi,
    /\bfor\s+informational\s+purposes?\s+only\b/gi,
    /\bfinancial\s+disclaimer\b/gi,
    /\bpast\s+performance\s+(?:is|does)\s+not\b/gi,
  ],
  'legal': [
    /\bnot\s+(?:a\s+substitute\s+for\s+)?legal\s+advice\b/gi,
    /\bconsult\s+(?:a|your)\s+(?:attorney|lawyer|legal\s+professional)\b/gi,
    /\bfor\s+informational\s+purposes?\s+only\b/gi,
    /\blegal\s+disclaimer\b/gi,
  ],
  'safety': [
    /\b(?:call|contact|dial)\s+(?:911|emergency|poison\s+control)\b/gi,
    /\bseek\s+(?:immediate|emergency)\s+(?:help|assistance|medical)\b/gi,
    /\bin\s+case\s+of\s+emergency\b/gi,
  ],
};

export function checkYmylCompliance(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content).toLowerCase();

  // Detect YMYL categories
  const detectedCategories: Array<{ category: string; matchCount: number }> = [];

  for (const { category, keywords } of YMYL_CATEGORIES) {
    let matchCount = 0;
    for (const pattern of keywords) {
      const matches = plainText.match(pattern);
      if (matches) matchCount += matches.length;
    }
    if (matchCount >= 3) { // Threshold: at least 3 keyword matches to classify
      detectedCategories.push({ category, matchCount });
    }
  }

  // Also check explicit category from input
  if (input.contentCategory) {
    const cat = input.contentCategory.toLowerCase();
    const isYMYL = YMYL_CATEGORIES.some(({ category }) =>
      cat.includes(category.split('/')[0] || '')
    );
    if (isYMYL && !detectedCategories.some(d => d.category.includes(cat))) {
      detectedCategories.push({ category: input.contentCategory, matchCount: 0 });
    }
  }

  if (detectedCategories.length === 0) {
    return {
      id: 'eeat-ymyl-compliance',
      title: 'YMYL compliance',
      description: 'Content does not appear to be YMYL (Your Money or Your Life). Standard E-E-A-T requirements apply.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Check for required disclaimers
  const categories = detectedCategories.map(d => d.category);
  const disclaimersFound: string[] = [];
  const disclaimersMissing: string[] = [];

  for (const category of categories) {
    const catKey = Object.keys(DISCLAIMER_PATTERNS).find(k => category.includes(k.split('/')[0] || ''));
    if (catKey && DISCLAIMER_PATTERNS[catKey]) {
      let found = false;
      for (const pattern of DISCLAIMER_PATTERNS[catKey]) {
        if (pattern.test(plainText)) {
          found = true;
          disclaimersFound.push(category);
          break;
        }
      }
      if (!found) {
        disclaimersMissing.push(category);
      }
    }
  }

  // Check for author credentials (critical for YMYL)
  const hasAuthorCredentials = !!(input.author?.credentials && input.author.credentials.length > 0);
  const hasEditorialReview = !!input.editorialReviewer;

  let score = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  if (disclaimersFound.length > 0) {
    score += 2;
    signals.push(`disclaimers present for ${disclaimersFound.join(', ')}`);
  }
  if (disclaimersMissing.length > 0) {
    gaps.push(`missing disclaimers for ${disclaimersMissing.join(', ')}`);
  }

  if (hasAuthorCredentials) {
    score += 2;
    signals.push('author has verifiable credentials');
  } else {
    gaps.push('YMYL content requires author with verifiable credentials');
  }

  if (hasEditorialReview) {
    score += 1;
    signals.push('editorial review present');
  } else {
    gaps.push('add editorial/fact-check review');
  }

  const ymylTypes = categories.join(', ');

  if (score >= 4) {
    return {
      id: 'eeat-ymyl-compliance',
      title: 'YMYL compliance',
      description: `YMYL content detected (${ymylTypes}). Good compliance: ${signals.join('; ')}. YMYL content is held to higher E-E-A-T standards by Google.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (score >= 2) {
    return {
      id: 'eeat-ymyl-compliance',
      title: 'YMYL compliance',
      description: `YMYL content detected (${ymylTypes}). Partial compliance: ${signals.join('; ')}. Gaps: ${gaps.join('; ')}. YMYL content requires strong E-E-A-T signals.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-ymyl-compliance',
    title: 'YMYL compliance',
    description: `YMYL content detected (${ymylTypes}) but lacks required trust signals. ${gaps.join('; ')}. YMYL content without proper disclaimers, credentials, and editorial review may be penalized in search rankings.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
