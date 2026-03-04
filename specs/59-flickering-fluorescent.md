# Feature: Flickering Fluorescent Light

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Create a flickering fluorescent tube light that randomly flickers via useFrame.

### Files to create (ONLY these files):

1. `src/components/features/scene/FlickeringLight.tsx`
2. `src/components/features/scene/FlickeringLight.test.tsx`

### Instructions

**Create `src/components/features/scene/FlickeringLight.tsx`**:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, PointLight } from 'three';
import { DARK_METAL } from './garage-materials';

export function FlickeringLight({
  position = [-8, 5.2, -10] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  const tubeRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  useFrame(() => {
    const on = Math.random() > 0.06;
    const intensity = on ? 2.5 + Math.random() * 0.5 : 0;
    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity;
    }
    if (lightRef.current) {
      lightRef.current.intensity = on ? 1.2 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Fixture housing */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Fluorescent tube */}
      <mesh ref={tubeRef}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial
          emissive="#e8ffe8"
          emissiveIntensity={2.5}
          color="#e8ffe8"
          toneMapped={false}
        />
      </mesh>

      {/* End caps */}
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      <pointLight ref={lightRef} color="#e8ffe8" intensity={1.2} distance={6} decay={2} />
    </group>
  );
}
```

Note: Add `import * as THREE from 'three';` at the top of the file after the other imports.

**Create `src/components/features/scene/FlickeringLight.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlickeringLight } from './FlickeringLight';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('three', () => ({
  default: {},
}));

describe('FlickeringLight', () => {
  it('renders without crashing', () => {
    const { container } = render(<FlickeringLight />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Fluorescent tube flickers randomly via useFrame
- Fixture housing, tube, end caps, and pointLight render
- `npm run validate` passes
