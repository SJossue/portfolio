'use client';

import { useEffect } from 'react';
import { SceneSkeleton } from './SceneSkeleton';
import { useSceneState } from './useSceneState';

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HomeScene() {
  const { introState, setIntroState } = useSceneState();
  
  // Check for reduced motion preference on mount
  useEffect(() => {
    if (getPrefersReducedMotion()) {
      setIntroState('skipped');
    }
  }, [setIntroState]);

  return (
    <div className="relative h-screen w-full">
      <SceneSkeleton />

      {introState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            data-testid="air-out"
            onClick={() => setIntroState('animating')}
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
            onClick={() => setIntroState('skipped')}
            className="rounded-lg bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/30"
            aria-label="Skip Intro"
          >
            Skip Intro
          </button>
        </div>
      )}

      {(introState === 'done' || introState === 'skipped') && (
        <div
          className="absolute inset-0 flex gap-4 bg-black/50 p-4 backdrop-blur-sm"
          data-testid="garage-shell"
        >
          {/* Left panel — terminal area */}
          <div className="flex flex-1 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
            <span className="text-sm text-white/60">Terminal</span>
          </div>
          {/* Right panel — project modules */}
          <div className="flex flex-1 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
            <span className="text-sm text-white/60">Projects</span>
          </div>
        </div>
      )}
    </div>
  );
}
