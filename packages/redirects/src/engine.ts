// @power-seo/redirects — Redirect Engine
// ----------------------------------------------------------------------------

import type { RedirectRule } from '@power-seo/core';
import type { RedirectMatch, RedirectEngine, RedirectEngineConfig } from './types.js';
import {
  matchExact,
  matchGlob,
  matchRegex,
  substituteParams,
  isDestinationSafe,
} from './matcher.js';

const MAX_CHAIN_HOPS = 10;

/**
 * Extract the query string (including the leading `?`) from a URL, or `''`
 * when there is none. Robust to both absolute URLs and bare paths.
 */
function extractQuery(url: string): string {
  const q = url.indexOf('?');
  if (q === -1) return '';
  // Drop any hash fragment that follows the query.
  const hash = url.indexOf('#', q);
  return hash === -1 ? url.slice(q) : url.slice(q, hash);
}

/**
 * Create a redirect engine that matches URLs against a set of rules.
 *
 * Rules are evaluated in order — first match wins.
 * Supports exact matches, glob patterns (`*`, `:param`), and regex.
 * Automatically resolves redirect chains (A→B→C returns C).
 * Throws on redirect loops.
 */
export function createRedirectEngine(
  initialRules: RedirectRule[] = [],
  config?: RedirectEngineConfig,
): RedirectEngine {
  const rules: RedirectRule[] = [...initialRules];

  function matchSingle(url: string): RedirectMatch | null {
    for (const rule of rules) {
      // Regex match
      if (rule.isRegex) {
        const result = matchRegex(url, rule.source, rule.destination, config);
        if (result.matched && isDestinationSafe(rule.destination, result.destination, config)) {
          return {
            rule,
            resolvedDestination: result.destination,
            statusCode: rule.statusCode,
          };
        }
        continue;
      }

      // Glob match (contains * or :)
      if (rule.source.includes('*') || rule.source.includes(':')) {
        const result = matchGlob(url, rule.source, config);
        if (result.matched) {
          const destination = substituteParams(rule.destination, result.params);
          if (isDestinationSafe(rule.destination, destination, config)) {
            return {
              rule,
              resolvedDestination: destination,
              statusCode: rule.statusCode,
            };
          }
        }
        continue;
      }

      // Exact match
      if (
        matchExact(url, rule.source, config) &&
        isDestinationSafe(rule.destination, rule.destination, config)
      ) {
        return {
          rule,
          resolvedDestination: rule.destination,
          statusCode: rule.statusCode,
        };
      }
    }

    return null;
  }

  function match(url: string): RedirectMatch | null {
    const firstMatch = matchSingle(url);
    if (!firstMatch) return null;

    // Preserve the inbound query string (UTM tags, `?ref=`, etc.) by
    // re-appending it to the final resolved destination — unless the
    // destination already carries its own query.
    const incomingQuery = extractQuery(url);
    const withQuery = (m: RedirectMatch): RedirectMatch => {
      if (!incomingQuery || m.resolvedDestination.includes('?')) return m;
      return { ...m, resolvedDestination: m.resolvedDestination + incomingQuery };
    };

    // Resolve chains
    const visited = new Set<string>([url]);
    let current = firstMatch;

    for (let hop = 0; hop < MAX_CHAIN_HOPS; hop++) {
      const nextDest = current.resolvedDestination;

      if (visited.has(nextDest)) {
        throw new Error(`Redirect loop detected: ${[...visited, nextDest].join(' → ')}`);
      }

      const nextMatch = matchSingle(nextDest);
      if (!nextMatch) {
        // End of chain
        return withQuery(current);
      }

      visited.add(nextDest);
      current = {
        rule: firstMatch.rule,
        resolvedDestination: nextMatch.resolvedDestination,
        statusCode: firstMatch.statusCode,
      };
    }

    throw new Error(`Redirect chain exceeds maximum of ${MAX_CHAIN_HOPS} hops`);
  }

  function addRule(rule: RedirectRule): void {
    rules.push(rule);
  }

  function removeRule(source: string): boolean {
    const index = rules.findIndex((r) => r.source === source);
    if (index === -1) return false;
    rules.splice(index, 1);
    return true;
  }

  function getRules(): RedirectRule[] {
    return [...rules];
  }

  return { match, addRule, removeRule, getRules };
}
