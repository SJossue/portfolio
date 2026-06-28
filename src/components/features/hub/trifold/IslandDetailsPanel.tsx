'use client';

import { contactLinks } from '@/content/contact';
import type { WorldData } from '@/content/worlds';

interface IslandDetailsPanelProps {
  world: WorldData;
  index: number;
  total: number;
}

/**
 * Right panel: the selected island's details — accent header with world number,
 * highlights, "+N more inside", stats, and (for `real-me`) contact links.
 */
export default function IslandDetailsPanel({ world, index, total }: IslandDetailsPanelProps) {
  const num = String(index + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  return (
    <div className="flex h-full flex-col gap-5 p-6">
      {/* Accent featured header */}
      <header className="flex items-center gap-3">
        <span
          className="h-14 w-14 flex-shrink-0 rounded-xl bg-cover bg-center"
          style={{
            backgroundImage: `url(/islands/${world.id}.webp)`,
            backgroundColor: `rgba(${world.colorRgb}, 0.15)`,
            boxShadow: `0 0 0 1px rgba(${world.colorRgb}, 0.4)`,
          }}
        />
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-[2px]" style={{ color: world.color }}>
            {num} / {totalNum}
          </p>
          <h3 className="truncate text-base font-semibold text-white/90">{world.subtitle}</h3>
        </div>
      </header>

      <div className="section-divider" />

      {/* Highlights */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold tracking-[3px] text-white/40">HIGHLIGHTS</p>
        <ul className="flex flex-col gap-3">
          {world.highlights.map((h) => (
            <li key={h.title}>
              <p className="text-sm font-medium text-white/85">{h.title}</p>
              <p className="text-xs text-white/50">{h.tech}</p>
            </li>
          ))}
        </ul>
        {world.moreCount > 0 && (
          <p className="text-xs" style={{ color: world.color }}>
            +{world.moreCount} more inside →
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="mt-auto flex flex-wrap gap-2">
        {world.stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col rounded-xl border px-3 py-2"
            style={{
              background: `rgba(${world.colorRgb}, 0.06)`,
              borderColor: `rgba(${world.colorRgb}, 0.2)`,
            }}
          >
            <span className="text-lg font-bold" style={{ color: world.color }}>
              {stat.value}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-white/50">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Contact links — only on the About / real-me island */}
      {world.id === 'real-me' && (
        <nav aria-label="Contact" className="flex flex-wrap gap-2">
          {contactLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-full border px-3 py-1.5 text-xs text-white/80 transition-colors"
              style={{
                background: `rgba(${world.colorRgb}, 0.08)`,
                borderColor: `rgba(${world.colorRgb}, 0.25)`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
