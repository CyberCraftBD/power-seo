import type { MetaFunction } from '@remix-run/node';
import { createMetaDescriptors } from '@power-seo/meta';

export const meta: MetaFunction = () =>
  createMetaDescriptors({
    title: 'Home',
    description: 'Welcome to the home page of My Remix Site',
    canonical: 'https://example.com/',
  });

export default function Index() {
  return (
    <main>
      <h1>Welcome to My Remix Site</h1>
      <p>This example demonstrates @power-seo/meta with Remix v2.</p>
    </main>
  );
}
