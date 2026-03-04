# Feature: Floor Drain Grate

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create a circular floor drain grate as a subtle floor detail.

### Files to create (ONLY these files):

1. `src/components/features/scene/FloorDrain.tsx`
2. `src/components/features/scene/FloorDrain.test.tsx`

### Instructions

**Create `src/components/features/scene/FloorDrain.tsx`**:

```tsx
import { DARK_METAL } from './garage-materials';

export function FloorDrain({
  position = [3, 0.003, 5] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[0.25, 0.025, 8, 24]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Grate bars */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, i) => (
        <mesh key={i} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.45, 0.02, 0.015]} />
          <meshStandardMaterial {...DARK_METAL} />
        </mesh>
      ))}

      {/* Dark center (drain hole) */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.24, 24]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>
    </group>
  );
}
```

**Create `src/components/features/scene/FloorDrain.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloorDrain } from './FloorDrain';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('FloorDrain', () => {
  it('renders without crashing', () => {
    const { container } = render(<FloorDrain />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Circular drain with outer ring, 4 grate bars, and dark center
- Uses `DARK_METAL` from `garage-materials.ts`
- `npm run validate` passes
