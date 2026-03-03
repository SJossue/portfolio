'use client';

import gsap from 'gsap';
import { useCallback, useEffect, useRef } from 'react';

interface OverlayPanelProps {
  section: string;
  onClose: () => void;
}

const SECTION_CONTENT: Record<string, { heading: string; description: string }> = {
  projects: {
    heading: 'Projects',
    description: 'A curated selection of engineering work.',
  },
  contact: {
    heading: 'Contact',
    description: 'Get in touch for collaboration or opportunities.',
  },
  about: {
    heading: 'About',
    description: 'Engineer, builder, systems thinker.',
  },
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
      x: '100%',
      opacity: 0,
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
      { x: '100%', opacity: 0 },
      {
        x: '0%',
        opacity: 1,
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

  const content = SECTION_CONTENT[section] ?? {
    heading: toTitleCase(section),
    description: '',
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-cyan-400/10 bg-black/85 p-4 backdrop-blur-lg sm:p-8 md:w-1/2"
      style={{ transform: 'translateX(100%)', opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={content.heading}
      data-testid="overlay-panel"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-mono text-xl font-bold uppercase tracking-wider text-cyan-300">
          {content.heading}
        </h2>
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="min-h-[44px] min-w-[44px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs uppercase tracking-wider text-white/50 transition-all hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/80"
          aria-label="Close panel"
          data-testid="close-panel"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <p className="text-white/60">{content.description}</p>
      </div>
    </div>
  );
}
