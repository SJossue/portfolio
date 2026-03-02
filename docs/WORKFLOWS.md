# Workflows — How to Add Features

This document provides step-by-step workflows for common development tasks. Follow these to maintain consistency and avoid common mistakes.

**Also see:**

- [AGENTS.md](./AGENTS.md) - Agent operating rules
- [ARCHITECTURE.md](./ARCHITECTURE.md) - File structure and boundaries
- [PROJECT.md](./PROJECT.md) - Performance budgets and constraints

---

## Add a New Feature (Standard Workflow)

**Use this for any new user-facing feature.**

1. **Create a spec**: `specs/<feature-name>.md`
   - Use [specs/template.md](../specs/template.md) as starting point
   - Define goal, requirements, acceptance criteria, tests
   - Get spec reviewed/approved if high-risk

2. **Create a branch**: `feat/<feature-name>`

   ```bash
   git checkout -b feat/skip-intro-button
   ```

3. **Implement on the branch**
   - Follow [ARCHITECTURE.md](./ARCHITECTURE.md) for file placement
   - Add feature components in `src/components/features/<feature>/`
   - Add UI primitives in `src/components/ui/` if reusable
   - Keep `page.tsx` files thin

4. **Add/update tests**
   - Unit tests for components/logic (Vitest + RTL)
   - E2E tests for user flows (Playwright)
   - Accessibility tests (keyboard nav, ARIA)

5. **Run validation**

   ```bash
   npm run validate  # or: just ci
   ```

6. **Open PR with risk label + evidence**
   - Use [PR template](../.github/pull_request_template.md)
   - Include screenshots/video if UI changed
   - Add link to spec
   - Mark risk level: 🟢 low | 🟡 medium | 🔴 high
   - Paste validation output

7. **Merge after CI passes + review**

---

## Add a New Route

**When adding a new page/route to the app.**

1. **Create route file**: `src/app/<route>/page.tsx`

   ```tsx
   // src/app/about/page.tsx
   import type { Metadata } from 'next';
   import { AboutHero } from '@/components/features/about/AboutHero';

   export const metadata: Metadata = {
     title: 'About',
     description: 'About me and my work',
   };

   export default function AboutPage() {
     return <AboutHero />;
   }
   ```

2. **Add metadata export** (SEO)
   - Include `title`, `description`, `openGraph` as needed

3. **Compose page with `ui` and `features` components**
   - Keep `page.tsx` thin (no logic, just composition)
   - Move logic into `src/components/features/`

4. **Add tests**:
   - Unit test for route logic or critical rendering (if any)
   - E2E test if route is primary user flow

5. **Run validation**:
   ```bash
   npm run validate
   ```

---

## Add a UI Primitive

**When adding a reusable presentational component (button, card, input, etc.).**

1. **Create component in `src/components/ui/`**

   ```tsx
   // src/components/ui/Button.tsx
   import type { ButtonHTMLAttributes } from 'react';
   import { cn } from '@/lib/cn';

   interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary';
   }

   export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
     return (
       <button
         className={cn(
           'rounded px-4 py-2',
           variant === 'primary' && 'bg-blue-500 text-white',
           variant === 'secondary' && 'bg-gray-200 text-black',
           className,
         )}
         {...props}
       />
     );
   }
   ```

2. **Keep it presentational and prop-driven**
   - No business logic, no data fetching, no route knowledge
   - Accept data via props

3. **Add tests** in colocated `*.test.tsx`

   ```tsx
   // src/components/ui/Button.test.tsx
   import { render, screen } from '@testing-library/react';
   import { Button } from './Button';

   describe('Button', () => {
     it('renders children', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
     });
   });
   ```

4. **Ensure accessibility**:
   - Semantic HTML (`<button>`, not `<div role="button">`)
   - Keyboard support (native for buttons)
   - Visible focus indicators

5. **Run quick validation**:
   ```bash
   npm run lint && npm run test
   ```

---

## Add a Domain Feature Module

**When adding a feature-specific component (3D scene, terminal, hero section, etc.).**

