import type { Metadata } from 'next';
import { createMetadata } from '@power-seo/meta';
import { buildArticle } from '@power-seo/schema';

// Example: dynamic metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // In a real app, fetch post data from CMS/database
  const post = {
    title: `Blog Post: ${slug}`,
    description: `Read about ${slug} on our blog`,
    publishedAt: '2024-01-15T00:00:00Z',
    author: 'Jane Doe',
  };

  return createMetadata({
    title: post.title,
    description: post.description,
    canonical: `https://example.com/blog/${slug}`,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      article: {
        publishedTime: post.publishedAt,
        authors: [post.author],
        section: 'Technology',
        tags: ['seo', 'typescript'],
      },
    },
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // JSON-LD structured data
  const articleSchema = buildArticle({
    headline: `Blog Post: ${slug}`,
    description: `Read about ${slug} on our blog`,
    datePublished: '2024-01-15T00:00:00Z',
    author: { '@type': 'Person', name: 'Jane Doe' },
    url: `https://example.com/blog/${slug}`,
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <h1>Blog Post: {slug}</h1>
      <p>This demonstrates dynamic SEO with JSON-LD structured data.</p>
    </main>
  );
}
