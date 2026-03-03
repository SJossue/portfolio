# Feature: SEO Meta Tags & OpenGraph

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

---

## Overview

Add comprehensive SEO meta tags, OpenGraph tags, and Twitter Card tags to the portfolio site for better search engine visibility and social media sharing.

**User story**: As the site owner, I want proper meta tags so that search engines index my portfolio correctly and social media previews look professional.

## Requirements

### Functional Requirements

1. The system MUST set proper `<title>` and `<meta name="description">` tags via Next.js Metadata API.
2. The system MUST include OpenGraph tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`).
3. The system MUST include Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`).
4. The system MUST include canonical URL via `alternates.canonical`.
5. The site config in `src/lib/site.ts` MUST be the single source of truth for site name, description, and URL.

### Non-Functional Requirements

- **No new dependencies**: Use Next.js built-in Metadata API only.
- **Performance**: Zero runtime cost (metadata is static/build-time).

## Technical Approach

### Modified Files

| File                 | Change                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| `src/lib/site.ts`    | Add `author`, `twitterHandle`, and `keywords` fields to `siteConfig`    |
| `src/app/layout.tsx` | Export `metadata` object using Next.js Metadata API with all SEO fields |

### Implementation Details

**`src/lib/site.ts`** — expand siteConfig:

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

**`src/app/layout.tsx`** — add metadata export:

```typescript
import { siteConfig } from '@/lib/site';
import type { Metadata } from 'next';

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
```

**IMPORTANT CONSTRAINTS for the agent:**

- Do NOT modify any files in `src/components/`.
- Do NOT add any new npm dependencies.
- Do NOT modify `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, or any config file other than the two listed above.
- Only touch `src/lib/site.ts` and `src/app/layout.tsx`.
- If `layout.tsx` already has a `metadata` export, merge into it rather than replacing.
- Run `npm run validate` after changes. If it fails, fix and retry (max 3 attempts).

## Acceptance Criteria

- [ ] `siteConfig` in `site.ts` has `author`, `twitterHandle`, and `keywords` fields
- [ ] `layout.tsx` exports `metadata` with title, description, openGraph, twitter, alternates, robots
- [ ] `npm run validate` passes
- [ ] No new dependencies added
- [ ] Only `src/lib/site.ts` and `src/app/layout.tsx` modified

## Testing Strategy

- **Build test**: `npm run build` succeeds (metadata is validated at build time)
- **Manual**: View page source and verify meta tags present

## Out of Scope

- OG image generation
- JSON-LD structured data
- Per-page metadata
- Favicon/manifest changes
