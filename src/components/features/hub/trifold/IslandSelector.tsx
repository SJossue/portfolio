'use client';

import { type KeyboardEvent, useRef } from 'react';

import type { WorldData } from '@/content/worlds';

interface IslandSelectorProps {
  worlds: WorldData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onEnter: (world: WorldData) => void;
  accentColor: string;
  accentRgb: string;
}

/**
 * The horizontal island list that fills the center panel below the hero. Each
 * island is a card with its preview + name. Clicking a card selects it (drives
 * the right details panel, accent, and background); clicking the already-
 * selected card enters that world. ArrowLeft/Right move the selection; Enter
 * dives into the selected world.
 */
export default function IslandSelector({
  worlds,
  selectedIndex,
  onSelect,
  onEnter,
  accentColor,
  accentRgb,
}: IslandSelectorProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const next =
        e.key === 'ArrowRight'
          ? Math.min(selectedIndex + 1, worlds.length - 1)
          : Math.max(selectedIndex - 1, 0);
      e.preventDefault();
      if (next !== selectedIndex) {
        onSelect(next);
        buttonsRef.current[next]?.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEnter(worlds[selectedIndex]);
    }
  };

  return (
    <nav
      aria-label="Islands"
      onKeyDown={onKeyDown}
      className="flex min-h-0 flex-1 items-stretch gap-3 overflow-x-auto p-5"
    >
      {worlds.map((world, i) => {
        const selected = i === selectedIndex;
        return (
          <button
            key={world.id}
            ref={(el) => {
              buttonsRef.current[i] = el;
            }}
            type="button"
            aria-current={selected ? 'true' : undefined}
            onClick={() => (selected ? onEnter(world) : onSelect(i))}
            className="group flex min-w-[8rem] flex-1 flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: selected ? `rgba(${accentRgb}, 0.1)` : 'rgba(255,255,255,0.02)',
              borderColor: selected ? `rgba(${accentRgb}, 0.5)` : 'rgba(255,255,255,0.07)',
              boxShadow: selected ? `0 0 40px -16px rgba(${accentRgb}, 0.7)` : 'none',
            }}
          >
            <span
              className="relative min-h-0 flex-1 bg-cover bg-center"
              style={{
                backgroundImage: `url(/islands/${world.id}.webp)`,
                backgroundColor: `rgba(${world.colorRgb}, 0.15)`,
              }}
            >
              {selected ? (
                <span
                  className="absolute bottom-2 right-2 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-[#06060c]"
                  style={{ background: accentColor }}
                >
                  Enter →
                </span>
              ) : null}
            </span>
            <span className="flex flex-col gap-0.5 p-3">
              <span
                className="truncate text-sm font-semibold"
                style={{ color: selected ? accentColor : 'rgba(255,255,255,0.9)' }}
              >
                {world.name}
              </span>
              <span className="truncate text-xs text-white/50">{world.subtitle}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
