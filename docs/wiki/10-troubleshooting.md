# Troubleshooting Guide

Solutions to common issues and problems with power-seo.

## Installation Issues

### Issue: "Module not found" error

**Symptom:**
```
Error: Cannot find module '@power-seo/core'
```

**Solution:**
1. Verify installation:
   ```bash
   npm list @power-seo/core
   ```

2. Clear cache and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. Check Node.js version:
   ```bash
   node --version  # Must be 18.0.0+
   ```

---

### Issue: TypeScript type errors

**Symptom:**
```
Type error: Property 'focusKeyphrase' is missing
```

**Solution:**
1. Update TypeScript:
   ```bash
   npm install --save-dev typescript@latest
   ```

2. Regenerate types:
   ```bash
   npm run typecheck
   ```

3. Check tsconfig.json:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "skipLibCheck": false
     }
   }
   ```

---

## Meta Tags Not Appearing

### Issue: Meta tags missing from HTML

**Symptom:** Page source doesn't show meta tags when viewing browser source

**Solution:**

**For Next.js:**
```tsx
// ❌ Wrong - generateMetadata not called
export default function Page() {
  return <h1>Page</h1>;
}

// ✅ Correct - generateMetadata is required
export function generateMetadata() {
  return createMetadata({
    title: 'Page Title',
    description: 'Description'
  });
}

export default function Page() {
  return <h1>Page</h1>;
}
```

**For Remix:**
```tsx
// ✅ Must use meta export
export const meta: MetaFunction = () =>
  createMetaDescriptors({
    title: 'Page Title',
    description: 'Description'
  });
```

**For React SPA:**
```tsx
// ✅ Must wrap with DefaultSEO
<DefaultSEO
  title="My Site"
  description="Description"
>
  <Routes>
    {/* routes */}
  </Routes>
</DefaultSEO>
```

---

## Schema Issues

### Issue: Schema validation fails

**Symptom:**
```
Schema validation failed: issues=[...]
```

**Solution:** Check for common errors:

```ts
import { article, validateSchema } from '@power-seo/schema';

const schema = article({
  headline: 'Title',
  // ❌ Missing required: datePublished
});

const { valid, issues } = validateSchema(schema);
if (!valid) {
  issues.forEach(issue => {
    console.error(`${issue.path}: ${issue.message}`);
    // Output: "root.datePublished: Property is missing"
  });
}

// ✅ Fixed - add required fields
const schema = article({
  headline: 'Title',
  datePublished: '2026-01-15' // ✅ Add this
});
```

**Common validation errors:**
- Missing `datePublished` in article
- Invalid date format (must be ISO 8601: `YYYY-MM-DDTHH:MM:SSZ`)
- Image width/height not specified
- Malformed URLs

---

### Issue: Social media cards not updating

**Symptom:** Facebook/Twitter show old content even after editing

**Solution:**
1. Check Open Graph tags:
   ```tsx
   openGraph={{
     type: 'article',
     images: [{
       url: 'https://example.com/og.jpg', // ✅ Must be absolute URL
       width: 1200,
       height: 630
     }]
   }}
   ```

2. Validate image URL is accessible:
   - Open URL in browser - must load
   - Use HTTPS (not HTTP)
   - Image must be 1200x630px minimum

3. Clear social cache:
   - **Facebook:** https://developers.facebook.com/tools/debug/
   - **Twitter:** https://cards-dev.twitter.com/validator
   - **LinkedIn:** https://www.linkedin.com/feed/

4. Wait for cache expiration (1-48 hours)

---

## Content Analysis Issues

### Issue: SEO score seems too low

**Symptom:**
```
Score: 25/55 (45%)
```

**Solution:** Check individual factors:

```ts
import { analyzeContent } from '@power-seo/content-analysis';

const result = analyzeContent({
  title: 'My Article',
  content: '<h1>My Article</h1><p>Content here</p>',
  focusKeyphrase: 'my keyword',
  images: [{ src: '/image.jpg', alt: 'Image alt' }],
  internalLinks: ['/page1'],
  externalLinks: ['https://external.com']
});

// Check individual results
result.results.forEach(r => {
  console.log(`${r.name}: ${r.status}`);
  console.log(`  Message: ${r.message}`);
});
```

**Common issues:**
- ❌ Keyphrase not in title → Add to title
- ❌ Keyphrase density too low → Use keyword more (2-3% optimal)
- ❌ Description too short → Expand to 120-160 chars
- ❌ No internal links → Add 2-3 internal links
- ❌ Content too short → Write 300+ words
- ❌ Images missing alt text → Add descriptive alt text

---

## Readability Issues

### Issue: Readability grade too high

**Symptom:**
```
Flesch-Kincaid Grade: 16.5
(requires 16+ years of education)
```

**Solution:** Simplify content:

```ts
import { analyzeReadability } from '@power-seo/readability';

const result = analyzeReadability({
  content: '<h1>Title</h1><p>Your content</p>'
});

console.log(result.recommendations);
// Example: ['Shorten sentences', 'Use simpler words', 'Break up paragraphs']
```

**Strategies to improve:**
1. **Shorter sentences** (15-20 words average)
   ```
   ❌ Complex content with advanced terminology
   ✅ Keep it simple. Use basic words. Short sentences.
   ```

2. **Shorter words**
   ```
   ❌ utilize, approximately, subsequently
   ✅ use, about, later
   ```

3. **More paragraphs** (max 3-4 sentences per paragraph)

4. **More subheadings** (one per 300 words)

---

## Sitemap Issues

### Issue: Sitemap generation fails with large dataset

**Symptom:**
```
Error: Out of memory
```

**Solution:** Use streaming instead:

```ts
// ❌ Wrong - loads all URLs in memory
const xml = generateSitemap({
  hostname: 'https://example.com',
  urls: allMillion Urls // Too much memory!
});

