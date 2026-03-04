# Test: Minimap component unit tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Write unit tests for the `Minimap` component created in spec 82.

### Files to create (ONLY these files):

1. `src/components/features/scene/Minimap.test.tsx` — NEW file

### Instructions

Create `src/components/features/scene/Minimap.test.tsx` with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';

import { Minimap } from './Minimap';

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedSection: null,
    }),
}));

describe('Minimap', () => {
  it('renders the MAP label', () => {
    render(<Minimap />);
    expect(screen.getByText('MAP')).toBeInTheDocument();
  });

  it('renders the section indicators', () => {
    render(<Minimap />);
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('renders grid crosshair lines', () => {
    const { container } = render(<Minimap />);
    const gridLines = container.querySelectorAll('.bg-cyan-400\\/20');
    expect(gridLines.length).toBeGreaterThanOrEqual(2);
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- Test file exists at the correct path
- Tests verify MAP label, section indicator letters (P, C, A, E), and grid lines
- `npm run validate` passes
