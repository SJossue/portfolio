# Feature: Air-Out + Reveal Animation

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Wire the full intro cinematic sequence: clicking "AIR OUT" triggers a GSAP animation that drops the car chassis, then automatically transitions the camera to reveal the garage. The state machine drives everything: `airingOut` -> `revealing` -> `garage`.

**User story**: As a visitor, I want clicking "AIR OUT" to trigger a satisfying car-drop animation followed by a camera pullback that reveals the garage interface.

## Context

With specs 01 (state machine), 03 (GSAP), 04 (CarRig), and 05 (CameraRig) merged, we have:

- A state machine with `idle | airingOut | revealing | garage`
- GSAP installed
- `CarRig` with a `chassisRef` on the chassis group
- `CameraRig` that lerps between closeup and wide based on state

This spec wires them together: GSAP animates the chassis in CarRig, state transitions drive the camera in CameraRig, and the garage shell appears at the end.

**IMPORTANT: This spec assumes specs 01, 03, 04, and 05 have all been merged.**

## Requirements

### Functional Requirements

1. The system MUST add a GSAP timeline to `CarRig.tsx` that activates when `introState` becomes `'airingOut'`
2. The GSAP timeline MUST animate the chassis group's Y position from `0` to `-0.3` over 1.2 seconds with `power3.out` easing
3. On timeline complete, the system MUST call `setIntroState('revealing')`
4. The `CameraRig` already handles the `'revealing'` state (lerps to SHOT_WIDE) — no changes needed there
5. The system MUST add a timer or detection in `CameraRig.tsx` that transitions from `'revealing'` to `'garage'` after the camera is close to `SHOT_WIDE` (distance < 0.1)
6. The system MUST add an E2E test that verifies: click AIR OUT -> garage-shell eventually appears
7. The system MUST clean up the GSAP timeline on component unmount

### Non-Functional Requirements

- **Performance**: GSAP timeline is lightweight; one animation target
- **Accessibility**: `prefers-reduced-motion` already skips to `'garage'` (spec 01), so this animation is never triggered for those users
- **Mobile**: Same behavior on all devices

## Design

### Technical Approach

**Files to modify:**

1. `src/components/features/scene/CarRig.tsx` — add GSAP timeline
2. `src/components/features/scene/CameraRig.tsx` — add revealing -> garage transition
3. `e2e/home.spec.ts` — add air-out E2E test

**No new files needed.**

**Modify `CarRig.tsx` — add GSAP animation:**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import gsap from 'gsap';
import type { Group } from 'three';
import { useSceneState } from './useSceneState';

export function CarRig() {
  const chassisRef = useRef<Group>(null);
  const introState = useSceneState((s) => s.introState);
  const setIntroState = useSceneState((s) => s.setIntroState);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (introState !== 'airingOut') return;
    if (!chassisRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroState('revealing');
      },
    });

    tl.to(chassisRef.current.position, {
      y: -0.3,
      duration: 1.2,
      ease: 'power3.out',
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [introState, setIntroState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <group position={[0, 0.5, 0]}>
      {/* Chassis — GSAP animates this group's Y position */}
      <group ref={chassisRef}>
        <Box args={[2, 1, 4]} position={[0, 0, 0]}>
          <meshStandardMaterial color="lightblue" />
        </Box>
      </group>

      {/* Wheels — stay at fixed height */}
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
    </group>
  );
}
```

**Modify `CameraRig.tsx` — add revealing -> garage transition:**

Add distance check inside `useFrame`. When `introState` is `'revealing'` and camera is within 0.1 of `SHOT_WIDE.position`, transition to `'garage'`:

```tsx
'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useSceneState } from './useSceneState';

const SHOT_CLOSEUP = {
  position: new Vector3(1.5, 0.8, 3),
  lookAt: new Vector3(0, 0.3, 0),
};

const SHOT_WIDE = {
  position: new Vector3(0, 2.5, 7),
  lookAt: new Vector3(0, 0.5, 0),
};

const LERP_FACTOR = 0.02;
const ARRIVAL_THRESHOLD = 0.1;

export function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef(SHOT_CLOSEUP.lookAt.clone());
  const introState = useSceneState((s) => s.introState);
  const setIntroState = useSceneState((s) => s.setIntroState);

  useFrame(() => {
    const target = introState === 'revealing' || introState === 'garage' ? SHOT_WIDE : SHOT_CLOSEUP;

    camera.position.lerp(target.position, LERP_FACTOR);
    lookAtTarget.current.lerp(target.lookAt, LERP_FACTOR);
    camera.lookAt(lookAtTarget.current);

    // Transition from revealing to garage when camera arrives
    if (introState === 'revealing') {
      const distance = camera.position.distanceTo(SHOT_WIDE.position);
      if (distance < ARRIVAL_THRESHOLD) {
        setIntroState('garage');
      }
    }
  });

  return null;
}
```

**Add to `e2e/home.spec.ts` — new test after existing tests:**

```typescript
test('air out triggers animation and shows garage shell', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /air out/i }).click();

  // Garage shell should appear after animation completes
  // Animation takes ~1.2s (air out) + camera lerp time
  await expect(page.getByTestId('garage-shell')).toBeVisible({ timeout: 10000 });
});
```

## Acceptance Criteria

- [ ] Clicking "AIR OUT" sets state to `'airingOut'` and triggers GSAP chassis animation
- [ ] Chassis Y position animates from 0 to -0.3 over 1.2s with power3.out easing
- [ ] After animation completes, state transitions to `'revealing'`
- [ ] During `'revealing'`, camera lerps toward SHOT_WIDE
- [ ] When camera arrives at SHOT_WIDE (distance < 0.1), state transitions to `'garage'`
- [ ] Garage shell becomes visible when state is `'garage'`
- [ ] GSAP timeline is cleaned up on unmount
- [ ] Full flow works end-to-end: AIR OUT click -> car drops -> camera pulls back -> garage shell visible
- [ ] `prefers-reduced-motion` users skip directly to `'garage'` (no animation)
- [ ] E2E test for air-out flow passes
- [ ] `npm run validate` passes (lint, typecheck, test, build, e2e)

## Testing Strategy

- **Unit tests**: Existing CarRig and CameraRig tests should still pass (mocked deps)
- **E2E tests**: New test verifies AIR OUT -> garage-shell visible flow with generous timeout

## Performance Budgets

- **Bundle size impact**: +~28 KB gzipped (first GSAP import in the bundle)
- **Runtime**: One GSAP tween (single target, 1.2s) — negligible

## Accessibility Checklist

- [x] `prefers-reduced-motion` bypasses animation entirely (spec 01)
- [x] Button labels and ARIA unchanged
- [x] No flashing or rapid movement (smooth ease)

## Dependencies

- `gsap` (already installed by spec 03)

## Risks & Mitigations

| Risk                                | Impact | Likelihood | Mitigation                                                                        |
| ----------------------------------- | ------ | ---------- | --------------------------------------------------------------------------------- |
| GSAP + R3F ref timing               | Medium | Medium     | useEffect fires after render when ref is attached; guard with null check          |
| Camera lerp never reaches threshold | Low    | Low        | LERP_FACTOR 0.02 is slow but approaches asymptotically; 0.1 threshold is generous |
| E2E timeout on slow CI              | Low    | Low        | 10s timeout is generous for 1.2s animation + camera lerp                          |

## Out of Scope

- Garage environment objects
- Interactable objects
- Overlay panels
- Post-processing effects
- Sound effects

## References

- GSAP docs: gsap.timeline(), gsap.to()
- Three.js Vector3.distanceTo()
- Spec 01: state machine
- Spec 05: CameraRig presets

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
