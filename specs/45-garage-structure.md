# Feature: Garage Structure

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create the structural shell of the garage: floor slab, walls with panel lines, ceiling, and I-beams.

### Files to create:

1. `src/components/features/scene/GarageStructure.tsx`
2. `src/components/features/scene/GarageStructure.test.tsx`

### Instructions

**GarageStructure.tsx**: Imports material constants from `./garage-materials`. Contains:

- Floor slab: box at y=-0.15, size [30, 0.3, 30]
- 3 floor stain decals (semi-transparent planes via `FLOOR_STAIN`)
- 3 walls (back at z=-15, left at x=-15, right at x=15) with horizontal panel line details
- Ceiling plane at y=6
- 4 structural I-beams at y=5.7 (each with top flange, web, bottom flange)

**Test**: Mock `@react-three/fiber`, verify renders without crashing.

### Acceptance Criteria

- Component renders floor, 3 walls, ceiling, and 4 I-beams
- Uses material constants from `garage-materials.ts`
- `npm run validate` passes
