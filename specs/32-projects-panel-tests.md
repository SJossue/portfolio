# Feature: Unit Tests for ProjectsPanel

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add unit tests for `src/components/features/scene/panels/ProjectsPanel.tsx`.

### Files to create:

1. `src/components/features/scene/panels/ProjectsPanel.test.tsx` — NEW file

### Current file content to test

The `ProjectsPanel` component renders project cards from the `projects` array in `src/content/projects.ts`. Each project has a `title`, `description`, `techStack` array, and optional `githubUrl` and `liveUrl`.

### Complete file to create

Create `src/components/features/scene/panels/ProjectsPanel.test.tsx` with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';
import { ProjectsPanel } from './ProjectsPanel';

describe('ProjectsPanel', () => {
  it('renders the introductory text', () => {
    render(<ProjectsPanel />);
    expect(screen.getByText(/curated selection/i)).toBeInTheDocument();
  });

  it('renders all project titles', () => {
    render(<ProjectsPanel />);
    expect(screen.getByText('Interactive 3D Portfolio')).toBeInTheDocument();
    expect(screen.getByText('CLI Task Runner')).toBeInTheDocument();
    expect(screen.getByText('Real-time Event Platform')).toBeInTheDocument();
    expect(screen.getByText('Data Pipeline Engine')).toBeInTheDocument();
  });

  it('renders tech stack badges', () => {
    render(<ProjectsPanel />);
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders GitHub links with proper aria labels', () => {
    render(<ProjectsPanel />);
    const links = screen.getAllByText('GitHub');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].closest('a')).toHaveAttribute('target', '_blank');
    expect(links[0].closest('a')).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- New test file created at `src/components/features/scene/panels/ProjectsPanel.test.tsx`
- All tests pass
- `npm run validate` passes
