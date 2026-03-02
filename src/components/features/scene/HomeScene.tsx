'use client';

import { useEffect, useState } from 'react';
import { SceneSkeleton } from './SceneSkeleton';
import { useSceneState } from './useSceneState';

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HomeScene() {
  const { introState, setIntroState } = useSceneState();
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  useEffect(() => {
    setHasReducedMotion(getPrefersReducedMotion());

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setHasReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (hasReducedMotion) {
      setIntroState('skipped');
    }
  }, [hasReducedMotion, setIntroState]);

  const handleAirOut = () => {
    setIntroState('animating');

    // In a real implementation, this would be replaced with GSAP timeline completion
    setTimeout(() => {
      setIntroState('done');
    }, 1000); // 1 second timeout for demo purposes
  };

  const handleSkipIntro = () => {
    setIntroState('skipped');
  };

  return (
    <div className="relative h-screen w-full">
      <SceneSkeleton />

      {introState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            data-testid="air-out"
            onClick={handleAirOut}
            className="rounded-lg bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label="AIR OUT"
          >
            AIR OUT
          </button>
        </div>
      )}

      {introState === 'idle' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
          <button
            data-testid="skip-intro"
            onClick={handleSkipIntro}
            className="rounded-lg bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/30"
            aria-label="Skip Intro"
          >
            Skip Intro
          </button>
        </div>
      )}

      {(introState === 'done' || introState === 'skipped') && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm">
          {/* Garage UI shell overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md"
              data-testid="garage-shell"
            >
              <h2 className="mb-4 text-2xl font-bold text-white">Garage UI Shell</h2>
              <p className="text-white/80">This is the garage interface that appears after intro</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
