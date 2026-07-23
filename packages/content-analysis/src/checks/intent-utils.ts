// @power-seo/content-analysis -- Intent Detection Utilities
// ----------------------------------------------------------------------------

/** Primary search intent types following Google's intent taxonomy. */
export type IntentType =
  | 'informational'
  | 'navigational'
  | 'transactional'
  | 'commercial-investigation'
  | 'unknown';

/** Sub-intent categories that refine the primary intent. */
export type IntentSubType =
  | 'definitional'
  | 'tutorial'
  | 'troubleshooting'
  | 'comparison'
  | 'review-seeking'
  | 'purchase'
  | 'download'
  | 'local'
  | 'reference'
  | 'news'
  | 'unknown';

/** A modifier token found in the keyphrase and the intent it signals. */
export interface IntentModifier {
  word: string;
  signalsIntent: IntentType;
}

/** An individual intent signal detected from the keyphrase. */
export interface IntentSignal {
  type: IntentType;
  confidence: number;
  reason: string;
}

/** Full result returned by detectIntent. */
export interface IntentResult {
  primary: IntentType;
  confidence: number;
  subType: IntentSubType;
  modifiers: IntentModifier[];
  signals: IntentSignal[];
}

// ---------------------------------------------------------------------------
// Modifier dictionaries
// ---------------------------------------------------------------------------

const INFORMATIONAL_MODIFIERS: readonly string[] = [
  'what', 'how', 'why', 'when', 'where', 'who', 'which',
  'guide', 'tutorial', 'tips', 'learn', 'example', 'examples',
  'definition', 'meaning', 'explained', 'overview', 'introduction',
  'basics', 'fundamentals', 'understanding', 'difference', 'differences',
  'ways', 'ideas', 'steps', 'methods', 'techniques', 'strategies',
  'benefits', 'advantages', 'disadvantages', 'pros', 'cons',
  'causes', 'effects', 'history', 'types', 'list',
];

const TRANSACTIONAL_MODIFIERS: readonly string[] = [
  'buy', 'purchase', 'order', 'shop', 'deal', 'deals',
  'discount', 'coupon', 'price', 'pricing', 'cheap', 'cheapest',
  'affordable', 'free', 'download', 'subscribe', 'sign up', 'signup',
  'register', 'hire', 'book', 'reserve', 'get', 'sale',
  'promo', 'offer', 'shipping', 'delivery',
];

const COMMERCIAL_MODIFIERS: readonly string[] = [
  'best', 'top', 'review', 'reviews', 'comparison', 'compare',
  'vs', 'versus', 'alternative', 'alternatives', 'recommended',
  'rating', 'ratings', 'ranked', 'ranking', 'winner',
  'most popular', 'leading', 'premium', 'professional',
  'enterprise', 'budget', 'worth', 'quality',
];

const NAVIGATIONAL_MODIFIERS: readonly string[] = [
  'login', 'log in', 'signin', 'sign in', 'website', 'site',
  'official', 'homepage', 'app', 'portal', 'dashboard',
  'account', 'contact', 'support', 'help', 'docs', 'documentation',
  'api', 'download page',
];

const TROUBLESHOOTING_MODIFIERS: readonly string[] = [
  'fix', 'error', 'issue', 'problem', 'not working',
  'troubleshoot', 'troubleshooting', 'debug', 'resolve',
  'solution', 'solved', 'stuck', 'broken', 'crash', 'bug',
  'fails', 'failure', 'wrong', 'help',
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function findModifiers(keyphrase: string): IntentModifier[] {
  const lower = keyphrase.toLowerCase();
  const found: IntentModifier[] = [];

  const scan = (words: readonly string[], intent: IntentType): void => {
    for (const w of words) {
      // Use word boundary matching to avoid partial matches (e.g. "site" in "website")
      const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`(?:^|\\b)${escaped}(?:\\b|$)`);
      if (re.test(lower)) {
        found.push({ word: w, signalsIntent: intent });
      }
    }
  };

  scan(INFORMATIONAL_MODIFIERS, 'informational');
  scan(TRANSACTIONAL_MODIFIERS, 'transactional');
  scan(COMMERCIAL_MODIFIERS, 'commercial-investigation');
  scan(NAVIGATIONAL_MODIFIERS, 'navigational');
  scan(TROUBLESHOOTING_MODIFIERS, 'informational'); // troubleshooting is informational

  return found;
}

