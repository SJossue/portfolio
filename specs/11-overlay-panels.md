# Feature: Overlay Panels

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Replace the current placeholder garage-shell overlay with a panel system that opens content panels based on `selectedSection`. Each panel slides in from the right side and can be closed with a button or the Escape key.

**User story**: As a visitor, I want to see portfolio content in a panel when I interact with a garage object so that I can learn about the engineer behind this experience.

## Context

Currently `HomeScene.tsx` renders a static garage-shell with two placeholder sections (Terminal, Projects) when `introState === 'garage'`. This spec replaces it with a dynamic panel system driven by `selectedSection` from the Zustand store.

**IMPORTANT: This spec assumes spec 10 (interactables-system) has been merged, providing `selectedSection` and `setSelectedSection` in the store.**

## Requirements

### Functional Requirements

1. The system MUST create `src/components/features/scene/OverlayPanel.tsx`
2. `OverlayPanel` MUST render a DOM overlay panel positioned on the right side of the screen (absolute positioned, ~50% width on desktop, full width on mobile)
3. `OverlayPanel` MUST accept props: `section: string`, `onClose: () => void`
4. `OverlayPanel` MUST render a close button with `aria-label="Close panel"` and `data-testid="close-panel"`
5. `OverlayPanel` MUST render section-specific content based on the `section` prop:
   - `'projects'`: heading "Projects", placeholder text "A curated selection of engineering work."
   - `'contact'`: heading "Contact", placeholder text "Get in touch for collaboration or opportunities."
   - `'about'`: heading "About", placeholder text "Engineer, builder, systems thinker."
   - Unknown section: heading with the section name in proper title case (capitalize principal words, lower-case small conjunctions/articles like "a", "the", "and", "of")
6. The system MUST update `HomeScene.tsx`:
   - Remove the old static garage-shell `<div>` (the one with `data-testid="garage-shell"`)
   - When `introState === 'garage'`, render a minimal HUD bar at the bottom with `data-testid="garage-shell"` (preserving the testid for existing E2E tests) containing three buttons: "Projects", "Contact", "About" — each sets `selectedSection` on click
   - When `selectedSection` is not null, render `<OverlayPanel section={selectedSection} onClose={() => setSelectedSection(null)} />`
7. The close button on the panel MUST call `setSelectedSection(null)`
8. Pressing Escape while a panel is open MUST close the panel (set `selectedSection` to null) instead of skipping the intro (intro is already done if panels are visible)
9. The system MUST export `OverlayPanel` from the barrel file `index.ts`
10. The system MUST add a unit test for OverlayPanel
11. The system MUST add an E2E test: click "Projects" button in HUD → panel appears with "Projects" heading → click close → panel disappears

### Non-Functional Requirements

- **Performance**: Pure DOM components, no 3D impact
- **Accessibility**: Close button is focusable, Escape key closes panel, panel has `role="dialog"` and `aria-label`
- **Mobile**: Panel is full-width on screens < 768px

## Design

### Technical Approach

**Files to create:**

1. `src/components/features/scene/OverlayPanel.tsx`
2. `src/components/features/scene/OverlayPanel.test.tsx`

**Files to modify:**

3. `src/components/features/scene/HomeScene.tsx` — replace garage-shell, add HUD + panel rendering
4. `src/components/features/scene/index.ts` — add export
5. `e2e/home.spec.ts` — add panel E2E test

**Create `src/components/features/scene/OverlayPanel.tsx`:**

```tsx
'use client';

import { useEffect } from 'react';

interface OverlayPanelProps {
  section: string;
  onClose: () => void;
}

const SECTION_CONTENT: Record<string, { heading: string; description: string }> = {
  projects: {
    heading: 'Projects',
    description: 'A curated selection of engineering work.',
  },
  contact: {
    heading: 'Contact',
    description: 'Get in touch for collaboration or opportunities.',
  },
  about: {
    heading: 'About',
    description: 'Engineer, builder, systems thinker.',
  },
};

export function OverlayPanel({ section, onClose }: OverlayPanelProps) {
  // Escape key closes the panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const content = SECTION_CONTENT[section] ?? {
    heading: section.charAt(0).toUpperCase() + section.slice(1),
    description: '',
  };

  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-white/10 bg-black/80 p-8 backdrop-blur-lg md:w-1/2"
      role="dialog"
      aria-label={content.heading}
      data-testid="overlay-panel"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{content.heading}</h2>
        <button
          onClick={onClose}
          className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Close panel"
          data-testid="close-panel"
        >
          Close
        </button>
      </div>
      <p className="text-white/60">{content.description}</p>
    </div>
  );
}
```

**Create `src/components/features/scene/OverlayPanel.test.tsx`:**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverlayPanel } from './OverlayPanel';

describe('OverlayPanel', () => {
  it('renders section heading', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByText(/curated selection/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<OverlayPanel section="projects" onClose={onClose} />);
    await userEvent.click(screen.getByTestId('close-panel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has dialog role and aria-label', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: /projects/i })).toBeInTheDocument();
  });
});
```

**Modify `HomeScene.tsx` — new content:**

```tsx
'use client';

import { useEffect } from 'react';
import { OverlayPanel } from './OverlayPanel';
import { SceneSkeleton } from './SceneSkeleton';
import { useSceneState } from './useSceneState';

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const HUD_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
];

