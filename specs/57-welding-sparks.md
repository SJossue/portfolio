# Feature: Welding Sparks

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create a welding spark particle effect near the workbench area.

### Files to create (ONLY these files):

1. `src/components/features/scene/WeldingSparks.tsx`
2. `src/components/features/scene/WeldingSparks.test.tsx`

### Instructions

**Create `src/components/features/scene/WeldingSparks.tsx`**:

```tsx
import { Sparkles } from '@react-three/drei';
import { NEON_ORANGE } from './garage-materials';

export function WeldingSparks({
  position = [-5, 1.2, -4] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Spark particles */}
      <Sparkles
        count={15}
        scale={[0.8, 0.6, 0.8]}
        color="#ff8800"
        opacity={0.8}
        speed={1.5}
        size={1.5}
      />

      {/* Secondary white-hot sparks */}
      <Sparkles
        count={8}
        scale={[0.4, 0.4, 0.4]}
        color="#ffeecc"
        opacity={0.6}
        speed={2}
        size={0.8}
      />

      {/* Emissive hot spot on surface */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 8]} />
        <meshStandardMaterial {...NEON_ORANGE} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
```

**Create `src/components/features/scene/WeldingSparks.test.tsx`**:

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeldingSparks } from './WeldingSparks';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  Sparkles: () => null,
}));

describe('WeldingSparks', () => {
  it('renders without crashing', () => {
    const { container } = render(<WeldingSparks />);
    expect(container).toBeTruthy();
  });
});
```

Do NOT modify any other files.

### Acceptance Criteria

- Orange and white spark particles render via `Sparkles`
- Emissive hot spot on surface
- Uses `NEON_ORANGE` from `garage-materials.ts`
- `npm run validate` passes
