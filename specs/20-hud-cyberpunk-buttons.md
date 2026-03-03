# Feature: Cyberpunk HUD Buttons

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Modify `src/components/features/scene/HomeScene.tsx` to update button styles with cyberpunk theme. Replace the AIR OUT button className, Skip Intro button className, garage-shell div className, and HUD button className.

The AIR OUT button currently has:

```
className="rounded-lg bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Change it to:

```
className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-8 py-4 font-mono text-sm uppercase tracking-widest text-cyan-300 backdrop-blur-sm transition-all hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
```

The Skip Intro button currently has:

```
className="rounded-lg bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Change it to:

```
className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/40 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
```

The garage-shell div currently has:

```
className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 bg-black/60 p-4 backdrop-blur-sm"
```

Change it to:

```
className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 border-t border-cyan-400/10 bg-black/70 p-4 backdrop-blur-md"
```

Each HUD section button currently has:

```
className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Change it to:

```
className="min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-5 py-2 font-mono text-xs uppercase tracking-wider text-white/70 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
```

Do NOT change any logic, state management, event handlers, or component structure. Only change className strings.
