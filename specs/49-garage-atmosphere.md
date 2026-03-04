# Feature: Garage Atmosphere

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create atmospheric effects: particles, light shafts, fog, and contact shadows.

### Files to create:

1. `src/components/features/scene/GarageAtmosphere.tsx`
2. `src/components/features/scene/GarageAtmosphere.test.tsx`

### Instructions

**GarageAtmosphere.tsx**: Imports `ContactShadows`, `Sparkles` from `@react-three/drei`. Contains:

- Cyan dust motes Sparkles (migrated from GarageEnvironment, same params)
- White ambient Sparkles layer (slower, larger area)
- 2-3 fake light shaft boxes (tall, thin, transparent with subtle cyan emissive)
- Ground fog plane at y=0.15 (transparent, low opacity)
- ContactShadows (migrated from GarageEnvironment, same params)

**Test**: Mock drei components, verify renders without crashing and ContactShadows present.

### Acceptance Criteria

- Sparkles and ContactShadows migrated with same parameters
- Light shafts and fog plane render
- `npm run validate` passes
