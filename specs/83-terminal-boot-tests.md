# Test: TerminalBoot component unit tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Write unit tests for the `TerminalBoot` component created in spec 71.

### Files to create (ONLY these files):

1. `src/components/features/scene/TerminalBoot.test.tsx` — NEW file

### Instructions

Create `src/components/features/scene/TerminalBoot.test.tsx` with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';

import { TerminalBoot } from './TerminalBoot';

describe('TerminalBoot', () => {
  it('renders the terminal container', () => {
    render(<TerminalBoot onComplete={vi.fn()} />);
    const container = document.querySelector('.font-mono');
    expect(container).toBeInTheDocument();
  });

  it('renders with a blinking cursor', () => {
    render(<TerminalBoot onComplete={vi.fn()} />);
    const cursor = document.querySelector('.animate-typing-cursor');
    expect(cursor).toBeInTheDocument();
  });

  it('accepts an onComplete callback prop', () => {
    const onComplete = vi.fn();
    render(<TerminalBoot onComplete={onComplete} />);
    // Component should render without throwing
    expect(document.querySelector('.font-mono')).toBeInTheDocument();
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- Test file exists at the correct path
- Tests verify the component renders
- Tests verify the cursor animation class is present
- `npm run validate` passes
