// @power-seo/content-analysis — Shared E-E-A-T Pattern Lists
// ----------------------------------------------------------------------------
// Internal module: regex lists used by multiple checks. Keep character classes
// like ['’] (straight + curly apostrophe) byte-for-byte intact.

// Temporal experience markers (stronger first-person experience signal).
// Used by eeat-experience-depth and eeat-overall-score.
export const TEMPORAL_EXPERIENCE_PATTERNS: RegExp[] = [
  /\bafter\s+\d+\s+(months?|years?|weeks?|days?)\s+of\s+using\b/gi,
  /\bover\s+the\s+past\s+\d+\s+(months?|years?|weeks?)\b/gi,
  /\bfor\s+the\s+last\s+\d+\s+(months?|years?|weeks?)\b/gi,
  /\bi['’]ve\s+been\s+using\b/gi,
  /\bi['’]ve\s+spent\b/gi,
  /\bi['’]ve\s+worked\s+with\b/gi,
  /\bfor\s+over\s+\d+\s+years?\b/gi,
  /\bsince\s+\d{4}\b/gi,
];
