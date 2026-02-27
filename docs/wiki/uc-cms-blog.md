# Use Case: Headless CMS / Blog Platform

Complete guide to building a CMS with power-seo for content quality and SEO optimization.

## Overview

Use power-seo to build a WordPress-alternative with:
- Real-time SEO scoring (Yoast-style)
- Readability analysis
- SERP preview generation
- Content validation
- Schema generation

## Architecture

```
CMS Editor
  ↓
Content Input (title, description, body, image)
  ↓
Real-time Analysis
  ├─ Content Analysis (@power-seo/content-analysis)
  ├─ Readability Analysis (@power-seo/readability)
  ├─ Preview Generation (@power-seo/preview)
  └─ Schema Validation (@power-seo/schema)
  ↓
SEO Sidebar Dashboard
  ├─ Score (0-100)
  ├─ Issues & Warnings
  ├─ SERP Preview
  └─ Recommendations
  ↓
Publish → Website
```

---

## Installation

```bash
npm install \
  @power-seo/core \
  @power-seo/content-analysis \
  @power-seo/readability \
  @power-seo/preview \
  @power-seo/schema
```

---

## Step 1: Build Content Editor

**components/ContentEditor.tsx:**

```tsx
import { useState } from 'react';
import { SEOSidebar } from './SEOSidebar';

interface BlogPost {
  title: string;
  metaDescription: string;
  content: string;
  focusKeyphrase: string;
  image?: string;
}

export function ContentEditor() {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    metaDescription: '',
    content: '',
    focusKeyphrase: '',
    image: ''
  });

  const handleChange = (field: string, value: string) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex gap-4">
      {/* Main Editor */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Post Title"
          value={post.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Meta Description (120-160 characters)"
          value={post.metaDescription}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Focus Keyphrase"
          value={post.focusKeyphrase}
          onChange={(e) => handleChange('focusKeyphrase', e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <textarea
          placeholder="Post Content (HTML)"
          value={post.content}
          onChange={(e) => handleChange('content', e.target.value)}
          className="w-full h-64 p-2 border rounded"
        />

        <input
          type="url"
          placeholder="Featured Image URL"
          value={post.image}
          onChange={(e) => handleChange('image', e.target.value)}
          className="w-full mt-4 p-2 border rounded"
        />
      </div>

      {/* SEO Sidebar */}
      <SEOSidebar post={post} />
    </div>
  );
}
```

---

## Step 2: Build SEO Analysis Component

**components/SEOSidebar.tsx:**

