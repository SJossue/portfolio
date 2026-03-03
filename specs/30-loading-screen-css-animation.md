# Feature: Sliding Loading Bar Animation

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Replace the `animate-pulse` on the loading bar with a smooth left-to-right sliding animation using a custom Tailwind keyframe. This looks more like a real loading indicator.

### Files to modify (ONLY these files):

1. `tailwind.config.ts` — add custom keyframe and animation
2. `src/components/features/scene/SceneSkeleton.tsx` — use the new animation class

### Instructions:

**Modify `tailwind.config.ts`:**

Find the `extend` object and add `keyframes` and `animation` properties. The full `extend` block should become:

```typescript
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'slide-lr': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        'slide-lr': 'slide-lr 1.5s ease-in-out infinite',
      },
```

**Modify `SceneSkeleton.tsx`:**

In the `SceneLoader` function, find this line:

```tsx
<div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 motion-reduce:animate-none" />
```

Replace it with:

```tsx
<div className="animate-slide-lr h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 motion-reduce:animate-none" />
```

Do NOT change anything else.

### Acceptance Criteria

- Loading bar slides left-to-right instead of pulsing
- `motion-reduce:animate-none` still stops animation for reduced motion
- Custom `slide-lr` keyframe and animation defined in `tailwind.config.ts`
- `npm run validate` passes
