# UI: Section-specific accent colors for HUD buttons

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Each HUD button currently looks identical. Add unique accent colors per section so users can visually distinguish navigation targets at a glance.

### Files to modify (ONLY these files):

1. `src/components/features/scene/HomeScene.tsx`

### Instructions

In `src/components/features/scene/HomeScene.tsx`, replace the `HUD_SECTIONS` constant:

Replace:

```tsx
const HUD_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
];
```

With:

```tsx
const HUD_SECTIONS = [
  { id: 'projects', label: 'Projects', accent: 'cyan' },
  { id: 'experience', label: 'Experience', accent: 'amber' },
  { id: 'contact', label: 'Contact', accent: 'fuchsia' },
  { id: 'about', label: 'About', accent: 'emerald' },
];
```

Then replace the button element inside the `.map()`:

Replace:

```tsx
<button
  key={s.id}
  onClick={() => setSelectedSection(s.id)}
  className="min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-5 py-2 font-mono text-xs uppercase tracking-wider text-white/70 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
  aria-label={s.label}
>
  {s.label}
</button>
```

With:

```tsx
<button
  key={s.id}
  onClick={() => setSelectedSection(s.id)}
  className={`min-h-[44px] rounded-lg border px-5 py-2 font-mono text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 ${
    s.accent === 'cyan'
      ? 'border-cyan-400/20 bg-cyan-500/5 text-cyan-300/70 hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.15)] focus-visible:ring-cyan-400/80'
      : s.accent === 'amber'
        ? 'border-amber-400/20 bg-amber-500/5 text-amber-300/70 hover:border-amber-400/50 hover:bg-amber-500/15 hover:text-amber-300 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] focus-visible:ring-amber-400/80'
        : s.accent === 'fuchsia'
          ? 'border-fuchsia-400/20 bg-fuchsia-500/5 text-fuchsia-300/70 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/15 hover:text-fuchsia-300 hover:shadow-[0_0_12px_rgba(217,70,239,0.15)] focus-visible:ring-fuchsia-400/80'
          : 'border-emerald-400/20 bg-emerald-500/5 text-emerald-300/70 hover:border-emerald-400/50 hover:bg-emerald-500/15 hover:text-emerald-300 hover:shadow-[0_0_12px_rgba(52,211,153,0.15)] focus-visible:ring-emerald-400/80'
  }`}
  aria-label={s.label}
>
  {s.label}
</button>
```

Do NOT modify any other files.

### Acceptance Criteria

- Each HUD button has a unique accent color (cyan, amber, fuchsia, emerald)
- Buttons have matching hover glow effects
- `npm run validate` passes
