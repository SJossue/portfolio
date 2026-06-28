'use client';

import { type KeyboardEvent, useRef } from 'react';

import type { WorldData } from '@/content/worlds';

import HubSocials from '../HubSocials';

interface IslandListPanelProps {
  worlds: WorldData[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  accentColor: string;
  accentRgb: string;
}

/**
 * Left panel: a keyboard-navigable list of all islands. The selected row is
 * highlighted with the world accent (`aria-current`); ArrowUp/Down move the
 * selection and keep DOM focus on the newly selected island. Footer carries the
 * social links and a "Book a call" CTA.
 */
export default function IslandListPanel({
  worlds,
  selectedIndex,
  onSelect,
  accentColor,
  accentRgb,
}: IslandListPanelProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // ArrowUp/Down move the selection AND focus together, so the highlighted
  // island and the keyboard target never diverge.
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    let next = selectedIndex;
    if (e.key === 'ArrowDown') next = Math.min(selectedIndex + 1, worlds.length - 1);
    else if (e.key === 'ArrowUp') next = Math.max(selectedIndex - 1, 0);
    else return;

    e.preventDefault();
    if (next !== selectedIndex) {
      onSelect(next);
      buttonsRef.current[next]?.focus();
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[4px] text-white/40">PORTFOLIO</p>
        <h1 className="mt-1 text-lg font-semibold tracking-[2px] text-white/90">JOSSUE SARANGO</h1>
      </header>

      <nav aria-label="Islands" onKeyDown={onKeyDown} className="flex flex-col gap-2">
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
              className="group flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors"
              style={{
                background: selected ? `rgba(${accentRgb}, 0.12)` : 'rgba(255,255,255,0.02)',
                borderColor: selected ? `rgba(${accentRgb}, 0.45)` : 'rgba(255,255,255,0.08)',
              }}
            >
              <span
                className="h-12 w-12 flex-shrink-0 rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(/islands/${world.id}.webp)`,
                  backgroundColor: `rgba(${world.colorRgb}, 0.15)`,
                  boxShadow: selected ? `0 0 0 1px rgba(${accentRgb}, 0.5)` : 'none',
                }}
              />
              <span className="min-w-0">
                <span
                  className="block truncate text-sm font-semibold"
                  style={{ color: selected ? accentColor : 'rgba(255,255,255,0.85)' }}
                >
                  {world.name}
                </span>
                <span className="block truncate text-xs text-white/50">{world.subtitle}</span>
              </span>
            </button>
          );
        })}
      </nav>

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
