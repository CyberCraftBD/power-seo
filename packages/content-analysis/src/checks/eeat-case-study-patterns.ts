// @power-seo/content-analysis — E-E-A-T: Case Study / Real Example Patterns
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

// Case study structural elements
const PROBLEM_PATTERNS: RegExp[] = [
  /\b(the\s+)?(problem|challenge|issue|pain\s+point)\s+(was|is|we\s+faced)\b/gi,
  /\bwe\s+(faced|encountered|dealt\s+with|struggled\s+with)\b/gi,
  /\bthe\s+client\s+(needed|wanted|required|asked)\b/gi,
  /\b(challenge|problem|issue):\s/gi,
  /\bour\s+(goal|objective|target)\s+was\b/gi,
  /\bthe\s+situation\b/gi,
  /\binitial\s+(state|condition|setup|assessment)\b/gi,
];

const APPROACH_PATTERNS: RegExp[] = [
  /\b(our|my|the)\s+(solution|approach|strategy|method|plan)\b/gi,
  /\bwe\s+(decided\s+to|chose\s+to|opted\s+for|implemented|designed|developed|built|created)\b/gi,
  /\bi\s+(decided\s+to|chose\s+to|opted\s+for|implemented|designed|developed|built|created)\b/gi,
  /\bthe\s+implementation\s+(involved|included|required)\b/gi,
  /\b(step\s+\d+|phase\s+\d+|stage\s+\d+)\b/gi,
  /\bhere['']?s?\s+(how|what)\s+we\s+(did|implemented|built|solved)\b/gi,
  /\bthe\s+process\b/gi,
  /\bour\s+workflow\b/gi,
  /\btechnical\s+(approach|solution|implementation)\b/gi,
];

const RESULTS_PATTERNS: RegExp[] = [
  /\b(the\s+)?(results?|outcomes?|impact)\s+(was|were|showed|demonstrated|included)\b/gi,
  /\bwe\s+(achieved|saw|observed|measured|recorded)\b/gi,
  /\bi\s+(achieved|saw|observed|measured|recorded)\b/gi,
  /\b(increased|decreased|improved|reduced|grew|boosted)\s+by\s+\d+/gi,
  /\b\d+\s*%\s+(increase|decrease|improvement|reduction|growth|boost|drop|decline)\b/gi,
  /\bROI\s+(of|was)\b/gi,
  /\bkey\s+(metrics?|results?|findings?|takeaways?)\b/gi,
  /\bperformance\s+(improved|increased|grew)\b/gi,
  /\b(before|after)\s+(the\s+)?(change|implementation|migration|update|optimization)\b/gi,
];

const LESSONS_PATTERNS: RegExp[] = [
  /\b(lessons?\s+learned|key\s+takeaways?|what\s+we\s+learned)\b/gi,
  /\bif\s+I\s+(had\s+to|could|were\s+to)\s+do\s+it\s+again\b/gi,
  /\bin\s+hindsight\b/gi,
  /\blooking\s+back\b/gi,
  /\bwhat\s+(worked|didn['']t\s+work|surprised\s+us)\b/gi,
  /\bthe\s+biggest\s+(lesson|takeaway|surprise|challenge)\b/gi,
  /\bnext\s+time\b/gi,
  /\bwould\s+recommend\b/gi,
  /\badvice\s+(for|to)\b/gi,
  /\bpro\s+tip\b/gi,
];

const REAL_EXAMPLE_PATTERNS: RegExp[] = [
  /\bfor\s+example\b/gi,
  /\bfor\s+instance\b/gi,
  /\bsuch\s+as\b/gi,
  /\bcase\s+study\b/gi,
  /\breal[\s-]world\s+(example|scenario|case|application)\b/gi,
  /\bin\s+one\s+(case|instance|project|scenario)\b/gi,
  /\ba\s+(client|customer|company|user|team)\s+(of\s+ours|we\s+worked\s+with)\b/gi,
  /\bspecifically\b/gi,
  /\bhere['']?s?\s+a\s+(concrete|specific|real)\s+example\b/gi,
  /\btake\s+(the\s+case|for\s+example)\b/gi,
];

interface ElementScore {
  name: string;
  count: number;
  found: boolean;
}

export function checkCaseStudyPatterns(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 100) {
    return {
      id: 'eeat-case-study-patterns',
      title: 'Case studies & examples',
      description: 'Content is too short to analyze for case study patterns.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  const elements: ElementScore[] = [
    { name: 'problem statement', count: 0, found: false },
    { name: 'approach/solution', count: 0, found: false },
    { name: 'results/outcomes', count: 0, found: false },
    { name: 'lessons learned', count: 0, found: false },
    { name: 'real examples', count: 0, found: false },
  ];

  const patternGroups = [
    PROBLEM_PATTERNS,
    APPROACH_PATTERNS,
    RESULTS_PATTERNS,
    LESSONS_PATTERNS,
    REAL_EXAMPLE_PATTERNS,
  ];

  for (let i = 0; i < patternGroups.length; i++) {
    const group = patternGroups[i]!;
    const element = elements[i]!;
    for (const pattern of group) {
      const matches = plainText.match(pattern);
      if (matches) {
        element.count += matches.length;
        element.found = true;
      }
    }
  }

  const foundElements = elements.filter((e) => e.found);
  const missingElements = elements.filter((e) => !e.found);
  const totalMarkers = elements.reduce((sum, e) => sum + e.count, 0);

  if (foundElements.length >= 4 && totalMarkers >= 8) {
    return {
      id: 'eeat-case-study-patterns',
      title: 'Case studies & examples',
      description: `Excellent case study structure with ${foundElements.length}/5 elements: ${foundElements.map((e) => e.name).join(', ')}. Content demonstrates real-world application and experience.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (foundElements.length >= 2 && totalMarkers >= 4) {
    return {
      id: 'eeat-case-study-patterns',
      title: 'Case studies & examples',
      description: `Partial case study elements found (${foundElements.map((e) => e.name).join(', ')}). Add ${missingElements
        .slice(0, 2)
        .map((e) => e.name)
        .join(' and ')} to complete the narrative.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-case-study-patterns',
    title: 'Case studies & examples',
    description:
      'No case study or real-world example patterns detected. Structure content with: problem statement → approach/solution → measurable results → lessons learned. Use named examples and specific scenarios.',
    status: 'poor',
    score: 0,
    maxScore: 5,
  };
}
