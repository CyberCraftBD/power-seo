// @power-seo/meta — Remix v2 Meta Descriptors
// ----------------------------------------------------------------------------

import type { SEOConfig } from '@power-seo/core';
import { resolveTitle, buildMetaTags, buildLinkTags } from '@power-seo/core';
import type { RemixMetaDescriptor } from './types.js';

/**
 * Convert an SEOConfig to a Remix v2 MetaDescriptor array.
 *
 * Returns an array of plain objects matching Remix's `MetaDescriptor` union shape —
 * no `@remix-run/react` dependency required.
 */
export function createMetaDescriptors(config: SEOConfig): RemixMetaDescriptor[] {
  const descriptors: RemixMetaDescriptor[] = [];

  // Title
  const title = resolveTitle(config);
  if (title !== undefined) {
    descriptors.push({ title });
  }

  // Meta tags (description, robots, OG, Twitter, additional)
  const metaTags = buildMetaTags(config);
  for (const tag of metaTags) {
    if (tag.property) {
      descriptors.push({ property: tag.property, content: tag.content });
    } else if (tag.httpEquiv) {
      descriptors.push({ httpEquiv: tag.httpEquiv, content: tag.content });
    } else if (tag.name) {
      descriptors.push({ name: tag.name, content: tag.content });
    }
  }

  // Link tags (canonical, hreflang, additional)
  const linkTags = buildLinkTags(config);
  for (const link of linkTags) {
    const descriptor: RemixMetaDescriptor = {
      tagName: 'link' as const,
      rel: link.rel,
      href: link.href,
      ...(link.hreflang !== undefined && { hrefLang: link.hreflang }),
      ...(link.type !== undefined && { type: link.type }),
      ...(link.sizes !== undefined && { sizes: link.sizes }),
      ...(link.media !== undefined && { media: link.media }),
    };
    descriptors.push(descriptor);
  }

  return descriptors;
}
