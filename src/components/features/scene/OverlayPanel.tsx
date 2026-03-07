'use client';

import gsap from 'gsap';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { projects } from '@/content';
import { aboutData } from '@/content/about';
import { experienceData } from '@/content/experience';
import { researchData } from '@/content/research';
import {
  AboutPanel,
  ChatPanel,
  ExperiencePanel,
  ProjectsPanel,
  ResearchPanel,
  ToolsPanel,
} from './panels';
import { ResumeButton } from './panels/ResumeButton';

interface OverlayPanelProps {
  section: string;
  onClose: () => void;
}

const SECTION_HEADINGS: Record<string, string> = {
  projects: 'Projects',
  research: 'Research',
  about: 'About',
  experience: 'Experience',
  tools: 'Tools & Software',
};

const SECTION_PANELS: Record<string, (props?: any) => ReactNode> = {
  projects: (props) => <ProjectsPanel {...props} />,
  research: (props) => <ResearchPanel {...props} />,
  about: () => (
    <div className="flex h-full min-h-0 gap-6">
      <div className="scrollbar-cyber flex-1 basis-1/2 overflow-y-auto pr-4">
        <AboutPanel />
      </div>
      <div className="flex min-w-0 flex-1 basis-1/2 flex-col border-l border-white/20 pl-6">
        <ChatPanel />
      </div>
    </div>
  ),
  experience: (props) => <ExperiencePanel {...props} />,
  tools: () => <ToolsPanel />,
};

