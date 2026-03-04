# Perf: Replace MeshReflectorMaterial with simple dark floor

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

The `MeshReflectorMaterial` in `GarageEnvironment.tsx` renders the entire scene a second time into a reflection texture. This doubles GPU work. Replace it with a simple `meshStandardMaterial` that looks nearly identical in the dark foggy garage.

### Files to modify (ONLY these files):

1. `src/components/features/scene/GarageEnvironment.tsx`

### Instructions

In `src/components/features/scene/GarageEnvironment.tsx`, replace ONLY the reflective floor mesh block (lines ~32-42) with this code. Change the import line at the top to remove `MeshReflectorMaterial`.

Remove this import at the top of the file:

```tsx
import { MeshReflectorMaterial } from '@react-three/drei';
```

Replace this block:

```tsx
{
  /* Reflective floor */
}
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
  <planeGeometry args={[30, 30]} />
  <MeshReflectorMaterial
    blur={[300, 100]}
    resolution={512}
    mixBlur={0.8}
    mixStrength={1.2}
    roughness={0.9}
    color="#050505"
    metalness={0.3}
    mirror={0.5}
  />
</mesh>;
```

With this:

```tsx
{
  /* Dark garage floor */
}
<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
  <planeGeometry args={[30, 30]} />
  <meshStandardMaterial color="#050505" roughness={0.85} metalness={0.4} />
</mesh>;
```

Do NOT modify any other parts of the file.

### Acceptance Criteria

- `MeshReflectorMaterial` is no longer imported or used
- Floor uses a simple `meshStandardMaterial`
- `npm run validate` passes
