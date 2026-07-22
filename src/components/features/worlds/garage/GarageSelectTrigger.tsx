'use client';

import type { ReactNode } from 'react';

import { useGarageSelection } from '@/lib/garage-selection-store';

/**
 * The one interactive leaf a server-rendered card/nav item needs: a button that
 * selects (or, with `projectId={null}`, clears) the garage selection. Wraps
 * server-rendered `children` — this is what lets the project cards, nav list, and
 * detail body stay server components while still being clickable.
 */
export function GarageSelectTrigger({
  projectId,
  className,
  style,
  children,
}: {
  projectId: string | null;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const select = useGarageSelection((s) => s.select);
  return (
    <button type="button" onClick={() => select(projectId)} className={className} style={style}>
      {children}
    </button>
  );
}
