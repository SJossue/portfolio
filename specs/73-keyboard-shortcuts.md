# UI: Keyboard shortcut hints on HUD bar

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Add small keyboard shortcut hints (1-4) next to each HUD button so power users know they can press number keys to navigate.

### Files to create (ONLY these files):

1. `src/components/features/scene/KeyboardShortcuts.tsx` — NEW file

### Instructions

Create `src/components/features/scene/KeyboardShortcuts.tsx` with this EXACT content:

```tsx
'use client';

import { useEffect } from 'react';
import { useSceneState } from './useSceneState';

const SHORTCUT_MAP: Record<string, string> = {
  '1': 'projects',
  '2': 'experience',
  '3': 'contact',
  '4': 'about',
};

export function KeyboardShortcuts() {
  const introState = useSceneState((s) => s.introState);
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  useEffect(() => {
    if (introState !== 'garage') return;
    if (selectedSection !== null) return;

    function handleKeyDown(e: KeyboardEvent) {
      const section = SHORTCUT_MAP[e.key];
      if (section) {
        setSelectedSection(section);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introState, selectedSection, setSelectedSection]);

  return null;
}
```

Do NOT modify any existing files.

### Acceptance Criteria

- `KeyboardShortcuts.tsx` exists as a new component
- Pressing 1-4 opens the corresponding section when in garage state and no panel is open
- Does nothing when panel is open or not in garage state
- `npm run validate` passes
