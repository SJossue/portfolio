'use client';

import type { ReactNode } from 'react';

import { useStudentSelection } from '@/lib/student-selection-store';

/**
 * The one interactive leaf a server-rendered paper card needs: a button that
 * selects (or, with `paperId={null}`, clears) the student selection. Wraps
 * server-rendered `children` — mirrors GarageSelectTrigger.
 */
export function StudentSelectTrigger({
  paperId,
  className,
  style,
  children,
}: {
  paperId: string | null;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const select = useStudentSelection((s) => s.select);
  return (
    <button type="button" onClick={() => select(paperId)} className={className} style={style}>
      {children}
    </button>
  );
}
