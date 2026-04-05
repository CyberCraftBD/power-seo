// @power-seo/content-analysis — Inclusive Language Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml } from '@power-seo/core';

type InclusiveCategory =
  | 'gender'
  | 'ability'
  | 'tech'
  | 'age'
  | 'race/ethnicity'
  | 'violence metaphor';

interface NonInclusiveTerm {
  term: string;
  replacement: string;
  category: InclusiveCategory;
}

interface TermMatch {
  term: string;
  replacement: string;
  category: InclusiveCategory;
}

/**
 * Comprehensive dictionary of non-inclusive terms with suggested replacements,
 * organized by category.
 */
const NON_INCLUSIVE_TERMS: NonInclusiveTerm[] = [
  // --- Gender ---
  { term: 'manpower', replacement: 'workforce', category: 'gender' },
  { term: 'chairman', replacement: 'chairperson', category: 'gender' },
  { term: 'chairmen', replacement: 'chairpersons', category: 'gender' },
  { term: 'fireman', replacement: 'firefighter', category: 'gender' },
  { term: 'firemen', replacement: 'firefighters', category: 'gender' },
  { term: 'mankind', replacement: 'humankind', category: 'gender' },
  { term: 'policeman', replacement: 'police officer', category: 'gender' },
  { term: 'policemen', replacement: 'police officers', category: 'gender' },
  { term: 'stewardess', replacement: 'flight attendant', category: 'gender' },
  { term: 'stewardesses', replacement: 'flight attendants', category: 'gender' },
  { term: 'waitress', replacement: 'server', category: 'gender' },
  { term: 'waitresses', replacement: 'servers', category: 'gender' },
  { term: 'salesman', replacement: 'salesperson', category: 'gender' },
  { term: 'salesmen', replacement: 'salespeople', category: 'gender' },
  { term: 'postman', replacement: 'mail carrier', category: 'gender' },
  { term: 'postmen', replacement: 'mail carriers', category: 'gender' },
  { term: 'man-made', replacement: 'artificial/synthetic', category: 'gender' },
  { term: 'manmade', replacement: 'artificial/synthetic', category: 'gender' },
  { term: 'manhole', replacement: 'maintenance hole', category: 'gender' },
  { term: 'manholes', replacement: 'maintenance holes', category: 'gender' },
  { term: 'freshman', replacement: 'first-year student', category: 'gender' },
  { term: 'freshmen', replacement: 'first-year students', category: 'gender' },
  { term: 'housewife', replacement: 'homemaker', category: 'gender' },
  { term: 'housewives', replacement: 'homemakers', category: 'gender' },
  { term: 'businessman', replacement: 'businessperson', category: 'gender' },
  { term: 'businessmen', replacement: 'businesspeople', category: 'gender' },
  { term: 'congressmen', replacement: 'members of congress', category: 'gender' },
  { term: 'spokesman', replacement: 'spokesperson', category: 'gender' },
  { term: 'spokesmen', replacement: 'spokespersons', category: 'gender' },
  { term: 'craftsman', replacement: 'craftsperson', category: 'gender' },
  { term: 'craftsmen', replacement: 'craftspeople', category: 'gender' },
  { term: 'foreman', replacement: 'supervisor', category: 'gender' },

  // --- Ability ---
  { term: 'blind spot', replacement: 'oversight', category: 'ability' },
  { term: 'crippled', replacement: 'impaired/broken', category: 'ability' },
  { term: 'crippling', replacement: 'severely limiting', category: 'ability' },
  { term: 'lame', replacement: 'inadequate', category: 'ability' },
  { term: 'crazy', replacement: 'unexpected/surprising', category: 'ability' },
  { term: 'insane', replacement: 'intense/extreme', category: 'ability' },
  { term: 'handicapped', replacement: 'disabled', category: 'ability' },
  { term: 'wheelchair-bound', replacement: 'wheelchair user', category: 'ability' },
  { term: 'wheelchair bound', replacement: 'wheelchair user', category: 'ability' },
  { term: 'suffers from', replacement: 'has/lives with', category: 'ability' },
  { term: 'suffering from', replacement: 'living with', category: 'ability' },
  { term: 'special needs', replacement: 'disability/disabled', category: 'ability' },
  { term: 'mentally retarded', replacement: 'intellectually disabled', category: 'ability' },
  { term: 'retarded', replacement: 'delayed/impaired', category: 'ability' },
  { term: 'tone deaf', replacement: 'unaware/oblivious', category: 'ability' },
  { term: 'tone-deaf', replacement: 'unaware/oblivious', category: 'ability' },
  { term: 'dumb', replacement: 'silent/mute', category: 'ability' },

  // --- Tech ---
  { term: 'master/slave', replacement: 'primary/replica', category: 'tech' },
  { term: 'master slave', replacement: 'primary replica', category: 'tech' },
  { term: 'whitelist', replacement: 'allowlist', category: 'tech' },
  { term: 'whitelisted', replacement: 'added to allowlist', category: 'tech' },
  { term: 'whitelisting', replacement: 'adding to allowlist', category: 'tech' },
  { term: 'blacklist', replacement: 'blocklist', category: 'tech' },
  { term: 'blacklisted', replacement: 'blocked', category: 'tech' },
  { term: 'blacklisting', replacement: 'blocking', category: 'tech' },
  { term: 'sanity check', replacement: 'validation check', category: 'tech' },
  { term: 'dummy value', replacement: 'placeholder value', category: 'tech' },
  { term: 'dummy variable', replacement: 'placeholder variable', category: 'tech' },
  { term: 'native feature', replacement: 'built-in feature', category: 'tech' },
  { term: 'grandfathered', replacement: 'legacy/exempt', category: 'tech' },
  { term: 'grandfather clause', replacement: 'legacy provision', category: 'tech' },

  // --- Age ---
  { term: 'elderly', replacement: 'older adults', category: 'age' },
  { term: 'senior citizen', replacement: 'older adult', category: 'age' },
  { term: 'senior citizens', replacement: 'older adults', category: 'age' },
  { term: 'the aged', replacement: 'older people', category: 'age' },
  { term: 'the elderly', replacement: 'older adults', category: 'age' },
  { term: 'old people', replacement: 'older people', category: 'age' },

  // --- Race/ethnicity ---
  { term: 'black market', replacement: 'underground market', category: 'race/ethnicity' },
  { term: 'blackball', replacement: 'reject/exclude', category: 'race/ethnicity' },
  { term: 'blackballed', replacement: 'rejected/excluded', category: 'race/ethnicity' },
  { term: 'black sheep', replacement: 'outcast/outlier', category: 'race/ethnicity' },
  { term: 'blackmark', replacement: 'negative record', category: 'race/ethnicity' },

  // --- Violence metaphors ---
  { term: 'killing it', replacement: 'excelling', category: 'violence metaphor' },
  { term: 'take a stab at', replacement: 'attempt', category: 'violence metaphor' },
  { term: 'taking a stab at', replacement: 'attempting', category: 'violence metaphor' },
  { term: 'trigger warning', replacement: 'content warning', category: 'violence metaphor' },
  { term: 'pull the trigger', replacement: 'make the decision', category: 'violence metaphor' },
  { term: 'bite the bullet', replacement: 'accept the challenge', category: 'violence metaphor' },
  { term: 'silver bullet', replacement: 'perfect solution', category: 'violence metaphor' },
  { term: 'war room', replacement: 'situation room', category: 'violence metaphor' },
  { term: 'go ballistic', replacement: 'react strongly', category: 'violence metaphor' },
  { term: 'shoot down', replacement: 'reject/dismiss', category: 'violence metaphor' },
];

