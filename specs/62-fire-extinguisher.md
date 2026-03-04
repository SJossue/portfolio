# Feature: Fire Extinguisher

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Create a wall-mounted fire extinguisher from primitives.

### Files to create (ONLY these files):

1. `src/components/features/scene/FireExtinguisher.tsx`
2. `src/components/features/scene/FireExtinguisher.test.tsx`

### Instructions

**Create `src/components/features/scene/FireExtinguisher.tsx`**:

```tsx
import { DARK_METAL } from './garage-materials';

const RED_BODY = {
  color: '#8b1a1a',
  roughness: 0.5,
  metalness: 0.3,
} as const;

export function FireExtinguisher({
  position = [14.5, 1.2, -2] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Wall bracket */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Body cylinder */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 12]} />
        <meshStandardMaterial {...RED_BODY} />
      </mesh>

      {/* Top dome */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...RED_BODY} />
      </mesh>

      {/* Valve/handle */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.06, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Handle lever */}
      <mesh position={[0.04, 0.34, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.08, 0.015, 0.02]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Nozzle */}
      <mesh position={[0.06, 0.28, 0]} rotation={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.008, 0.005, 0.08, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Hose */}
      <mesh position={[0.04, 0.15, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      {/* Bottom ring */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.02, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}
```

**Create `src/components/features/scene/FireExtinguisher.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FireExtinguisher } from './FireExtinguisher';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('FireExtinguisher', () => {
  it('renders without crashing', () => {
    const { container } = render(<FireExtinguisher />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Red cylinder body with dome top, valve, handle, nozzle, hose
- Wall brackets for mounting
- `npm run validate` passes
