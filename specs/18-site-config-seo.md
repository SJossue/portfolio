# Feature: Expand Site Config

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Replace the contents of `src/lib/site.ts` with the following code. Do not change any other file.

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
