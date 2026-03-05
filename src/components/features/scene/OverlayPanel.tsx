'use client';

import gsap from 'gsap';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { AboutPanel, ContactPanel, ExperiencePanel, ProjectsPanel, ToolsPanel } from './panels';

interface OverlayPanelProps {
  section: string;
  onClose: () => void;
}

const SECTION_HEADINGS: Record<string, string> = {
  projects: 'Projects',
  contact: 'Contact',
  about: 'About',
  experience: 'Experience',
  tools: 'Tools & Software',
};

const SECTION_PANELS: Record<string, ReactNode> = {
  projects: <ProjectsPanel />,
  contact: <ContactPanel />,
  about: <AboutPanel />,
  experience: <ExperiencePanel />,
  tools: <ToolsPanel />,
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
      className="pointer-events-none absolute inset-0 z-40 flex h-full w-full justify-between p-6 md:p-12"
      style={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      data-testid="overlay-panel"
    >
      {/* LEFT COLUMN - Sub-navigation */}
      <div className="corner-brackets pointer-events-auto flex h-full w-full max-w-[300px] flex-col border border-white/20 bg-white/5 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
        <h2 className="animate-glitch-skew mb-8 font-mono text-3xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
          {heading}
        </h2>
        <div className="flex flex-col gap-4">
          {/* Loadout categories for visual flair */}
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

      {/* RIGHT COLUMN - Stats and Details Container */}
      <div className="corner-brackets pointer-events-auto flex h-full w-full max-w-[420px] flex-col border border-white/20 bg-white/5 p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
        <div className="mb-6 flex justify-end">
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

        <div className="scrollbar-cyber flex-1 overflow-y-auto pr-4 text-white/90">
          {SECTION_PANELS[section] ?? null}
        </div>
      </div>
    </div>
  );
}
