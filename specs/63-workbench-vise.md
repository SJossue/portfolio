# Feature: Workbench Vise

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Create a workbench vise (clamp) from box primitives mounted to the workstation area.

### Files to create (ONLY these files):

1. `src/components/features/scene/WorkbenchVise.tsx`
2. `src/components/features/scene/WorkbenchVise.test.tsx`

### Instructions

**Create `src/components/features/scene/WorkbenchVise.tsx`**:

```tsx
import { DARK_METAL, RUST_METAL } from './garage-materials';

export function WorkbenchVise({
  position = [-5.2, 0.78, -2.5] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Base plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.15]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Fixed jaw */}
      <mesh position={[0, 0.06, -0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.03]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>

      {/* Moving jaw */}
      <mesh position={[0, 0.06, 0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.03]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>

      {/* Screw rod */}
      <mesh position={[0, 0.06, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Handle bar */}
      <mesh position={[0, 0.06, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Handle knobs */}
      <mesh position={[-0.06, 0.06, 0.16]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>
      <mesh position={[0.06, 0.06, 0.16]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>

      {/* Anvil surface on back */}
      <mesh position={[0, 0.115, -0.05]}>
        <boxGeometry args={[0.12, 0.01, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}
```

**Create `src/components/features/scene/WorkbenchVise.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkbenchVise } from './WorkbenchVise';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('WorkbenchVise', () => {
  it('renders without crashing', () => {
    const { container } = render(<WorkbenchVise />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Vise has base plate, fixed jaw, moving jaw, screw rod, handle with knobs
- Anvil surface on back of fixed jaw
- `npm run validate` passes
