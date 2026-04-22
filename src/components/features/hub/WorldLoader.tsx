'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getHyperspeedPreset } from '@/lib/hyperspeed-presets';
import { useWorldLoader } from '@/lib/world-loader-store';

const Hyperspeed = dynamic(() => import('@/components/ui/Hyperspeed'), {
  ssr: false,
  loading: () => null,
});

const MIN_DISPLAY_MS = 1600;
const FADE_OUT_MS = 600;

export default function WorldLoader() {
  const worldId = useWorldLoader((s) => s.worldId);
  const phase = useWorldLoader((s) => s.phase);
  const startedAt = useWorldLoader((s) => s.startedAt);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const reducedMotion = useReducedMotion();

  const preset = useMemo(() => getHyperspeedPreset(worldId), [worldId]);
  // The Hyperspeed effect tears down + recreates its WebGL scene whenever its
  // options object identity changes — keep the reference stable per worldId.
  const effectOptions = useMemo(() => preset.options, [preset]);

  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const dismissTimer = useRef<number | null>(null);

  // Mount/unmount on phase
  useEffect(() => {
    if (phase === 'entering') {
      setVisible(true);
      setFading(false);
    }
  }, [phase]);

  // When destination signals ready, wait out the min-display window then fade
  useEffect(() => {
    if (phase !== 'ready' || !startedAt) return;

    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const t = window.setTimeout(() => {
      setFading(true);
      dismissTimer.current = window.setTimeout(() => {
        setVisible(false);
        dismiss();
      }, FADE_OUT_MS);
    }, wait);

    return () => {
      window.clearTimeout(t);
      if (dismissTimer.current) window.clearTimeout(dismissTimer.current);
    };
  }, [phase, startedAt, dismiss]);

  if (!visible) return null;

  // Reduced-motion: skip the heavy 3D scene, show a calm color wash + label.
  if (reducedMotion) {
    return (
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center transition-opacity"
        style={{
          backgroundColor: preset.accentHex,
          opacity: fading ? 0 : 1,
          transitionDuration: `${FADE_OUT_MS}ms`,
        }}
        role="status"
        aria-live="assertive"
      >
        <span className="font-mono text-sm tracking-[0.4em] text-white/90">
          ENTERING {preset.label.toUpperCase()}…
        </span>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[300] overflow-hidden bg-black transition-opacity"
      style={{
        opacity: fading ? 0 : 1,
        transitionDuration: `${FADE_OUT_MS}ms`,
      }}
      role="status"
      aria-live="assertive"
    >
      <Hyperspeed effectOptions={effectOptions} />

      {/* Vignette + bottom scrim for legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Top label */}
      <div className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center gap-3 sm:top-16">
        <span
          className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/55"
          style={{ textShadow: `0 0 18px rgba(${preset.accentRgb}, 0.6)` }}
        >
          Entering
        </span>
        <span
          className="text-2xl font-black uppercase tracking-[0.35em] text-white sm:text-3xl"
          style={{ textShadow: `0 0 28px rgba(${preset.accentRgb}, 0.55)` }}
        >
          {preset.label}
        </span>
        <span
          className="mt-1 h-px w-24 origin-center"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${preset.accentRgb}, 0.85), transparent)`,
          }}
        />
      </div>

      {/* Bottom progress / breathing dot */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-center gap-2 sm:bottom-14">
        <span
          className="block h-1.5 w-1.5 animate-pulse rounded-full"
          style={{
            backgroundColor: preset.accentHex,
            boxShadow: `0 0 18px rgba(${preset.accentRgb}, 0.85)`,
          }}
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/55">
          {phase === 'ready' ? 'Stabilizing' : 'Calibrating'}
        </span>
      </div>
    </div>
  );
}
