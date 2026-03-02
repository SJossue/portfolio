# Feature: Thin Page + Fullscreen Scene

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Make `page.tsx` a thin page (per ARCHITECTURE.md) and render `HomeScene` as a fullscreen experience. Remove the placeholder header and architecture checklist content. Update tests to match.

**User story**: As a visitor, I want the portfolio to open directly into the fullscreen 3D garage scene so that the experience is immersive from the first frame.

## Context

Currently `page.tsx` contains inline content (header with "Jossue" heading, description paragraph, "Architecture Checks" list) alongside `HomeScene`. Per ARCHITECTURE.md, pages should be thin composition layers. The portfolio vision is that the garage scene IS the interface — there should be no traditional page content wrapping it.

## Requirements

### Functional Requirements

1. The system MUST replace `page.tsx` content so it renders ONLY `<HomeScene />` inside a thin `<main>` wrapper
2. The system MUST make the `<main>` element fullscreen: `min-h-screen w-full`
3. The system MUST remove the header, description paragraph, and architecture checklist from `page.tsx`
4. The system MUST update `src/app/page.test.tsx` to test the new thin page
5. The system MUST update `e2e/home.spec.ts` to remove assertions for removed content

### Non-Functional Requirements

- **Performance**: Fewer DOM nodes, marginally better
- **Accessibility**: `<main>` landmark preserved
- **Browser Support**: No change
- **Mobile**: Fullscreen scene works on all viewports (HomeScene already uses `h-screen w-full`)

## Design

### Technical Approach

**Files to modify (ONLY these files):**

1. `src/app/page.tsx`
2. `src/app/page.test.tsx`
3. `e2e/home.spec.ts`

**Exact changes:**

### page.tsx — replace entire content with:

```tsx
import { HomeScene } from '@/components/features/scene/HomeScene';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <HomeScene />
    </main>
  );
}
```

### page.test.tsx — replace entire content with:

```tsx
import { render, screen } from '@testing-library/react';

import Home from './page';

// Mock the HomeScene client component
vi.mock('@/components/features/scene/HomeScene', () => ({
  HomeScene: () => <div data-testid="home-scene">HomeScene</div>,
}));

describe('Home page', () => {
  it('renders main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders HomeScene', () => {
    render(<Home />);
    expect(screen.getByTestId('home-scene')).toBeInTheDocument();
  });
});
```

### e2e/home.spec.ts — replace the first test:

The first test (`homepage renders correctly`) asserts on content that no longer exists (heading "Jossue", description text, "Architecture Checks"). Replace it:

```typescript
import { expect, test } from '@playwright/test';

test('homepage loads fullscreen scene', async ({ page }) => {
  await page.goto('/');

  // Page has a main landmark
  await expect(page.locator('main')).toBeVisible();
});

test('home loads and shows intro controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible();

  await expect(page.getByRole('button', { name: /skip intro/i })).toBeVisible();
});

test('skip intro shows garage UI shell', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /skip intro/i }).click();

  await expect(page.getByTestId('garage-shell')).toBeVisible();
});
```

## Acceptance Criteria

- [ ] `page.tsx` contains ONLY a `<main>` wrapping `<HomeScene />`
- [ ] No heading, description, or architecture checklist in `page.tsx`
- [ ] `page.tsx` is fewer than 15 lines
- [ ] `page.test.tsx` tests render `<main>` and `HomeScene`
- [ ] `e2e/home.spec.ts` does not reference "Architecture Checks", description text, or "Jossue" heading
- [ ] `npm run validate` passes (lint, typecheck, test, build, e2e)

## Testing Strategy

- **Unit tests**: `page.test.tsx` — mock HomeScene, assert main landmark + HomeScene presence
- **E2E tests**: `e2e/home.spec.ts` — homepage loads, intro controls visible, skip works

## Performance Budgets

- **Bundle size impact**: Slightly smaller (less JSX)
- **Runtime performance**: Fewer DOM nodes

## Accessibility Checklist

- [x] `<main>` landmark preserved
- [x] No content removed that was critical for screen readers (architecture checklist was dev-facing)

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                    | Impact | Likelihood | Mitigation                    |
| ----------------------- | ------ | ---------- | ----------------------------- |
| Existing e2e tests fail | Medium | Certain    | Spec explicitly replaces them |

## Out of Scope

- Changing HomeScene component
- Adding new page routes
- Layout.tsx changes

## References

- Architecture rule: `src/app/**` — thin pages only
- Current file: `src/app/page.tsx`

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
