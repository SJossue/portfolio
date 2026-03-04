# Feature: Garage Shelving

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create shelf units with prop boxes for visual detail.

### Files to create:

1. `src/components/features/scene/GarageShelving.tsx`
2. `src/components/features/scene/GarageShelving.test.tsx`

### Instructions

**GarageShelving.tsx**: Imports `DARK_METAL`, `RUST_METAL`, `NEON_ORANGE` from `./garage-materials`. Contains:

- Left-wall shelf at x=-13, z=-8 (away from interactables)
- Right-wall shelf at x=13, z=-10
- Each shelf: 2 vertical posts, 3 shelf planes, 3 prop boxes
- One item on right shelf with `NEON_ORANGE` emissive (powered device)

**Test**: Mock `@react-three/fiber`, verify renders without crashing.

### Acceptance Criteria

- Two shelf units render with prop boxes
- One orange emissive device present
- `npm run validate` passes
