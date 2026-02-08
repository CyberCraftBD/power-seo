import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { createMetaDescriptors } from '@ccbd-seo/meta';
import { buildArticle } from '@ccbd-seo/schema';

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug ?? 'unknown';

  // In a real app, fetch post data from CMS/database
  const post = {
    slug,
    title: `Blog Post: ${slug}`,
    description: `Read about ${slug} on our blog`,
    publishedAt: '2024-01-15T00:00:00Z',
    author: 'Jane Doe',
  };

  return json({ post });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [];
  const { post } = data;

  return createMetaDescriptors({
    title: post.title,
    description: post.description,
    canonical: `https://example.com/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      article: {
        publishedTime: post.publishedAt,
        authors: [post.author],
        section: 'Technology',
      },
    },
  });
};

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  const articleSchema = buildArticle({
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: post.author },
    url: `https://example.com/blog/${post.slug}`,
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <h1>{post.title}</h1>
      <p>This demonstrates dynamic SEO with JSON-LD structured data in Remix.</p>
    </main>
  );
}
