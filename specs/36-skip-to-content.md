# Feature: Skip to Content Link

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add a "Skip to content" link for keyboard/screen reader users that appears when focused and jumps past the 3D scene to the main content.

### Files to modify (ONLY these files):

1. `src/app/page.tsx` — add skip link and id to main

### Instructions

Replace the entire content of `src/app/page.tsx` with:

```tsx
import { HomeScene } from '@/components/features/scene/HomeScene';

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-full rounded-md bg-cyan-500 px-4 py-2 font-mono text-sm text-black transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <main id="main-content" className="min-h-screen w-full">
        <HomeScene />
      </main>
    </>
  );
}
```

Also update the test in `src/app/page.test.tsx` — replace its entire content with:

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

  it('renders skip to content link', () => {
    render(<Home />);
    const skipLink = screen.getByText('Skip to content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('main has correct id for skip link target', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
});
```

### Acceptance Criteria

- Skip link is visually hidden until focused
- Skip link targets `#main-content`
- Main element has `id="main-content"`
- Tests verify skip link and id
- `npm run validate` passes
