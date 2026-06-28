'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useWorldLoader } from '@/lib/world-loader-store';

import IslandChat from '../IslandChat';
import HubBackground from './HubBackground';
import IslandDetailsPanel from './IslandDetailsPanel';
import IslandListPanel from './IslandListPanel';
import IslandStagePanel from './IslandStagePanel';

export default function TrifoldHub() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
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

  // Crossfade the center + right panels when the selection changes.
  const fade = reducedMotion
    ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      };

  return (
    <div
      className="relative min-h-dvh bg-[#0f3d2e]"
      style={{ '--world-color-rgb': selectedWorld.colorRgb } as React.CSSProperties}
    >
      {/* Skip link — visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
      >
        Skip to content
      </a>

      <HubBackground />

      <div className="relative z-10 flex flex-col gap-4 p-4 lg:grid lg:h-dvh lg:grid-cols-[minmax(0,20rem)_1.5fr_minmax(0,22rem)] lg:gap-5 lg:p-6">
        <GlassPanel as="aside" aria-label="Islands" accent className="overflow-y-auto lg:h-full">
          <IslandListPanel
            worlds={worlds}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            accentColor={selectedWorld.color}
            accentRgb={selectedWorld.colorRgb}
          />
        </GlassPanel>

        <GlassPanel
          as="section"
          aria-label="Selected island"
          accent
          className="overflow-hidden lg:h-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selectedWorld.id} className="h-full" {...fade}>
              <IslandStagePanel world={selectedWorld} onEnter={() => enterWorld(selectedWorld)} />
            </motion.div>
          </AnimatePresence>
        </GlassPanel>

        <GlassPanel
          as="section"
          aria-label="Island details"
          accent
          className="overflow-y-auto lg:h-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={selectedWorld.id} className="h-full" {...fade}>
              <IslandDetailsPanel
                world={selectedWorld}
                index={selectedIndex}
                total={worlds.length}
              />
            </motion.div>
          </AnimatePresence>
        </GlassPanel>
      </div>

      {/* Universal chat — floats over the panels, anchored bottom-right so it
          never covers the centered Enter CTA. */}
      <div className="pointer-events-none fixed bottom-6 right-4 z-30 flex justify-end">
        <IslandChat
          accentColor={selectedWorld.color}
          accentRgb={selectedWorld.colorRgb}
          isMobile={isMobile}
          defaultMinimized={isMobile}
        />
      </div>
    </div>
  );
}
