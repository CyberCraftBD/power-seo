// @power-seo/core — Pattern Utilities
// ----------------------------------------------------------------------------

/**
 * Count distinct (non-overlapping) match spans of `patterns` in `text`.
 * Overlapping hits from different patterns are merged and counted once.
 * Resets each pattern's lastIndex.
 */
export function countDistinctMatches(text: string, patterns: RegExp[]): number {
  const spans: Array<[number, number]> = [];

  for (const pattern of patterns) {
    // Non-global regexes would loop forever with exec(); wrap them with /g.
    const re = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + 'g');
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      spans.push([m.index, m.index + m[0].length]);
      if (m[0].length === 0) re.lastIndex++;
    }
    re.lastIndex = 0;
  }

  spans.sort((a, b) => a[0] - b[0]);
  let count = 0;
  let coveredEnd = -1;
  for (const [start, end] of spans) {
    if (start >= coveredEnd) {
      count++;
      coveredEnd = end;
    } else if (end > coveredEnd) {
      coveredEnd = end;
    }
  }

  return count;
}

/**
 * Diminishing-returns match counting (power-seo#152).
 *
 * Each DISTINCT matched phrase earns full credit once; identical repeats earn
 * log2-scaled credit (n occurrences of the same phrase = 1 + log2(n)). Ten
 * different signal phrases therefore outweigh one phrase repeated ten times,
 * making phrase-stuffing strictly worse than genuine variety. Identical
 * phrases matched by more than one pattern are merged, which also removes
 * same-phrase double-dipping across a check's pattern list.
 */
export function countEffectiveMatches(text: string, patterns: RegExp[]): number {
  const counts = new Map<string, number>();
  for (const pattern of patterns) {
    const re = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + 'g');
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const key = m[0].trim().toLowerCase().replace(/\s+/g, ' ');
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (m[0].length === 0) re.lastIndex++;
    }
    re.lastIndex = 0;
  }
  let effective = 0;
  for (const n of counts.values()) {
    effective += 1 + Math.log2(n);
  }
  return Math.round(effective * 10) / 10;
}
