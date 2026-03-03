# Feature: Custom Monospace Font

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add the "JetBrains Mono" font via `next/font/google` for the cyberpunk monospace aesthetic. Apply it as the default monospace font across the app.

### Files to modify (ONLY these files):

1. `src/app/layout.tsx`

### Instructions:

Replace the contents of `src/app/layout.tsx` with the following code exactly:

```typescript
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { siteConfig } from '@/lib/site';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="flex min-h-screen flex-col font-mono antialiased">{children}</body>
    </html>
  );
}
```

### Acceptance Criteria

- `next/font/google` loads JetBrains Mono with `display: 'swap'`
- CSS variable `--font-mono` is set on `<html>`
- `<body>` uses `font-mono` class
- `npm run validate` passes
