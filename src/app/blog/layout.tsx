import 'highlight.js/styles/github-dark.css';

import type { ReactNode } from 'react';

import HubBackground from '@/components/features/hub/trifold/HubBackground';

/** Shared blog chrome: the site wallpaper background + accent, behind a
 *  readable centered column. The highlight.js theme is imported here so it only
 *  loads for blog routes. */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-dvh bg-[#07070b] text-white"
      style={{ '--world-color-rgb': '34, 211, 238' } as React.CSSProperties}
    >
      <HubBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
