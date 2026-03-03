# Feature: Interactables System

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Add interactive 3D objects to the garage scene that users can hover and click to open content sections. Expand the Zustand store with `selectedSection` state. Each object maps to a portfolio section (Projects, Contact, About).

**User story**: As a visitor, I want to click objects in the garage to explore different sections of the portfolio so that navigating the site feels like interacting with a real workshop.

## Context

The vision calls for the garage to BE the interface — instead of navbar links, users interact with 3D objects. This spec adds three placeholder interactable objects (simple Box geometry with labels) and the store expansion to track which section is selected. Overlay panels that display content will be a separate spec.

**IMPORTANT: This spec assumes specs 07, 08, and 09 have been merged.**

## Requirements

### Functional Requirements

1. The system MUST add `selectedSection` and `setSelectedSection` to `useSceneState.ts`:
   - `selectedSection: string | null` (initially `null`)
   - `setSelectedSection: (section: string | null) => void`
2. `setSelectedSection` MUST only work when `interactionLocked` is `false` (i.e., `introState === 'garage'`)
3. The system MUST create `src/components/features/scene/Interactable.tsx` — a reusable R3F component for a single clickable 3D object
4. `Interactable` MUST accept props: `id: string`, `label: string`, `section: string`, `position: [number, number, number]`, `color: string`
5. `Interactable` MUST render a `<Box>` with the given color and position
6. `Interactable` MUST show a hover effect: on `onPointerOver`, increase emissive intensity; on `onPointerOut`, reset it
7. `Interactable` MUST change the cursor to `pointer` on hover and back to `default` on pointer out
8. `Interactable` MUST call `setSelectedSection(section)` on click
9. The system MUST create `src/components/features/scene/GarageInteractables.tsx` — a group of three interactable objects:
   - Workbench: position `[-4, 0.75, -3]`, color `#8B4513`, section `'projects'`
   - Monitor: position `[4, 2, -7]`, color `#333333`, section `'contact'`
   - Toolboard: position `[-9, 2.5, -2]`, color `#444444`, section `'about'`
