'use client';

import { useEffect } from 'react';

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

export function OverlayPanel({ section, onClose }: OverlayPanelProps) {
  // Escape key closes the panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const content = SECTION_CONTENT[section] ?? {
    heading: section.charAt(0).toUpperCase() + section.slice(1),
    description: '',
  };

  return (
    <div
      className="absolute right-0 top-0 z-20 flex h-full w-full flex-col border-l border-white/10 bg-black/80 p-8 backdrop-blur-lg md:w-1/2"
      role="dialog"
      aria-label={content.heading}
      data-testid="overlay-panel"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{content.heading}</h2>
        <button
          onClick={onClose}
          className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/60 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Close panel"
          data-testid="close-panel"
        >
          Close
        </button>
      </div>
      <p className="text-white/60">{content.description}</p>
    </div>
  );
}
