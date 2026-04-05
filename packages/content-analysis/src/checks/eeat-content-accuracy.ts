// @power-seo/content-analysis — E-E-A-T: Content Accuracy Patterns
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

// Misleading/accuracy-undermining patterns
const MISLEADING_PATTERNS: Array<{ pattern: RegExp; type: string }> = [
  // False urgency
  { pattern: /\bact\s+now\s+(?:before|or)\b/gi, type: 'false urgency' },
  { pattern: /\blimited\s+time\s+(?:only|offer)\b/gi, type: 'false urgency' },
  { pattern: /\bbefore\s+it['']?s?\s+too\s+late\b/gi, type: 'false urgency' },
  { pattern: /\bhurry\s+(?:up|before)\b/gi, type: 'false urgency' },
  { pattern: /\bdon['']t\s+miss\s+(?:out|this)\b/gi, type: 'false urgency' },
  { pattern: /\bexpires?\s+(?:soon|today|tonight)\b/gi, type: 'false urgency' },
  { pattern: /\blast\s+chance\b/gi, type: 'false urgency' },
  { pattern: /\bonly\s+\d+\s+(?:left|remaining|spots?)\b/gi, type: 'false scarcity' },

  // Unsubstantiated superlatives
  { pattern: /\bthe\s+(?:absolute|very|single)\s+best\b/gi, type: 'unsubstantiated superlative' },
  { pattern: /\b(?:best|greatest|most\s+\w+)\s+(?:ever|in\s+the\s+world|of\s+all\s+time)\b/gi, type: 'unsubstantiated superlative' },
  { pattern: /\bnothing\s+(?:else\s+)?(?:compares?|comes?\s+close|beats?)\b/gi, type: 'unsubstantiated superlative' },
  { pattern: /\bthe\s+only\s+(?:solution|answer|way|product|tool)\s+you['']?ll?\s+(?:ever\s+)?need\b/gi, type: 'unsubstantiated superlative' },

  // Clickbait exaggeration
  { pattern: /\byou\s+won['']t\s+believe\b/gi, type: 'clickbait' },
  { pattern: /\bshocking\s+(?:truth|reason|secret|fact)\b/gi, type: 'clickbait' },
  { pattern: /\bwhat\s+(?:they|nobody|no\s+one)\s+(?:don['']t|won['']t)\s+tell\s+you\b/gi, type: 'clickbait' },
  { pattern: /\bsecret\s+(?:that|they|nobody)\b/gi, type: 'clickbait' },
  { pattern: /\bdoctors?\s+(?:hate|don['']t\s+want)\b/gi, type: 'clickbait' },
  { pattern: /\bone\s+weird\s+trick\b/gi, type: 'clickbait' },
  { pattern: /\bmind[\s-]?blow(?:ing|n)\b/gi, type: 'clickbait' },

  // Deceptive framing
  { pattern: /\bguaranteed\s+(?:results?|success|income|returns?)\b/gi, type: 'deceptive claim' },
  { pattern: /\b100\s*%\s+(?:guaranteed|proven|risk[\s-]?free|safe|effective|success)\b/gi, type: 'deceptive claim' },
  { pattern: /\bget\s+rich\s+(?:quick|fast)\b/gi, type: 'deceptive claim' },
  { pattern: /\bmake\s+(?:\$[\d,]+|money)\s+(?:fast|easily|overnight|while\s+you\s+sleep)\b/gi, type: 'deceptive claim' },
  { pattern: /\bno\s+(?:risk|effort|experience)\s+(?:required|needed|necessary)\b/gi, type: 'deceptive claim' },
  { pattern: /\binstant\s+(?:results?|success|cure|fix)\b/gi, type: 'deceptive claim' },
  { pattern: /\bmiracle\s+(?:cure|solution|product|formula)\b/gi, type: 'deceptive claim' },
];

// Evidence-backing patterns (claims supported by data)
const EVIDENCE_PATTERNS: RegExp[] = [
  /\baccording\s+to\s+(?:a\s+)?(?:study|research|survey|report|data)\b/gi,
  /\b(?:studies?|research|data|evidence)\s+(?:shows?|suggests?|indicates?|demonstrates?|confirms?|supports?)\b/gi,
  /\b\[\d+\]\b/g, // Citation markers [1], [2]
  /\bsource\s*:/gi,
  /\bcited?\s+(?:in|from|by)\b/gi,
  /\breference\s*:/gi,
  /\b(?:published|reported)\s+(?:in|by)\b/gi,
];

export function checkContentAccuracy(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content || '');
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-content-accuracy',
      title: 'Content accuracy',
      description: 'Content is too short to assess accuracy patterns.',
      status: 'na',
      score: 0,
      maxScore: 10,
    };
  }

  // Detect misleading patterns
  const foundIssues: Array<{ text: string; type: string }> = [];
  const issueTypes = new Set<string>();

  for (const { pattern, type } of MISLEADING_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) {
      for (const m of matches) {
        if (foundIssues.length < 5) {
          foundIssues.push({ text: m.trim(), type });
        }
        issueTypes.add(type);
      }
    }
  }

  // Detect evidence-backing
  let evidenceCount = 0;
  for (const pattern of EVIDENCE_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) evidenceCount += matches.length;
  }

  const issueCount = foundIssues.length;

  if (issueCount === 0 && evidenceCount >= 2) {
    return {
      id: 'eeat-content-accuracy',
      title: 'Content accuracy',
      description: `No misleading language detected. ${evidenceCount} evidence-backed claims found. Content maintains factual, trustworthy tone.`,
      status: 'good',
      score: 5,
      maxScore: 10,
    };
  }

  if (issueCount === 0) {
    return {
      id: 'eeat-content-accuracy',
      title: 'Content accuracy',
      description: 'No misleading language detected. Consider adding more evidence-backed claims ("research shows", "according to studies") to strengthen trustworthiness.',
      status: 'good',
      score: 5,
      maxScore: 10,
    };
  }

  if (issueCount <= 2 && evidenceCount >= 1) {
    const examples = foundIssues.slice(0, 2).map(i => `"${i.text}" (${i.type})`);
    return {
      id: 'eeat-content-accuracy',
      title: 'Content accuracy',
      description: `Minor accuracy concerns: ${examples.join('; ')}. Consider softening or removing these phrases. ${evidenceCount} evidence-backed claims help balance credibility.`,
      status: 'ok',
      score: 3,
      maxScore: 10,
    };
  }

  const typeList = Array.from(issueTypes).join(', ');
  const examples = foundIssues.slice(0, 3).map(i => `"${i.text}"`);
  return {
    id: 'eeat-content-accuracy',
    title: 'Content accuracy',
    description: `${issueCount} accuracy issues detected (${typeList}): ${examples.join(', ')}. Remove misleading language, unsubstantiated claims, and clickbait. Back claims with evidence and use calibrated language.`,
    status: 'poor',
    score: 0,
    maxScore: 10,
  };
}
