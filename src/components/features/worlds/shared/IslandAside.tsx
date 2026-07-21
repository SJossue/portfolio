import type { ReactNode } from 'react';

import HubSocials from '@/components/features/hub/HubSocials';
import { worlds } from '@/content/worlds';

interface IslandAsideProps {
  worldId: string;
  /** Show the "Highlights" section. Defaults to true. */
  showHighlights?: boolean;
  /** Optional island-specific block, rendered between stats and the socials. */
  children?: ReactNode;
}

/**
 * Right-panel complement for an island: the world's highlights, key stats, an
 * optional island-specific block, and the social links. Derived from
 * `worlds.ts`, so each island just passes its id.
 */
export default function IslandAside({
  worldId,
  showHighlights = true,
  children,
}: IslandAsideProps) {
  const world = worlds.find((w) => w.id === worldId) ?? worlds[0];

  return (
    <div className="flex h-full flex-col gap-8 p-6">
      {showHighlights ? (
        <section>
          <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
            Highlights
          </p>
          <ul className="space-y-3">
            {world.highlights.map((h) => (
              <li key={h.title}>
                <p className="text-sm font-semibold text-white">{h.title}</p>
                <p className="text-xs text-white/50">{h.tech}</p>
              </li>
            ))}
          </ul>
          {world.moreCount > 0 ? (
            <p className="mt-3 text-xs font-semibold" style={{ color: world.color }}>
              +{world.moreCount} more inside &rarr;
            </p>
          ) : null}
        </section>
      ) : null}

      <section>
        <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
          By the numbers
        </p>
        <div className="grid grid-cols-2 gap-3">
          {world.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3"
            >
              <p className="text-2xl font-black text-white">
                {s.value}
                {s.value >= 10 ? <span style={{ color: world.color }}>+</span> : null}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {children}

      {/* Social links — centered at the bottom of the right panel. */}
      <div className="mt-auto flex justify-center pt-2">
        <HubSocials accentColor={world.color} accentRgb={world.colorRgb} layout="inline" />
      </div>
    </div>
  );
}
