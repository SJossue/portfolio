# Feature: Garage Environment

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Create a `GarageEnvironment` component that adds floor, walls, and atmospheric lighting to the 3D scene, transforming the black void into a garage bay. The environment fades in during the `revealing` state.

**User story**: As a visitor, I want to see a garage space materialize around the car during the reveal so that the experience feels like entering a real workshop.

## Context

Currently the 3D scene is a black void with a single ambient light and point light. The vision calls for a garage that IS the interface. This spec adds the foundational environment geometry — floor, back wall, side walls — plus garage-appropriate lighting (warm spots, subtle fill).

## Requirements

### Functional Requirements

1. The system MUST create `src/components/features/scene/GarageEnvironment.tsx`
2. The component MUST render:
   - A floor plane (20x20 units, dark concrete color `#1a1a1a`, positioned at Y=0)
   - A back wall plane (20x8 units, slightly lighter `#222222`, positioned at Z=-8, facing forward)
   - Two side wall planes (20x8 units, `#1e1e1e`, positioned at X=-10 and X=10, facing inward)
3. The system MUST add garage-specific lighting inside the component:
   - Two spot lights pointing down from the ceiling (simulating garage bay lights), warm white `#ffeedd`, intensity 2, positioned at `[3, 6, 0]` and `[-3, 6, 0]`, pointing at the floor
   - A subtle fill light (hemisphere light) with sky color `#111122` and ground color `#080808`, intensity 0.3
4. The system MUST read `introState` from `useSceneState`
5. During `idle` and `airingOut` states, the garage environment MUST be invisible (all materials transparent, lights intensity 0)
6. During `revealing` state, the garage environment MUST fade in (material opacity 0→1 over the reveal duration, lights intensity ramp up)
7. During `garage` state, the garage environment MUST be fully visible
8. The system MUST update `SceneSkeleton.tsx` to include `<GarageEnvironment />`
9. The system MUST remove the existing `<ambientLight>` and `<pointLight>` from `SceneSkeleton.tsx` (GarageEnvironment owns all lighting now)
10. The system MUST export `GarageEnvironment` from the barrel file `index.ts`
11. The system MUST add a unit test for GarageEnvironment

### Non-Functional Requirements

- **Performance**: 5 planes + 3 lights is minimal — well within draw call budget (50/frame)
- **Accessibility**: No change (3D environment, not screen-reader content)

## Design

### Technical Approach

**Files to create:**

1. `src/components/features/scene/GarageEnvironment.tsx`
2. `src/components/features/scene/GarageEnvironment.test.tsx`

**Files to modify:**

3. `src/components/features/scene/SceneSkeleton.tsx` — add GarageEnvironment, remove old lights
4. `src/components/features/scene/index.ts` — add export

**Create `src/components/features/scene/GarageEnvironment.tsx`:**

```tsx
'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import { MathUtils } from 'three';
import type { Mesh, SpotLight as SpotLightType } from 'three';
import { useSceneState } from './useSceneState';

export function GarageEnvironment() {
  const introState = useSceneState((s) => s.introState);

  const floorRef = useRef<Mesh>(null);
  const backWallRef = useRef<Mesh>(null);
  const leftWallRef = useRef<Mesh>(null);
  const rightWallRef = useRef<Mesh>(null);
  const spotLeftRef = useRef<SpotLightType>(null);
  const spotRightRef = useRef<SpotLightType>(null);

  useFrame(() => {
    const targetOpacity = introState === 'idle' || introState === 'airingOut' ? 0 : 1;
    const targetIntensity = introState === 'idle' || introState === 'airingOut' ? 0 : 2;
    const lerpSpeed = 0.03;

    const meshes = [floorRef, backWallRef, leftWallRef, rightWallRef];
    for (const ref of meshes) {
      if (ref.current) {
        const mat = ref.current.material as THREE.MeshStandardMaterial;
        mat.opacity = MathUtils.lerp(mat.opacity, targetOpacity, lerpSpeed);
      }
    }

    if (spotLeftRef.current) {
      spotLeftRef.current.intensity = MathUtils.lerp(
        spotLeftRef.current.intensity,
        targetIntensity,
        lerpSpeed,
      );
    }
    if (spotRightRef.current) {
      spotRightRef.current.intensity = MathUtils.lerp(
        spotRightRef.current.intensity,
        targetIntensity,
        lerpSpeed,
      );
    }
  });

  return (
    <group>
      {/* Floor */}
      <Plane ref={floorRef} args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0} />
      </Plane>

      {/* Back wall */}
      <Plane ref={backWallRef} args={[20, 8]} position={[0, 4, -8]}>
        <meshStandardMaterial color="#222222" transparent opacity={0} />
      </Plane>

      {/* Left wall */}
      <Plane ref={leftWallRef} args={[20, 8]} position={[-10, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#1e1e1e" transparent opacity={0} />
      </Plane>

      {/* Right wall */}
      <Plane
        ref={rightWallRef}
        args={[20, 8]}
        position={[10, 4, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <meshStandardMaterial color="#1e1e1e" transparent opacity={0} />
      </Plane>

      {/* Garage bay spot lights */}
      <spotLight
        ref={spotLeftRef}
        position={[-3, 6, 0]}
        angle={0.6}
        penumbra={0.5}
        color="#ffeedd"
        intensity={0}
        target-position={[-3, 0, 0]}
      />
      <spotLight
        ref={spotRightRef}
        position={[3, 6, 0]}
        angle={0.6}
        penumbra={0.5}
        color="#ffeedd"
        intensity={0}
        target-position={[3, 0, 0]}
      />

      {/* Ambient fill */}
      <hemisphereLight args={['#111122', '#080808', 0.3]} />
    </group>
  );
}
```

