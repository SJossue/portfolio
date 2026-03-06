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
          <div className="glass-pill flex h-11 w-11 items-center justify-center overflow-hidden">
            <img
              src="/jossue/headshot.jpg"
              alt="Jossue Sarango"
              className="h-full w-full scale-110 object-cover"
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
                className={`group relative overflow-hidden rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'border border-cyan-400/40 bg-cyan-400/10 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'glass-panel glass-interactive text-white/70 hover:text-white'
                } ${interactionLocked && !isActive ? 'cursor-not-allowed opacity-50' : ''} `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="relative z-10">{item.label}</span>
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