export function HomeScene() {
  const { introState, setIntroState, selectedSection, setSelectedSection } = useSceneState();

  // Check localStorage for skip preference on mount
  useEffect(() => {
    try {
      if (localStorage.getItem('portfolio-skip-intro') === 'true') {
        setIntroState('garage');
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, [setIntroState]);

  // Check for reduced motion preference on mount
  useEffect(() => {
    if (getPrefersReducedMotion()) {
      setIntroState('garage');
    }
  }, [setIntroState]);

  // Escape key: close panel if open, otherwise skip intro
  useEffect(() => {
    if (introState === 'garage' && selectedSection !== null) return; // Panel handles its own Escape
    if (introState === 'garage') return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIntroState('garage');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introState, selectedSection, setIntroState]);

  // Persist skip preference when garage state is reached
  useEffect(() => {
    if (introState === 'garage') {
      try {
        localStorage.setItem('portfolio-skip-intro', 'true');
      } catch {
        // localStorage unavailable — ignore
      }
    }
  }, [introState]);

  return (
    <div className="relative h-screen w-full">
      <SceneSkeleton />

      {introState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            data-testid="air-out"
            onClick={() => setIntroState('airingOut')}
            className="rounded-lg bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="AIR OUT"
          >
            AIR OUT
          </button>
        </div>
      )}

      {introState === 'idle' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
          <button
            data-testid="skip-intro"
            onClick={() => setIntroState('garage')}
            className="rounded-lg bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/30"
            aria-label="Skip Intro"
          >
            Skip Intro
          </button>
        </div>
      )}

      {introState === 'garage' && (
        <>
          {/* Bottom HUD bar — preserves data-testid for E2E compatibility */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 bg-black/60 p-4 backdrop-blur-sm"
            data-testid="garage-shell"
          >
            {HUD_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
                aria-label={s.label}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Overlay panel */}
          {selectedSection && (
            <OverlayPanel section={selectedSection} onClose={() => setSelectedSection(null)} />
          )}
        </>
      )}
    </div>
  );
}
```

**Add to `e2e/home.spec.ts`:**

```typescript
test('clicking Projects in HUD opens overlay panel', async ({ page }) => {
  await page.goto('/');

  // Skip to garage
  await page.getByRole('button', { name: /skip intro/i }).click();
  await expect(page.getByTestId('garage-shell')).toBeVisible();

  // Click Projects in HUD
  await page.getByRole('button', { name: /projects/i }).click();

  // Panel opens with Projects heading
  await expect(page.getByTestId('overlay-panel')).toBeVisible();
  await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();

  // Close panel
  await page.getByTestId('close-panel').click();
  await expect(page.getByTestId('overlay-panel')).not.toBeVisible();
});
```

**Modify `index.ts`:**

Add:

```typescript
export { OverlayPanel } from './OverlayPanel';
```

## Acceptance Criteria

- [ ] Old static garage-shell div removed from HomeScene
- [ ] Bottom HUD bar renders with Projects, Contact, About buttons when in garage state
- [ ] HUD bar has `data-testid="garage-shell"` (backward-compatible with existing E2E tests)
- [ ] Clicking a HUD button sets `selectedSection` in the store
- [ ] `OverlayPanel` renders with the correct heading and description for each section
- [ ] `OverlayPanel` has `role="dialog"` and `aria-label`
- [ ] Close button on panel sets `selectedSection` to null
- [ ] Escape key closes the panel when open
- [ ] Escape key still skips intro when no panel is open and intro is not done
- [ ] `OverlayPanel.test.tsx` passes (4 tests: heading, description, close click, dialog role)
- [ ] E2E test for panel open/close passes
- [ ] All existing E2E tests still pass
- [ ] `npm run validate` passes

## Testing Strategy

- **Unit tests**: `OverlayPanel.test.tsx` — heading render, description render, close button callback, dialog role with `aria-modal`, Escape key triggers `onClose`, focus management (close button receives focus on mount)
- **E2E tests**: New test for HUD → panel → close flow; keyboard-only open/close scenario asserting ARIA presence
- **Manual**: Verify panel slide-in visual, responsive behavior on mobile viewport

## Performance Budgets

- **Bundle size impact**: < 2 KB (pure DOM component)
- **Runtime**: No 3D impact, pure React rendering

## Accessibility Checklist

- [x] Panel has `role="dialog"` and `aria-label`
- [x] Close button has `aria-label="Close panel"`
- [x] Escape key closes the panel
- [x] HUD buttons have `aria-label` attributes
- [x] Focus is not trapped (future spec could add focus management)

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                                                    | Impact | Likelihood | Mitigation                                                           |
| ------------------------------------------------------- | ------ | ---------- | -------------------------------------------------------------------- |
| Escape key conflict between intro skip and panel close  | Medium | Medium     | Conditional: panel owns Escape when open, HomeScene owns it when not |
| Existing E2E tests break if garage-shell testid removed | High   | Certain    | Spec explicitly preserves data-testid on HUD bar                     |

## Out of Scope

- Real project content (images, descriptions, links)
- Panel animation (slide-in/out transitions)
- Focus trapping inside panel
- Keyboard navigation between HUD buttons
- Camera movement to object on section select

## References

- Vision doc: "Panel slides in from the side"
- Spec 10: Interactables system provides selectedSection store

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