10. The system MUST update `SceneSkeleton.tsx` to include `<GarageInteractables />`
11. `GarageInteractables` MUST only render when `introState === 'garage'` (check inside the component, not in SceneSkeleton)
12. The system MUST export both components from the barrel file `index.ts`
13. The system MUST add unit tests for both components
14. The system MUST add an E2E test that verifies clicking a 3D object is NOT feasible (3D clicks can't be tested in Playwright reliably) — instead, add a DOM-based test that verifies the store's `selectedSection` behavior indirectly through the overlay panel (deferred to spec 11)

### Non-Functional Requirements

- **Performance**: 3 additional Box meshes — negligible
- **Accessibility**: 3D objects are not keyboard-navigable (this is acceptable; keyboard users will have alternative DOM-based navigation added in a future spec)

## Design

### Technical Approach

**Files to create:**

1. `src/components/features/scene/Interactable.tsx`
2. `src/components/features/scene/Interactable.test.tsx`
3. `src/components/features/scene/GarageInteractables.tsx`
4. `src/components/features/scene/GarageInteractables.test.tsx`

**Files to modify:**

5. `src/components/features/scene/useSceneState.ts` — add selectedSection
6. `src/components/features/scene/SceneSkeleton.tsx` — add GarageInteractables
7. `src/components/features/scene/index.ts` — add exports

**Modify `useSceneState.ts` — new content:**

```typescript
import { create } from 'zustand';

type IntroState = 'idle' | 'airingOut' | 'revealing' | 'garage';

interface SceneState {
  introState: IntroState;
  interactionLocked: boolean;
  selectedSection: string | null;
  setIntroState: (state: IntroState) => void;
  setSelectedSection: (section: string | null) => void;
}

export const useSceneState = create<SceneState>((set, get) => ({
  introState: 'idle',
  interactionLocked: true,
  selectedSection: null,
  setIntroState: (introState) =>
    set({
      introState,
      interactionLocked: introState !== 'garage',
    }),
  setSelectedSection: (section) => {
    if (get().interactionLocked) return;
    set({ selectedSection: section });
  },
}));
```

**Create `src/components/features/scene/Interactable.tsx`:**

```tsx
'use client';

import { useRef, useState } from 'react';
import { Box } from '@react-three/drei';
import type { Mesh } from 'three';
import { useSceneState } from './useSceneState';

interface InteractableProps {
  id: string;
  label: string;
  section: string;
  position: [number, number, number];
  color: string;
}

export function Interactable({ id, label, section, position, color }: InteractableProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  return (
    <Box
      ref={meshRef}
      args={[1.5, 1.5, 1.5]}
      position={position}
      onClick={() => setSelectedSection(section)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      data-testid={`interactable-${id}`}
    >
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0} />
    </Box>
  );
}
```

**Create `src/components/features/scene/GarageInteractables.tsx`:**

```tsx
'use client';

import { Interactable } from './Interactable';
import { useSceneState } from './useSceneState';

const INTERACTABLES = [
  {
    id: 'workbench',
    label: 'Workbench',
    section: 'projects',
    position: [-4, 0.75, -3] as [number, number, number],
    color: '#8B4513',
  },
  {
    id: 'monitor',
    label: 'Monitor',
    section: 'contact',
    position: [4, 2, -7] as [number, number, number],
    color: '#333333',
  },
  {
    id: 'toolboard',
    label: 'Tool Board',
    section: 'about',
    position: [-9, 2.5, -2] as [number, number, number],
    color: '#444444',
  },
] as const;

export function GarageInteractables() {
  const introState = useSceneState((s) => s.introState);

  if (introState !== 'garage') return null;

  return (
    <group>
      {INTERACTABLES.map((item) => (
        <Interactable
          key={item.id}
          id={item.id}
          label={item.label}
          section={item.section}
          position={[...item.position]}
          color={item.color}
        />
      ))}
    </group>
  );
}
```

**Create `src/components/features/scene/Interactable.test.tsx`:**

```tsx
import { render } from '@testing-library/react';

vi.mock('@react-three/drei', () => ({
  Box: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { setSelectedSection: () => void }) => unknown) =>
    selector({ setSelectedSection: vi.fn() }),
}));

import { Interactable } from './Interactable';

describe('Interactable', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Interactable
        id="test"
        label="Test"
        section="projects"
        position={[0, 0, 0]}
        color="#ff0000"
      />,
    );
    expect(container).toBeTruthy();
  });
});
```

**Create `src/components/features/scene/GarageInteractables.test.tsx`:**

```tsx
import { render } from '@testing-library/react';

vi.mock('@react-three/drei', () => ({
  Box: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (
    selector: (s: { introState: string; setSelectedSection: () => void }) => unknown,
  ) => selector({ introState: 'garage', setSelectedSection: vi.fn() }),
}));

import { GarageInteractables } from './GarageInteractables';

describe('GarageInteractables', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageInteractables />);
    expect(container).toBeTruthy();
  });
});
```

**Modify `SceneSkeleton.tsx` — add GarageInteractables:**

Add import:

```tsx
import { GarageInteractables } from './GarageInteractables';
```

Add `<GarageInteractables />` inside the Canvas, after `<CarRig />`:

```tsx
<CameraRig />
<CarRig />
<GarageInteractables />
<OrbitControls ... />
```

**Modify `index.ts`:**

```typescript
export { CameraRig } from './CameraRig';
export { CarRig } from './CarRig';
export { GarageEnvironment } from './GarageEnvironment';
export { GarageInteractables } from './GarageInteractables';
export { Interactable } from './Interactable';
export { SceneSkeleton } from './SceneSkeleton';
export { useSceneState } from './useSceneState';
export { HomeScene } from './HomeScene';
```

## Acceptance Criteria

- [ ] `selectedSection` exists in the Zustand store, initially `null`
- [ ] `setSelectedSection` is a no-op when `interactionLocked` is `true`
- [ ] `setSelectedSection` updates `selectedSection` when `interactionLocked` is `false`
- [ ] `Interactable` component renders a Box at the given position with the given color
- [ ] `Interactable` shows emissive glow on hover
- [ ] `Interactable` changes cursor to pointer on hover
- [ ] `Interactable` calls `setSelectedSection` on click
- [ ] `GarageInteractables` renders three interactable objects
- [ ] `GarageInteractables` returns null when `introState !== 'garage'`
- [ ] All unit tests pass
- [ ] `npm run validate` passes

## Testing Strategy

- **Unit tests**: Smoke tests for Interactable and GarageInteractables
- **E2E tests**: No new E2E tests (3D pointer events can't be reliably tested in Playwright; DOM-based E2E for panels will be in spec 11)

## Performance Budgets

- **Bundle size impact**: < 1 KB
- **Runtime**: 3 additional Box meshes, negligible

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                          | Impact | Likelihood | Mitigation                                                                                       |
| ----------------------------- | ------ | ---------- | ------------------------------------------------------------------------------------------------ |
| R3F pointer events not firing | Medium | Low        | R3F has built-in raycasting for onClick/onPointer\* on meshes                                    |
| data-testid on R3F component  | Low    | Medium     | R3F passes unknown props to the underlying Three.js object — data-testid may be ignored silently |

## Out of Scope

- Overlay panels (spec 11)
- Real geometry (detailed workbench, monitor models)
- Tooltip labels floating above objects
- Camera preset per object
- Keyboard-accessible alternative navigation

## References

- Vision doc: "click toolbench → Projects, click wall monitor → Contact"
- Spec 09: GarageEnvironment provides the walls/floor context

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
