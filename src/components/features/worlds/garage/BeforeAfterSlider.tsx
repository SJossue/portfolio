'use client';

import Image from 'next/image';
import { useId, useState } from 'react';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt: string;
  /** CSS `aspect-ratio` value (e.g. `'1774 / 1108'`), ideally matching the
   *  images' own ratio so `object-contain` shows both full-frame with no
   *  letterboxing. Defaults to 4:3. */
  aspectRatio?: string;
}

/** A draggable before/after comparison: the "after" image sits full-bleed, the
 *  "before" image is clipped to the slider position and layered on top, and a
 *  native range input (visually hidden, fully accessible) drives the reveal —
 *  mouse, touch, and keyboard all work for free. */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  alt,
  aspectRatio = '4 / 3',
}: BeforeAfterSliderProps) {
  const [percent, setPercent] = useState(50);
  const id = useId();

  return (
    <div
      className="border-white/8 relative w-full select-none overflow-hidden rounded-2xl border bg-black/20"
      style={{ aspectRatio }}
    >
      <Image
        src={after}
        alt={`${alt} — ${afterLabel}`}
        fill
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-contain"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${alt} — ${beforeLabel}`}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain"
          draggable={false}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
        {afterLabel}
      </span>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/80"
        style={{ left: `${percent}%` }}
      >
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/70 text-white shadow-lg backdrop-blur">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="8 7 3 12 8 17" />
            <polyline points="16 7 21 12 16 17" />
          </svg>
        </div>
      </div>

      <label htmlFor={id} className="sr-only">
        Drag to compare {beforeLabel.toLowerCase()} and {afterLabel.toLowerCase()} for {alt}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={percent}
        onChange={(e) => setPercent(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}
