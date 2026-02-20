// ============================================================================
// @power-seo/react — SEO Context for Default Configuration
// ============================================================================

import { createContext, useContext } from 'react';
import type { SEOConfig } from '@power-seo/core';

export const SEOContext = createContext<SEOConfig | null>(null);

/**
 * Hook to access the default SEO configuration from the nearest DefaultSEO provider.
 */
export function useDefaultSEO(): SEOConfig | null {
  return useContext(SEOContext);
}
