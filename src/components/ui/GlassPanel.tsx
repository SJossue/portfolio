import { createElement, type ElementType, type ReactNode } from 'react';

interface GlassPanelProps {
  /** Extra Tailwind classes for layout (grid, padding, sizing). */
  className?: string;
  /** Adds the per-world accent edge ring (reads --world-color-rgb). */
  accent?: boolean;
  /** Render as a different element (e.g. 'section', 'aside'). Defaults to div. */
  as?: ElementType;
  /** Accessible label for landmark elements. */
  'aria-label'?: string;
  children?: ReactNode;
}

/**
 * visionOS "liquid glass" surface — a stronger, framework-agnostic variant of
 * the `.glass-card` primitive. Visuals live in the `.glass-panel` class in
 * globals.css; layout is supplied by the caller via `className`.
 */
export function GlassPanel({
  className = '',
  accent = false,
  as = 'div',
  children,
  ...rest
}: GlassPanelProps) {
  const accentClass = accent ? ' glass-panel--accent' : '';
  return createElement(
    as,
    { className: `glass-panel${accentClass} ${className}`, ...rest },
    children,
  );
}