function inferSubType(keyphrase: string, primary: IntentType): IntentSubType {
  const lower = keyphrase.toLowerCase();

  if (/\b(what\s+is|definition|meaning|define|explained)\b/.test(lower)) {
    return 'definitional';
  }
  if (/\b(how\s+to|tutorial|guide|step[\s-]by[\s-]step|walkthrough)\b/.test(lower)) {
    return 'tutorial';
  }
  if (/\b(fix|error|issue|problem|not\s+working|troubleshoot|debug|resolve)\b/.test(lower)) {
    return 'troubleshooting';
  }
  if (/\b(vs|versus|compare|comparison|difference|differences|alternative|alternatives)\b/.test(lower)) {
    return 'comparison';
  }
  if (/\b(review|reviews|rating|ratings|best|top|recommended|worth\s+it)\b/.test(lower)) {
    return 'review-seeking';
  }
  if (/\b(buy|purchase|order|shop|deal|price|pricing|coupon|discount|sale)\b/.test(lower)) {
    return 'purchase';
  }
  if (/\b(download|install|free\s+download|get\s+free)\b/.test(lower)) {
    return 'download';
  }
  if (/\b(near\s+me|nearby|local|city|town|neighborhood)\b/.test(lower)) {
    return 'local';
  }
  if (/\b(list|types|examples?|resources?|tools?|reference)\b/.test(lower)) {
    return 'reference';
  }
  if (/\b(news|update|latest|breaking|announcement|release|launched|2026|2025)\b/.test(lower)) {
    return 'news';
  }

  if (primary === 'transactional') return 'purchase';
  if (primary === 'commercial-investigation') return 'review-seeking';
  if (primary === 'navigational') return 'unknown';

  return 'unknown';
}

function buildSignals(modifiers: IntentModifier[]): IntentSignal[] {
  const intentScores = new Map<IntentType, { total: number; reasons: string[] }>();

  for (const mod of modifiers) {
    const entry = intentScores.get(mod.signalsIntent);
    if (entry) {
      entry.total += 1;
      entry.reasons.push('"' + mod.word + '"');
    } else {
      intentScores.set(mod.signalsIntent, { total: 1, reasons: ['"' + mod.word + '"'] });
    }
  }

  // If no modifiers found, assign a baseline signal for bare keywords.
  // A bare keyphrase of any length defaults to informational — navigational
  // intent must be earned by actual navigational modifiers.
  if (intentScores.size === 0) {
    intentScores.set('informational', {
      total: 1,
      reasons: ['default: bare keyword with no clear modifiers'],
    });
  }

  const totalPoints = Array.from(intentScores.values()).reduce((s, v) => s + v.total, 0);

  const signals: IntentSignal[] = [];
  for (const [type, data] of intentScores) {
    signals.push({
      type,
      confidence: totalPoints > 0 ? Number((data.total / totalPoints).toFixed(2)) : 0,
      reason: data.reasons.join(', '),
    });
  }

  // Sort by confidence descending
  signals.sort((a, b) => b.confidence - a.confidence);

  return signals;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Detect the search intent of a focus keyphrase.
 *
 * Analyzes modifier words, phrase patterns, and structural cues to determine
 * the primary intent type, sub-type, confidence score, and any ambiguity.
 */
export function detectIntent(keyphrase: string): IntentResult {
  const trimmed = keyphrase.trim();

  if (trimmed.length === 0) {
    return {
      primary: 'unknown',
      confidence: 0,
      subType: 'unknown',
      modifiers: [],
      signals: [],
    };
  }

  const modifiers = findModifiers(trimmed);
  const signals = buildSignals(modifiers);

  const topSignal: IntentSignal | undefined = signals[0];
  const primary: IntentType = topSignal?.type ?? 'unknown';
  const confidence: number = topSignal?.confidence ?? 0;

  const subType = inferSubType(trimmed, primary);

  return {
    primary,
    confidence,
    subType,
    modifiers,
    signals,
  };
}
