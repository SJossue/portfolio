# Visual: Remove extra pointLight from NeonOpenSign

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

The `NeonOpenSign` component has a `<pointLight>` at line 186 that's redundant (the emissive segments + Bloom create the glow effect already). Remove it to save one more dynamic light.

### Files to modify (ONLY these files):

1. `src/components/features/scene/NeonOpenSign.tsx`

### Instructions

In `src/components/features/scene/NeonOpenSign.tsx`, remove this line near the bottom of the return statement:

```tsx
<pointLight color={NEON_GREEN_COLOR} intensity={0.8} distance={6} decay={2} />
```

Simply delete this line. Do NOT modify anything else in the file.

### Acceptance Criteria

- `NeonOpenSign.tsx` no longer contains a `<pointLight>` element
- `npm run validate` passes
