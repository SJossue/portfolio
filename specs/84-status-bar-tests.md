# Test: StatusBar component unit tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Write unit tests for the `StatusBar` component created in spec 76.

### Files to create (ONLY these files):

1. `src/components/features/scene/StatusBar.test.tsx` — NEW file

### Instructions

Create `src/components/features/scene/StatusBar.test.tsx` with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';

import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renders the system label', () => {
    render(<StatusBar />);
    expect(screen.getByText('SYS.PORTFOLIO')).toBeInTheDocument();
  });

  it('renders the connected status', () => {
    render(<StatusBar />);
    expect(screen.getByText('CONNECTED')).toBeInTheDocument();
  });

  it('renders the pulsing status dot', () => {
    render(<StatusBar />);
    const dot = document.querySelector('.animate-pulse');
    expect(dot).toBeInTheDocument();
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- Test file exists at the correct path
- Tests verify system label, connected status, and pulsing dot
- `npm run validate` passes
