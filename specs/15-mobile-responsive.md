# Feature: Mobile Responsive Panels & HUD

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

---

## Overview

Improve the mobile responsiveness of the HUD navigation bar and overlay panels to ensure a good experience on phones and tablets.

**User story**: As a mobile visitor, I want the navigation and content panels to be properly sized and usable on my phone so I can explore the portfolio.

## Requirements

### Functional Requirements

1. The HUD bar MUST stack vertically on screens narrower than 640px (`sm` breakpoint).
2. The HUD bar buttons MUST be touch-friendly (minimum 44x44px tap target).
3. The overlay panel MUST be full-width on mobile (`w-full`) and half-width on desktop (`md:w-1/2`).
4. The overlay panel content MUST be scrollable on mobile.
5. The close button MUST be easily reachable on mobile (top-right, minimum 44x44px).

### Non-Functional Requirements

- **No new dependencies**: Tailwind responsive utilities only.
- **Performance**: No JavaScript for responsive behavior — CSS only.
- **Accessibility**: Touch targets meet WCAG 2.5.5 (44x44px minimum).

## Technical Approach

### Modified Files

| File                                             | Change                                                  |
| ------------------------------------------------ | ------------------------------------------------------- |
| `src/components/features/scene/HomeScene.tsx`    | Update HUD bar classes for responsive layout            |
| `src/components/features/scene/OverlayPanel.tsx` | Update panel and close button classes for mobile sizing |

### Implementation Details

**`HomeScene.tsx`** — HUD bar responsive changes:

Find the `garage-shell` div and update its className. Currently:

```
className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 bg-black/60 p-4 backdrop-blur-sm"
```

Change to:

```
className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/60 p-3 backdrop-blur-sm sm:flex-row sm:gap-4 sm:p-4"
```

Find the HUD button className. Currently:

```
className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

Change to:

```
className="min-h-[44px] min-w-[44px] rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
```

**`OverlayPanel.tsx`** — panel responsive changes:

Find the panel div className. Currently:

```
className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-white/10 bg-black/80 p-8 backdrop-blur-lg md:w-1/2"
```

Change to:

```
className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-white/10 bg-black/80 p-4 backdrop-blur-lg sm:p-8 md:w-1/2"
```

Find the close button className. Currently:

```
className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/60 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
```

Change to:

```
className="min-h-[44px] min-w-[44px] rounded-lg bg-white/10 px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
```

Add `overflow-y-auto` to the panel content area. Find the `<p>` tag that shows description and wrap it (or add to the panel's flex-col) so content scrolls:

After the header div (`mb-6 flex items-center justify-between`), add `overflow-y-auto` to the remaining content area. The simplest way: add a wrapper div around the `<p>` with `className="flex-1 overflow-y-auto"`.

**IMPORTANT CONSTRAINTS for the agent:**

- Only modify `HomeScene.tsx` and `OverlayPanel.tsx`.
- Only change className strings — do NOT modify component logic, state, or event handlers.
- Do NOT add any new npm dependencies.
- Do NOT modify any test files (className changes don't affect test assertions).
- Do NOT modify any config files.
- Run `npm run validate` after changes. If it fails, fix and retry (max 3 attempts).

## Acceptance Criteria

- [ ] HUD bar stacks vertically on narrow screens
- [ ] HUD buttons have min 44x44px tap target
- [ ] Panel is full-width on mobile, half-width on md+
- [ ] Panel padding is reduced on mobile (p-4 vs p-8)
- [ ] Close button has min 44x44px tap target
- [ ] Panel content scrolls when overflowing
- [ ] `npm run validate` passes
- [ ] Only `HomeScene.tsx` and `OverlayPanel.tsx` modified

## Testing Strategy

- **E2E**: Existing tests still pass (no logic changes)
- **Manual**: Resize browser to verify responsive behavior

## Out of Scope

- Touch gesture support (swipe to close panel)
- Responsive 3D scene adjustments
- Landscape-specific layouts
- Bottom sheet pattern for mobile panels
