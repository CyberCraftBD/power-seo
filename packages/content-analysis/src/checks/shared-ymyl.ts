// @power-seo/content-analysis — Shared YMYL Detection
// ----------------------------------------------------------------------------
// Internal module: YMYL category detection shared by eeat-ymyl-compliance and
// eeat-ymyl-multiplier.

// YMYL category detection keywords (health, finance, legal, safety, civic).
// Used with .match() for counting, so the /g flag is required here.
export const YMYL_CATEGORIES: Array<{ category: string; keywords: RegExp[] }> = [
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
      /\b(emergency|evacuation|first\s+aid|poison|hazardous|toxic|(?:product|drug|safety)\s+recall|warning\s+sign|danger(?:ous)?\s+(?:to|for|side)|life[\s-]?threatening|safety\s+protocol|protective\s+equipment)\b/gi,
    ],
  },
  {
    category: 'news/civic',
    keywords: [
      /\b(election|voting|legislation|government\s+policy|international\s+relations|political\s+party|civil\s+rights|public\s+policy|regulatory|supreme\s+court)\b/gi,
    ],
  },
];

// Required disclaimers by category.
// Only used with .test(), so no /g flag (a stateful lastIndex would make
// consecutive .test() calls nondeterministic).
export const DISCLAIMER_PATTERNS: Record<string, RegExp[]> = {
  'health/medical': [
    /\bnot\s+(?:a\s+substitute\s+for\s+)?(?:medical|professional)\s+advice\b/i,
    /\bconsult\s+(?:your|a)\s+(?:doctor|physician|healthcare|medical)\b/i,
    /\bfor\s+informational\s+purposes?\s+only\b/i,
    /\bseek\s+(?:immediate\s+)?medical\s+(?:attention|help|advice)\b/i,
    /\bmedical\s+disclaimer\b/i,
  ],
  finance: [
    /\bnot\s+(?:a\s+substitute\s+for\s+)?financial\s+advice\b/i,
    /\bconsult\s+(?:a|your)\s+(?:financial|tax)\s+(?:advisor|professional|consultant)\b/i,
    /\bfor\s+informational\s+purposes?\s+only\b/i,
    /\bfinancial\s+disclaimer\b/i,
    /\bpast\s+performance\s+(?:is|does)\s+not\b/i,
  ],
  legal: [
    /\bnot\s+(?:a\s+substitute\s+for\s+)?legal\s+advice\b/i,
    /\bconsult\s+(?:a|your)\s+(?:attorney|lawyer|legal\s+professional)\b/i,
    /\bfor\s+informational\s+purposes?\s+only\b/i,
    /\blegal\s+disclaimer\b/i,
  ],
  safety: [
    /\b(?:call|contact|dial)\s+(?:911|emergency|poison\s+control)\b/i,
    /\bseek\s+(?:immediate|emergency)\s+(?:help|assistance|medical)\b/i,
    /\bin\s+case\s+of\s+emergency\b/i,
  ],
};

/**
 * Maps an arbitrary category label to a canonical YMYL category key using
 * exact-token matching (lowercase, split on non-letters). "Newsletter" does
 * NOT match "news", "syntax" does NOT match "tax", "lawn care" does NOT
 * match "law". Returns null when the label is not a YMYL category.
 */
export function ymylCategoryKey(label: string): string | null {
  const tokens = label.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  for (const { category } of YMYL_CATEGORIES) {
    const categoryWords = category.split('/');
    if (categoryWords.some((word) => tokens.includes(word))) {
      return category;
    }
  }
  return null;
}

/**
 * Detects YMYL categories from content keywords and the explicit content
 * category. Classification requires at least 2 DISTINCT terms from a
 * category's keyword list — repeated hits of a single word do not classify.
 */
export function detectYmylCategories(plainText: string, contentCategory?: string): string[] {
  const detected: string[] = [];

  for (const { category, keywords } of YMYL_CATEGORIES) {
    const distinctTerms = new Set<string>();
    for (const pattern of keywords) {
      const matches = plainText.match(pattern);
      if (matches) {
        for (const m of matches) {
          distinctTerms.add(m.toLowerCase().replace(/\s+/g, ' '));
        }
      }
    }
    if (distinctTerms.size >= 2) {
      detected.push(category);
    }
  }

  // Also check explicit category from input (exact-token match only)
  if (contentCategory) {
    const key = ymylCategoryKey(contentCategory);
    if (key && !detected.includes(key)) {
      detected.push(contentCategory);
    }
  }

  return detected;
}
