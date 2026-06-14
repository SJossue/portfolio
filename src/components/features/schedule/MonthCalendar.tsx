'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const pad = (n: number) => String(n).padStart(2, '0');
const keyOf = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

interface MonthCalendarProps {
  availableDayKeys: Set<string>;
  selectedKey: string | null;
  loading?: boolean;
  onSelectDay: (dayKey: string) => void;
}

export function MonthCalendar({
  availableDayKeys,
  selectedKey,
  loading = false,
  onSelectDay,
}: MonthCalendarProps) {
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // 42-cell grid (6 weeks) starting on the Sunday on/before the 1st.
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const gridStart = addDays(first, -first.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [view]);

  const canGoPrev = view.y > today.getFullYear() || view.m > today.getMonth();

  useEffect(() => {
    if (focusKey) cellRefs.current.get(focusKey)?.focus();
  }, [focusKey]);

  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function move(from: Date, delta: number) {
    const next = addDays(from, delta);
    if (next.getMonth() !== view.m || next.getFullYear() !== view.y) {
      setView({ y: next.getFullYear(), m: next.getMonth() });
    }
    setFocusKey(keyOf(next));
  }

  function onKeyDown(e: React.KeyboardEvent, date: Date) {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in map) {
      e.preventDefault();
      move(date, map[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const k = keyOf(date);
      if (availableDayKeys.has(k)) onSelectDay(k);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            canGoPrev && setView(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))
          }
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="hover:border-[color:var(--accent,#22d3ee)]/50 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#22d3ee)] disabled:opacity-25"
        >
          ‹
        </button>
        <div
          className="font-mono text-xs uppercase tracking-[0.2em] text-slate-200"
          aria-live="polite"
        >
          {monthLabel}
        </div>
        <button
          type="button"
          onClick={() => setView(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}
          aria-label="Next month"
          className="hover:border-[color:var(--accent,#22d3ee)]/50 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#22d3ee)]"
        >
          ›
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            aria-hidden
            className="text-center font-mono text-[0.6rem] uppercase tracking-wider text-slate-600"
          >
            {d}
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-label="Choose a day"
        className={`grid grid-cols-7 gap-1 transition-opacity ${loading ? 'opacity-40' : ''}`}
      >
        {cells.map((date) => {
          const k = keyOf(date);
          const inMonth = date.getMonth() === view.m;
          const available = inMonth && availableDayKeys.has(k);
          const isSelected = k === selectedKey;
          const isToday = k === keyOf(today);
          const tabbable = focusKey ? k === focusKey : available && !selectedKey;

          return (
            <button
              key={k}
              type="button"
              role="gridcell"
              ref={(el) => {
                if (el) cellRefs.current.set(k, el);
                else cellRefs.current.delete(k);
              }}
              disabled={!available}
              aria-selected={isSelected}
              aria-label={date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
              tabIndex={tabbable ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, date)}
              onClick={() => available && onSelectDay(k)}
              className={`relative aspect-square rounded-lg text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#22d3ee)] ${
                !inMonth
                  ? 'text-transparent'
                  : isSelected
                    ? 'bg-[color:var(--accent,#22d3ee)] font-semibold text-[#050510] shadow-[0_0_18px_-4px_var(--accent,#22d3ee)]'
                    : available
                      ? 'hover:bg-[color:var(--accent,#22d3ee)]/15 text-white hover:text-white'
                      : 'cursor-not-allowed text-slate-700'
              }`}
            >
              {date.getDate()}
              {available && !isSelected ? (
                <span
                  aria-hidden
                  className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{ background: 'var(--accent, #22d3ee)' }}
                />
              ) : null}
              {isToday && !isSelected ? (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/15"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
