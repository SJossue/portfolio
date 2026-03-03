# Feature: SEO Meta Tags & OpenGraph

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

---

## Overview

Add SEO meta tags, OpenGraph, and Twitter Card tags to improve search engine visibility and social sharing.

## Exact Changes Required

### File 1: `src/lib/site.ts`

Replace the ENTIRE file contents with:

```typescript
export const siteConfig = {
  name: 'Jossue Portfolio',
  description:
    'Software engineer portfolio — interactive 3D experience showcasing projects, skills, and contact information.',
  url: 'https://example.com',
  author: 'Jossue',
  twitterHandle: '@jossue',
  keywords: [
    'software engineer',
    'portfolio',
    'web developer',
    'full-stack',
    'React',
    'Next.js',
    'TypeScript',
  ],
};
```

### File 2: `src/app/layout.tsx`

Replace the ENTIRE file contents with:

```typescript
import type { Metadata } from 'next';
import '@/styles/globals.css';
import { siteConfig } from '@/lib/site';

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
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
```

## Constraints

- ONLY modify `src/lib/site.ts` and `src/app/layout.tsx`
- Do NOT touch any other files
- Do NOT add dependencies
- After changes run `npm run validate`

## Acceptance Criteria

- [ ] `siteConfig` has author, twitterHandle, keywords fields
- [ ] layout.tsx exports metadata with openGraph, twitter, alternates, robots
- [ ] `npm run validate` passes
