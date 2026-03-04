# Visual: Smoother GaragePipes with round cylinders

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

The pipes in the garage look very angular because they use default 8-segment cylinders. Increase segments to 16 for visually smoother pipes.

### Files to modify (ONLY these files):

1. `src/components/features/scene/GaragePipes.tsx`

### Instructions

In `src/components/features/scene/GaragePipes.tsx`, find every `cylinderGeometry` args and change the segment count from the 4th argument (currently 8 or default) to 16.

For example, change:

```tsx
<cylinderGeometry args={[0.06, 0.06, 20, 8]} />
```

To:

```tsx
<cylinderGeometry args={[0.06, 0.06, 20, 16]} />
```

Apply this to ALL cylinderGeometry instances in the file. If any cylinder doesn't have a 4th segment argument, add `16` as the 4th argument.

Do NOT modify any other files.

### Acceptance Criteria

- All `cylinderGeometry` in `GaragePipes.tsx` use 16 radial segments
- Pipes appear visually smoother
- `npm run validate` passes