function toTitleCase(str: string): string {
  const minorWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'nor',
    'for',
    'so',
    'yet',
    'in',
    'on',
    'at',
    'to',
    'by',
    'of',
    'up',
  ]);
  return str
    .split(/[\s-]+/)
    .map((word, i) => {
      if (i === 0 || !minorWords.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(' ');
}

export function OverlayPanel({ section, onClose }: OverlayPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<Element | null>(null);
  const isAnimatingRef = useRef(false);
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);
  const [activeExperienceId, setActiveExperienceId] = useState<string>(experienceData[0].id);
  const [activeResearchId, setActiveResearchId] = useState<string>(researchData[0]?.id ?? '');
  const [aboutImageIdx, setAboutImageIdx] = useState(0);

  const handleClose = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    // Safety fallback: if GSAP ticker stalls (e.g. no-WebGL CI),
    // ensure onClose fires regardless.
    const fallback = window.setTimeout(() => {
      isAnimatingRef.current = false;
      onClose();
    }, 500);
    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 1.02,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        window.clearTimeout(fallback);
        isAnimatingRef.current = false;
        onClose();
      },
    });
  }, [onClose]);

  // Capture previously focused element and animate in on mount
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.98 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
        onComplete: () => {
          closeButtonRef.current?.focus();
        },
      },
    );

    return () => {
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Escape key closes the panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Focus trap: keep Tab key cycling within the panel
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      const focusable = panel!.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, []);

  const heading = SECTION_HEADINGS[section] ?? toTitleCase(section);

  return (
    <div
      ref={panelRef}
      className={`pointer-events-none absolute inset-0 z-40 flex h-full w-full justify-between py-6 md:py-12`}
      style={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      data-testid="overlay-panel"
    >
      {/* LEFT COLUMN - Sub-navigation */}
      {section === 'projects' ? (
        <div className="corner-brackets pointer-events-auto my-auto flex h-[80vh] w-full max-w-[300px] flex-col border border-l-0 border-white/20 bg-black/60 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <h2 className="animate-glitch-skew mb-8 font-mono text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            {heading}
          </h2>
          <ul className="scrollbar-cyber flex flex-col gap-3 overflow-y-auto pr-2">
            <h3 className="mb-2 font-mono text-sm uppercase tracking-widest text-white/30">
              Select Project
            </h3>
            {projects.map((project) => {
              const isActive = activeProjectId === project.id;
              return (
                <li key={project.id} className="flex items-center gap-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-white/20'}`}
                  />
                  <button
                    onClick={() => setActiveProjectId(project.id)}
                    className={`text-left text-sm transition-all hover:text-white ${
                      isActive
                        ? 'translate-x-1 font-bold tracking-wide text-cyan-400'
                        : 'font-medium text-white/60'
                    }`}
                  >
                    {project.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : section === 'experience' ? (
        <div className="corner-brackets pointer-events-auto my-auto flex h-[80vh] w-full max-w-[300px] flex-col border border-l-0 border-white/20 bg-black/60 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <h2 className="animate-glitch-skew mb-8 font-mono text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            {heading}
          </h2>

          <div className="scrollbar-cyber relative mt-2 flex flex-col gap-0 overflow-y-auto pr-2">
            {/* Timeline Vertical Axis */}
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-cyan-400/20" />

            {experienceData.map((entry, i) => {
              const isActive = activeExperienceId === entry.id;
              return (
                <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Timeline dot */}
                  <div className="relative z-10 mt-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'scale-125 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                          : 'border border-cyan-400/40 bg-black'
                      }`}
                    />
                  </div>

                  {/* Content Button */}
                  <button
                    onClick={() => setActiveExperienceId(entry.id)}
                    className={`flex-1 text-left transition-all ${
                      isActive ? 'translate-x-1 opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="mb-0.5 font-mono text-xs tracking-wider text-cyan-400">
                      {entry.period}
                    </div>
                    <h3
                      className={`text-sm font-medium ${isActive ? 'font-bold text-white' : 'text-white/80'}`}
                    >
                      {entry.company}
                    </h3>
                    <div className="mt-0.5 line-clamp-1 text-xs text-fuchsia-400">{entry.role}</div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : section === 'research' ? (
        <div className="corner-brackets pointer-events-auto my-auto flex h-[80vh] w-full max-w-[300px] flex-col border border-l-0 border-white/20 bg-black/60 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <h2 className="animate-glitch-skew mb-8 font-mono text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            {heading}
          </h2>
          <ul className="scrollbar-cyber flex flex-col gap-3 overflow-y-auto pr-2">
            <h3 className="mb-2 font-mono text-sm uppercase tracking-widest text-white/30">
              Select Paper
            </h3>
            {researchData.map((entry) => {
              const isActive = activeResearchId === entry.id;
              return (
                <li key={entry.id} className="flex items-center gap-3">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-white/20'}`}
                  />
                  <button
                    onClick={() => setActiveResearchId(entry.id)}
                    className={`text-left text-sm transition-all hover:text-white ${isActive ? 'translate-x-1 font-bold tracking-wide text-cyan-400' : 'font-medium text-white/60'}`}
                  >
                    {entry.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : section === 'about' ? (
        <div className="corner-brackets pointer-events-auto my-auto flex h-[80vh] w-full max-w-[300px] flex-col border border-l-0 border-white/20 bg-black/60 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <h2 className="animate-glitch-skew mb-6 font-mono text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            {heading}
          </h2>

          {/* Image Carousel — 3:4 aspect ratio */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden border border-white/20 bg-black/40">
            {aboutData.images.length > 0 && (
              <Image
                src={aboutData.images[aboutImageIdx]}
                alt={`${aboutData.name} photo ${aboutImageIdx + 1}`}
                fill
                className="object-cover"
                sizes="240px"
              />
            )}
          </div>

          {/* Carousel Controls */}
          {aboutData.images.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setAboutImageIdx(
                    (prev) => (prev - 1 + aboutData.images.length) % aboutData.images.length,
                  )
                }
                className="font-mono text-xs text-white/60 transition-colors hover:text-white"
                aria-label="Previous image"
              >
                [ &lt; ]
              </button>
              <span className="font-mono text-xs text-white/40">
                {aboutImageIdx + 1} / {aboutData.images.length}
              </span>
              <button
                onClick={() => setAboutImageIdx((prev) => (prev + 1) % aboutData.images.length)}
                className="font-mono text-xs text-white/60 transition-colors hover:text-white"
                aria-label="Next image"
              >
                [ &gt; ]
              </button>
            </div>
          )}

          {/* Profile Info */}
          <div className="mt-5 flex flex-col gap-1">
            <span className="font-mono text-2xl font-bold tracking-wide text-white">
              {aboutData.name}
            </span>
            <span className="font-mono text-sm tracking-wide text-cyan-400">
              {aboutData.roleTitle}
            </span>
            <span className="font-mono text-xs tracking-wider text-white/40">
              {aboutData.ethnicity}
            </span>
          </div>

          {/* Resume CTA */}
          <div className="mt-auto pt-6">
            <ResumeButton />
          </div>
        </div>
      ) : (
        <div className="corner-brackets pointer-events-auto my-auto flex h-[80vh] w-full max-w-[300px] flex-col border border-l-0 border-white/20 bg-black/60 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <h2 className="animate-glitch-skew mb-8 font-mono text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            {heading}
          </h2>
          <div className="flex flex-col gap-4">
            {['OVERVIEW', 'DETAILS', 'LOGS'].map((item, i) => (
              <button
                key={item}
                className={`group relative flex items-center gap-4 border p-4 text-left font-mono text-sm uppercase tracking-widest ${i === 0 ? 'border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/20 bg-transparent text-white/70 hover:border-white hover:text-white'} transition-all`}
              >
                <span
                  className={`block h-1.5 w-1.5 ${i === 0 ? 'bg-black' : 'bg-white/50 group-hover:bg-white'}`}
                />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CENTER - ESC Back Button */}
      <div className="btn-back pointer-events-auto absolute bottom-4 left-1/2 z-50 -translate-x-1/2 md:bottom-8">
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="flex min-h-[44px] items-center gap-2 border border-white/20 bg-black/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close panel"
          data-testid="close-panel"
        >
          <span>[ ESC ]</span> BACK
        </button>
      </div>

      {/* RIGHT COLUMN - Stats and Details Container */}
      <div
        className={`corner-brackets pointer-events-auto my-auto flex h-[80vh] w-full flex-col border border-r-0 border-white/20 bg-black/60 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md ${section === 'projects' || section === 'experience' || section === 'about' || section === 'research' ? 'max-w-[800px]' : 'max-w-[500px]'}`}
      >
        <div className="scrollbar-cyber flex-1 overflow-y-auto pr-4 text-white/90">
          {SECTION_PANELS[section]
            ? SECTION_PANELS[section]({
                projectId: activeProjectId,
                experienceId: activeExperienceId,
                researchId: activeResearchId,
              })
            : null}
        </div>
      </div>
    </div>
  );
}
