'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getHyperspeedPreset } from '@/lib/hyperspeed-presets';
import { useWorldLoader } from '@/lib/world-loader-store';

import TrifoldLayout from './trifold/TrifoldLayout';

const Hyperspeed = dynamic(() => import('@/components/ui/Hyperspeed'), {
  ssr: false,
  loading: () => null,
});

const MIN_DISPLAY_MS = 1600;
const FADE_OUT_MS = 600;

type Preset = ReturnType<typeof getHyperspeedPreset>;

/** Centered "Entering {world}" label + progress — shown in the loader's main panel. */
function LoaderLabel({ preset, phase }: { preset: Preset; phase: string }) {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-3 text-center">
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
        className="h-px w-24"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${preset.accentRgb}, 0.85), transparent)`,
        }}
      />
      <span className="mt-1 flex items-center gap-2">
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
      </span>
    </div>
  );
}

export default function WorldLoader() {
  const worldId = useWorldLoader((s) => s.worldId);
  const phase = useWorldLoader((s) => s.phase);
  const startedAt = useWorldLoader((s) => s.startedAt);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

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

  const fadeStyle = { opacity: fading ? 0 : 1, transitionDuration: `${FADE_OUT_MS}ms` };

  const hyperspeed = (
    <div className="absolute inset-0">
      <Hyperspeed effectOptions={effectOptions} />
      {/* Vignette so the panels + label stay legible over the streaks. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </div>
  );

  // Mobile: a single full-screen effect with the label centered (no panel split).
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-[300] overflow-hidden bg-black transition-opacity"
        style={fadeStyle}
        role="status"
        aria-live="assertive"
      >
        {hyperspeed}
        <div className="absolute inset-0 flex items-center justify-center">
          <LoaderLabel preset={preset} phase={phase} />
        </div>
      </div>
    );
  }

  // Desktop: split across the trifold. The effect plays full-bleed behind; the
  // transparent center frames it as the MAIN loader, while the angled frosted
  // side panels take the cropped side pieces — the same geometry the destination
  // (hub or island) renders, so the panels stay put as the loader hands off.
  return (
    <TrifoldLayout
      colorRgb={preset.accentRgb}
      background={hyperspeed}
      rootClassName="fixed inset-0 z-[300] overflow-hidden bg-black transition-opacity"
      rootStyle={fadeStyle}
      rootProps={{ role: 'status', 'aria-live': 'assertive' }}
      left={{ className: 'pointer-events-none', children: null }}
      center={{
        glass: false,
        className: 'pointer-events-none flex items-center justify-center',
        children: <LoaderLabel preset={preset} phase={phase} />,
      }}
      right={{ className: 'pointer-events-none', children: null }}
    />
  );
}
