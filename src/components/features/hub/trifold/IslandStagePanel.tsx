'use client';

import type { WorldData } from '@/content/worlds';

import IslandScene from '../IslandScene';

interface IslandStagePanelProps {
  world: WorldData;
  onEnter: () => void;
}

/**
 * Center panel: the selected island's visual (reused `IslandScene`), its name,
 * subtitle, description, stat pills, and the primary Enter call-to-action.
 */
export default function IslandStagePanel({ world, onEnter }: IslandStagePanelProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <IslandScene
        worldId={world.id}
        worldName={world.name}
        color={world.color}
        colorRgb={world.colorRgb}
        isActive
        onEnter={onEnter}
      />

      <div className="flex flex-col items-center gap-3">
        <h2
          className="text-3xl font-bold tracking-[2px] 3xl:text-4xl"
          style={{ color: world.color }}
        >
          {world.name}
        </h2>
        <p className="text-sm uppercase tracking-[3px] text-white/50">{world.subtitle}</p>
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
