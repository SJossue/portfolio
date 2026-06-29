import type { ReactNode } from 'react';

import { contactLinks } from '@/content/contact';
import { worlds } from '@/content/worlds';

interface IslandAsideProps {
  worldId: string;
  /** Which contact links to surface (by id). Defaults to all. */
  linkIds?: string[];
  /** Optional island-specific block, rendered between stats and links. */
  children?: ReactNode;
}

/**
 * Right-panel complement for an island: the world's highlights, key stats, an
 * optional island-specific block, and the contact links. Derived from
 * `worlds.ts` + `contact.ts`, so each island just passes its id.
 */
export default function IslandAside({ worldId, linkIds, children }: IslandAsideProps) {
  const world = worlds.find((w) => w.id === worldId) ?? worlds[0];
  const links = linkIds ? contactLinks.filter((l) => linkIds.includes(l.id)) : contactLinks;

  return (
    <div className="flex h-full flex-col gap-8 p-6">
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
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {children}

      <section className="mt-auto">
        <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
          Connect
        </p>
        <ul className="space-y-1.5">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/15 hover:text-white"
              >
                {l.label}
                <span aria-hidden className="text-white/30">
                  &rarr;
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
