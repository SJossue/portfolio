'use client';

import { useEffect, useState } from 'react';
import { useSceneState } from './useSceneState';
import { useIsMobile } from '@/hooks/useIsMobile';

const NAV_ITEMS: readonly { id: string; label: string; hideOnMobile?: boolean }[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'tools', label: 'Tools', hideOnMobile: true },
];

const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  research: 'Research',
  tools: 'Tools',
};

function OnboardingHint() {
  const [show, setShow] = useState(false);
  const selectedSection = useSceneState((s) => s.selectedSection);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('scene-onboarded')) return;
    const timer = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss when user clicks any hitbox
  useEffect(() => {
    if (selectedSection && show) {
      setShow(false);
      localStorage.setItem('scene-onboarded', '1');
    }
  }, [selectedSection, show]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('scene-onboarded', '1');
  };

  if (!show) return null;

  return (
    <div className="pointer-events-auto absolute bottom-24 left-1/2 z-50 -translate-x-1/2 sm:bottom-20">
      <div className="glass-card flex w-[calc(100vw-2rem)] max-w-sm items-center gap-3 rounded-lg border-cyan-400/20 px-4 py-3 shadow-[0_0_20px_rgba(0,240,255,0.1)] sm:w-auto sm:gap-4 sm:px-5">
        <p className="font-mono text-xs text-white/80 sm:text-sm">
          Tap objects in the scene to explore
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 rounded border border-white/20 px-3 py-1 font-mono text-xs text-white/60 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function TopNav() {
  const introState = useSceneState((s) => s.introState);
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);
  const hoveredSection = useSceneState((s) => s.hoveredSection);
  const interactionLocked = useSceneState((s) => s.interactionLocked);
  const isMobile = useIsMobile();

  if (introState !== 'garage') return null;

  // On mobile, hide the entire nav when a panel is open (mobile overlay has its own header)
  if (isMobile && selectedSection) return null;

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between p-3 sm:p-6 md:p-8">
        {/* Brand / Logo Area */}
        <div className="pointer-events-auto flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden border border-cyan-400/30 bg-black/40 backdrop-blur-md sm:h-10 sm:w-10">
            <img
              src="/jossue/headshot.jpg"
              alt="Jossue Sarango"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-white">
              Jossue Sarango
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="scrollbar-none pointer-events-auto flex items-center gap-1 overflow-x-auto sm:gap-2">
          {NAV_ITEMS.map((item) => {
            if (item.hideOnMobile && isMobile) return null;
            const isActive = selectedSection === item.id;
            return (
              <button
                key={item.id}
                disabled={interactionLocked || isActive}
                onClick={() => setSelectedSection(item.id)}
                className={`group relative flex-shrink-0 overflow-hidden border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 bg-black/40 text-white/60 hover:border-white/40 hover:bg-white/10 hover:text-white'
                } ${interactionLocked && !isActive ? 'cursor-not-allowed opacity-50' : ''} `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative z-10">{item.label}</span>
                {!isActive && (
                  <div className="absolute inset-0 z-0 -translate-x-full bg-white/5 transition-transform duration-300 group-hover:translate-x-0" />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Onboarding hint (first visit only) */}
      <OnboardingHint />

      {/* Bottom Right Status — contextual */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-50 p-3 sm:p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]"></div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
            {hoveredSection
              ? `→ ${SECTION_LABELS[hoveredSection] ?? hoveredSection}`
              : 'Interactive Mode'}
          </span>
        </div>
      </div>
    </>
  );
}
