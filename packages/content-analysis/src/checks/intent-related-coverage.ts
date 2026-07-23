// @power-seo/content-analysis — Related Intent Coverage Check
// ----------------------------------------------------------------------------
// Checks if content addresses secondary/related intents that searchers
// commonly have alongside the primary query, reducing the need for follow-up
// searches.

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';
import { detectIntent } from './intent-utils.js';

// ---------------------------------------------------------------------------
// Related intent definitions per primary sub-intent pattern
// ---------------------------------------------------------------------------

interface RelatedIntent {
  name: string;
  /** Pattern to detect if this related intent is addressed in content */
  pattern: RegExp;
}

interface SubIntentMapping {
  /** Pattern to detect if the keyphrase matches this sub-intent */
  keyphrasePattern: RegExp;
  label: string;
  relatedIntents: RelatedIntent[];
}

const SUB_INTENT_MAPPINGS: readonly SubIntentMapping[] = [
  {
    keyphrasePattern: /\bhow to\b/i,
    label: '"how to" article',
    relatedIntents: [
      {
        name: '"what is" (definitional)',
        pattern: /\b(?:what is|what are|definition|refers to|is a type of)\b/i,
      },
      {
        name: '"why" (motivation)',
        pattern: /\b(?:why you should|why it matters|the reason|benefits of|importance of)\b/i,
      },
      {
        name: 'common mistakes',
        pattern: /\b(?:mistakes?|avoid|common errors?|pitfalls?|don't)\b/i,
      },
      {
        name: 'tools/resources',
        pattern: /\b(?:tools?|resources?|software|apps?|platforms?|you'll need)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\bbest\b/i,
    label: '"best X" query',
    relatedIntents: [
      {
        name: '"how to choose"',
        pattern:
          /\b(?:how to choose|how to pick|what to look for|factors to consider|buying guide)\b/i,
      },
      {
        name: '"what to look for"',
        pattern: /\b(?:features?|criteria|specifications?|requirements?|must.have)\b/i,
      },
      {
        name: 'budget options',
        pattern: /\b(?:budget|affordable|cheap|free|value for money|bang for buck)\b/i,
      },
      {
        name: 'use-case recommendations',
        pattern:
          /\b(?:for beginners?|for professionals?|for small business|for enterprise|use case)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\bbuy\b/i,
    label: '"buy X" query',
    relatedIntents: [
      {
        name: '"X review"',
        pattern: /\b(?:reviews?|ratings?|rated|tested|hands.on|our verdict)\b/i,
      },
      {
        name: '"X alternatives"',
        pattern: /\b(?:alternatives?|similar to|instead of|competitors?|other options?)\b/i,
      },
      {
        name: 'warranty/support',
        pattern: /\b(?:warranty|guarantee|support|return policy|customer service)\b/i,
      },
      {
        name: 'setup/getting started',
        pattern: /\b(?:setup|set up|getting started|installation|unboxing)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\b(?:vs|versus)\b/i,
    label: '"X vs Y" comparison',
    relatedIntents: [
      {
        name: '"which is better"',
        pattern: /\b(?:which is better|winner|our pick|verdict|recommendation)\b/i,
      },
      {
        name: '"when to use X vs Y"',
        pattern: /\b(?:when to use|best for|ideal for|suited for|use case|scenario)\b/i,
      },
      {
        name: 'key differences',
        pattern: /\b(?:key differences?|main differences?|differs? from|unlike|whereas)\b/i,
      },
      {
        name: 'pricing comparison',
        pattern: /\b(?:pricing|price|cost|plans?|subscription|free tier)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\b(?:what is|what are)\b/i,
    label: '"what is X" query',
    relatedIntents: [
      {
        name: '"how to use X"',
        pattern: /\b(?:how to use|how to implement|how to apply|getting started|step.by.step)\b/i,
      },
      {
        name: '"X examples"',
        pattern: /\b(?:examples?|for instance|for example|such as|use cases?|real.world)\b/i,
      },
      {
        name: 'types/categories',
        pattern: /\b(?:types? of|categories|kinds? of|varieties|classification)\b/i,
      },
      {
        name: 'history/background',
        pattern: /\b(?:history|background|origin|evolution|development|invented|created)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\b(?:checklist|list)\b/i,
    label: '"checklist / list" article',
    relatedIntents: [
      {
        name: '"how to" (implementation)',
        pattern: /\b(?:how to|step.by.step|follow these|getting started)\b/i,
      },
      {
        name: '"why it matters"',
        pattern: /\b(?:why you should|why it matters|the reason|benefits of|importance of)\b/i,
      },
      {
        name: 'common mistakes',
        pattern: /\b(?:mistakes?|avoid|common errors?|pitfalls?|don't)\b/i,
      },
      {
        name: 'tools/templates',
        pattern: /\b(?:tools?|templates?|resources?|software|apps?|you'll need)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\btips?\b/i,
    label: '"tips" article',
    relatedIntents: [
      {
        name: '"how to" (implementation)',
        pattern: /\b(?:how to|step.by.step|follow these|getting started)\b/i,
      },
      {
        name: 'common mistakes',
        pattern: /\b(?:mistakes?|avoid|common errors?|pitfalls?|don't)\b/i,
      },
      {
        name: 'beginner guidance',
        pattern: /\b(?:for beginners?|basics|fundamentals|start(?:ing)? out|new to)\b/i,
      },
      {
        name: 'tools/resources',
        pattern: /\b(?:tools?|resources?|software|apps?|platforms?|you'll need)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\bexamples?\b/i,
    label: '"examples" article',
    relatedIntents: [
      {
        name: '"what is" (definitional)',
        pattern: /\b(?:what is|what are|definition|refers to|is a type of)\b/i,
      },
      {
        name: '"how to" (implementation)',
        pattern: /\b(?:how to|step.by.step|getting started|how to use|how to apply)\b/i,
      },
      {
        name: 'templates/tools',
        pattern: /\b(?:templates?|tools?|resources?|generators?|software)\b/i,
      },
      {
        name: 'best practices',
        pattern: /\b(?:best practices?|tips|guidelines|recommendations?|dos and don'ts)\b/i,
      },
    ],
  },
  {
    keyphrasePattern: /\b(?:tutorial|guide)\b/i,
    label: '"tutorial / guide" article',
    relatedIntents: [
      {
        name: '"what is" (definitional)',
        pattern: /\b(?:what is|what are|definition|refers to|is a type of)\b/i,
      },
      {
        name: 'prerequisites/requirements',
        pattern: /\b(?:prerequisites?|requirements?|before you (?:start|begin)|you'll need)\b/i,
      },
      {
        name: 'common mistakes',
        pattern: /\b(?:mistakes?|avoid|common errors?|pitfalls?|troubleshooting)\b/i,
      },
      {
        name: 'next steps/advanced',
        pattern: /\b(?:next steps?|advanced|going further|further reading|beyond the basics)\b/i,
      },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------

export function checkIntentRelatedCoverage(input: ContentAnalysisInput): AnalysisResult {
  const id = 'intent-related-coverage';
  const title = 'Related intent coverage';

  if (!input.focusKeyphrase || input.focusKeyphrase.trim().length === 0) {
    return {
      id,
      title,
      description: 'No focus keyphrase set. Set one to evaluate related intent coverage.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const keyphrase = input.focusKeyphrase.trim();
  const plainText = stripHtml(input.content);

  // Find the matching sub-intent mapping
  let matchedMapping: SubIntentMapping | undefined;
  for (const mapping of SUB_INTENT_MAPPINGS) {
    if (mapping.keyphrasePattern.test(keyphrase)) {
      matchedMapping = mapping;
      break;
    }
  }

  // If no sub-intent pattern matches, this check does not apply — exclude it
  // rather than penalizing an unrecognized keyphrase shape.
  if (!matchedMapping) {
    const detected = detectIntent(keyphrase);
    const intentLabel =
      detected.primary === 'commercial-investigation' ? 'commercial' : detected.primary;
    return {
      id,
      title,
      description:
        `No specific sub-intent pattern recognized for this ${intentLabel} keyphrase, so related intent coverage cannot be evaluated. ` +
        `Consider adding related topics that users commonly search for alongside "${keyphrase}".`,
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Check which related intents are addressed
  const covered: string[] = [];
  const missing: string[] = [];

  for (const related of matchedMapping.relatedIntents) {
    if (related.pattern.test(plainText)) {
      covered.push(related.name);
    } else {
      missing.push(related.name);
    }
  }

  const coveredCount = covered.length;
  const coveredList = covered.join(', ');
  const missingList = missing.join(', ');

  // good (5): 3+ related intents addressed
  if (coveredCount >= 3) {
    return {
      id,
      title,
      description:
        `Excellent related intent coverage for a ${matchedMapping.label} (${coveredCount}/${matchedMapping.relatedIntents.length} related intents). ` +
        `Covered: ${coveredList}.` +
        (missing.length > 0 ? ` Consider also addressing: ${missingList}.` : ''),
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // ok (3): 1-2 related intents
  if (coveredCount >= 1) {
    return {
      id,
      title,
      description:
        `Partial related intent coverage for a ${matchedMapping.label} (${coveredCount}/${matchedMapping.relatedIntents.length} related intents). ` +
        `Covered: ${coveredList}. Missing: ${missingList}. ` +
        `Address missing intents to reduce follow-up searches.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  // poor (0): no related intents addressed
  return {
    id,
    title,
    description:
      `No related intents addressed for a ${matchedMapping.label}. ` +
      `Missing: ${missingList}. ` +
      `Content may cause users to search again for these related topics.`,
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
