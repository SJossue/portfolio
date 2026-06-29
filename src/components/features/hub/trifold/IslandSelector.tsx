'use client';

import { type KeyboardEvent, useRef } from 'react';

import type { WorldData } from '@/content/worlds';

interface IslandSelectorProps {
  worlds: WorldData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  accentColor: string;
  accentRgb: string;
}

/**
 * Horizontal island selector shown under the hero in the center panel. The
 * selected island is highlighted with the world accent (`aria-current`);
 * ArrowLeft/Right move the selection and keep focus on the active island.
 */
export default function IslandSelector({
  worlds,
  selectedIndex,
  onSelect,
  accentColor,
  accentRgb,
}: IslandSelectorProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    let next = selectedIndex;
    if (e.key === 'ArrowRight') next = Math.min(selectedIndex + 1, worlds.length - 1);
    else if (e.key === 'ArrowLeft') next = Math.max(selectedIndex - 1, 0);
    else return;
    e.preventDefault();
    if (next !== selectedIndex) {
      onSelect(next);
      buttonsRef.current[next]?.focus();
    }
  };

  return (
    <nav
      aria-label="Islands"
      onKeyDown={onKeyDown}
      className="flex shrink-0 gap-2 overflow-x-auto px-5 py-4"
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
            onClick={() => onSelect(i)}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border p-2 text-left transition-colors"
            style={{
              background: selected ? `rgba(${accentRgb}, 0.14)` : 'rgba(255,255,255,0.02)',
              borderColor: selected ? `rgba(${accentRgb}, 0.45)` : 'rgba(255,255,255,0.07)',
            }}
          >
            <span
              className="h-10 w-10 flex-shrink-0 rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `url(/islands/${world.id}.webp)`,
                backgroundColor: `rgba(${world.colorRgb}, 0.15)`,
                boxShadow: selected ? `0 0 0 1px rgba(${accentRgb}, 0.5)` : 'none',
              }}
            />
            <span className="hidden min-w-0 lg:block">
              <span
                className="block truncate text-xs font-semibold"
                style={{ color: selected ? accentColor : 'rgba(255,255,255,0.85)' }}
              >
                {world.name}
              </span>
              <span className="block truncate text-[0.65rem] text-white/45">{world.subtitle}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
