'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useWorldLoader } from '@/lib/world-loader-store';

import IslandChat from '../IslandChat';
import HackathonHero from './HackathonHero';
import HubBackground from './HubBackground';
import IslandListPanel from './IslandListPanel';
import IslandSelector from './IslandSelector';
import StageHero from './StageHero';

/**
 * Trifold spatial hub: orchestrates the island list, stage, and hackathon glass
 * panels. Owns the selected-island state, drives the per-world accent
 * (`--world-color-rgb`), and runs the `enterWorld` deep-dive flow
 * (WorldLoader → world route).
 */
export default function TrifoldHub() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const startWorldLoader = useWorldLoader((s) => s.start);
  const enteringRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedWorld = worlds[selectedIndex];

  const enterWorld = useCallback(
    (world: (typeof worlds)[number]) => {
      if (enteringRef.current) return;
      enteringRef.current = true;
      startWorldLoader(world.id);
      // Allow the loader to mount/paint a frame before route navigation
      // tears down this tree.
      requestAnimationFrame(() => {
        router.push(world.slug);
      });
    },
    [router, startWorldLoader],
  );

  return (
    <div
      className="relative min-h-dvh bg-[#07070b]"
      style={{ '--world-color-rgb': selectedWorld.colorRgb } as React.CSSProperties}
    >
      {/* Skip link — jumps past the island nav to the selected-island stage. */}
      <a
        href="#hub-stage"
        className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
      >
        Skip to island content
      </a>

      <HubBackground colorRgb={selectedWorld.colorRgb} worldId={selectedWorld.id} />

      <div className="relative z-10 flex flex-col gap-4 p-4 lg:grid lg:h-dvh lg:grid-cols-[minmax(0,20rem)_1.5fr_minmax(0,22rem)] lg:gap-5 lg:p-6">
        <GlassPanel
          as="aside"
          aria-label="Profile"
          accent
          className="overflow-y-auto lg:h-full"
          style={
            isMobile
              ? undefined
              : { transform: 'perspective(1600px) rotateY(13deg)', transformOrigin: 'right center' }
          }
        >
          <IslandListPanel accentColor={selectedWorld.color} accentRgb={selectedWorld.colorRgb}>
            <IslandChat
              accentColor={selectedWorld.color}
              accentRgb={selectedWorld.colorRgb}
              isMobile={isMobile}
              defaultMinimized={isMobile}
            />
          </IslandListPanel>
        </GlassPanel>

        <GlassPanel
          as="section"
          id="hub-stage"
          tabIndex={-1}
          aria-label="Selected island"
          accent
          className="overflow-hidden focus-visible:outline-none lg:h-full"
        >
          <div className="flex h-full flex-col">
            {/* Constant hero — Jossue's photo + name. */}
            <StageHero />
            {/* The island list fills the rest of the center. Selecting drives the
                right panel + accent + background; clicking the selected island
                enters that world. */}
            <IslandSelector
              worlds={worlds}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onEnter={enterWorld}
              accentColor={selectedWorld.color}
              accentRgb={selectedWorld.colorRgb}
            />
          </div>
        </GlassPanel>

        <GlassPanel
          as="section"
          aria-label="Island details"
          accent
          className="overflow-y-auto lg:h-full"
          style={
            isMobile
              ? undefined
              : { transform: 'perspective(1600px) rotateY(-13deg)', transformOrigin: 'left center' }
          }
        >
          <div className="flex min-h-full flex-col">
            {/* Cycling hackathon hero — fills the right panel. */}
            <HackathonHero />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
