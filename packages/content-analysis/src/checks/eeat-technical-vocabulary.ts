// @power-seo/content-analysis — E-E-A-T: Technical Vocabulary Depth
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords, countSyllables, countDistinctMatches } from '@power-seo/core';

// Patterns that indicate technical terms are being explained (good for expertise)
const EXPLANATION_PATTERNS: RegExp[] = [
  /\bwhich\s+means\b/gi,
  /\bin\s+other\s+words\b/gi,
  /\balso\s+known\s+as\b/gi,
  /\breferred\s+to\s+as\b/gi,
  /\bdefined\s+as\b/gi,
  /\bi\.e\.\b/gi,
  /\be\.g\.\b/gi,
  /\bfor\s+example\b/gi,
  /\bsimply\s+put\b/gi,
  /\bin\s+simple\s+terms\b/gi,
  /\bthis\s+means\b/gi,
  /\bthat\s+is\b/gi,
  /\b\(\s*[A-Z][a-z]+/g, // Parenthetical definitions like "(Hypertext Transfer Protocol)"
];

// Unnecessarily complex words with simpler alternatives
const COMPLEX_SYNONYMS: Array<{ complex: RegExp; simple: string }> = [
  { complex: /\butilize\b/gi, simple: 'use' },
  { complex: /\bapproximately\b/gi, simple: 'about' },
  { complex: /\bsubsequently\b/gi, simple: 'then/later' },
  { complex: /\bcommence\b/gi, simple: 'start/begin' },
  { complex: /\bterminate\b/gi, simple: 'end/stop' },
  { complex: /\bfacilitate\b/gi, simple: 'help/enable' },
  { complex: /\bdemonstrate\b/gi, simple: 'show' },
  { complex: /\bleverage\b/gi, simple: 'use' },
  { complex: /\boptimize\b/gi, simple: 'improve' },
  { complex: /\bimplementation\b/gi, simple: 'setup' },
  { complex: /\bfunctionality\b/gi, simple: 'feature' },
  { complex: /\bmodification\b/gi, simple: 'change' },
  { complex: /\bconfiguration\b/gi, simple: 'setup/settings' },
  { complex: /\bascertain\b/gi, simple: 'find out' },
  { complex: /\bnumerous\b/gi, simple: 'many' },
  { complex: /\bsufficient\b/gi, simple: 'enough' },
  { complex: /\bnecessitate\b/gi, simple: 'need/require' },
  { complex: /\bprocure\b/gi, simple: 'get/obtain' },
  { complex: /\bdiminish\b/gi, simple: 'reduce' },
  { complex: /\bameliorat\w+\b/gi, simple: 'improve' },
  { complex: /\bexpedit\w+\b/gi, simple: 'speed up' },
  { complex: /\belucidat\w+\b/gi, simple: 'explain/clarify' },
  { complex: /\bperpetuat\w+\b/gi, simple: 'continue' },
  { complex: /\bexacerbat\w+\b/gi, simple: 'worsen' },
  { complex: /\bamalgamat\w+\b/gi, simple: 'combine/merge' },
];

// Common technical/domain words (3+ syllables that are NOT unnecessarily complex)
const VALID_TECHNICAL_WORDS: RegExp[] = [
  /\b(algorithm|database|framework|component|interface|architecture|infrastructure|deployment|repository|middleware|authentication|authorization|encryption|protocol|bandwidth|latency|throughput|scalability|microservic\w+|containeriz\w+|orchestrat\w+|kubernetes|javascript|typescript|python|machine\s+learning|artificial\s+intelligence|neural\s+network|blockchain|cryptocurrency|responsive|analytics|automation|integration|documentation|performance|accessibility|optimization|specification)\b/gi,
];

export function checkTechnicalVocabulary(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-technical-vocabulary',
      title: 'Technical vocabulary',
      description: 'Content is too short to analyze technical vocabulary.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Count complex words (3+ syllables)
  let complexWordCount = 0;
  const complexWords: string[] = [];
  for (const word of words) {
    if (countSyllables(word) >= 3 && word.length >= 6) {
      complexWordCount++;
      const lower = word.toLowerCase();
      if (!complexWords.includes(lower) && complexWords.length < 15) {
        complexWords.push(lower);
      }
    }
  }
  const complexRatio = complexWordCount / wordCount;

  // Count explanation patterns (overlapping hits count once)
  const explanationCount = countDistinctMatches(plainText, EXPLANATION_PATTERNS);

  // Count unnecessarily complex synonyms
  let unnecessaryComplexCount = 0;
  const unnecessaryExamples: string[] = [];
  for (const { complex, simple } of COMPLEX_SYNONYMS) {
    const matches = plainText.match(complex);
    if (matches) {
      unnecessaryComplexCount += matches.length;
      if (unnecessaryExamples.length < 3) {
        unnecessaryExamples.push(`"${matches[0]}" → "${simple}"`);
      }
    }
  }

  // Count valid technical terms
  let technicalTermCount = 0;
  for (const pattern of VALID_TECHNICAL_WORDS) {
    const matches = plainText.match(pattern);
    if (matches) technicalTermCount += matches.length;
  }

  // Evaluate: Good = uses technical terms AND explains them, AND avoids unnecessary complexity
  const hasGoodTechnicalDepth = technicalTermCount >= 3 || complexRatio >= 0.08;
  const explainsTerms = explanationCount >= 2;
  const lowUnnecessary = unnecessaryComplexCount <= 2;

  if (hasGoodTechnicalDepth && explainsTerms && lowUnnecessary) {
    return {
      id: 'eeat-technical-vocabulary',
      title: 'Technical vocabulary',
      description: `Good technical depth with ${technicalTermCount} domain-specific terms and ${explanationCount} explanatory phrases. Complex concepts are properly explained for the reader.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (hasGoodTechnicalDepth && (explainsTerms || lowUnnecessary)) {
    const suggestions: string[] = [];
    if (!explainsTerms) suggestions.push('explain technical terms for wider audience');
    if (!lowUnnecessary) suggestions.push(`simplify: ${unnecessaryExamples.join(', ')}`);
    return {
      id: 'eeat-technical-vocabulary',
      title: 'Technical vocabulary',
      description: `Moderate technical vocabulary. ${suggestions.join('; ')}. Good expertise signals come from using domain terms AND explaining them clearly.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  const suggestions: string[] = [];
  if (technicalTermCount < 3) suggestions.push('add more domain-specific terminology');
  if (explanationCount < 2)
    suggestions.push('explain technical concepts with "which means", "in other words"');
  if (unnecessaryComplexCount > 2) suggestions.push(`simplify: ${unnecessaryExamples.join(', ')}`);

  return {
    id: 'eeat-technical-vocabulary',
    title: 'Technical vocabulary',
    description: `Weak technical vocabulary depth. ${suggestions.join('; ')}. Expert content uses precise domain language while remaining accessible.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
