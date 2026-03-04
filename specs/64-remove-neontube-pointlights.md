# Perf: Remove pointLight from every NeonTube

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Remove the `<pointLight>` from `NeonTube.tsx`. The emissive mesh + Bloom post-processing already provides the neon glow effect. Removing the light from each of the 13 NeonTube instances eliminates 13 dynamic point lights from the scene.

### Files to modify (ONLY these files):

1. `src/components/features/scene/NeonTube.tsx`

### Instructions

Replace the entire content of `src/components/features/scene/NeonTube.tsx` with:

```tsx
interface NeonTubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  color: string;
  intensity?: number;
}

export function NeonTube({
  position,
  rotation = [0, 0, 0],
  length,
  color,
  intensity = 3,
}: NeonTubeProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, length, 12]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={intensity}
          color={color}
          toneMapped={false}
        />
      </mesh>
      {/* Outer glow cylinder */}
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, length, 12]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={intensity * 0.4}
          color={color}
          transparent
          opacity={0.15}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
```

Do NOT modify any other files.

### Acceptance Criteria

- `NeonTube.tsx` no longer contains any `pointLight` or `<pointLight` element
- Cylinder segments increased from 8 to 12 for smoother appearance
- The `distance` prop is removed since no light uses it
- `npm run validate` passes
