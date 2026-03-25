// @power-seo/content-analysis — E-E-A-T: YMYL Multiplier
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

// YMYL category detection keywords (health, finance, legal, safety, civic)
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

// Disclaimer patterns by category
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

function detectYmylCategories(plainText: string, contentCategory?: string): string[] {
  const detected: string[] = [];

  for (const { category, keywords } of YMYL_CATEGORIES) {
    let matchCount = 0;
    for (const pattern of keywords) {
      const matches = plainText.match(pattern);
      if (matches) matchCount += matches.length;
    }
    if (matchCount >= 3) {
      detected.push(category);
    }
  }

  // Also check explicit category from input
  if (contentCategory) {
    const cat = contentCategory.toLowerCase();
    const isYMYL = YMYL_CATEGORIES.some(({ category }) =>
      cat.includes(category.split('/')[0] || '')
    );
    if (isYMYL && !detected.some(d => d.includes(cat.split('/')[0] || ''))) {
      detected.push(contentCategory);
    }
  }

  return detected;
}

export function checkYmylMultiplier(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content).toLowerCase();

  // Detect YMYL categories
  const ymylCategories = detectYmylCategories(plainText, input.contentCategory);

  if (ymylCategories.length === 0) {
    return {
      id: 'eeat-ymyl-multiplier',
      title: 'YMYL multiplier',
      description: 'Content is not YMYL (Your Money or Your Life). Standard E-E-A-T requirements apply; no stricter multiplier needed.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const ymylTypes = ymylCategories.join(', ');

  // Assess E-E-A-T signal strength under YMYL scrutiny
  let eeatScore = 0;
  const signals: string[] = [];
  const gaps: string[] = [];

  // 1. Author credentials (critical for YMYL)
  if (input.author?.credentials && input.author.credentials.length > 0) {
    eeatScore += 2;
    const credNames = input.author.credentials.map(c => c.name);
    signals.push(`author credentials: ${credNames.slice(0, 3).join(', ')}`);
  } else {
    gaps.push('YMYL content requires author with verifiable credentials');
  }

  // 2. Editorial reviewer (fact-checking)
  if (input.editorialReviewer) {
    eeatScore += 2;
    const reviewerInfo = input.editorialReviewer.name || 'unnamed';
    signals.push(`editorial reviewer: ${reviewerInfo}`);
    if (input.editorialReviewer.credentials) {
      eeatScore += 1;
      signals.push(`reviewer credentials: ${input.editorialReviewer.credentials}`);
    }
  } else {
    gaps.push('add editorial/fact-check reviewer for YMYL content');
  }

  // 3. Category-appropriate disclaimers
  let hasDisclaimer = false;
  for (const category of ymylCategories) {
    const catKey = Object.keys(DISCLAIMER_PATTERNS).find(k => category.includes(k.split('/')[0] || ''));
    if (catKey && DISCLAIMER_PATTERNS[catKey]) {
      for (const pattern of DISCLAIMER_PATTERNS[catKey]) {
        if (pattern.test(plainText)) {
          hasDisclaimer = true;
          break;
        }
      }
    }
    if (hasDisclaimer) break;
  }

  if (hasDisclaimer) {
    eeatScore += 1;
    signals.push('appropriate disclaimers present');
  } else {
    gaps.push('add category-appropriate disclaimers (e.g., "consult a professional", "for informational purposes only")');
  }

  // 4. HTTPS (baseline trust for YMYL)
  const url = input.canonicalUrl || input.siteUrl || '';
  if (url.startsWith('https://')) {
    eeatScore += 1;
    signals.push('HTTPS verified');
  } else {
    gaps.push('YMYL content must be served over HTTPS');
  }

  // 5. Publish/modified dates (transparency)
  if (input.publishDate) {
    eeatScore += 1;
    signals.push('publish date provided');
  } else {
    gaps.push('add publish date for content freshness transparency');
  }

  // 6. Author bio and expertise areas
  if (input.author?.bio && input.author.bio.trim().length >= 20 && input.author.knowsAbout && input.author.knowsAbout.length > 0) {
    eeatScore += 1;
    signals.push('author bio with expertise areas');
  }

  // 7. Correction policy (accountability for YMYL)
  if (input.correctionPolicyUrl) {
    eeatScore += 1;
    signals.push('correction policy linked');
  }

  if (eeatScore >= 6) {
    return {
      id: 'eeat-ymyl-multiplier',
      title: 'YMYL multiplier',
      description: `YMYL content detected (${ymylTypes}) with strong E-E-A-T compliance. ${signals.join('; ')}. Content meets the higher trust bar Google applies to YMYL topics.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (eeatScore >= 3) {
    return {
      id: 'eeat-ymyl-multiplier',
      title: 'YMYL multiplier',
      description: `YMYL content detected (${ymylTypes}) with moderate E-E-A-T signals. Present: ${signals.join('; ')}. Gaps: ${gaps.join('; ')}. YMYL topics face stricter quality evaluation.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-ymyl-multiplier',
    title: 'YMYL multiplier',
    description: `YMYL content detected (${ymylTypes}) with insufficient E-E-A-T signals. Gaps: ${gaps.join('; ')}. YMYL content without strong author credentials, editorial review, disclaimers, and trust signals faces significant ranking penalties.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
