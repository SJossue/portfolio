# Test: MobileHud component unit tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Write unit tests for the `MobileHud` component created in spec 79.

### Files to create (ONLY these files):

1. `src/components/features/scene/MobileHud.test.tsx` — NEW file

### Instructions

Create `src/components/features/scene/MobileHud.test.tsx` with this EXACT content:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';

import { MobileHud } from './MobileHud';

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      setSelectedSection: vi.fn(),
    }),
}));

describe('MobileHud', () => {
  it('renders the hamburger toggle button', () => {
    render(<MobileHud />);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('shows section buttons when expanded', () => {
    render(<MobileHud />);
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('toggles aria-expanded on the toggle button', () => {
    render(<MobileHud />);
    const btn = screen.getByLabelText('Open menu');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(btn);
    expect(screen.getByLabelText('Close menu')).toHaveAttribute('aria-expanded', 'true');
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- Test file exists at the correct path
- Tests verify toggle button, expanded section buttons, and aria-expanded
- `npm run validate` passes
