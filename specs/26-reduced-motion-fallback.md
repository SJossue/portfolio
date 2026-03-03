# Feature: Reduced Motion Fallback for 3D Scene

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

When `prefers-reduced-motion: reduce` is active, the loading screen should skip the `animate-pulse` animation. Add a Tailwind `motion-reduce:` variant to the progress bar so it remains static but visible.

### Files to modify (ONLY these files):

1. `src/components/features/scene/SceneSkeleton.tsx` — update the SceneLoader function

### Instructions:

In the `SceneLoader` function inside `SceneSkeleton.tsx`, find the animated progress bar div:

```tsx
<div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" />
```

Replace it with:

```tsx
<div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 motion-reduce:animate-none" />
```

Do NOT change anything else in SceneSkeleton.tsx.

### Acceptance Criteria

- Progress bar has `motion-reduce:animate-none` class
- Animation stops when user prefers reduced motion
- `npm run validate` passes
