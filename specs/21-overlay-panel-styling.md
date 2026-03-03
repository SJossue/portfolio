# Feature: Overlay Panel Cyberpunk Styling

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Modify `src/components/features/scene/OverlayPanel.tsx` to update styles with cyberpunk theme.

Change the panel container div className from:

```
className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-white/10 bg-black/80 p-8 backdrop-blur-lg md:w-1/2"
```

to:

```
className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-cyan-400/10 bg-black/85 p-4 backdrop-blur-lg sm:p-8 md:w-1/2"
```

Change the h2 heading from:

```
<h2 className="text-2xl font-bold text-white">{content.heading}</h2>
```

to:

```
<h2 className="font-mono text-xl font-bold uppercase tracking-wider text-cyan-300">{content.heading}</h2>
```

Change the close button className from:

```
className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/60 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
```

to:

```
className="min-h-[44px] min-w-[44px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/50 transition-all hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/80"
```

Change the description line from:

```
      <p className="text-white/60">{content.description}</p>
```

to:

```
      <div className="flex-1 overflow-y-auto">
        <p className="text-white/60">{content.description}</p>
      </div>
```

Do NOT change any logic, state management, event handlers, imports, or component structure. Only change className strings and add the overflow wrapper div.
