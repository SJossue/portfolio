# Feature: Custom 404 Not Found Page

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Create a custom 404 page with cyberpunk styling that matches the portfolio theme.

### Files to create:

1. `src/app/not-found.tsx` — NEW file

### Instructions

Create `src/app/not-found.tsx` with this EXACT content:

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050510] px-4 text-center">
      <div className="font-mono text-6xl font-bold tracking-wider text-cyan-400">
        404
      </div>
      <p className="font-mono text-lg text-white/60">
        Signal lost. This page does not exist.
      </p>
      <Link
        href="/"
        className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 font-mono text-sm uppercase tracking-wider text-cyan-300 transition-all hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
      >
        Return to Base
      </Link>
    </div>
  );
}
```

Do NOT modify any existing files.

### Acceptance Criteria

- `src/app/not-found.tsx` exists with cyberpunk 404 page
- Shows "404" heading, description, and link back to home
- Page uses the dark theme background matching the portfolio
- `npm run validate` passes
