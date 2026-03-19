'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useActiveSection } from '@/hooks/useActiveSection';

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
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Auto-hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < 100 || currentY < lastScrollY.current);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
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
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`whitespace-nowrap rounded px-2 py-1 text-xs transition-colors ${
                activeSection === id
                  ? 'bg-cyan-400/10 text-cyan-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {SECTION_LABELS[id]}
            </button>
          ))}
        </nav>

        {/* Enter 3D button */}
        <button
          onClick={onEnter3D}
          className="ml-2 whitespace-nowrap rounded border border-cyan-400/40 px-3 py-1 text-xs text-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.15)] transition-all hover:bg-cyan-400/10 hover:shadow-[0_0_16px_rgba(0,240,255,0.3)]"
        >
          Enter 3D World
        </button>
      </div>
    </header>
  );
}
