# Visual: Monitor screen content — animated terminal output

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

The MonitorInteractable currently shows a plain colored screen. Add a cyberpunk terminal output texture using an emissive material that makes the screen feel alive.

### Files to modify (ONLY these files):

1. `src/components/features/scene/MonitorInteractable.tsx`

### Instructions

In `src/components/features/scene/MonitorInteractable.tsx`, locate the screen mesh (the one that acts as the monitor display — it should have a `meshStandardMaterial` with an emissive blue or cyan color).

Change the screen material to use a more vibrant emissive screen effect:

Find the screen's `meshStandardMaterial` and update it to:

```tsx
<meshStandardMaterial emissive="#003366" emissiveIntensity={2} color="#001122" toneMapped={false} />
```

This makes the screen glow a deep blue that interacts with the Bloom post-processing to create a realistic monitor glow.

Do NOT modify any other files.

### Acceptance Criteria

- Monitor screen uses an emissive blue material with `toneMapped={false}`
- Screen appears to glow in the scene
- `npm run validate` passes
