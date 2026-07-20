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
