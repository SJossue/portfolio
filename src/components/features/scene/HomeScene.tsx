'use client';

import { useEffect } from 'react';
import { OverlayPanel } from './OverlayPanel';
import { SceneSkeleton } from './SceneSkeleton';
import { useSceneState } from './useSceneState';

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const HUD_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
  { id: 'about', label: 'About' },
];

export function HomeScene() {
  const { introState, setIntroState, selectedSection, setSelectedSection } = useSceneState();

  // Check localStorage for skip preference on mount
  useEffect(() => {
    try {
      if (localStorage.getItem('portfolio-skip-intro') === 'true') {
        setIntroState('garage');
      }
    } catch {
      // localStorage unavailable (SSR, privacy mode) — ignore
    }
  }, [setIntroState]);

  // Check for reduced motion preference on mount
  useEffect(() => {
    if (getPrefersReducedMotion()) {
      setIntroState('garage');
    }
  }, [setIntroState]);

  // Escape key: close panel if open, otherwise skip intro
  useEffect(() => {
    if (introState === 'garage' && selectedSection !== null) return; // Panel handles its own Escape
    if (introState === 'garage') return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIntroState('garage');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introState, selectedSection, setIntroState]);

  // Persist skip preference when garage state is reached
  useEffect(() => {
    if (introState === 'garage') {
      try {
        localStorage.setItem('portfolio-skip-intro', 'true');
      } catch {
        // localStorage unavailable — ignore
      }
    }
  }, [introState]);

  return (
    <div className="relative h-screen w-full">
      <SceneSkeleton />

      {introState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            data-testid="air-out"
            onClick={() => setIntroState('airingOut')}
            className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-8 py-4 font-mono text-sm uppercase tracking-widest text-cyan-300 backdrop-blur-sm transition-all hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
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
            onClick={() => setIntroState('garage')}
            className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white/40 backdrop-blur-sm transition-all hover:border-white/20 hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Skip Intro"
          >
            Skip Intro
          </button>
        </div>
      )}

      {introState === 'garage' && (
        <>
          {/* Bottom HUD bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 border-t border-cyan-400/10 bg-black/70 p-4 backdrop-blur-md"
            data-testid="garage-shell"
          >
            {HUD_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className="min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-5 py-2 font-mono text-xs uppercase tracking-wider text-white/70 transition-all hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80"
                aria-label={s.label}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Overlay panel */}
          {selectedSection && (
            <OverlayPanel section={selectedSection} onClose={() => setSelectedSection(null)} />
          )}
        </>
      )}
    </div>
  );
}
