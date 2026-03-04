# Feature: Garage Light Fixtures

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create industrial light fixtures to replace SceneSkeleton's ambient point lights.

### Files to create:

1. `src/components/features/scene/GarageLightFixtures.tsx`
2. `src/components/features/scene/GarageLightFixtures.test.tsx`

### Instructions

**GarageLightFixtures.tsx**: Imports `DARK_METAL`, `NEON_CYAN` from `./garage-materials`. Contains:

- 3 hanging industrial lamps from ceiling beams (cylinder housing + emissive disc + pointLight + hanging rod)
- 2 emissive floor strips flanking car position (cyan, thin boxes at y=0.005)
- Wall accent strips at baseboard level (y=0.1) on all 3 walls
- Ceiling emissive strip along one beam

**Test**: Mock `@react-three/fiber`, verify renders without crashing.

### Acceptance Criteria

- 3 hanging lamps with embedded pointLights
- Floor and wall accent strips render
- `npm run validate` passes
