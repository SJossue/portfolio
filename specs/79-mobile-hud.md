# UI: Mobile-responsive HUD layout

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

The HUD bar buttons are too small on mobile and don't wrap properly. Make the HUD responsive: stack vertically on mobile, use larger touch targets, and add a hamburger-style toggle.

### Files to create (ONLY these files):

1. `src/components/features/scene/MobileHud.tsx` — NEW file

### Instructions

Create `src/components/features/scene/MobileHud.tsx` with this EXACT content:

```tsx
'use client';

import { useState } from 'react';
import { useSceneState } from './useSceneState';

const HUD_SECTIONS = [
  { id: 'projects', label: 'Projects', key: '1' },
  { id: 'experience', label: 'Experience', key: '2' },
  { id: 'contact', label: 'Contact', key: '3' },
  { id: 'about', label: 'About', key: '4' },
];

export function MobileHud() {
  const [expanded, setExpanded] = useState(false);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  return (
    <div className="absolute bottom-4 right-4 z-10 sm:hidden">
      {expanded && (
        <div className="mb-2 flex flex-col gap-2">
          {HUD_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSection(s.id);
                setExpanded(false);
              }}
              className="min-h-[48px] rounded-lg border border-cyan-400/20 bg-black/80 px-4 py-3 font-mono text-xs uppercase tracking-wider text-cyan-300 backdrop-blur-md transition-all active:bg-cyan-500/20"
              aria-label={s.label}
            >
              <span className="mr-2 text-white/30">{s.key}</span>
              {s.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-black/80 font-mono text-lg text-cyan-400 backdrop-blur-md transition-all active:bg-cyan-500/20"
        aria-label={expanded ? 'Close menu' : 'Open menu'}
        aria-expanded={expanded}
      >
        {expanded ? '×' : '☰'}
      </button>
    </div>
  );
}
```

Do NOT modify any existing files.

### Acceptance Criteria

- `MobileHud.tsx` exists with a floating action button
- Only visible on `sm:hidden` (mobile screens)
- Expands to show section buttons with 48px touch targets
- `npm run validate` passes
