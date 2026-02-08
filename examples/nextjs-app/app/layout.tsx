import type { Metadata } from 'next';
import { createMetadata } from '@ccbd-seo/meta';

// Global default SEO metadata for the site
export const metadata: Metadata = createMetadata({
  defaultTitle: 'My Site',
  titleTemplate: '%s | My Site',
  description: 'A demo site showcasing @ccbd-seo with Next.js App Router',
  canonical: 'https://example.com',
  openGraph: {
    type: 'website',
    siteName: 'My Site',
    locale: 'en_US',
    images: [
      {
        url: 'https://example.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'My Site',
      },
    ],
  },
  twitter: {
    cardType: 'summary_large_image',
    site: '@mysite',
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
