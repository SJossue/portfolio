# Perf: Reduce I-beams and tune Bloom

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Reduce number of ceiling I-beams from 4 to 2 (saves 6 meshes) and tune Bloom post-processing to be less intense.

### Files to modify (ONLY these files):

1. `src/components/features/scene/GarageStructure.tsx`
2. `src/components/features/scene/SceneSkeleton.tsx`

### Instructions

**In `src/components/features/scene/GarageStructure.tsx`**, replace the I-beam section (the 4 IBeam lines near the bottom) with just 2:

Replace:

```tsx
      {/* Structural I-beams across ceiling */}
      <IBeam position={[0, 5.7, -7]} />
      <IBeam position={[0, 5.7, -2]} />
      <IBeam position={[0, 5.7, 3]} />
      <IBeam position={[0, 5.7, 8]} />
```

With:

```tsx
      {/* Structural I-beams across ceiling */}
      <IBeam position={[0, 5.7, -5]} />
      <IBeam position={[0, 5.7, 5]} />
```

**In `src/components/features/scene/SceneSkeleton.tsx`**, change the Bloom settings:

Replace:

```tsx
<Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur />
```

With:

```tsx
<Bloom intensity={0.5} luminanceThreshold={0.7} luminanceSmoothing={0.9} mipmapBlur />
```

### Acceptance Criteria

- Only 2 I-beams remain in GarageStructure
- Bloom intensity reduced from 0.8 to 0.5, threshold raised from 0.6 to 0.7
- `npm run validate` passes
