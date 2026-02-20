import type { Metadata } from 'next';
import { createMetadata } from '@power-seo/meta';

export const metadata: Metadata = createMetadata({
  title: 'Home',
  description: 'Welcome to the home page of My Site',
  canonical: 'https://example.com/',
});

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to My Site</h1>
      <p>This example demonstrates @power-seo/meta with Next.js App Router.</p>
    </main>
  );
}
