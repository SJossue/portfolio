# Feature: CRT Scanline Overlay for Scene

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add a subtle CRT scanline overlay on top of the 3D scene to enhance the cyberpunk aesthetic. This is purely CSS — a semi-transparent repeating gradient overlaid on the canvas.

### Files to modify (ONLY these files):

1. `src/styles/globals.css` — add scanline CSS
2. `src/components/features/scene/HomeScene.tsx` — add the overlay div

### Instructions:

**Add to the end of `src/styles/globals.css`:**

```css
/* CRT scanline overlay */
.scanline-overlay {
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.03) 0px,
    rgba(0, 0, 0, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
}
```

**Modify `src/components/features/scene/HomeScene.tsx`:**

Find the outermost `<div>` in the `HomeScene` return statement:

```tsx
    <div className="relative h-screen w-full">
      <SceneSkeleton />
```

Add the scanline overlay div right after `<SceneSkeleton />`:

```tsx
    <div className="relative h-screen w-full">
      <SceneSkeleton />
      <div className="scanline-overlay absolute inset-0 z-[1]" aria-hidden="true" />
```

Do NOT change anything else.

### Acceptance Criteria

- Scanline overlay renders on top of the 3D scene
- Overlay has `pointer-events: none` so clicks pass through
- Overlay has `aria-hidden="true"` for accessibility
- Overlay uses `z-[1]` so it appears above the canvas but below UI controls
- `npm run validate` passes
