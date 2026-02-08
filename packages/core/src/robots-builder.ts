// ============================================================================
// @ccbd-seo/core — Robots Directive Builder
// ============================================================================

import type { RobotsDirective } from './types.js';

/**
 * Build a robots meta content string from a RobotsDirective config.
 *
 * @example
 * ```ts
 * buildRobotsContent({ index: false, follow: true, maxSnippet: 150 });
 * // => "noindex, follow, max-snippet:150"
 * ```
 */
export function buildRobotsContent(directive: RobotsDirective): string {
  const parts: string[] = [];

  if (directive.index === false) {
    parts.push('noindex');
  } else if (directive.index === true) {
    parts.push('index');
  }

  if (directive.follow === false) {
    parts.push('nofollow');
  } else if (directive.follow === true) {
    parts.push('follow');
  }

  if (directive.noarchive) parts.push('noarchive');
  if (directive.nosnippet) parts.push('nosnippet');
  if (directive.noimageindex) parts.push('noimageindex');
  if (directive.notranslate) parts.push('notranslate');

  if (directive.maxSnippet !== undefined) {
    parts.push(`max-snippet:${directive.maxSnippet}`);
  }

  if (directive.maxImagePreview !== undefined) {
    parts.push(`max-image-preview:${directive.maxImagePreview}`);
  }

  if (directive.maxVideoPreview !== undefined) {
    parts.push(`max-video-preview:${directive.maxVideoPreview}`);
  }

  if (directive.unavailableAfter) {
    parts.push(`unavailable_after:${directive.unavailableAfter}`);
  }

  return parts.join(', ');
}

/**
 * Parse a robots meta content string into a RobotsDirective.
 */
export function parseRobotsContent(content: string): RobotsDirective {
  const directive: RobotsDirective = {};
  const parts = content.split(',').map((p) => p.trim().toLowerCase());

  for (const part of parts) {
    if (part === 'noindex') directive.index = false;
    else if (part === 'index') directive.index = true;
    else if (part === 'nofollow') directive.follow = false;
    else if (part === 'follow') directive.follow = true;
    else if (part === 'noarchive') directive.noarchive = true;
    else if (part === 'nosnippet') directive.nosnippet = true;
    else if (part === 'noimageindex') directive.noimageindex = true;
    else if (part === 'notranslate') directive.notranslate = true;
    else if (part.startsWith('max-snippet:')) {
      directive.maxSnippet = parseInt(part.split(':')[1] ?? '0', 10);
    } else if (part.startsWith('max-image-preview:')) {
      const value = part.split(':')[1] as 'none' | 'standard' | 'large';
      directive.maxImagePreview = value;
    } else if (part.startsWith('max-video-preview:')) {
      directive.maxVideoPreview = parseInt(part.split(':')[1] ?? '0', 10);
    } else if (part.startsWith('unavailable_after:')) {
      directive.unavailableAfter = part.substring('unavailable_after:'.length);
    }
  }

  return directive;
}
