'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from './icons';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
      <div className="mb-3 flex items-center justify-between">
        <div className="text-base font-medium text-white" aria-live="polite">
          {monthLabel}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              canGoPrev && setView(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))
            }
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 disabled:opacity-25 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div key={d} aria-hidden className="py-1 text-center text-xs font-medium text-slate-500">
            {d}
          </div>
        ))}
      </div>

      <div
        role="grid"
        aria-label="Choose a day"
        className={`grid grid-cols-7 gap-y-1 transition-opacity ${loading ? 'opacity-40' : ''}`}
      >
        {cells.map((date) => {
          const k = keyOf(date);
          const inMonth = date.getMonth() === view.m;
          const available = inMonth && availableDayKeys.has(k);
          const isSelected = k === selectedKey;
          const isToday = k === keyOf(today);
          const tabbable = focusKey ? k === focusKey : available && !selectedKey;

          return (
            <div key={k} className="flex justify-center py-0.5">
              <button
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
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
                  !inMonth
                    ? 'invisible'
                    : isSelected
                      ? 'bg-cyan-500 font-semibold text-[#06060c]'
                      : available
                        ? 'font-medium text-cyan-300 hover:bg-cyan-500/15'
                        : 'cursor-not-allowed text-slate-600'
                } ${isToday && !isSelected ? 'ring-1 ring-inset ring-white/25' : ''}`}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
