# Feature: Cyberpunk HUD Styling

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

---

## Overview

Update the intro buttons, HUD navigation bar, and overlay panel with cyberpunk-themed styling to match the neon garage aesthetic.

## Exact Changes Required

### File 1: `src/components/features/scene/HomeScene.tsx`

Find the AIR OUT button className:

```
className="rounded-lg bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Replace with:

```
className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-8 py-4 font-mono text-sm uppercase tracking-widest text-cyan-300 backdrop-blur-sm transition-all hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
```

Find the Skip Intro button className:

```
className="rounded-lg bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Replace with:

```
className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/40 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
```

Find the garage-shell div className:

```
className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 bg-black/60 p-4 backdrop-blur-sm"
```

Replace with:

```
className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 border-t border-cyan-400/10 bg-black/70 p-4 backdrop-blur-md"
```

Find each HUD button className:

```
className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Replace with:

```
className="min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-5 py-2 font-mono text-xs uppercase tracking-wider text-white/70 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
```

### File 2: `src/components/features/scene/OverlayPanel.tsx`

Find the panel div className:

```
className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-white/10 bg-black/80 p-8 backdrop-blur-lg md:w-1/2"
```

Replace with:

```
className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-cyan-400/10 bg-black/85 p-4 backdrop-blur-lg sm:p-8 md:w-1/2"
```

Find the heading h2:

```
<h2 className="text-2xl font-bold text-white">{content.heading}</h2>
```

Replace with:

```
<h2 className="font-mono text-xl font-bold uppercase tracking-wider text-cyan-300">{content.heading}</h2>
```

Find the close button className:

```
className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/60 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
```

Replace with:

```
className="min-h-[44px] min-w-[44px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/50 transition-all hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/80"
```

Find the description paragraph:

```
      <p className="text-white/60">{content.description}</p>
```

Replace with:

```
      <div className="flex-1 overflow-y-auto">
        <p className="text-white/60">{content.description}</p>
      </div>
```

## Constraints

- ONLY modify `HomeScene.tsx` and `OverlayPanel.tsx`
- Only change className strings and the description wrapper — do NOT modify component logic, state, or event handlers
- Do NOT add any new npm dependencies
- Do NOT modify any test files
- After changes run `npm run validate`

## Acceptance Criteria

- [ ] Intro buttons have cyberpunk mono/uppercase/cyan styling
- [ ] HUD bar has dark bg, cyan border-top, neon hover effects
- [ ] Panel has cyan heading, magenta close button, scrollable content
- [ ] 44px minimum touch targets on interactive elements
- [ ] `npm run validate` passes