1. **Create feature directory**: `src/components/features/<feature>/`

   ```
   src/components/features/scene/
   ├── SceneSkeleton.tsx
   ├── SceneSkeleton.test.tsx
   ├── useSceneState.ts
   └── scene-utils.ts
   ```

2. **Organize related files**:
   - Main component: `SceneSkeleton.tsx`
   - Custom hooks: `useSceneState.ts`
   - Utils: `scene-utils.ts`
   - Tests: `SceneSkeleton.test.tsx`

3. **Can import from `ui/` but not vice versa**
   - Features can use UI primitives
   - UI primitives cannot import features

4. **Can have state, effects, data fetching**

   ```tsx
   // src/components/features/scene/SceneSkeleton.tsx
   'use client';

   import { useState } from 'react';
   import { Button } from '@/components/ui/Button';

   export function SceneSkeleton() {
     const [isPlaying, setIsPlaying] = useState(false);
     // ... domain logic here
   }
   ```

5. **Add tests**:
   - Component tests for behavior
   - Hook tests if custom hooks
   - E2E tests for critical flows

---

## Add/Modify 3D Scene

**When working with 3D assets, models, or R3F components.**

1. **Scene logic goes in**: `src/components/features/scene/**`

2. **Assets go in**: `public/models/**`
   - Prefer **GLB** format (binary, compressed)
   - Use **Draco compression** for geometry
   - Document model specs (triangle count, texture sizes) in spec or ADR

3. **Respect budgets** (see [PROJECT.md](./PROJECT.md)):
   - GLB ≤ 2 MB per model
   - Triangles ≤ 100k mobile, ≤ 250k desktop
   - Textures ≤ 2048×2048

4. **Must include fallbacks**:
   - Reduced motion: static or simplified animation
   - Low power: fallback hero image or simplified route
   - No WebGL 2: graceful degradation message

5. **Lazy-load with Suspense**:

   ```tsx
   import { Suspense } from 'react';
   import { Canvas } from '@react-three/fiber';

   export function Scene() {
     return (
       <Suspense fallback={<LoadingSpinner />}>
         <Canvas>{/* 3D content */}</Canvas>
       </Suspense>
     );
   }
   ```

6. **Test performance**:
   - Maintain 60fps on target devices
   - Check LCP/CLS in preview deployment
   - Test on real mobile device if possible

---

## Add a New Animation/Motion

**When adding animations, transitions, or motion effects.**

1. **Define UX reason** in PR description
   - Why is this motion needed?
   - What problem does it solve?

2. **Provide reduced-motion fallback**

   ```tsx
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   <div className={prefersReducedMotion ? 'opacity-100' : 'animate-fade-in'}>{/* content */}</div>;
   ```

3. **Keep animation localized to feature boundaries**
   - Don't add global animations without ADR
   - Prefer CSS transitions/animations over JS when possible

4. **Test performance impact**:
   - Check on mobile viewport
   - Ensure 60fps maintained
   - Validate no layout shift (CLS) regressions

5. **Respect budgets**:
   - No heavy animation libraries without ADR (prefer GSAP for 3D)
   - Bundle size impact must be justified

---

## Add Analytics (Future)

**Placeholder workflow for when analytics are needed.**

1. **Create ADR** describing:
   - Provider choice (e.g., Vercel Analytics, Plausible, custom)
   - Data governance and privacy policy
   - GDPR/consent requirements

2. **Add analytics adapter** in `src/lib/analytics/`
   - Avoid vendor lock-in
   - Abstract tracking calls

3. **Gate by environment and consent**:

   ```tsx
   if (process.env.NODE_ENV === 'production' && userConsent) {
     trackEvent('page_view');
   }
   ```

4. **Add event naming conventions** in `docs/`

5. **Add tests/mocks** for instrumentation calls

---

## Emergency: Rollback a PR

**If a merged PR causes production issues.**

1. **Revert the merge commit**:

   ```bash
   git revert -m 1 <merge-commit-sha>
   git push origin main
   ```

2. **Open revert PR** with:
   - Explanation of the issue
   - Link to original PR
   - Plan to fix and re-land

3. **Fix the issue** on a new branch, re-open PR with fixes

---

**For agent-specific stop rules and failure protocols, see [AGENTS.md](./AGENTS.md).**