**Note:** The `THREE` namespace import is needed for the material type cast. Add this import at the top:

```tsx
import * as THREE from 'three';
```

Or alternatively use the already-imported types. The agent should ensure the type cast `as THREE.MeshStandardMaterial` works. If the agent prefers, they can import `MeshStandardMaterial` from `three` directly:

```tsx
import { MathUtils, MeshStandardMaterial } from 'three';
import type { Mesh, SpotLight as SpotLightType } from 'three';
```

And cast as `as MeshStandardMaterial`.

**Create `src/components/features/scene/GarageEnvironment.test.tsx`:**

```tsx
import { render } from '@testing-library/react';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Plane: (props: Record<string, unknown>) => <div data-testid="plane" {...props} />,
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'garage' }),
}));

import { GarageEnvironment } from './GarageEnvironment';

describe('GarageEnvironment', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageEnvironment />);
    expect(container).toBeTruthy();
  });
});
```

**Modify `SceneSkeleton.tsx`:**

Remove `<ambientLight>` and `<pointLight>`. Add `<GarageEnvironment />`. New Canvas content:

```tsx
<Canvas camera={{ position: [1.5, 0.8, 3], fov: 50 }}>
  <GarageEnvironment />
  <CameraRig />
  <CarRig />
  <OrbitControls enableZoom={false} enablePan={false} enabled={introState === 'garage'} />
</Canvas>
```

Add the import at the top of `SceneSkeleton.tsx`:

```tsx
import { GarageEnvironment } from './GarageEnvironment';
```

**Modify `index.ts`:**

```typescript
export { CameraRig } from './CameraRig';
export { CarRig } from './CarRig';
export { GarageEnvironment } from './GarageEnvironment';
export { SceneSkeleton } from './SceneSkeleton';
export { useSceneState } from './useSceneState';
export { HomeScene } from './HomeScene';
```

## Acceptance Criteria

- [ ] `GarageEnvironment.tsx` exists at `src/components/features/scene/GarageEnvironment.tsx`
- [ ] Floor plane renders at Y=0, 20x20 units
- [ ] Back wall renders at Z=-8, facing forward
- [ ] Two side walls render at X=-10 and X=10
- [ ] Two spot lights are positioned overhead
- [ ] Hemisphere light provides ambient fill
- [ ] Environment is invisible during `idle` and `airingOut` states (opacity 0, lights intensity 0)
- [ ] Environment fades in during `revealing` state (lerp toward full opacity/intensity)
- [ ] Environment is fully visible during `garage` state
- [ ] Old `<ambientLight>` and `<pointLight>` removed from `SceneSkeleton.tsx`
- [ ] `GarageEnvironment.test.tsx` exists and passes
- [ ] `index.ts` exports `GarageEnvironment`
- [ ] `npm run validate` passes

## Testing Strategy

- **Unit tests**: `GarageEnvironment.test.tsx` — renders without crashing (mocked R3F/Drei)
- **E2E tests**: Existing tests pass unchanged (they test DOM, not 3D geometry)

## Performance Budgets

- **Bundle size impact**: < 1 KB (Plane is already in Drei bundle)
- **Runtime**: 5 planes + 3 lights + `useFrame` lerp — well within budgets
- **Draw calls**: +5 draw calls, total still well under 50/frame limit

## Dependencies

- None. Uses existing `@react-three/drei` (Plane) and `three` (MathUtils).

## Risks & Mitigations

| Risk                                            | Impact | Likelihood | Mitigation                                                                  |
| ----------------------------------------------- | ------ | ---------- | --------------------------------------------------------------------------- |
| spotLight target-position JSX prop may not work | Medium | Medium     | Use a target object or `lookAt` in useFrame if R3F doesn't support the prop |
| Material type cast                              | Low    | Low        | Use explicit MeshStandardMaterial import                                    |

## Out of Scope

- Interactable objects inside the garage
- Detailed geometry (shelves, workbench, tools)
- Environment maps / HDRI
- Post-processing (bloom, AO)

## References

- Vision doc: "garage environment fades/comes online during reveal"
- PROJECT.md: draw calls ≤ 50/frame

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
