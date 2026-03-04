# Test: KeyboardShortcuts component unit tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Write unit tests for the `KeyboardShortcuts` component created in spec 73.

### Files to create (ONLY these files):

1. `src/components/features/scene/KeyboardShortcuts.test.tsx` — NEW file

### Instructions

Create `src/components/features/scene/KeyboardShortcuts.test.tsx` with this EXACT content:

```tsx
import { render } from '@testing-library/react';

import { KeyboardShortcuts } from './KeyboardShortcuts';

// Mock useSceneState
vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      introState: 'garage',
      selectedSection: null,
      setSelectedSection: vi.fn(),
    }),
}));

describe('KeyboardShortcuts', () => {
  it('renders without crashing', () => {
    const { container } = render(<KeyboardShortcuts />);
    // Component renders null — container should be empty
    expect(container.innerHTML).toBe('');
  });

  it('returns null (renders nothing visible)', () => {
    const { container } = render(<KeyboardShortcuts />);
    expect(container.firstChild).toBeNull();
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- Test file exists at the correct path
- Tests verify the component renders without crashing
- Tests verify it renders nothing visible (returns null)
- `npm run validate` passes
