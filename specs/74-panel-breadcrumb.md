# UI: Breadcrumb trail in overlay panel header

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Add a breadcrumb-style navigation trail to the overlay panel header showing `Garage > [Section Name]` to give spatial context.

### Files to modify (ONLY these files):

1. `src/components/features/scene/OverlayPanel.tsx`

### Instructions

In `src/components/features/scene/OverlayPanel.tsx`, replace the heading `<h2>` element inside the header div:

Replace:

```tsx
<h2 className="animate-glitch-skew font-mono text-xl font-bold uppercase tracking-wider text-cyan-300">
  {heading}
</h2>
```

With:

```tsx
<div className="flex flex-col gap-1">
  <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">
    Garage <span className="text-cyan-400/40">{'>'}</span> {heading}
  </div>
  <h2 className="animate-glitch-skew font-mono text-xl font-bold uppercase tracking-wider text-cyan-300">
    {heading}
  </h2>
</div>
```

Do NOT modify any other files.

### Acceptance Criteria

- Panel header shows "Garage > [Section]" breadcrumb above the heading
- Breadcrumb uses small monospace text with subtle styling
- `npm run validate` passes
