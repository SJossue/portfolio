'use client';

import { type KeyboardEvent, useRef } from 'react';

import type { WorldData } from '@/content/worlds';
import { useCoarsePointer } from '@/hooks/useCoarsePointer';

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
 * island is a card with its preview + name. Hovering (or focusing) a card
 * selects it (drives the right details panel, accent, and background) and
 * reveals its Enter affordance; clicking dives into that world. ArrowLeft/Right
 * move the selection; Enter dives into the selected world. On touch (no hover),
 * a single tap enters the tapped world directly.
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
  // Touch has no hover to preview with, so a single tap enters directly rather than
  // running the desktop select-then-enter two-step. (The pill/chevron *visuals* are
  // resolved in CSS by pointer type; this only drives the click behaviour.)
  const coarse = useCoarsePointer();

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
      className="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-y-auto p-5"
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
            onMouseEnter={() => onSelect(i)}
            onFocus={() => onSelect(i)}
            onClick={() => (coarse || selected ? onEnter(world) : onSelect(i))}
            className="group flex items-stretch gap-4 overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:translate-x-0.5"
            style={{
              background: selected ? `rgba(${accentRgb}, 0.1)` : 'rgba(255,255,255,0.02)',
              borderColor: selected ? `rgba(${accentRgb}, 0.5)` : 'rgba(255,255,255,0.07)',
              boxShadow: selected ? `0 0 40px -16px rgba(${accentRgb}, 0.7)` : 'none',
            }}
          >
            <span
              className="h-[4.75rem] w-24 flex-shrink-0 bg-cover bg-center sm:w-32"
              style={{
                backgroundImage: `url(/islands/${world.id}.webp)`,
                backgroundColor: `rgba(${world.colorRgb}, 0.15)`,
              }}
            />
            <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-3 pr-4">
              <span
                className="truncate text-base font-semibold"
                style={{ color: selected ? accentColor : 'rgba(255,255,255,0.9)' }}
              >
                {world.name}
              </span>
              <span className="truncate text-sm text-white/50">{world.subtitle}</span>
            </span>
            {/* Touch: a light chevron on every card (all enter on a single tap). Shown
                only on coarse pointers via CSS. */}
            <span
              aria-hidden
              className="island-enter-chevron mr-4 flex-shrink-0 items-center self-center text-lg"
              style={{ color: accentColor }}
            >
              →
            </span>
            {/* Fine pointer: the hover-selected card reveals a full Enter pill. Shown
                only on fine pointers via CSS, and only for the selected card. */}
            {selected ? (
              <span
                className="island-enter-pill m-3 flex-shrink-0 items-center self-center rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#06060c]"
                style={{ background: accentColor }}
              >
                Enter →
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
