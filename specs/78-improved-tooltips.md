# UI: Hover tooltip with neon glow for interactable labels

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Improve the interactable label tooltip to have a more cyberpunk feel with animated border glow, bracket decorations, and a subtle scan-line effect when hovered.

### Files to modify (ONLY these files):

1. `src/components/features/scene/Interactable.tsx`

### Instructions

In `src/components/features/scene/Interactable.tsx`, replace the `<Html>` label block at the bottom of the return statement:

Replace:

```tsx
<Html position={[0, 1.4, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
  <div
    className={`whitespace-nowrap rounded-sm px-2 py-0.5 font-mono text-xs tracking-wider transition-all duration-300 ${hovered ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'bg-black/40 text-white/60'}`}
  >
    {label}
  </div>
</Html>
```

With:

```tsx
<Html position={[0, 1.4, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
  <div
    className={`whitespace-nowrap rounded px-3 py-1 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
      hovered
        ? 'corner-brackets animate-glow-pulse border border-cyan-400/30 bg-black/80 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
        : 'border border-transparent bg-black/40 text-white/50'
    }`}
  >
    {hovered && <span className="mr-1 text-cyan-400/50">{'>'}</span>}
    {label}
  </div>
</Html>
```

Do NOT modify any other files.

### Acceptance Criteria

- Hovered labels show corner brackets decoration, neon glow pulse, and a `>` prefix
- Non-hovered labels remain subtle
- Uses existing `.corner-brackets` and `.animate-glow-pulse` CSS classes
- `npm run validate` passes
