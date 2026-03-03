# Feature: Branded Loading Screen

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Replace the plain "Loading scene..." text in `SceneSkeleton.tsx` with a branded cyberpunk loading indicator.

### Files to modify (ONLY these files):

1. `src/components/features/scene/SceneSkeleton.tsx` — replace the `SceneLoader` function

### Instructions:

Find the `SceneLoader` function in `SceneSkeleton.tsx` and replace it with:

```tsx
function SceneLoader() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#050510]"
      role="status"
    >
      <div className="font-mono text-2xl uppercase tracking-[0.3em] text-cyan-400">
        Initializing
      </div>
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" />
      </div>
      <div className="font-mono text-xs tracking-wider text-white/30">
        Loading 3D environment...
      </div>
    </div>
  );
}
```

Do NOT change any other function in SceneSkeleton.tsx.

### Acceptance Criteria

- Loading screen shows "Initializing" heading with cyan color
- Animated gradient progress bar visible
- Background matches scene background (#050510)
- `npm run validate` passes
