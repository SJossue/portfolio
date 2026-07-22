'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useWorldLoader } from '@/lib/world-loader-store';

import HubSocials from '../HubSocials';
import IslandChat from '../LazyIslandChat';
import HackathonHero from './HackathonHero';
import IslandListPanel from './IslandListPanel';
import IslandSelector from './IslandSelector';
import StageHero from './StageHero';
import TrifoldLayout from './TrifoldLayout';

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
    <TrifoldLayout
      colorRgb={selectedWorld.colorRgb}
      lead={
        // Skip link — jumps past the island nav to the selected-island stage.
        <a
          href="#hub-stage"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to island content
        </a>
      }
      left={{
        as: 'aside',
        // Mobile stacking order: hero+islands first, then this profile rail, then the
        // hackathon/socials footer. Reset to source order for the desktop grid.
        className: 'order-2 lg:order-none',
        panelProps: { 'aria-label': 'Profile' },
        children: (
          <IslandListPanel>
            <IslandChat
              accentColor={selectedWorld.color}
              accentRgb={selectedWorld.colorRgb}
              isMobile={isMobile}
              defaultMinimized={isMobile}
            />
          </IslandListPanel>
        ),
      }}
      center={{
        as: 'section',
        className: 'order-1 overflow-hidden lg:order-none',
        panelProps: { id: 'hub-stage', tabIndex: -1, 'aria-label': 'Selected island' },
        children: (
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
        ),
      }}
      right={{
        as: 'section',
        className: 'order-3 lg:order-none',
        panelProps: { 'aria-label': 'Island details' },
        children: (
          <div className="flex min-h-full flex-col">
            {/* Cycling hackathon hero — fills the right panel. */}
            <HackathonHero />
            {/* Social links — centered at the bottom of the right panel. */}
            <div className="mt-auto flex justify-center pb-6">
              <HubSocials
                accentColor={selectedWorld.color}
                accentRgb={selectedWorld.colorRgb}
                layout="inline"
              />
            </div>
          </div>
        ),
      }}
    />
  );
}
