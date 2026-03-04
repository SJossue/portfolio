# Feature: Rotating Wireframe Hologram

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Create a slowly rotating wireframe hologram on the workbench area.

### Files to create (ONLY these files):

1. `src/components/features/scene/HologramDisplay.tsx`
2. `src/components/features/scene/HologramDisplay.test.tsx`

### Instructions

**Create `src/components/features/scene/HologramDisplay.tsx`**:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import type { Group } from 'three';
import { NEON_CYAN } from './garage-materials';

export function HologramDisplay({
  position = [-3, 1.3, -3] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Base emissive disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial {...NEON_CYAN} transparent opacity={0.2} />
      </mesh>

      {/* Rotating wireframe shape */}
      <group ref={groupRef} position={[0, 0.25, 0]}>
        {/* Icosahedron wireframe */}
        <mesh>
          <icosahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial {...NEON_CYAN} transparent opacity={0.1} />
          <Edges color="#00f0ff" threshold={15} />
        </mesh>

        {/* Inner octahedron wireframe */}
        <mesh>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial {...NEON_CYAN} transparent opacity={0.05} />
          <Edges color="#00f0ff" threshold={15} />
        </mesh>
      </group>

      {/* Beam from base to hologram */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.01, 0.08, 0.2, 8]} />
        <meshStandardMaterial {...NEON_CYAN} transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
```

**Create `src/components/features/scene/HologramDisplay.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HologramDisplay } from './HologramDisplay';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  Edges: () => null,
}));

describe('HologramDisplay', () => {
  it('renders without crashing', () => {
    const { container } = render(<HologramDisplay />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Wireframe icosahedron + octahedron rotate via useFrame
- Subtle vertical bob animation
- Base disc and projection beam render
- `npm run validate` passes
