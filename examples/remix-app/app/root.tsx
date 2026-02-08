import type { MetaFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { createMetaDescriptors } from '@ccbd-seo/meta';

// Default meta tags for the entire site
export const meta: MetaFunction = () =>
  createMetaDescriptors({
    title: 'My Remix Site',
    description: 'A demo site showcasing @ccbd-seo with Remix',
    canonical: 'https://example.com',
    openGraph: {
      type: 'website',
      siteName: 'My Remix Site',
    },
    twitter: {
      cardType: 'summary_large_image',
      site: '@mysite',
    },
  });

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
