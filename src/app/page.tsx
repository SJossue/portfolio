'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ScrollPortfolio } from '@/components/features/portfolio';
import { CircuitIntro } from '@/components/features/portfolio/CircuitIntro';

const HomeScene = dynamic(
  () =>
    import('@/components/features/scene/HomeScene').then((m) => ({
      default: m.HomeScene,
    })),
  { ssr: false },
);

export default function Home() {
  const [viewMode, setViewMode] = useState<'scroll' | '3d'>('scroll');
  const [introComplete, setIntroComplete] = useState(false);
  const scrollPosRef = useRef(0);

  // Check sessionStorage on mount to skip intro if already played
  useEffect(() => {
    try {
      if (sessionStorage.getItem('intro-played')) {
        setIntroComplete(true);
      }
    } catch {
      // sessionStorage unavailable — show intro
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

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
      {!introComplete && <CircuitIntro onComplete={handleIntroComplete} />}
      {viewMode === 'scroll' && (
        <ScrollPortfolio onEnter3D={enter3D} introComplete={introComplete} />
      )}
      {viewMode === '3d' && <HomeScene onExit3D={exit3D} />}
    </main>
  );
}
