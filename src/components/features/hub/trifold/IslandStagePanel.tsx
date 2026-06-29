'use client';

import type { WorldData } from '@/content/worlds';

interface IslandStagePanelProps {
  world: WorldData;
  onEnter: () => void;
}

/**
 * The per-island content shown below the constant hero in the center panel:
 * the selected island's name, subtitle, description, stat pills, and the
 * primary Enter call-to-action. Updates on selection.
 */
export default function IslandStagePanel({ world, onEnter }: IslandStagePanelProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 py-7 text-center">
      <div className="flex flex-col items-center gap-2.5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
          {world.subtitle}
        </p>
        <h2
          className="text-3xl font-bold tracking-[1px] 3xl:text-4xl"
          style={{ color: world.color }}
        >
          {world.name}
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-white/70">{world.description}</p>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-2">
        {world.stats.map((stat) => (
          <li
            key={stat.label}
            className="rounded-full border px-3 py-1 text-xs text-white/80"
            style={{
              background: `rgba(${world.colorRgb}, 0.08)`,
              borderColor: `rgba(${world.colorRgb}, 0.25)`,
            }}
          >
            <span className="font-semibold" style={{ color: world.color }}>
              {stat.value}
            </span>{' '}
            {stat.label}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onEnter}
        className="inline-flex items-center justify-center rounded-full px-7 py-2.5 text-sm font-semibold text-[#06060c] transition-transform hover:scale-[1.03]"
        style={{ background: world.color }}
      >
        Enter {world.name}
      </button>
    </div>
  );
}
