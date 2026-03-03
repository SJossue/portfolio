# Feature: Unit Tests for ContactPanel

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add unit tests for `src/components/features/scene/panels/ContactPanel.tsx`.

### Files to create:

1. `src/components/features/scene/panels/ContactPanel.test.tsx` — NEW file

### Current file content to test

The `ContactPanel` component renders contact links (GitHub, LinkedIn, Email) from the `contactLinks` array in `src/content/contact.ts`. Each link has a label, href, icon, and opens in a new tab.

### Complete file to create

Create `src/components/features/scene/panels/ContactPanel.test.tsx` with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';
import { ContactPanel } from './ContactPanel';

describe('ContactPanel', () => {
  it('renders the introductory text', () => {
    render(<ContactPanel />);
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
  });

  it('renders all contact links', () => {
    render(<ContactPanel />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders links with correct attributes', () => {
    render(<ContactPanel />);
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/SJossue');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders contact icons', () => {
    render(<ContactPanel />);
    expect(screen.getByText('/>')).toBeInTheDocument();
    expect(screen.getByText('in')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- New test file created at `src/components/features/scene/panels/ContactPanel.test.tsx`
- All tests pass
- `npm run validate` passes
