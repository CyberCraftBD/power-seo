// ============================================================================
// @power-seo/images — Alt Text Analysis
// ============================================================================

import type { ImageInfo, ImageIssue, ImageAuditResult, ImageAnalysisResult } from './types.js';

const REDUNDANT_PREFIXES = [
  'image of',
  'photo of',
  'picture of',
  'graphic of',
  'icon of',
  'screenshot of',
  'thumbnail of',
];

const FILENAME_PATTERN = /^(IMG|DSC|DSCN|DCIM|Screenshot|Screen Shot|image|photo|pic)[_\-\s]?\d+/i;

function analyzeImageAlt(image: ImageInfo, allAlts: string[]): ImageIssue[] {
  const issues: ImageIssue[] = [];

  // Missing alt attribute entirely
  if (image.alt === undefined || image.alt === null) {
    issues.push({
      id: 'alt-missing',
      title: 'Missing alt attribute',
      description: `Image "${image.src}" has no alt attribute. Add alt text for accessibility and SEO.`,
      severity: 'error',
      image,
    });
    return issues;
  }

  // Decorative alt="" is valid
  if (image.alt === '') {
    issues.push({
      id: 'alt-decorative',
      title: 'Decorative image',
      description: `Image "${image.src}" has empty alt (decorative). This is valid if the image is purely decorative.`,
      severity: 'pass',
      image,
    });
    return issues;
  }

  const alt = image.alt.trim();

  // Too short
  if (alt.length < 5) {
    issues.push({
      id: 'alt-too-short',
      title: 'Alt text too short',
      description: `Alt text "${alt}" is only ${alt.length} characters. Provide more descriptive alt text (5+ characters).`,
      severity: 'warning',
      image,
    });
  }

  // Too long
  if (alt.length > 125) {
    issues.push({
      id: 'alt-too-long',
      title: 'Alt text too long',
      description: `Alt text is ${alt.length} characters. Keep alt text under 125 characters for screen reader usability.`,
      severity: 'warning',
      image,
    });
  }

  // Redundant prefix
  const altLower = alt.toLowerCase();
  for (const prefix of REDUNDANT_PREFIXES) {
    if (altLower.startsWith(prefix)) {
      issues.push({
        id: 'alt-redundant-prefix',
        title: 'Redundant alt text prefix',
        description: `Alt text starts with "${prefix}". Screen readers already announce images, so this prefix is redundant.`,
        severity: 'warning',
        image,
      });
      break;
    }
  }

  // Filename pattern in alt
  if (FILENAME_PATTERN.test(alt)) {
    issues.push({
      id: 'alt-filename',
      title: 'Filename used as alt text',
      description: `Alt text "${alt}" appears to be a filename. Replace with descriptive text.`,
      severity: 'warning',
      image,
    });
  }

  // Duplicate alt across images
  const duplicateCount = allAlts.filter((a) => a === image.alt).length;
  if (duplicateCount > 1) {
    issues.push({
      id: 'alt-duplicate',
      title: 'Duplicate alt text',
      description: `Alt text "${alt}" is used on ${duplicateCount} images. Each image should have unique alt text.`,
      severity: 'warning',
      image,
    });
  }

  if (issues.length === 0) {
    issues.push({
      id: 'alt-good',
      title: 'Good alt text',
      description: `Alt text for "${image.src}" is well-formed.`,
      severity: 'pass',
      image,
    });
  }

  return issues;
}

export function analyzeAltText(images: ImageInfo[], focusKeyphrase?: string): ImageAuditResult {
  if (images.length === 0) {
    return {
      totalImages: 0,
      score: 100,
      maxScore: 100,
      issues: [],
      perImage: [],
      recommendations: [],
    };
  }

  const allAlts = images
    .map((img) => img.alt)
    .filter((a): a is string => a !== undefined && a !== null);
  const perImage: ImageAnalysisResult[] = [];
  const allIssues: ImageIssue[] = [];

  for (const image of images) {
    const issues = analyzeImageAlt(image, allAlts);
    const maxScore = 10;
    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const score = Math.max(0, maxScore - errorCount * 5 - warningCount * 2);

    perImage.push({ src: image.src, issues, score, maxScore });
    allIssues.push(...issues);
  }

  // Check if keyphrase is present in any alt text
  if (focusKeyphrase && focusKeyphrase.trim().length > 0) {
    const keyphraseInAlt = allAlts.some((alt) =>
      alt.toLowerCase().includes(focusKeyphrase.toLowerCase()),
    );
    if (!keyphraseInAlt) {
      allIssues.push({
        id: 'alt-no-keyphrase',
        title: 'Focus keyphrase not in image alt text',
        description: `None of the ${images.length} images have the focus keyphrase "${focusKeyphrase}" in their alt text. Consider adding it to at least one relevant image.`,
        severity: 'info',
      });
    }
  }

  const maxScore = images.length * 10;
  const score = perImage.reduce((sum, r) => sum + r.score, 0);

  const recommendations: string[] = [];
  const errorIssues = allIssues.filter((i) => i.severity === 'error');
  const warningIssues = allIssues.filter((i) => i.severity === 'warning');
  if (errorIssues.length > 0) {
    recommendations.push(
      `Fix ${errorIssues.length} critical alt text issue(s): missing alt attributes.`,
    );
  }
  if (warningIssues.length > 0) {
    recommendations.push(
      `Address ${warningIssues.length} alt text warning(s) to improve accessibility and SEO.`,
    );
  }

  return {
    totalImages: images.length,
    score,
    maxScore,
    issues: allIssues,
    perImage,
    recommendations,
  };
}
