'use client';

import { useSceneState } from './useSceneState';

const NAV_ITEMS = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'tools', label: 'Tools' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;

export function TopNav() {
  const introState = useSceneState((s) => s.introState);
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);
  const interactionLocked = useSceneState((s) => s.interactionLocked);

  // Only show the nav once the boot sequence is completely finished
  // and the garage is fully visible.
  if (introState !== 'garage') return null;

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between p-6 md:p-8">
        {/* Brand / Logo Area */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden border border-cyan-400/30 bg-black/40 backdrop-blur-md">
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
        <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = selectedSection === item.id;
            return (
              <button
                key={item.id}
                disabled={interactionLocked || isActive}
                onClick={() => setSelectedSection(item.id)}
                className={`group relative overflow-hidden border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 sm:px-4 sm:py-2 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 bg-black/40 text-white/60 hover:border-white/40 hover:bg-white/10 hover:text-white'
                } ${interactionLocked && !isActive ? 'cursor-not-allowed opacity-50' : ''} `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Hover effect background fill */}
                {!isActive && (
                  <div className="absolute inset-0 z-0 -translate-x-full bg-white/5 transition-transform duration-300 group-hover:translate-x-0" />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Bottom Right Status */}
      <div className="pointer-events-none absolute bottom-0 right-0 z-50 p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]"></div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
            Connected
          </span>
        </div>
      </div>
    </>
  );
}
