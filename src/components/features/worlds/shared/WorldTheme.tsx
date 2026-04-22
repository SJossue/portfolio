'use client';

import { worlds } from '@/content/worlds';

interface WorldThemeProps {
  worldId: string;
  children: React.ReactNode;
}

export default function WorldTheme({ worldId, children }: WorldThemeProps) {
  const world = worlds.find((w) => w.id === worldId);

  if (!world) return <>{children}</>;

  return (
    <div
      style={
        {
          '--world-color': world.color,
          '--world-color-rgb': world.colorRgb,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