```tsx
import { useState, useEffect } from 'react';
import { analyzeContent } from '@power-seo/content-analysis';
import { analyzeReadability } from '@power-seo/readability';
import { generateSerpPreview } from '@power-seo/preview';

export function SEOSidebar({ post }) {
  const [analysis, setAnalysis] = useState(null);
  const [readability, setReadability] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Run analysis on content change
    if (!post.title || !post.content) return;

    // Content analysis
    const contentResult = analyzeContent({
      title: post.title,
      metaDescription: post.metaDescription,
      content: post.content,
      focusKeyphrase: post.focusKeyphrase,
      images: post.image ? [{ src: post.image, alt: '' }] : [],
      internalLinks: [], // Extract from content in real implementation
      externalLinks: [], // Extract from content
    });

    // Readability analysis
    const readabilityResult = analyzeReadability({
      content: post.content,
    });

    // SERP preview
    const serpResult = generateSerpPreview({
      title: post.title,
      description: post.metaDescription,
      url: `https://example.com/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`,
      siteTitle: 'My Blog',
    });

    setAnalysis(contentResult);
    setReadability(readabilityResult);
    setPreview(serpResult);
  }, [post.title, post.metaDescription, post.content, post.focusKeyphrase, post.image]);

  if (!analysis) return <div>Enter content to analyze...</div>;

  const scorePercentage = Math.round((analysis.score / analysis.maxScore) * 100);
  const scoreColor = scorePercentage >= 70 ? 'green' : scorePercentage >= 50 ? 'yellow' : 'red';

  return (
    <div className="w-80 bg-gray-50 p-4 rounded border">
      <h2 className="text-xl font-bold mb-4">SEO Analysis</h2>

      {/* Content Score */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Content Score</h3>
        <div className="flex items-center gap-2">
          <div className={`text-3xl font-bold text-${scoreColor}-500`}>
            {scorePercentage}%
          </div>
          <div className="text-sm text-gray-600">
            {analysis.score} / {analysis.maxScore}
          </div>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className={`bg-${scoreColor}-500 h-2 rounded-full`}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
      </div>

      {/* Readability */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Readability</h3>
        <p className={`text-sm font-semibold ${
          readability.status === 'good' ? 'text-green-600' :
          readability.status === 'ok' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {readability.status.toUpperCase()}
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Grade Level: {readability.scores.fleschKincaidGrade}
        </p>
      </div>

      {/* SERP Preview */}
      <div className="mb-6 bg-white p-3 rounded border">
        <h3 className="font-semibold mb-2 text-xs">SERP Preview</h3>
        <a href="#" className="text-blue-600 hover:underline text-sm">
          {preview.displayUrl}
        </a>
        <h4 className="font-semibold text-sm text-gray-800 mt-1">
          {preview.title}
          {preview.titleTruncated && <span className="text-red-500"> (truncated)</span>}
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          {preview.description}
          {preview.descriptionTruncated && <span className="text-red-500"> (truncated)</span>}
        </p>
      </div>

      {/* Issues & Recommendations */}
      <div>
        <h3 className="font-semibold mb-2">Recommendations</h3>
        <ul className="text-sm space-y-2">
          {analysis.recommendations.slice(0, 5).map((rec, i) => (
            <li key={i} className="flex gap-2 text-gray-700">
              <span className="text-red-500 font-bold">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
        {analysis.recommendations.length > 5 && (
          <p className="text-xs text-gray-500 mt-2">
            +{analysis.recommendations.length - 5} more recommendations
          </p>
        )}
      </div>
    </div>
  );
}
```

---

## Step 3: Schema Generation Component

**components/SchemaGenerator.tsx:**

```tsx
import {
  article,
  validateSchema,
  toJsonLdString,
  schemaGraph,
  breadcrumbList
} from '@power-seo/schema';

export function generateArticleSchema(post) {
  // Build article schema
  const articleSchema = article({
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: post.updatedAt || new Date().toISOString(),
    author: {
      name: post.authorName || 'Anonymous',
      url: post.authorUrl || undefined,
    },
    image: post.image ? {
      url: post.image,
      width: 1200,
      height: 630,
    } : undefined,
    articleBody: stripHtml(post.content),
  });

  // Combine with breadcrumbs
  const schema = schemaGraph([
    articleSchema,
    breadcrumbList([
      { name: 'Home', url: 'https://example.com' },
      { name: 'Blog', url: 'https://example.com/blog' },
      { name: post.title }
    ])
  ]);

  // Validate
  const { valid, issues } = validateSchema(schema);
  if (!valid) {
    console.error('Schema validation failed:', issues);
    return null;
  }

  // Return as HTML string
  return toJsonLdString(schema);
}
```

---

## Step 4: Publishing Workflow

**hooks/usePublish.ts:**

```ts
import { analyzeContent } from '@power-seo/content-analysis';
import { analyzeReadability } from '@power-seo/readability';

export function usePublish() {
  const publish = async (post) => {
    // SEO quality gate
    const contentAnalysis = analyzeContent({
      title: post.title,
      metaDescription: post.metaDescription,
      content: post.content,
      focusKeyphrase: post.focusKeyphrase,
      images: post.image ? [{ src: post.image, alt: '' }] : [],
      internalLinks: [],
      externalLinks: [],
    });

    const readabilityAnalysis = analyzeReadability({
      content: post.content,
    });

    const errors = [];

    // Check SEO score
    if ((contentAnalysis.score / contentAnalysis.maxScore) < 0.6) {
      errors.push(`Content SEO score is only ${Math.round((contentAnalysis.score / contentAnalysis.maxScore) * 100)}% - aim for 60%+`);
    }

    // Check readability
    if (readabilityAnalysis.status === 'poor') {
      errors.push('Content readability is poor - simplify sentences');
    }

    // Check title length
    if (post.title.length < 30 || post.title.length > 75) {
      errors.push('Title should be 30-75 characters');
    }

    // Check description length
    if (post.metaDescription.length < 120 || post.metaDescription.length > 160) {
      errors.push('Meta description should be 120-160 characters');
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    // Save to database
    const savedPost = await savePost(post);
    return { success: true, post: savedPost };
  };

  return { publish };
}
```

---

## Step 5: Full Editor Integration

**pages/editor.tsx:**

```tsx
import { useState } from 'react';
import { ContentEditor } from '@/components/ContentEditor';
import { usePublish } from '@/hooks/usePublish';

export default function EditorPage() {
  const [post, setPost] = useState(null);
  const { publish } = usePublish();
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);

    const result = await publish(post);

    if (!result.success) {
      setPublishError(result.errors.join('\n'));
    } else {
      // Redirect to published post
      window.location.href = `/blog/${result.post.slug}`;
    }

    setPublishing(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Blog Editor</h1>
        <button
          onClick={handlePublish}
          disabled={publishing || !post}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {publishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {publishError && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <h3 className="font-semibold text-red-700 mb-2">Publishing Errors:</h3>
          <pre className="text-sm text-red-600">{publishError}</pre>
        </div>
      )}

      <ContentEditor />
    </div>
  );
}
```

---

## Database Schema

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  meta_description VARCHAR(200),
  content TEXT NOT NULL,
  focus_keyphrase VARCHAR(100),
  featured_image URL,
  author_id UUID NOT NULL,

  -- SEO Metrics
  seo_score INT,
  readability_score INT,
  published_at TIMESTAMP,
  updated_at TIMESTAMP,

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seo_analysis_history (
  id UUID PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES blog_posts(id),
  seo_score INT,
  readability_status VARCHAR(20),
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

---

## Key Features Implemented

✅ **Real-time SEO Scoring** - Yoast-style analysis while typing
✅ **Readability Feedback** - Flesch-Kincaid, Gunning Fog scores
✅ **SERP Preview** - See how it appears in Google
✅ **Content Validation** - Keyphrase density, heading structure
✅ **Quality Gates** - Can't publish if SEO score < 60%
✅ **Schema Generation** - Automatic JSON-LD creation
✅ **Recommendations** - Actionable suggestions for improvement

---

## Performance Optimization

```ts
import { useMemo, useCallback } from 'react';

// Debounce analysis to avoid constant recalculation
export function useDebouncedAnalysis(post, delay = 500) {
  return useMemo(() => {
    const timer = setTimeout(() => {
      // Run analysis
    }, delay);

    return () => clearTimeout(timer);
  }, [post, delay]);
}

// Memoize analysis results
export function useMemoizedAnalysis(post) {
  return useMemo(() => {
    return analyzeContent({
      title: post.title,
      content: post.content,
      focusKeyphrase: post.focusKeyphrase,
    });
  }, [post.title, post.content, post.focusKeyphrase]);
}
```

---

## Testing

```ts
import { describe, it, expect } from 'vitest';
import { analyzeContent } from '@power-seo/content-analysis';

describe('Blog Editor', () => {
  it('should reject posts with low SEO score', () => {
    const poorPost = {
      title: 'Post',
      content: 'Short content',
      focusKeyphrase: 'keyword',
    };

    const result = analyzeContent(poorPost);
    expect(result.score / result.maxScore).toBeLessThan(0.6);
  });

  it('should accept posts meeting SEO standards', () => {
    const goodPost = {
      title: 'Complete Guide to SEO Best Practices for 2026',
      content: '<h1>SEO Guide</h1><p>Long detailed content...</p>',
      focusKeyphrase: 'seo',
    };

    const result = analyzeContent(goodPost);
    expect(result.score / result.maxScore).toBeGreaterThan(0.6);
  });
});
```

---

## Next Steps

- **[Next.js Integration](./uc-ecommerce.md)** - Build product pages
- **[All Packages](./pkg-schema.md)** - Explore other features
- **[API Examples](./06-framework-integration.md)** - Backend integration

