# UI: Loading progress bar with percentage

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Replace the simple sliding bar in the SceneLoader with a proper percentage-based progress bar.

### Files to modify (ONLY these files):

1. `src/components/features/scene/SceneSkeleton.tsx`

### Instructions

In `src/components/features/scene/SceneSkeleton.tsx`, replace the `SceneLoader` function:

Replace:

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
        <div className="h-full w-1/3 animate-slide-lr rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 motion-reduce:animate-none" />
      </div>
      <div className="font-mono text-xs tracking-wider text-white/30">
        Loading 3D environment...
      </div>
    </div>
  );
}
```

With:

```tsx
function SceneLoader() {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-8 bg-[#050510]"
      role="status"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="font-mono text-3xl font-bold uppercase tracking-[0.3em] text-cyan-400">
          INITIALIZING
        </div>
        <div className="font-mono text-xs tracking-wider text-white/20">SYS.PORTFOLIO.v3.7</div>
      </div>
      <div className="w-64 space-y-2">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-slide-lr rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 motion-reduce:animate-none" />
        </div>
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-white/30">
          <span>Loading 3D environment</span>
          <span className="text-cyan-400/40">...</span>
        </div>
      </div>
    </div>
  );
}
```

Do NOT modify any other parts of the file.

### Acceptance Criteria

- SceneLoader has improved visual hierarchy with larger title and version number
- Progress bar is wider (w-64) with status text below it
- `npm run validate` passes
