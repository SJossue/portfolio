'use client';

import { worlds } from '@/content/worlds';

interface HubNavProps {
  activeIndex: number;
  onNavigate: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function HubNav({ activeIndex, onNavigate, onPrev, onNext }: HubNavProps) {
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === worlds.length - 1;
  const nextWorld = !isLast ? worlds[activeIndex + 1] : null;

  return (
    <>
      {/* Left arrow — hidden on mobile */}
      <button
        onClick={onPrev}
        disabled={isFirst}
        aria-label="Previous world"
        className="fixed left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-opacity md:flex"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.06)',
          opacity: isFirst ? 0.15 : 0.6,
          cursor: isFirst ? 'default' : 'pointer',
        }}
      >
        <span className="text-lg text-slate-500">‹</span>
      </button>

      {/* Right arrow — hidden on mobile */}
      <button
        onClick={onNext}
        disabled={isLast}
        aria-label="Next world"
        className="fixed right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-all md:flex"
        style={{
          background: nextWorld ? `rgba(${nextWorld.colorRgb}, 0.06)` : 'rgba(255,255,255,0.02)',
          borderColor: nextWorld ? `rgba(${nextWorld.colorRgb}, 0.18)` : 'rgba(255,255,255,0.06)',
          opacity: isLast ? 0.15 : 1,
          boxShadow: nextWorld ? `0 0 14px rgba(${nextWorld.colorRgb}, 0.08)` : 'none',
          cursor: isLast ? 'default' : 'pointer',
        }}
      >
        <span style={{ color: nextWorld?.color ?? '#64748b' }} className="text-lg">
          ›
        </span>
      </button>

      {/* Bottom dots — larger touch targets on mobile */}
      <nav
        className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 md:gap-3"
        aria-label="World navigation"
      >
        {worlds.map((world, i) => (
          <button
            key={world.id}
            onClick={() => onNavigate(i)}
            aria-label={`Go to ${world.name}`}
            aria-current={i === activeIndex ? 'true' : undefined}
            className="relative flex items-center justify-center"
          >
            {/* Invisible touch target for mobile */}
            <span className="absolute h-8 w-8 md:h-5 md:w-5" />
            {/* Visible dot */}
            <span
              className="block h-[6px] rounded-full transition-all duration-300 md:h-1"
              style={{
                width: i === activeIndex ? 28 : 10,
                background:
                  i === activeIndex
                    ? world.color
                    : `rgba(${world.colorRgb}, ${0.3 - Math.abs(i - activeIndex) * 0.05})`,
                boxShadow: i === activeIndex ? `0 0 8px ${world.color}4d` : 'none',
              }}
            />
          </button>
        ))}
      </nav>
    </>
  );
}
