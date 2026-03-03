# Feature: Error Boundary for 3D Scene

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add an error boundary component that catches WebGL/3D rendering errors and displays a user-friendly fallback message.

### Files to create:

1. `src/components/features/scene/SceneErrorBoundary.tsx` — NEW file
2. `src/components/features/scene/SceneErrorBoundary.test.tsx` — NEW file

### Instructions

**Create `src/components/features/scene/SceneErrorBoundary.tsx`** with this EXACT content:

```tsx
'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Scene render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#050510] p-8"
          role="alert"
          data-testid="scene-error"
        >
          <div className="font-mono text-xl text-cyan-400">Rendering Error</div>
          <p className="max-w-md text-center font-mono text-sm text-white/50">
            The 3D scene could not be loaded. Your browser may not support WebGL, or
            an unexpected error occurred.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyan-300 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/20"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Create `src/components/features/scene/SceneErrorBoundary.test.tsx`** with this EXACT content:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SceneErrorBoundary } from './SceneErrorBoundary';

function ThrowingComponent() {
  throw new Error('Test error');
}

describe('SceneErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(
      <SceneErrorBoundary>
        <div data-testid="child">OK</div>
      </SceneErrorBoundary>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders error fallback when child throws', () => {
    render(
      <SceneErrorBoundary>
        <ThrowingComponent />
      </SceneErrorBoundary>,
    );
    expect(screen.getByTestId('scene-error')).toBeInTheDocument();
    expect(screen.getByText(/rendering error/i)).toBeInTheDocument();
  });

  it('has alert role for accessibility', () => {
    render(
      <SceneErrorBoundary>
        <ThrowingComponent />
      </SceneErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows retry button', async () => {
    render(
      <SceneErrorBoundary>
        <ThrowingComponent />
      </SceneErrorBoundary>,
    );
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });
});
```

Do NOT modify any existing files. The error boundary can be integrated into SceneSkeleton in a later spec.

### Acceptance Criteria

- `SceneErrorBoundary.tsx` created with class-based error boundary
- `SceneErrorBoundary.test.tsx` created with 4 tests
- Error fallback shows cyberpunk-themed message with retry button
- All tests pass
- `npm run validate` passes
