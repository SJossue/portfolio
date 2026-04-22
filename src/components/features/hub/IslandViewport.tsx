'use client';

import { useState } from 'react';
import type { WorldData } from '@/content/worlds';
import IslandScene from './IslandScene';
import BlurText from '@/components/ui/BlurText';
import TextScramble from '@/components/ui/TextScramble';
import CountUp from '@/components/ui/CountUp';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface IslandViewportProps {
  world: WorldData;
  index: number;
  total: number;
  isActive: boolean;
  onEnter: () => void;
}

export default function IslandViewport({
  world,
  index,
  total,
  isActive,
  onEnter,
}: IslandViewportProps) {
  const [hasBeenActive, setHasBeenActive] = useState(false);

  if (isActive && !hasBeenActive) setHasBeenActive(true);

  return (
    <section
      className="relative flex min-h-dvh w-screen flex-shrink-0 flex-col items-center justify-start overflow-x-hidden pb-40 pt-[120px] md:h-dvh md:flex-row md:items-center md:justify-center md:overflow-hidden md:pb-0 md:pt-0"
      aria-label={`${world.name} world`}
    >
      {/* Left panel (top on mobile) */}
      <div className="relative z-10 w-full flex-shrink-0 px-6 text-center md:w-[320px] md:px-0 md:pl-12 md:text-left lg:w-[360px] lg:pl-16 3xl:w-[440px] 3xl:pl-24 4xl:w-[540px] 4xl:pl-36">
        {/* World number */}
        <div
          className="font-mono text-[13px] font-semibold tracking-[3px] md:text-[12px]"
          style={{ color: `rgba(${world.colorRgb}, 0.45)` }}
        >
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        {/* Title — one word per line */}
        <div className="mt-2 flex flex-col items-center gap-0 md:mt-3 md:items-start">
          {world.name.split(' ').map((word, i) =>
            hasBeenActive ? (
              <BlurText
                key={`${word}-${i}`}
                text={word}
                delay={100 + i * 200}
                animateBy="letters"
                className="whitespace-nowrap text-[40px] font-extrabold leading-[1.05] tracking-[2px] sm:text-[48px] md:text-[50px] lg:text-[56px] 3xl:text-[72px] 4xl:text-[88px]"
                stepDuration={0.3}
              />
            ) : (
              <span
                key={`${word}-${i}`}
                className="text-[44px] font-extrabold leading-[1.05] tracking-[2px] opacity-0 sm:text-[52px] md:text-[56px] 3xl:text-[72px] 4xl:text-[88px]"
              >
                {word}
              </span>
            ),
          )}
        </div>

        {/* Color the title text */}
        <style>{`
          section[aria-label="${world.name} world"] .blur-text span,
          section[aria-label="${world.name} world"] .flex.flex-wrap span {
            color: ${world.color};
          }
        `}</style>

        {/* Divider */}
        <div
          className="mx-auto mt-4 h-[2px] w-9 rounded-full md:mx-0 md:mt-5"
          style={{ background: `rgba(${world.colorRgb}, 0.35)` }}
        />

        {/* Description */}
        <p className="mt-4 text-[15px] leading-[1.7] text-slate-400 md:mt-5 md:text-[14px] 3xl:text-[17px] 4xl:text-[19px]">
          {world.description}
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap justify-center gap-[8px] md:mt-5 md:justify-start">
          {world.stats.map((stat) => (
            <span
              key={stat.label}
              className="rounded-full px-3 py-[5px] font-mono text-[12px] md:text-[11px]"
              style={{
                background: `rgba(${world.colorRgb}, 0.08)`,
                border: `1px solid rgba(${world.colorRgb}, 0.15)`,
                color: world.color,
              }}
            >
              {hasBeenActive ? <CountUp to={stat.value} duration={1.5} /> : stat.value} {stat.label}
            </span>
          ))}
        </div>

        {/* Enter button — desktop only (in left panel) */}
        <div className="hidden md:mt-7 md:block">
          <SpotlightCard
            className="inline-block cursor-pointer rounded-full !p-0"
            spotlightColor={`rgba(${world.colorRgb}, 0.3)`}
          >
            <button
              onClick={onEnter}
              className="rounded-full px-6 py-[11px] text-[13px] font-semibold tracking-[2px] transition-all hover:scale-105"
              style={{
                background: `rgba(${world.colorRgb}, 0.1)`,
                border: `1px solid rgba(${world.colorRgb}, 0.2)`,
                color: world.color,
                boxShadow: `0 0 15px rgba(${world.colorRgb}, 0.06)`,
              }}
            >
              ENTER →
            </button>
          </SpotlightCard>
        </div>
      </div>

      {/* Center: Island preview */}
      <div className="relative z-0 flex h-[240px] w-full items-center justify-center px-4 md:h-auto md:flex-1">
        <IslandScene
          worldId={world.id}
          worldName={world.name}
          color={world.color}
          colorRgb={world.colorRgb}
          isActive={isActive}
          onEnter={onEnter}
        />
      </div>

      {/* Right panel (bottom on mobile) */}
      <div className="relative z-10 w-full flex-shrink-0 px-6 text-center md:w-[240px] md:px-0 md:pr-12 md:text-right lg:w-[360px] lg:pr-16 3xl:w-[440px] 3xl:pr-24 4xl:w-[540px] 4xl:pr-36">
        <div
          className="mb-4 font-mono text-[12px] tracking-[2px] md:mb-6 md:text-[11px]"
          style={{ color: `rgba(${world.colorRgb}, 0.4)` }}
        >
          {hasBeenActive ? (
            <TextScramble text="HIGHLIGHTS" trigger={isActive} speed={40} />
          ) : (
            'HIGHLIGHTS'
          )}
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          {world.highlights.map((highlight, i) => (
            <div key={i}>
              <div className="text-[15px] font-semibold text-slate-200 md:text-[14px] 3xl:text-[17px] 4xl:text-[19px]">
                {highlight.title}
              </div>
              <div className="mt-1 text-[13px] text-slate-500 md:text-[12px] 3xl:text-[14px] 4xl:text-[16px]">
                {highlight.tech}
              </div>
              {i < world.highlights.length - 1 && (
                <div
                  className="mx-auto mt-4 h-px w-3/4 md:ml-auto md:mr-0 md:mt-5 md:w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(${world.colorRgb}, 0.12))`,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {world.moreCount > 0 && (
          <div className="mt-5 font-mono text-[12px] tracking-wider text-slate-600 md:mt-6 md:text-[11px]">
            + {world.moreCount} more inside →
          </div>
        )}

        {/* Enter button — mobile only (centered at bottom) */}
        <div className="mt-6 flex justify-center md:hidden">
          <SpotlightCard
            className="inline-block cursor-pointer rounded-full !p-0"
            spotlightColor={`rgba(${world.colorRgb}, 0.3)`}
          >
            <button
              onClick={onEnter}
              className="rounded-full px-8 py-3.5 text-[15px] font-semibold tracking-[2px] transition-all hover:scale-105"
              style={{
                background: `rgba(${world.colorRgb}, 0.1)`,
                border: `1px solid rgba(${world.colorRgb}, 0.2)`,
                color: world.color,
                boxShadow: `0 0 15px rgba(${world.colorRgb}, 0.06)`,
              }}
            >
              ENTER →
            </button>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
