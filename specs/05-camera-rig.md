# Feature: CameraRig with Two Presets

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Create a `CameraRig` component that controls the camera position based on `introState`. It defines two camera presets (closeup and wide) and smoothly lerps between them using `useFrame`.

**User story**: As a visitor, I want the camera to start tight on the car and pull back to reveal the garage so that the intro feels cinematic.

## Context

Currently the camera is static at `[0, 2, 5]` with `OrbitControls`. The new `CameraRig` replaces manual camera control with state-driven positions. `OrbitControls` will only be enabled in the `'garage'` state.

**IMPORTANT: This spec assumes specs 01 (intro-state-machine) and 04 (extract-car-rig) have been merged.**

## Requirements

### Functional Requirements

1. The system MUST create `src/components/features/scene/CameraRig.tsx`
2. The system MUST define two camera presets as constants:
   - `SHOT_CLOSEUP`: position `[1.5, 0.8, 3]`, lookAt `[0, 0.3, 0]` (tight on rear quarter panel)
   - `SHOT_WIDE`: position `[0, 2.5, 7]`, lookAt `[0, 0.5, 0]` (full car + garage)
3. The system MUST read `introState` from `useSceneState`
4. The system MUST set camera position based on state:
   - `'idle'` and `'airingOut'`: `SHOT_CLOSEUP` (camera stays still during air-out)
   - `'revealing'`: lerp from current position toward `SHOT_WIDE`
   - `'garage'`: `SHOT_WIDE` (final position)
5. The system MUST use `useFrame` to smoothly lerp camera position and lookAt target each frame
6. The system MUST use a lerp factor of `0.02` for smooth motion (roughly 1-2 seconds transition)
7. The system MUST update `SceneSkeleton.tsx` to include `<CameraRig />` and conditionally enable `OrbitControls` only when `introState === 'garage'`
8. The system MUST set the initial Canvas camera position to match `SHOT_CLOSEUP`
9. The system MUST export `CameraRig` from the barrel file `index.ts`

### Non-Functional Requirements

- **Performance**: `useFrame` runs per frame but only does vector lerp — negligible cost
- **Accessibility**: No change
- **Mobile**: Same behavior on all devices

## Design

### Technical Approach

**Files to create:**

1. `src/components/features/scene/CameraRig.tsx`
2. `src/components/features/scene/CameraRig.test.tsx`

**Files to modify:**

3. `src/components/features/scene/SceneSkeleton.tsx` — add CameraRig, conditionally enable OrbitControls
4. `src/components/features/scene/index.ts` — add export

**Create `src/components/features/scene/CameraRig.tsx`:**

```tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useSceneState } from './useSceneState';

const SHOT_CLOSEUP = {
  position: new Vector3(1.5, 0.8, 3),
  lookAt: new Vector3(0, 0.3, 0),
};

const SHOT_WIDE = {
  position: new Vector3(0, 2.5, 7),
  lookAt: new Vector3(0, 0.5, 0),
};

const LERP_FACTOR = 0.02;

export function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef(SHOT_CLOSEUP.lookAt.clone());
  const introState = useSceneState((s) => s.introState);

  useFrame(() => {
    const target = introState === 'revealing' || introState === 'garage' ? SHOT_WIDE : SHOT_CLOSEUP;

    camera.position.lerp(target.position, LERP_FACTOR);
    lookAtTarget.current.lerp(target.lookAt, LERP_FACTOR);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
```

**Create `src/components/features/scene/CameraRig.test.tsx`:**

```tsx
import { render } from '@testing-library/react';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {
      position: { lerp: vi.fn(), set: vi.fn(), x: 0, y: 0, z: 0 },
      lookAt: vi.fn(),
    },
  }),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'idle' }),
}));

import { CameraRig } from './CameraRig';

describe('CameraRig', () => {
  it('renders without crashing', () => {
    const { container } = render(<CameraRig />);
    expect(container).toBeTruthy();
  });
});
```

**Modify `SceneSkeleton.tsx` — new content:**

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CarRig } from './CarRig';
import { CameraRig } from './CameraRig';
import { useSceneState } from './useSceneState';

export function SceneSkeleton() {
  const [showScene, setShowScene] = useState(false);
  const introState = useSceneState((s) => s.introState);

  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showScene) return null;

  return (
    <Canvas camera={{ position: [1.5, 0.8, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CameraRig />
      <CarRig />
      <OrbitControls enableZoom={false} enablePan={false} enabled={introState === 'garage'} />
    </Canvas>
  );
}
```

**Modify `src/components/features/scene/index.ts`:**

```typescript
export { CameraRig } from './CameraRig';
export { CarRig } from './CarRig';
export { SceneSkeleton } from './SceneSkeleton';
export { useSceneState } from './useSceneState';
export { HomeScene } from './HomeScene';
```

## Acceptance Criteria

- [ ] `CameraRig.tsx` exists at `src/components/features/scene/CameraRig.tsx`
- [ ] Two camera presets are defined as module-level constants
- [ ] `CameraRig` reads `introState` from `useSceneState`
- [ ] Camera lerps toward `SHOT_WIDE` when `introState` is `'revealing'` or `'garage'`
- [ ] Camera stays at `SHOT_CLOSEUP` when `introState` is `'idle'` or `'airingOut'`
- [ ] Canvas initial camera position matches `SHOT_CLOSEUP` coordinates `[1.5, 0.8, 3]`
- [ ] `OrbitControls` is only enabled when `introState === 'garage'`
- [ ] `CameraRig.test.tsx` exists and passes
- [ ] `index.ts` exports `CameraRig`
- [ ] `npm run validate` passes (lint, typecheck, test, build, e2e)

## Testing Strategy

- **Unit tests**: `CameraRig.test.tsx` — renders without crashing (mocked R3F hooks)
- **E2E tests**: Existing e2e tests pass unchanged (they test button clicks and DOM, not camera position)

## Performance Budgets

- **Bundle size impact**: < 1 KB (small component + Three.js Vector3 already in bundle)
- **Runtime**: One `lerp` + `lookAt` per frame — negligible

## Dependencies

- None. Uses existing `@react-three/fiber` and `three`.

## Risks & Mitigations

| Risk                                   | Impact | Likelihood | Mitigation                                                                               |
| -------------------------------------- | ------ | ---------- | ---------------------------------------------------------------------------------------- |
| SceneSkeleton test needs updated mocks | Low    | Medium     | The mock already covers Canvas/OrbitControls; CameraRig returns null so it's transparent |

## Out of Scope

- Air-out animation
- GSAP timelines
- Garage environment objects
- Post-processing

## References

- Camera preset coordinates designed for the placeholder car at `[0, 0.5, 0]`

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
