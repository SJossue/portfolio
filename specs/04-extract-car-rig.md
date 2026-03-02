# Feature: Extract CarRig Component

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Extract the inline `CarModel` function from `SceneSkeleton.tsx` into a standalone `CarRig.tsx` component with a group structure that supports future suspension animation.

**User story**: As a developer, I want the car to be a standalone component with a suspension group so that future specs can animate the air-out sequence by targeting the chassis group.

## Context

Currently `CarModel` is an unexported function defined inside `SceneSkeleton.tsx`. It needs to be its own module so that:

1. Future specs can add GSAP animation to it without touching SceneSkeleton
2. The chassis and wheels are in separate groups for independent animation

**IMPORTANT: This spec assumes spec 01 (intro-state-machine) has been merged. It uses the new state names (`'idle' | 'airingOut' | 'revealing' | 'garage'`).**

## Requirements

### Functional Requirements

1. The system MUST create `src/components/features/scene/CarRig.tsx`
2. The system MUST move the car geometry from `SceneSkeleton.tsx` into `CarRig.tsx`
3. The system MUST structure the car as nested groups: outer `carRoot` group > `chassis` group + individual wheel groups
4. The system MUST export `CarRig` as a named export
5. The system MUST update `SceneSkeleton.tsx` to import and render `<CarRig />` instead of `<CarModel />`
6. The system MUST remove the `CarModel` function from `SceneSkeleton.tsx`
7. The system MUST export `CarRig` from the scene barrel file `src/components/features/scene/index.ts`
8. The system MUST add a unit test for CarRig

### Non-Functional Requirements

- **Performance**: No change (same geometry, just restructured)
- **Accessibility**: No change (3D canvas, not screen-reader content)

## Design

### Technical Approach

**Files to create:**

1. `src/components/features/scene/CarRig.tsx`
2. `src/components/features/scene/CarRig.test.tsx`

**Files to modify:**

3. `src/components/features/scene/SceneSkeleton.tsx` — remove `CarModel`, import `CarRig`
4. `src/components/features/scene/index.ts` — add `CarRig` export

**Create `src/components/features/scene/CarRig.tsx`:**

```tsx
'use client';

import { useRef } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import type { Group } from 'three';

export function CarRig() {
  const chassisRef = useRef<Group>(null);

  return (
    <group position={[0, 0.5, 0]}>
      {/* Chassis — animate this group's Y position for air-out */}
      <group ref={chassisRef}>
        <Box args={[2, 1, 4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="lightblue" />
        </Box>
      </group>

      {/* Wheels — stay at fixed height */}
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
    </group>
  );
}
```

**Create `src/components/features/scene/CarRig.test.tsx`:**

```tsx
import { render } from '@testing-library/react';

// Mock R3F and Drei since they require WebGL
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Box: (props: Record<string, unknown>) => <div data-testid="box" {...props} />,
  Cylinder: (props: Record<string, unknown>) => <div data-testid="cylinder" {...props} />,
}));

import { CarRig } from './CarRig';

describe('CarRig', () => {
  it('renders without crashing', () => {
    const { container } = render(<CarRig />);
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

export function SceneSkeleton() {
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showScene) return null;

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CarRig />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
```

Note: the `Box` and `Cylinder` imports are removed from SceneSkeleton since they are no longer used there.

**Modify `src/components/features/scene/index.ts`:**

```typescript
export { CarRig } from './CarRig';
export { SceneSkeleton } from './SceneSkeleton';
export { useSceneState } from './useSceneState';
export { HomeScene } from './HomeScene';
```

## Acceptance Criteria

- [ ] `CarRig.tsx` exists at `src/components/features/scene/CarRig.tsx`
- [ ] `CarRig` is exported as a named export
- [ ] `CarRig` has a `chassisRef` on the chassis group (for future GSAP animation)
- [ ] `CarModel` function no longer exists in `SceneSkeleton.tsx`
- [ ] `SceneSkeleton.tsx` imports and renders `<CarRig />`
- [ ] `SceneSkeleton.tsx` no longer imports `Box` or `Cylinder` from drei
- [ ] `CarRig.test.tsx` exists and passes
- [ ] `index.ts` exports `CarRig`
- [ ] Visual output unchanged (same geometry, positions, colors)
- [ ] `npm run validate` passes (lint, typecheck, test, build, e2e)

## Testing Strategy

- **Unit tests**: `CarRig.test.tsx` — renders without crashing (mocked R3F/Drei)
- **E2E tests**: Existing e2e tests pass unchanged (they don't test 3D content directly)

## Performance Budgets

- **Bundle size impact**: ~0 bytes (same code, different file)

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                      | Impact | Likelihood | Mitigation                                                                            |
| ------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------- |
| SceneSkeleton test breaks | Low    | Medium     | Test mocks Box/Cylinder — after removal from SceneSkeleton the mock may need updating |

## Out of Scope

- Animation logic
- GSAP integration
- Camera rig
- Real GLB model

## References

- Current inline `CarModel`: `src/components/features/scene/SceneSkeleton.tsx` lines 8-28

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
