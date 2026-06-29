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

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

/**
 * Left rail: a horizontal "Home" nav item at the top, social links and a
 * "Book a call" CTA at the bottom.
 */
export default function IslandListPanel({
  accentColor,
  accentRgb,
  children,
}: IslandListPanelProps) {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <nav aria-label="Primary">
        <Link
          href="/"
          aria-current="page"
          className="inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          style={{
            background: `rgba(${accentRgb}, 0.12)`,
            color: accentColor,
          }}
        >
          <HomeIcon className="h-5 w-5" />
          Home
        </Link>
      </nav>

      {/* Chat fills the middle of the rail. */}
      <div className="min-h-0 flex-1">{children}</div>

      <div className="flex flex-col gap-4 pt-2">
        <HubSocials accentColor={accentColor} accentRgb={accentRgb} layout="inline" />
        <a
          href="/book"
          className="inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium text-white/85 transition-colors"
          style={{
            background: `rgba(${accentRgb}, 0.12)`,
            borderColor: `rgba(${accentRgb}, 0.4)`,
          }}
        >
          Book a call
        </a>
      </div>
    </div>
  );
}
