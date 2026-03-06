'use client';

import gsap from 'gsap';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import {
  AboutPanel,
  ChatPanel,
  ContactPanel,
  ExperiencePanel,
  ProjectsPanel,
  ToolsPanel,
} from './panels';

interface OverlayPanelProps {
  section: string;
  onClose: () => void;
}

const SECTION_HEADINGS: Record<string, string> = {
  projects: 'Projects',
  contact: 'Chat',
  about: 'About',
  experience: 'Experience',
  tools: 'Tools & Software',
};

const SECTION_PANELS: Record<string, ReactNode> = {
  projects: <ProjectsPanel />,
  contact: <ChatPanel />,
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
    }, 600);

    const panel = panelRef.current;
    if (!panel) return;
    const leftP = panel.querySelector('.panel-left');
    const rightP = panel.querySelector('.panel-right');
    const backBtn = panel.querySelector('.btn-back');

    gsap.to(leftP, { x: '-100%', opacity: 0, duration: 0.4, ease: 'power3.in' });
    gsap.to(rightP, { x: '100%', opacity: 0, duration: 0.4, ease: 'power3.in' });
    gsap.to(backBtn, { y: 50, opacity: 0, duration: 0.3, ease: 'power3.in' });
    gsap.to(panel, {
      opacity: 0,
      duration: 0.2,
      delay: 0.3,
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

    const panel = panelRef.current;
    if (!panel) return;
    const leftP = panel.querySelector('.panel-left');
    const rightP = panel.querySelector('.panel-right');
    const backBtn = panel.querySelector('.btn-back');

    // In testing environments (jsdom), GSAP may not be fully initialized or stubbed
    if (typeof gsap.fromTo === 'function' && typeof gsap.set === 'function') {
      // Make parent visible immediately, we will animate children
      gsap.set(panel, { opacity: 1 });

      gsap.fromTo(
        leftP,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' },
      );
      gsap.fromTo(
        rightP,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' },
      );
      gsap.fromTo(
        backBtn,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: 0.2,
          ease: 'power3.out',
          onComplete: () => {
            closeButtonRef.current?.focus();
          },
        },
      );
    } else {
      // Fallback for tests
      if (panel) panel.style.opacity = '1';
      closeButtonRef.current?.focus();
    }

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
      className="pointer-events-none absolute inset-0 z-40 flex h-full w-full flex-col justify-between overflow-hidden p-4 pt-24 md:flex-row md:p-0 md:pt-0"
      style={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      data-testid="overlay-panel"
    >
      {/* LEFT COLUMN - Sub-navigation */}
      <div className="panel-left glass-panel pointer-events-auto flex w-full flex-col rounded-2xl p-5 md:h-[100vh] md:w-[320px] md:max-w-[320px] md:rounded-none md:rounded-r-3xl md:border-y-0 md:border-l-0 md:p-8 md:pt-28 lg:max-w-[400px]">
        <h2 className="mb-4 font-mono text-2xl font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] md:mb-8 md:text-3xl">
          {heading}
        </h2>
        <div
          className="flex flex-row gap-3 overflow-x-auto pb-2 md:flex-col md:pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Loadout categories for visual flair */}
          {['OVERVIEW', 'DETAILS', 'LOGS'].map((item, i) => (
            <button
              key={item}
              className={`group relative flex flex-shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left font-mono text-xs uppercase tracking-widest md:flex-shrink ${i === 0 ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'glass-panel-hover text-white/70'} transition-all`}
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-black' : 'bg-white/50 group-hover:bg-white'}`}
              />
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* CENTER - ESC Back Button */}
      <div className="btn-back pointer-events-auto absolute bottom-4 left-1/2 z-50 -translate-x-1/2 md:bottom-8">
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="glass-panel glass-panel-hover flex min-h-[44px] items-center gap-2 rounded-full px-6 py-2 font-mono text-xs uppercase tracking-widest text-white/90 transition-all hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Close panel"
          data-testid="close-panel"
        >
          <span>[ ESC ]</span> BACK
        </button>
      </div>

      {/* RIGHT COLUMN - Stats and Details Container */}
      <div className="panel-right glass-panel pointer-events-auto flex w-full flex-1 flex-col overflow-hidden rounded-2xl p-5 md:h-[100vh] md:w-[480px] md:max-w-[480px] md:flex-none md:rounded-none md:rounded-l-3xl md:border-y-0 md:border-r-0 md:p-8 md:pt-28 lg:max-w-[600px]">
        <div className="scrollbar-cyber flex-1 overflow-y-auto pr-2 font-sans text-[15px] leading-relaxed text-white/90 md:pr-4">
          {SECTION_PANELS[section] ?? null}
        </div>
      </div>
    </div>
  );
}
