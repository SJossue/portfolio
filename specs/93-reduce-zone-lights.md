# Visual: Reduce SceneSkeleton zone point lights

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

SceneSkeleton.tsx has 3 zone point lights (workstation, monitor, car bay) that can be consolidated. The workstation and car bay lights overlap in coverage. Merge them into 2.

### Files to modify (ONLY these files):

1. `src/components/features/scene/SceneSkeleton.tsx`

### Instructions

In `src/components/features/scene/SceneSkeleton.tsx`, in the garage-ready section, replace the 3 pointLights:

Replace:

```tsx
{
  /* Workstation area */
}
<pointLight position={[-4, 2, -3]} color="#ff6600" intensity={0.8} distance={6} decay={2} />;
{
  /* Monitor area */
}
<pointLight position={[4, 3, -7]} color="#0066ff" intensity={0.8} distance={6} decay={2} />;
{
  /* Car bay light */
}
<pointLight position={[-9, 4, 8]} color="#00f0ff" intensity={0.6} distance={8} decay={2} />;
```

With:

```tsx
{
  /* Warm workshop light */
}
<pointLight position={[-2, 3, 0]} color="#ff6600" intensity={1} distance={12} decay={2} />;
{
  /* Cool monitor glow */
}
<pointLight position={[4, 3, -7]} color="#0066ff" intensity={0.8} distance={8} decay={2} />;
```

Do NOT modify anything else in the file.

### Acceptance Criteria

- Only 2 zone point lights remain (warm and cool)
- The warm light is repositioned centrally with higher distance to cover more area
- `npm run validate` passes
