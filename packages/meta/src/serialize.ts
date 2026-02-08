// ============================================================================
// @ccbd-seo/meta — Generic SSR HTML Serialization
// ============================================================================

import type { SEOConfig } from '@ccbd-seo/core';
import { resolveTitle, buildMetaTags, buildLinkTags } from '@ccbd-seo/core';
import type { HeadTag } from './types.js';

/**
 * Escape special characters for safe HTML attribute values.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Convert an SEOConfig to an array of structured HeadTag objects.
 *
 * Useful for programmatic consumption in template engines or custom SSR.
 */
export function createHeadTagObjects(config: SEOConfig): HeadTag[] {
  const tags: HeadTag[] = [];

  // Title
  const title = resolveTitle(config);
  if (title !== undefined) {
    tags.push({ tag: 'title', attributes: {}, content: title });
  }

  // Meta tags
  const metaTags = buildMetaTags(config);
  for (const meta of metaTags) {
    const attributes: Record<string, string> = {};
    if (meta.name) attributes['name'] = meta.name;
    if (meta.property) attributes['property'] = meta.property;
    if (meta.httpEquiv) attributes['http-equiv'] = meta.httpEquiv;
    attributes['content'] = meta.content;
    tags.push({ tag: 'meta', attributes });
  }

  // Link tags
  const linkTags = buildLinkTags(config);
  for (const link of linkTags) {
    const attributes: Record<string, string> = { rel: link.rel, href: link.href };
    if (link.hreflang) attributes['hreflang'] = link.hreflang;
    if (link.type) attributes['type'] = link.type;
    if (link.sizes) attributes['sizes'] = link.sizes;
    if (link.media) attributes['media'] = link.media;
    tags.push({ tag: 'link', attributes });
  }

  return tags;
}

/**
 * Serialize an SEOConfig to an HTML string for generic SSR
 * (Astro, plain Express, Fastify, etc.).
 *
 * Returns a string of `<title>`, `<meta>`, and `<link>` tags
 * ready to inject into a `<head>` element.
 */
export function createHeadTags(config: SEOConfig): string {
  const headTags = createHeadTagObjects(config);
  const lines: string[] = [];

  for (const tag of headTags) {
    if (tag.tag === 'title' && tag.content !== undefined) {
      lines.push(`<title>${escapeHtml(tag.content)}</title>`);
    } else if (tag.tag === 'meta') {
      const attrs = serializeAttributes(tag.attributes);
      lines.push(`<meta ${attrs}>`);
    } else if (tag.tag === 'link') {
      const attrs = serializeAttributes(tag.attributes);
      lines.push(`<link ${attrs}>`);
    }
  }

  return lines.join('\n');
}

/**
 * Serialize an object of attributes to an HTML attribute string.
 */
function serializeAttributes(attributes: Record<string, string>): string {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ');
}
