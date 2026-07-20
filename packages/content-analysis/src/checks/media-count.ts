// @power-seo/content-analysis — Image/Video Count Check
// ----------------------------------------------------------------------------

import type { ContentAnalysisInput, AnalysisResult } from '@power-seo/core';
import { getWords } from '@power-seo/core';

export function checkMediaCount(input: ContentAnalysisInput): AnalysisResult {
  const { content, images } = input;

  // Count images from input.images and <img> tags in content HTML.
  // input.images typically describes the same images embedded in the content,
  // so we take the larger of the two counts rather than the sum to avoid
  // double-counting.
  const inputImageCount = images ? images.length : 0;
  const contentImgMatches = content.match(/<img\b/gi);
  const contentImageCount = contentImgMatches ? contentImgMatches.length : 0;
  const imageCount = Math.max(inputImageCount, contentImageCount);

  // Count each video embed exactly once: <video> tags plus video-provider
  // iframes. Raw youtube.com/vimeo.com URLs in text are not embeds.
  const videoTagMatches = content.match(/<video\b/gi);
  const iframeVideoMatches = content.match(/<iframe\b[^>]*(?:youtube\.com|youtu\.be|vimeo\.com)/gi);
  const videoCount =
    (videoTagMatches ? videoTagMatches.length : 0) +
    (iframeVideoMatches ? iframeVideoMatches.length : 0);

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

  const wordCount = getWords(content).length;

  // Good ratio: at least 1 media per 200 words
  const requiredMedia = Math.max(1, Math.floor(wordCount / 200));

  if (totalMedia >= requiredMedia) {
    return {
      id: 'media-count',
      title: 'Media count',
      description: `Good use of visual media (${imageCount} image${imageCount === 1 ? '' : 's'}, ${videoCount} video${videoCount === 1 ? '' : 's'}). Media improves engagement and time on page.`,
      status: 'good',
      score: 8,
      maxScore: 8,
    };
  }

  return {
    id: 'media-count',
    title: 'Media count',
    description: `Found ${imageCount} image${imageCount === 1 ? '' : 's'} and ${videoCount} video${videoCount === 1 ? '' : 's'}. Consider adding more visual media for better engagement.`,
    status: 'ok',
    score: 5,
    maxScore: 8,
  };
}
