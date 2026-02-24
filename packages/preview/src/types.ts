// @power-seo/preview — Types
// ----------------------------------------------------------------------------

import type { ValidationResult, TwitterCardType } from '@power-seo/core';

// --- SERP Preview ---

export interface SerpPreviewInput {
  title: string;
  description: string;
  url: string;
  siteTitle?: string;
}

export interface SerpPreviewData {
  title: string;
  displayUrl: string;
  description: string;
  titleTruncated: boolean;
  descriptionTruncated: boolean;
  titleValidation: ValidationResult;
  descriptionValidation: ValidationResult;
}

// --- Open Graph Preview ---

export interface OgPreviewInput {
  title: string;
  description: string;
  url: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
  siteName?: string;
}

export interface OgImageValidation {
  url: string;
  width?: number;
  height?: number;
  valid: boolean;
  message?: string;
}

export interface OgPreviewData {
  title: string;
  description: string;
  url: string;
  siteName?: string;
  image?: OgImageValidation;
}

// --- Twitter Card Preview ---

export interface TwitterPreviewInput {
  cardType: TwitterCardType;
  title: string;
  description: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
  site?: string;
}

export interface TwitterImageValidation {
  url: string;
  width?: number;
  height?: number;
  valid: boolean;
  message?: string;
}

export interface TwitterPreviewData {
  cardType: TwitterCardType;
  title: string;
  description: string;
  image?: TwitterImageValidation;
  domain?: string;
}
