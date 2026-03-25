// @power-seo/content-analysis — E-E-A-T: Multimedia Experience Evidence
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { stripHtml, getWords } from '@power-seo/core';

// Contextual caption patterns (figcaption, alt text with description)
const CAPTION_PATTERNS = /<figcaption\b[^>]*>[^<]+<\/figcaption>/gi;
const FIGURE_PATTERN = /<figure\b/gi;

// Before/after comparison patterns
const BEFORE_AFTER_PATTERNS: RegExp[] = [
  /\bbefore\s+and\s+after\b/gi,
  /\bcomparison\b/gi,
  /\bside[\s-]by[\s-]side\b/gi,
  /\bvs\.?\b/gi,
  /\bbefore[\s:]/gi,
  /\bafter[\s:]/gi,
];

// Screenshot/evidence indicators in alt text or content
const EVIDENCE_ALT_PATTERNS: RegExp[] = [
  /screenshot/i,
  /screen\s*cap/i,
  /dashboard/i,
  /results?\s+(page|screen|view)/i,
  /settings?\s+(page|panel|screen)/i,
  /configuration/i,
  /interface/i,
  /output/i,
  /terminal/i,
  /console/i,
  /editor/i,
  /photo\s+of/i,
  /image\s+of/i,
  /picture\s+of/i,
  /showing/i,
  /demonstrat/i,
];

// Generic/stock alt patterns (low evidence value)
const GENERIC_ALT_PATTERNS: RegExp[] = [
  /^image$/i,
  /^photo$/i,
  /^picture$/i,
  /^img$/i,
  /^banner$/i,
  /^header$/i,
  /^stock/i,
  /^shutterstock/i,
  /^getty/i,
  /^unsplash/i,
  /^pexels/i,
];

export function checkMultimediaEvidence(input: ContentAnalysisInput): AnalysisResult {
  const content = input.content || '';
  const plainText = stripHtml(content);
  const words = getWords(plainText);
  const wordCount = words.length;

  if (wordCount < 50) {
    return {
      id: 'eeat-multimedia-evidence',
      title: 'Multimedia evidence',
      description: 'Content is too short to analyze multimedia evidence.',
      status: 'na',
      score: 0,
      maxScore: 5,
    };
  }

  // Count images with evidence-quality alt text
  const imgTags = content.match(/<img\b[^>]*>/gi) || [];
  const inputImages = input.images || [];
  let evidenceImages = 0;
  let genericImages = 0;
  let captionedImages = 0;

  // Check img tags in content
  for (const imgTag of imgTags) {
    const altMatch = imgTag.match(/alt\s*=\s*["']([^"']+)["']/i);
    const alt = (altMatch && altMatch[1]) ? altMatch[1] : '';

    if (GENERIC_ALT_PATTERNS.some(p => p.test(alt)) || alt.length < 5) {
      genericImages++;
    } else if (EVIDENCE_ALT_PATTERNS.some(p => p.test(alt))) {
      evidenceImages++;
    }
  }

  // Check input.images
  for (const img of inputImages) {
    const alt = img.alt || '';
    if (GENERIC_ALT_PATTERNS.some(p => p.test(alt)) || alt.length < 5) {
      genericImages++;
    } else if (EVIDENCE_ALT_PATTERNS.some(p => p.test(alt))) {
      evidenceImages++;
    }
  }

  // Count figures with captions
  const figures = content.match(FIGURE_PATTERN) || [];
  const captions = content.match(CAPTION_PATTERNS) || [];
  captionedImages = Math.min(figures.length, captions.length);

  // Count videos
  const videoTags = content.match(/<video\b/gi) || [];
  const iframeTags = content.match(/<iframe\b[^>]*(?:youtube|vimeo|loom|screencast)[^>]*>/gi) || [];
  const videoCount = videoTags.length + iframeTags.length;

  // Check for before/after patterns
  let beforeAfterCount = 0;
  for (const pattern of BEFORE_AFTER_PATTERNS) {
    const matches = plainText.match(pattern);
    if (matches) beforeAfterCount += matches.length;
  }

  // Score calculation
  const totalMedia = imgTags.length + inputImages.length + videoCount;
  const qualityScore =
    (evidenceImages * 3) +
    (captionedImages * 2) +
    (videoCount * 2) +
    (beforeAfterCount > 0 ? 3 : 0) -
    (genericImages * 1);

  if (totalMedia === 0) {
    return {
      id: 'eeat-multimedia-evidence',
      title: 'Multimedia evidence',
      description: 'No images or videos found. Add screenshots, original photos, or videos that demonstrate first-hand experience with the topic.',
      status: 'poor',
      score: 0,
      maxScore: 5,
    };
  }

  if (qualityScore >= 6 && evidenceImages >= 2) {
    const details: string[] = [];
    if (evidenceImages > 0) details.push(`${evidenceImages} evidence-quality images`);
    if (captionedImages > 0) details.push(`${captionedImages} captioned figures`);
    if (videoCount > 0) details.push(`${videoCount} video${videoCount > 1 ? 's' : ''}`);
    if (beforeAfterCount > 0) details.push('before/after comparisons');
    return {
      id: 'eeat-multimedia-evidence',
      title: 'Multimedia evidence',
      description: `Strong multimedia evidence: ${details.join(', ')}. Media demonstrates real experience with the topic.`,
      status: 'good',
      score: 5,
      maxScore: 5,
    };
  }

  if (qualityScore >= 2) {
    const suggestions: string[] = [];
    if (genericImages > 0) suggestions.push(`${genericImages} images have generic alt text — add descriptive captions`);
    if (captionedImages === 0) suggestions.push('wrap images in <figure> with <figcaption> for context');
    if (videoCount === 0) suggestions.push('consider adding a video walkthrough');
    if (evidenceImages === 0) suggestions.push('add screenshots or original photos showing your experience');
    return {
      id: 'eeat-multimedia-evidence',
      title: 'Multimedia evidence',
      description: `Some multimedia present but limited evidence value. ${suggestions.slice(0, 2).join('; ')}.`,
      status: 'ok',
      score: 3,
      maxScore: 5,
    };
  }

  return {
    id: 'eeat-multimedia-evidence',
    title: 'Multimedia evidence',
    description: `${totalMedia} media item${totalMedia > 1 ? 's' : ''} found but they lack evidence value. Replace stock/generic images with screenshots, original photos, before/after comparisons, or annotated visuals that prove first-hand experience.`,
    status: 'poor',
    score: 1,
    maxScore: 5,
  };
}
