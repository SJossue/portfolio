# Architecture Overview

## Goals

- Keep route architecture simple and scalable
- Separate reusable UI primitives from feature-specific composition
- Make repository structure obvious for humans and coding agents
- Preserve performance and accessibility by default
- Enable low-oversight agent-driven development

## High-Level Structure

```
src/
├── app/              # Next.js App Router (routing only)
├── components/
│   ├── ui/           # Presentational primitives (no domain logic)
│   └── features/     # Domain-specific components
├── lib/              # Framework-agnostic utilities
├── styles/           # Global styles
├── content/          # Content source of truth
└── types/            # Shared TypeScript types
```

## Routing (`src/app/**`)

**Purpose**: Define routes and page-level composition using Next.js App Router.

**Rules**:

- All routes live in `src/app/**`
- Route-level components (`page.tsx`) should be **thin**
- Move logic into `src/components/features/**`
- Use Server Components by default
- Add `"use client"` directive only when necessary (interactivity, hooks, browser APIs)

**Example**:

```tsx
// src/app/page.tsx - GOOD (thin, delegates to features)
import { Hero } from '@/components/features/hero/Hero';

export default function HomePage() {
  return <Hero />;
}

// src/app/page.tsx - BAD (too much logic in route)
export default function HomePage() {
  const [state, setState] = useState(/* ... */);
  // ... complex logic here ...
  return <div>{/* ... */}</div>;
}
```

## Components (`src/components/**`)

### UI Primitives (`src/components/ui/**`)

**Purpose**: Reusable presentational components with no domain logic.

**Rules**:

- Must be **framework-agnostic** in spirit (could work in any React app)
- No business logic, no data fetching, no route knowledge
- Accept data via props
- Examples: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Badge.tsx`

**Example**:

```tsx
// src/components/ui/Button.tsx - GOOD
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

// src/components/ui/CheckoutButton.tsx - BAD (domain-specific)
export function CheckoutButton() {
  const cart = useCart(); // ❌ domain logic in UI primitive
  return <button onClick={cart.checkout}>Checkout</button>;
}
```

### Feature Components (`src/components/features/**`)

**Purpose**: Domain-specific components tied to business logic.

**Rules**:

- Organize by feature/domain: `features/scene/`, `features/terminal/`, `features/hero/`
- Can import from `ui/` but not vice versa
- Can have state, effects, data fetching
- Colocate related files (hooks, utils, tests) within feature folder

**Example structure**:

```
src/components/features/
├── scene/
│   ├── SceneSkeleton.tsx
│   ├── SceneSkeleton.test.tsx
│   ├── useSceneState.ts
│   └── scene-utils.ts
└── hero/
    ├── Hero.tsx
    ├── Hero.test.tsx
    └── hero-constants.ts
```

## Utilities (`src/lib/**`)

**Purpose**: Framework-agnostic helpers, configuration, constants.

**Rules**:

- Pure functions preferred
- No React/Next.js dependencies where possible
- Examples: `cn.ts` (classname helper), `format-date.ts`, `api-client.ts`
- Config files: `config.ts`, `constants.ts`

**Example**:

```tsx
// src/lib/cn.ts - GOOD
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 3D Assets (`public/models/**`)

**Purpose**: Store optimized 3D models and textures.

**Rules**:

- All 3D assets go in `public/models/**`
- **Never commit raw unoptimized models > 10 MB** unless explicitly marked as temporary
- Prefer **GLB** format (binary, compressed)
- Use Draco compression where applicable
- Document model specs in ADR if significant (triangle count, texture sizes)

## Testing Strategy

### Unit/Integration Tests (Vitest + Testing Library)

- **Location**: Colocate as `*.test.ts(x)` near target module
- **Scope**: Component behavior, utility functions, hooks
- **Run**: `npm run test` or `just check`

### End-to-End Tests (Playwright)

- **Location**: `e2e/**/*.spec.ts`
- **Scope**: Critical user flows, smoke tests
- **Run**: `npm run e2e` or `just e2e`

### CI Gates

Every PR must pass:

1. `npm run lint` - ESLint with 0 warnings
2. `npm run typecheck` - TypeScript strict mode
3. `npm run test` - Unit/integration tests
4. `npm run build` - Production build
5. `npm run e2e` - End-to-end smoke tests

**Single command**: `npm run validate` or `just ci`

## Why This Split?

- **App Router**: Keeps routing and layout concerns centralized
- **UI vs Features**: Prevents business logic from leaking into primitives
- **lib/**: Isolates utility logic for easier testing and reuse
- **Dedicated docs + ADRs**: Provide durable context for agentic workflows

## Evolution Strategy

1. **Feature modules**: Add incrementally under `src/components/features/`
2. **Content model**: Introduce in `src/content/` before integrating CMS
3. **3D/Motion**: Evaluate in isolated boundaries with explicit performance checks
4. **State management**: Add Zustand only when server state insufficient (document in ADR)

## Anti-Patterns to Avoid

❌ Putting business logic in `ui/` components
❌ Deep nesting in `features/` (keep flat or one level deep)
❌ Importing `features/` from `ui/` (one-way dependency)
❌ Large `page.tsx` files (delegate to features)
❌ Unoptimized 3D assets in production

---

**For agent-specific rules, see [AGENTS.md](./AGENTS.md)**
