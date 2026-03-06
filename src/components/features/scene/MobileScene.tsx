'use client';

import { useState } from 'react';
import { AboutPanel, ChatPanel, ExperiencePanel, ProjectsPanel, ToolsPanel } from './panels';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'tools', label: 'Tools' },
  { id: 'contact', label: 'Chat' },
] as const;

const SECTION_PANELS: Record<string, React.ReactNode> = {
  about: <AboutPanel />,
  projects: <ProjectsPanel />,
  experience: <ExperiencePanel />,
  tools: <ToolsPanel />,
  contact: <ChatPanel />,
};

export function MobileScene() {
  const [activeSection, setActiveSection] = useState<string>('about');

  return (
    <div className="flex h-dvh w-full flex-col bg-[#0a0908]">
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden border border-cyan-400/30 bg-black/40">
          <img
            src="/jossue/headshot.jpg"
            alt="Jossue Sarango"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-white">
          Jossue Sarango
        </span>
      </header>

      {/* Section Nav - horizontal scroll */}
      <nav className="scrollbar-none flex shrink-0 gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`whitespace-nowrap border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                  : 'border-white/10 bg-transparent text-white/60 active:bg-white/10'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <h1 className="mb-6 font-mono text-xl font-bold uppercase tracking-widest text-white">
          {NAV_ITEMS.find((i) => i.id === activeSection)?.label}
        </h1>
        <div className="text-white/90">{SECTION_PANELS[activeSection]}</div>
      </main>

      {/* Status bar */}
      <div className="flex shrink-0 items-center gap-2 border-t border-white/10 px-4 py-2">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
          Mobile View
        </span>
      </div>
    </div>
  );
}
