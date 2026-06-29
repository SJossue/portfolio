'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import HubSocials from '../HubSocials';

interface IslandListPanelProps {
  accentColor: string;
  accentRgb: string;
  /** Slot filling the rail's middle — the chat lives here. */
  children?: ReactNode;
}

const iconBase = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function HomeIcon() {
  return (
    <svg {...iconBase} className="h-5 w-5 flex-shrink-0">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...iconBase} className="h-5 w-5 flex-shrink-0">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
}

/**
 * Left rail: plain "Home" and "Book a call" nav rows at the top (icon + text,
 * no background), the chat in the middle, and social links at the bottom.
 */
export default function IslandListPanel({
  accentColor,
  accentRgb,
  children,
}: IslandListPanelProps) {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <nav aria-label="Primary" className="flex flex-col gap-0.5">
        <Link
          href="/"
          aria-current="page"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-base font-semibold text-white transition-colors hover:bg-white/5"
        >
          <HomeIcon />
          Home
        </Link>
        <Link
          href="/book"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-base font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <CalendarIcon />
          Book a call
        </Link>
      </nav>

      {/* Chat fills the middle of the rail. */}
      <div className="min-h-0 flex-1">{children}</div>

      <div className="pt-2">
        <HubSocials accentColor={accentColor} accentRgb={accentRgb} layout="inline" />
      </div>
    </div>
  );
}
