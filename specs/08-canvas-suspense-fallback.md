# Feature: Canvas Suspense Wrapper + WebGL Fallback

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Wrap the R3F Canvas in a React Suspense boundary with a loading fallback, and add WebGL 2 detection so users on unsupported browsers see a graceful fallback instead of a blank screen.

**User story**: As a visitor on a device without WebGL 2 support, I want to see a meaningful fallback instead of a broken blank page.

## Context

WORKFLOWS.md requires Suspense + lazy loading for all 3D scene components. PROJECT.md lists WebGL 2 graceful degradation as a UX non-negotiable. Currently `SceneSkeleton.tsx` renders `<Canvas>` directly with no Suspense boundary and no WebGL detection.

## Requirements

### Functional Requirements

1. The system MUST wrap the `<Canvas>` component in `<Suspense>` with a loading fallback
2. The loading fallback MUST be a centered loading indicator with the text "Loading scene..." and `role="status"` for accessibility
3. The system MUST detect WebGL 2 availability before attempting to render the Canvas
4. If WebGL 2 is unavailable, the system MUST render a static fallback div with `data-testid="webgl-fallback"` containing a message: "3D scene requires WebGL 2. Please use a modern browser."
5. The system MUST add a unit test that verifies the WebGL fallback renders when WebGL is unavailable
6. The system MUST remove the current 500ms `setTimeout` delay and replace it with the Suspense fallback (which handles the async loading naturally)

### Non-Functional Requirements

- **Performance**: Suspense defers rendering until Canvas + child components are ready — better than arbitrary 500ms delay
- **Accessibility**: Loading state has `role="status"` for screen readers; fallback message is plain text
- **Browser Support**: WebGL 2 detection works in all browsers (returns false on unsupported)

## Design

### Technical Approach

**Files to modify (ONLY these files):**

1. `src/components/features/scene/SceneSkeleton.tsx` — add Suspense, WebGL detection, remove setTimeout
2. `src/components/features/scene/SceneSkeleton.test.tsx` — update tests for new behavior

**Modify `SceneSkeleton.tsx` — replace entire content with:**

```tsx
'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { CarRig } from './CarRig';
import { useSceneState } from './useSceneState';

function isWebGL2Available(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center" role="status">
      <p className="text-sm text-white/60">Loading scene...</p>
    </div>
  );
}

function WebGLFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-neutral-900"
      data-testid="webgl-fallback"
    >
      <p className="text-sm text-white/60">
        3D scene requires WebGL 2. Please use a modern browser.
      </p>
    </div>
  );
}

export function SceneSkeleton() {
  const introState = useSceneState((s) => s.introState);

  if (!isWebGL2Available()) {
    return <WebGLFallback />;
  }

  return (
    <Suspense fallback={<SceneLoader />}>
      <Canvas camera={{ position: [1.5, 0.8, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <CameraRig />
        <CarRig />
        <OrbitControls enableZoom={false} enablePan={false} enabled={introState === 'garage'} />
      </Canvas>
    </Suspense>
  );
}
```

**Modify `SceneSkeleton.test.tsx` — replace entire content with:**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SceneSkeleton } from './SceneSkeleton';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div>OrbitControls</div>,
}));

vi.mock('./CameraRig', () => ({
  CameraRig: () => null,
}));

vi.mock('./CarRig', () => ({
  CarRig: () => <div>CarRig</div>,
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'idle' }),
}));

describe('SceneSkeleton', () => {
  it('renders canvas when WebGL 2 is available', () => {
    // jsdom doesn't have real WebGL, but canvas.getContext returns null
    // Mock it to return a truthy value
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'canvas') {
        el.getContext = vi.fn().mockReturnValue({});
      }
      return el;
    });

    render(<SceneSkeleton />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('renders fallback when WebGL 2 is unavailable', () => {
    // jsdom canvas.getContext returns null by default — no WebGL
    render(<SceneSkeleton />);
    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
    expect(screen.getByText(/webgl 2/i)).toBeInTheDocument();
  });
});
```

## Acceptance Criteria

- [ ] `<Canvas>` is wrapped in `<Suspense>` with a loading fallback
- [ ] Loading fallback shows "Loading scene..." with `role="status"`
- [ ] The old 500ms `setTimeout` delay is removed
- [ ] When WebGL 2 is unavailable, a fallback div with `data-testid="webgl-fallback"` renders
- [ ] WebGL fallback shows text "3D scene requires WebGL 2. Please use a modern browser."
- [ ] Unit test verifies Canvas renders when WebGL 2 is available
- [ ] Unit test verifies fallback renders when WebGL 2 is unavailable
- [ ] No `useState` or `setTimeout` for the deferred mount pattern
- [ ] `npm run validate` passes

## Testing Strategy

- **Unit tests**: `SceneSkeleton.test.tsx` — two tests: WebGL available (canvas renders) and WebGL unavailable (fallback renders)
- **E2E tests**: Existing tests pass unchanged (Playwright uses Chromium which has WebGL 2)

## Performance Budgets

- **Bundle size impact**: ~0 bytes (Suspense is built into React)
- **Runtime**: Eliminates arbitrary 500ms delay — scene appears as soon as Canvas is ready

## Accessibility Checklist

- [x] Loading indicator has `role="status"`
- [x] Fallback message is plain text, readable by screen readers
- [x] No keyboard traps introduced

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                                     | Impact | Likelihood | Mitigation                                                |
| ---------------------------------------- | ------ | ---------- | --------------------------------------------------------- |
| Existing E2E tests relied on 500ms delay | Low    | Low        | E2E tests use button selectors, not timing                |
| WebGL detection false positive           | Low    | Very Low   | `canvas.getContext('webgl2')` is reliable across browsers |

## Out of Scope

- Low-power device detection (future spec)
- Reduced-quality rendering mode
- Progressive loading of 3D assets

## References

- WORKFLOWS.md: "Suspense + lazy loading" requirement
- PROJECT.md: "WebGL fallback for low-power/unsupported devices"

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
