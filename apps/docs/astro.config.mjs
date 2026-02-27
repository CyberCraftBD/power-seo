import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: '@power-seo',
      description: 'A comprehensive, modular SEO toolkit for TypeScript and React',
      social: {
        github: 'https://github.com/power-seo/seo',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [{ label: 'Introduction', slug: '' }],
        },
        {
          label: 'Packages',
          items: [
            { label: 'core', slug: 'packages/core' },
            { label: 'react', slug: 'packages/react' },
            { label: 'schema', slug: 'packages/schema' },
            { label: 'meta', slug: 'packages/meta' },
            { label: 'content-analysis', slug: 'packages/content-analysis' },
            { label: 'preview', slug: 'packages/preview' },
            { label: 'readability', slug: 'packages/readability' },
            { label: 'sitemap', slug: 'packages/sitemap' },
            { label: 'redirects', slug: 'packages/redirects' },
            { label: 'links', slug: 'packages/links' },
            { label: 'audit', slug: 'packages/audit' },
            { label: 'images', slug: 'packages/images' },
            { label: 'ai', slug: 'packages/ai' },
            { label: 'analytics', slug: 'packages/analytics' },
            { label: 'search-console', slug: 'packages/search-console' },
            { label: 'integrations', slug: 'packages/integrations' },
            { label: 'tracking', slug: 'packages/tracking' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Next.js', slug: 'guides/nextjs' },
            { label: 'Remix', slug: 'guides/remix' },
            { label: 'Migration', slug: 'guides/migration' },
          ],
        },
      ],
    }),
  ],
});
