# Visual: Smoother tire geometry in TireRack

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Tires in the `TireRack` currently use low-poly torus geometry. Increase the segments for smoother, more realistic tires.

### Files to modify (ONLY these files):

1. `src/components/features/scene/TireRack.tsx`

### Instructions

In `src/components/features/scene/TireRack.tsx`, find every `torusGeometry` and increase the segment counts. Change the 3rd argument (tubular segments) from 8 to 16, and the 4th argument (radial segments) from 12 to 24 (or add them if missing).

For example, change:

```tsx
<torusGeometry args={[0.35, 0.12, 8, 24]} />
```

To:

```tsx
<torusGeometry args={[0.35, 0.12, 16, 32]} />
```

Apply to ALL torusGeometry instances in the file.

Do NOT modify any other files.

### Acceptance Criteria

- All `torusGeometry` in `TireRack.tsx` use higher segment counts
- Tires appear visually smoother and more round
- `npm run validate` passes
