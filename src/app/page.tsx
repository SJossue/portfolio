'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ScrollPortfolio } from '@/components/features/portfolio';

const HomeScene = dynamic(
  () =>
    import('@/components/features/scene/HomeScene').then((m) => ({
      default: m.HomeScene,
    })),
  { ssr: false },
);

export default function Home() {
  const [viewMode, setViewMode] = useState<'scroll' | '3d'>('scroll');
  const scrollPosRef = useRef(0);

  const enter3D = () => {
    scrollPosRef.current = window.scrollY;
    setViewMode('3d');
  };

  const exit3D = () => {
    setViewMode('scroll');
    requestAnimationFrame(() => window.scrollTo(0, scrollPosRef.current));
  };

  return (
    <main id="main-content" className={viewMode === '3d' ? 'mode-3d' : ''}>
      {viewMode === 'scroll' && <ScrollPortfolio onEnter3D={enter3D} />}
      {viewMode === '3d' && <HomeScene onExit3D={exit3D} />}
    </main>
  );
}
