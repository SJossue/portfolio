# Feature: Tire Rack

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create a wall-mounted tire rack with stacked torus tire shapes.

### Files to create (ONLY these files):

1. `src/components/features/scene/TireRack.tsx`
2. `src/components/features/scene/TireRack.test.tsx`

### Instructions

**Create `src/components/features/scene/TireRack.tsx`**:

```tsx
import { DARK_METAL } from './garage-materials';

const RUBBER = {
  color: '#0f0f0f',
  roughness: 0.95,
  metalness: 0.05,
} as const;

function Tire({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.28, 0.1, 8, 16]} />
      <meshStandardMaterial {...RUBBER} />
    </mesh>
  );
}

export function TireRack() {
  return (
    <group position={[14.5, 0, 5]}>
      {/* Rack frame — horizontal bars */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.06, 0.06, 2]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.06, 0.06, 2]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Rack frame — vertical supports */}
      <mesh position={[0, 1.7, -0.9]}>
        <boxGeometry args={[0.06, 2.4, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 1.7, 0.9]}>
        <boxGeometry args={[0.06, 2.4, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Bottom row tires */}
      <Tire position={[-0.05, 1.2, -0.5]} />
      <Tire position={[-0.05, 1.2, 0.1]} />
      <Tire position={[-0.05, 1.2, 0.7]} />

      {/* Top row tires */}
      <Tire position={[-0.05, 2.2, -0.3]} />
      <Tire position={[-0.05, 2.2, 0.4]} />
    </group>
  );
}
```

**Create `src/components/features/scene/TireRack.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TireRack } from './TireRack';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('TireRack', () => {
  it('renders without crashing', () => {
    const { container } = render(<TireRack />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Rack frame with 2 horizontal bars and 2 vertical supports
- 5 torus tires arranged in 2 rows
- Uses `DARK_METAL` from `garage-materials.ts`
- `npm run validate` passes
