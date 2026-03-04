# Feature: Swinging Chain

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Create a pendulum chain hanging from a ceiling beam, oscillating via sine wave.

### Files to create (ONLY these files):

1. `src/components/features/scene/SwingingChain.tsx`
2. `src/components/features/scene/SwingingChain.test.tsx`

### Instructions

**Create `src/components/features/scene/SwingingChain.tsx`**:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { DARK_METAL, RUST_METAL } from './garage-materials';

function ChainLink({ y }: { y: number }) {
  return (
    <mesh position={[0, y, 0]}>
      <torusGeometry args={[0.025, 0.008, 6, 8]} />
      <meshStandardMaterial {...DARK_METAL} />
    </mesh>
  );
}

export function SwingingChain({
  position = [4, 5.7, 8] as [number, number, number],
  speed = 0.6,
  amplitude = 0.15,
}: {
  position?: [number, number, number];
  speed?: number;
  amplitude?: number;
}) {
  const chainRef = useRef<Group>(null);

  useFrame((state) => {
    if (chainRef.current) {
      chainRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * amplitude;
    }
  });

  return (
    <group position={position}>
      <group ref={chainRef}>
        {/* Chain links */}
        {Array.from({ length: 12 }, (_, i) => (
          <ChainLink key={i} y={-i * 0.055} />
        ))}

        {/* Hook at bottom */}
        <mesh position={[0, -0.7, 0]}>
          <torusGeometry args={[0.035, 0.01, 6, 8, Math.PI]} />
          <meshStandardMaterial {...RUST_METAL} />
        </mesh>
      </group>

      {/* Ceiling mount */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}
```

**Create `src/components/features/scene/SwingingChain.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SwingingChain } from './SwingingChain';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('SwingingChain', () => {
  it('renders without crashing', () => {
    const { container } = render(<SwingingChain />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Chain oscillates via sine wave in useFrame
- 12 torus chain links + hook at bottom
- `npm run validate` passes
