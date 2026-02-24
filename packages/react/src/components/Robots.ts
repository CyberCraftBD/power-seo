// @power-seo/react — <Robots> Component
// ----------------------------------------------------------------------------

import { createElement } from 'react';
import type { RobotsDirective } from '@power-seo/core';
import { buildRobotsContent } from '@power-seo/core';

export type RobotsProps = RobotsDirective;

/**
 * Render a robots meta tag with per-page directives.
 *
 * @example
 * ```tsx
 * <Robots index={false} follow={true} maxSnippet={150} />
 * // Renders: <meta name="robots" content="noindex, follow, max-snippet:150" />
 * ```
 */
export function Robots(props: RobotsProps) {
  const content = buildRobotsContent(props);
  if (!content) return null;
  return createElement('meta', { name: 'robots', content });
}