// ✅ Correct - streams URLs
import { streamSitemap } from '@power-seo/sitemap';

export async function GET() {
  const urls = await fetchAllUrls(); // from database
  const chunks = [...streamSitemap('https://example.com', urls)];
  return new Response(chunks.join(''), {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

---

### Issue: Sitemaps exceed 50,000 URLs

**Solution:** Use sitemap splitting:

```ts
import { splitSitemap } from '@power-seo/sitemap';

const { index, sitemaps } = splitSitemap({
  hostname: 'https://example.com',
  urls: allUrls // Can be 1M+ URLs
});

// index.xml contains references to sitemaps
// sitemaps[0], sitemaps[1], etc. contain actual URLs (max 50k each)
```

---

## Redirect Issues

### Issue: Redirects not working

**Symptom:**
```
User visits /old-page → Still sees /old-page
```

**Solution:**

**For Next.js (next.config.js):**
```js
// ❌ Wrong - redirects defined but not used
export async function redirects() {
  return [
    { source: '/old', destination: '/new', permanent: true }
  ];
}

// ✅ Correct - must be in next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/old', destination: '/new', permanent: true }
    ];
  }
};
module.exports = nextConfig;
```

**For Remix:**
```tsx
// ✅ Use redirect() in loaders
import { redirect } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }) => {
  if (params.oldSlug) {
    throw redirect(`/new-url/${params.oldSlug}`, 301);
  }
  return null;
};
```

---

## Bundle Size Issues

### Issue: Bundle too large

**Symptom:**
```
Bundle size: 250 KB (expected < 100 KB)
```

**Solution:**

1. **Only install needed packages:**
   ```bash
   # ❌ Wrong - installs everything
   npm install @power-seo/core @power-seo/react @power-seo/schema \
     @power-seo/audit @power-seo/search-console ...

   # ✅ Right - install only what you need
   npm install @power-seo/meta @power-seo/schema
   ```

2. **Check what you import:**
   ```ts
   // ❌ Wrong - imports entire package
   import * as powerseo from '@power-seo/schema';

   // ✅ Right - imports only used function
   import { article } from '@power-seo/schema';
   ```

3. **Verify tree-shaking works:**
   ```bash
   npm install -g bundlesize
   bundlesize --max-size 100KB
   ```

4. **Use production build:**
   ```bash
   npm run build  # Minifies and optimizes
   ```

---

## TypeScript Issues

### Issue: Type errors with builders

**Symptom:**
```
Property 'datePublished' is missing
```

**Solution:** All required fields must be provided:

```ts
import { article } from '@power-seo/schema';

// ❌ Type error - missing datePublished
const schema = article({
  headline: 'Title'
});

// ✅ Correct - all required fields
const schema = article({
  headline: 'Title',
  datePublished: '2026-01-15T10:00:00Z'
});
```

---

## Performance Issues

### Issue: Content analysis is slow

**Symptom:**
```
analyzeContent() takes 500ms+
```

**Solution:**

1. **Debounce analysis in React:**
   ```tsx
   const [debounceTimer, setDebounceTimer] = useState(null);

   const handleChange = (content) => {
     clearTimeout(debounceTimer);
     setDebounceTimer(setTimeout(() => {
       // Run analysis only after user stops typing
       analyzeContent(content);
     }, 300));
   };
   ```

2. **Memoize results:**
   ```tsx
   const analysis = useMemo(
     () => analyzeContent(content),
     [content] // Only recompute if content changes
   );
   ```

3. **Run in Web Worker:**
   ```ts
   // worker.ts
   import { analyzeContent } from '@power-seo/content-analysis';
   self.onmessage = (e) => {
     const result = analyzeContent(e.data);
     self.postMessage(result);
   };

   // component.tsx
   const worker = new Worker('worker.ts');
   worker.postMessage(content);
   worker.onmessage = (e) => setAnalysis(e.data);
   ```

---

## Framework-Specific Issues

### Next.js: Metadata not refreshing on dynamic routes

**Solution:**
```tsx
// ✅ generateMetadata receives params
export function generateMetadata({ params, searchParams }) {
  return createMetadata({
    title: `Product: ${params.id}`,
    description: `Showing product ${params.id}`
  });
}

// ✅ Revalidate cache if needed
export const revalidate = 3600; // Revalidate every hour
```

### Remix: Meta not appearing in HTML

**Solution:**
```tsx
// ✅ Must be in route file, not component
export const meta: MetaFunction = () =>
  createMetaDescriptors({...});

// ✅ meta export must be at route level
export default function Route() {
  return <h1>Page</h1>;
}
```

### React SPA: Meta tags only on first load

**Solution:**
```tsx
// ✅ Update meta tags on each route change
import { useEffect } from 'react';
import { SEO } from '@power-seo/react';

function Page() {
  useEffect(() => {
    // Ensure document title is set
    document.title = 'Page Title';
  }, []);

  return (
    <>
      <SEO title="Page Title" description="Description" />
      <h1>Page Content</h1>
    </>
  );
}
```

---

## Getting Help

If you can't find a solution:

1. **Check GitHub Issues:** https://github.com/CyberCraftBD/power-seo/issues
2. **Start Discussion:** https://github.com/CyberCraftBD/power-seo/discussions
3. **Email:** info@ccbd.dev
4. **Debug Tips:**
   ```ts
   // Enable verbose logging
   const result = analyzeContent(input);
   console.log(JSON.stringify(result, null, 2));
   ```

