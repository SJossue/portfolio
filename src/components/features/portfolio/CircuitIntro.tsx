'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { createFlows, updateFlows } from '@/lib/circuit-intro/particles';
import { renderFrame } from '@/lib/circuit-intro/renderer';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CircuitIntroProps {
  onComplete: () => void;
}

export function CircuitIntro({ onComplete }: CircuitIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const tickerRef = useRef<gsap.TickerCallback | null>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      sessionStorage.setItem('intro-played', '1');
    } catch {
      // sessionStorage may be unavailable
    }
    onComplete();
  }, [onComplete]);

  // Skip immediately if reduced motion or already played
  useEffect(() => {
    if (reducedMotion) {
      finish();
      return;
    }
    try {
      if (sessionStorage.getItem('intro-played')) {
        finish();
        return;
      }
    } catch {
      // sessionStorage unavailable — play animation
    }
    setReady(true);
  }, [reducedMotion, finish]);

  // Main animation
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      finish();
      return;
    }

    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const flows = createFlows(isMobile);

      // State driven by GSAP timeline
      const state = { converge: 0, textAlpha: 0, ribbonAlpha: 0 };
      let elapsed = 0;

      // Render loop
      const render = (_: number, delta: number) => {
        if (cancelled) return;
        elapsed += delta / 1000;
        updateFlows(flows, w, h, state.converge, elapsed);
        renderFrame(ctx, flows, state.textAlpha, state.ribbonAlpha, dpr);
      };
      tickerRef.current = render;
      gsap.ticker.add(render);

      // Timeline (~3.5s)
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(container, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: finish,
          });
        },
      });
      timelineRef.current = tl;

      // Phase 1: Ribbons appear and flow freely
      tl.to(state, {
        ribbonAlpha: 0.6,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Phase 2: Ribbons converge toward center
      tl.to(
        state,
        {
          converge: 1,
          duration: 1.8,
          ease: 'power2.inOut',
        },
        0.3,
      );

      // Phase 3: Text fades in as ribbons tighten
      tl.to(
        state,
        {
          textAlpha: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.8',
      );

      // Ribbons dim slightly so text is the star
      tl.to(
        state,
        {
          ribbonAlpha: 0.3,
          duration: 0.6,
          ease: 'power1.out',
        },
        '<',
      );

      // Hold
      tl.to({}, { duration: 0.6 });
    });

    return () => {
      cancelled = true;
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
        tickerRef.current = null;
      }
    };
  }, [ready, finish]);

  if (!ready) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] bg-black" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
      <button
        onClick={finish}
        className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-widest text-white/20 transition-colors hover:text-white/50"
        aria-label="Skip intro animation"
      >
        Skip
      </button>
    </div>
  );
}