/**
 * Find all non-inclusive term matches in the text. Uses word-boundary-aware
 * matching to avoid false positives inside unrelated words.
 */
function findMatches(text: string): TermMatch[] {
  const lowerText = text.toLowerCase();
  const matches: TermMatch[] = [];
  const seen = new Set<string>();

  for (const entry of NON_INCLUSIVE_TERMS) {
    if (seen.has(entry.term)) continue;

    const termLower = entry.term.toLowerCase();
    let searchPos = 0;

    while (searchPos < lowerText.length) {
      const idx = lowerText.indexOf(termLower, searchPos);
      if (idx === -1) break;

      // Word boundary checks to avoid partial matches
      const charBefore = idx > 0 ? lowerText[idx - 1]! : ' ';
      const charAfter =
        idx + termLower.length < lowerText.length
          ? lowerText[idx + termLower.length]!
          : ' ';

      const isWordBoundaryBefore = /[\s.,;:!?'"()-/]/.test(charBefore) || idx === 0;
      const isWordBoundaryAfter =
        /[\s.,;:!?'"()-/]/.test(charAfter) || idx + termLower.length === lowerText.length;

      if (isWordBoundaryBefore && isWordBoundaryAfter) {
        seen.add(entry.term);
        matches.push({
          term: entry.term,
          replacement: entry.replacement,
          category: entry.category,
        });
        break; // One match per term is sufficient
      }

      searchPos = idx + 1;
    }
  }

  return matches;
}

/**
 * Group matches by category for clearer reporting.
 */
function groupByCategory(matches: TermMatch[]): Map<InclusiveCategory, TermMatch[]> {
  const groups = new Map<InclusiveCategory, TermMatch[]>();
  for (const match of matches) {
    const group = groups.get(match.category) || [];
    group.push(match);
    groups.set(match.category, group);
  }
  return groups;
}

/**
 * Check content for non-inclusive language across six categories:
 * gender, ability, tech, age, race/ethnicity, and violence metaphors.
 *
 * For each match, reports the term found, its category, and a suggested
 * inclusive replacement.
 */
export function checkInclusiveLanguage(input: ContentAnalysisInput): AnalysisResult {
  const plainText = stripHtml(input.content).trim();

  if (!plainText || plainText.length === 0) {
    return {
      id: 'inclusive-language',
      title: 'Inclusive language',
      description: 'No content to analyze. Add content to check for inclusive language.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Also check the title and meta description
  const fullText = [
    input.title || '',
    input.metaDescription || '',
    plainText,
  ].join(' ');

  const matches = findMatches(fullText);

  if (matches.length === 0) {
    return {
      id: 'inclusive-language',
      title: 'Inclusive language',
      description:
        'No non-inclusive language detected. Your content uses inclusive terminology.',
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  // Build detailed report
  const grouped = groupByCategory(matches);
  const reportParts: string[] = [];

  for (const [category, categoryMatches] of grouped) {
    const items = categoryMatches
      .map((m) => `"${m.term}" -> "${m.replacement}"`)
      .join(', ');
    reportParts.push(`${category}: ${items}`);
  }

  const report = reportParts.join('; ') + '.';

  if (matches.length <= 2) {
    return {
      id: 'inclusive-language',
      title: 'Inclusive language',
      description:
        `Found ${matches.length} non-inclusive term${matches.length === 1 ? '' : 's'}. ` +
        `Consider replacing: ${report}`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'inclusive-language',
    title: 'Inclusive language',
    description:
      `Found ${matches.length} non-inclusive terms across your content. ` +
      `Replace the following: ${report}`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
