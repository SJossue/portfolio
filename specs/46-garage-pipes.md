# Feature: Garage Pipes & Cables

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create pipe and cable detail geometry for the garage scene.

### Files to create:

1. `src/components/features/scene/GaragePipes.tsx`
2. `src/components/features/scene/GaragePipes.test.tsx`

### Instructions

**GaragePipes.tsx**: Imports `DARK_METAL` from `./garage-materials`. Contains:

- 2 existing ceiling pipes migrated from GarageEnvironment (same positions/sizes)
- 2 vertical corner pipes from floor to ceiling at [-14.5, 3, -14.5] and [14.5, 3, -14.5]
- 3-4 thin cable cylinders along left wall at y=4.5
- Conduit track (box) along right wall ceiling

**Test**: Mock `@react-three/fiber`, verify renders without crashing.

### Acceptance Criteria

- Ceiling pipes match original GarageEnvironment positions
- Vertical corner pipes and cable bundles render
- `npm run validate` passes
