'use client';
// @power-seo/react — SEO Context


import { createContext, useContext } from 'react';
import type { SEOConfig } from '@power-seo/core';

export const SEOContext = createContext<SEOConfig | null>(null);

export function useDefaultSEO(): SEOConfig | null {
  return useContext(SEOContext);
}
