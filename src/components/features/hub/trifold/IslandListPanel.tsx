'use client';

import HubSocials from '../HubSocials';

interface IslandListPanelProps {
  accentColor: string;
  accentRgb: string;
}

/**
 * Left profile rail: brand identity at the top, social links and a "Book a
 * call" CTA at the bottom. (Island selection now lives under the hero in the
 * center panel.)
 */
export default function IslandListPanel({ accentColor, accentRgb }: IslandListPanelProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[4px] text-white/40">PORTFOLIO</p>
        <h1 className="mt-1 text-lg font-semibold tracking-[2px] text-white/90">JOSSUE SARANGO</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Mechanical engineering student building across hardware and software — pick a space to
          explore.
        </p>
      </header>

      <div className="mt-auto flex flex-col gap-4 pt-2">
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
