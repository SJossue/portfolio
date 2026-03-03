# Feature: Aria Live Region for Section Changes

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add an aria-live region that announces section changes to screen readers when a user navigates the HUD or opens a panel.

### Files to create:

1. `src/components/features/scene/SectionAnnouncer.tsx` — NEW file
2. `src/components/features/scene/SectionAnnouncer.test.tsx` — NEW file

### Instructions

**Create `src/components/features/scene/SectionAnnouncer.tsx`** with this EXACT content:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSceneState } from './useSceneState';

export function SectionAnnouncer() {
  const selectedSection = useSceneState((s) => s.selectedSection);
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSection && announceRef.current) {
      announceRef.current.textContent = `${selectedSection} section opened`;
    } else if (announceRef.current) {
      announceRef.current.textContent = '';
    }
  }, [selectedSection]);

  return (
    <div
      ref={announceRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      data-testid="section-announcer"
    />
  );
}
```

**Create `src/components/features/scene/SectionAnnouncer.test.tsx`** with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';
import { SectionAnnouncer } from './SectionAnnouncer';

let mockSelectedSection: string | null = null;

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { selectedSection: string | null }) => unknown) =>
    selector({ selectedSection: mockSelectedSection }),
}));

describe('SectionAnnouncer', () => {
  beforeEach(() => {
    mockSelectedSection = null;
  });

  it('renders an aria-live region', () => {
    render(<SectionAnnouncer />);
    const el = screen.getByTestId('section-announcer');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('is visually hidden', () => {
    render(<SectionAnnouncer />);
    const el = screen.getByTestId('section-announcer');
    expect(el).toHaveClass('sr-only');
  });

  it('has empty text when no section is selected', () => {
    render(<SectionAnnouncer />);
    expect(screen.getByTestId('section-announcer')).toHaveTextContent('');
  });

  it('announces the section when selected', () => {
    mockSelectedSection = 'projects';
    render(<SectionAnnouncer />);
    expect(screen.getByTestId('section-announcer')).toHaveTextContent('projects section opened');
  });
});
```

Do NOT modify `HomeScene.tsx` or any other existing file. The SectionAnnouncer can be integrated into HomeScene in a later spec.

### Acceptance Criteria

- `SectionAnnouncer.tsx` created with aria-live region
- `SectionAnnouncer.test.tsx` created with 4 tests
- Component uses `sr-only` for visual hiding
- All tests pass
- `npm run validate` passes
