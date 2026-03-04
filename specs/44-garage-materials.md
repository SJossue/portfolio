# Feature: Shared Material Constants

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create a shared material constants module for the garage scene components.

### Files to create (ONLY these files):

1. `src/components/features/scene/garage-materials.ts`

### Instructions

Create `src/components/features/scene/garage-materials.ts` with the following exports:

- `DARK_METAL` — dark metallic surface (`color: '#0a0a0a'`, `metalness: 0.85`, `roughness: 0.35`)
- `WALL_CONCRETE` — wall material (`color: '#111111'`, `metalness: 0.7`, `roughness: 0.6`)
- `RUST_METAL` — rusty surface (`color: '#1a0e08'`, `metalness: 0.6`, `roughness: 0.8`)
- `NEON_CYAN` — cyan emissive (`emissive: '#00f0ff'`, `emissiveIntensity: 3`, `toneMapped: false`)
- `NEON_MAGENTA` — magenta emissive (`emissive: '#ff00cc'`, `emissiveIntensity: 3`, `toneMapped: false`)
- `NEON_ORANGE` — orange emissive (`emissive: '#ff6600'`, `emissiveIntensity: 2`, `toneMapped: false`)
- `FLOOR_STAIN` — semi-transparent dark stain (`transparent: true`, `opacity: 0.4`)

All exports use `as const` for type safety. No test needed (pure data).

### Acceptance Criteria

- File exports all 7 material constants
- `npm run validate` passes
