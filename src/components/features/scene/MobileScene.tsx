'use client';

import { useState } from 'react';
import {
  AboutPanel,
  ChatPanel,
  ContactPanel,
  ExperiencePanel,
  ProjectsPanel,
  ToolsPanel,
} from './panels';

const NAV_ITEMS = [
  { id: 'projects', label: 'Projects', content: <ProjectsPanel /> },
  { id: 'experience', label: 'Experience', content: <ExperiencePanel /> },
  { id: 'tools', label: 'Tools', content: <ToolsPanel /> },
  { id: 'about', label: 'About', content: <AboutPanel /> },
  { id: 'contact', label: 'Chat', content: <ChatPanel /> },
] as const;

export function MobileScene() {
  const [activeSection, setActiveSection] = useState<string>('projects');

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#0a0908]">
      {/* Hero background with scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/social/jossue-accord-photo.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/60 via-[#0a0908]/80 to-[#0a0908]" />
        {/* Scanline effect */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden border border-cyan-400/30 bg-black/40">
          <img
            src="/jossue/headshot.jpg"
            alt="Jossue Sarango"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-sm font-bold uppercase tracking-widest text-white">
            Jossue Sarango
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,240,255,0.6)]" />
            Online
          </span>
        </div>
      </header>

      {/* Tab navigation */}
      <nav className="relative z-10 flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`shrink-0 border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all ${
                isActive
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'border-white/10 bg-white/5 text-white/50 active:bg-white/10'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Content area */}
      <main className="scrollbar-cyber relative z-10 flex-1 overflow-y-auto px-4 py-5">
        <div className="corner-brackets border border-white/10 bg-black/40 p-4 backdrop-blur-sm">
          <h2 className="animate-glitch-skew mb-4 font-mono text-lg font-bold uppercase tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {NAV_ITEMS.find((i) => i.id === activeSection)?.label}
          </h2>
          <div className="text-white/90">
            {NAV_ITEMS.find((i) => i.id === activeSection)?.content}
          </div>
        </div>
      </main>

      {/* Bottom status bar */}
      <footer className="relative z-10 flex items-center justify-between border-t border-white/10 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
          Mobile View
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/60">
            Connected
          </span>
        </div>
      </footer>
    </div>
  );
}
