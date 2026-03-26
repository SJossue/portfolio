'use client';

import Image from 'next/image';
import { useActiveSection } from '@/hooks/useActiveSection';
import { MagneticWrap } from '@/components/ui/MagneticWrap';

const SECTIONS = ['about', 'experience', 'projects', 'research', 'tools', 'contact'] as const;
const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  research: 'Research',
  tools: 'Tools',
  contact: 'Contact',
};

interface ScrollNavProps {
  onEnter3D: () => void;
}

export function ScrollNav({ onEnter3D }: ScrollNavProps) {
  const activeSection = useActiveSection([...SECTIONS]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:h-14 sm:px-4">
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2"
        >
          <Image
            src="/jossue/headshot.jpg"
            alt="Jossue Sarango"
            width={28}
            height={28}
            className="rounded-full border border-cyan-400/30"
          />
          <span className="hidden text-sm font-medium text-white sm:inline">Jossue Sarango</span>
        </button>

        {/* Section links */}
        <nav className="scrollbar-none flex items-center gap-1 overflow-x-auto">
          {SECTIONS.map((id) => (
            <MagneticWrap key={id} strength={0.2}>
              <button
                onClick={() => scrollTo(id)}
                className={`whitespace-nowrap rounded px-2 py-1.5 text-[11px] transition-colors sm:px-2.5 sm:py-1 sm:text-xs ${
                  activeSection === id
                    ? 'bg-cyan-400/10 text-cyan-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {SECTION_LABELS[id]}
              </button>
            </MagneticWrap>
          ))}
        </nav>

        {/* Enter 3D button */}
        <MagneticWrap strength={0.2}>
          <button
            onClick={onEnter3D}
            className="ml-1 whitespace-nowrap rounded-lg border border-cyan-400/40 px-2 py-1 text-[10px] font-medium text-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.15)] transition-all hover:bg-cyan-400/10 hover:shadow-[0_0_16px_rgba(0,240,255,0.3)] sm:ml-2 sm:px-3 sm:text-xs"
          >
            Enter 3D World
          </button>
        </MagneticWrap>
      </div>
      {/* Gradient fade bottom border */}
      <div className="section-divider" aria-hidden="true" />
    </header>
  );
}
