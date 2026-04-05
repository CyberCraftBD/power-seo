// @power-seo/content-analysis — Image/Video Count Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';

export function checkMediaCount(input: ContentAnalysisInput): AnalysisResult {
  const { content, images } = input;

  // Count images from input.images AND <img> tags in content HTML
  const inputImageCount = images ? images.length : 0;
  const contentImgMatches = content.match(/<img\b/gi);
  const contentImageCount = contentImgMatches ? contentImgMatches.length : 0;
  const imageCount = inputImageCount + contentImageCount;

  // Count videos by regex matching
  const videoPatterns = /<video|<iframe|youtube\.com|vimeo\.com/gi;
  const videoMatches = content.match(videoPatterns);
  const videoCount = videoMatches ? videoMatches.length : 0;

  const totalMedia = imageCount + videoCount;

  if (totalMedia === 0) {
    return {
      id: 'media-count',
      title: 'Media count',
      description: 'No images or videos found. Add visual media to improve engagement.',
      status: 'poor',
      score: 0,
      maxScore: 8,
    };
  }

  // Strip HTML, count words
  const textOnly = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = textOnly.length > 0 ? textOnly.split(/\s+/) : [];
  const wordCount = words.length;

  // Good ratio: at least 1 media per 200 words
  const requiredMedia = Math.max(1, Math.floor(wordCount / 200));

  if (totalMedia >= requiredMedia) {
    return {
      id: 'media-count',
      title: 'Media count',
      description: `Good use of visual media (${imageCount} image${imageCount === 1 ? '' : 's'}, ${videoCount} video${videoCount === 1 ? '' : 's'}). Media improves engagement and time on page.`,
      status: 'good',
      score: 5,
      maxScore: 8,
    };
  }

  return {
    id: 'media-count',
    title: 'Media count',
    description: `Found ${imageCount} image${imageCount === 1 ? '' : 's'} and ${videoCount} video${videoCount === 1 ? '' : 's'}. Consider adding more visual media for better engagement.`,
    status: 'ok',
    score: 3,
    maxScore: 8,
  };
}
