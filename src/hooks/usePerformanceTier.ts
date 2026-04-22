'use client';

import { useEffect, useState } from 'react';

import { useIsMobile } from './useIsMobile';
import { useReducedMotion } from './useReducedMotion';

export type PerformanceTier = 'low' | 'mid' | 'high';

interface NavigatorWithCapabilities extends Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
  };
}

/**
 * Detects the device's performance tier based on hardware signals.
 *
 * Signals considered:
 * - `navigator.hardwareConcurrency` (CPU cores)
 * - `navigator.deviceMemory` (GB, when available)
 * - `navigator.connection.effectiveType` (network quality, when available)
 * - `window.devicePixelRatio` (throttled on mobile)
 * - Mobile viewport (caps tier at 'mid' unless the device is clearly high-end)
 * - `prefers-reduced-motion` (forces 'low')
 *
 * Returns 'mid' during SSR and before hydration settles, then updates once
 * client-side capabilities are available.
 */
export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('mid');
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (reducedMotion) {
      setTier('low');
      if (process.env.NODE_ENV !== 'production') {
        console.info('[usePerformanceTier] reduced motion → low');
      }
      return;
    }

    const nav = navigator as NavigatorWithCapabilities;
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    const connection = nav.connection?.effectiveType;
    const dpr = window.devicePixelRatio ?? 1;

    let detected: PerformanceTier = 'mid';

    if (cores >= 8 && memory >= 8 && !isMobile) {
      detected = 'high';
    } else if (cores >= 4 && memory >= 4) {
      detected = 'mid';
    }

    // Downgrades
    if (cores < 4 || memory < 4) {
      detected = 'low';
    }
    if (connection === '2g' || connection === 'slow-2g' || connection === '3g') {
      detected = detected === 'high' ? 'mid' : 'low';
    }
    // High DPR on mobile strains the GPU even on capable chips.
    if (isMobile && dpr > 2 && detected === 'high') {
      detected = 'mid';
    }
    // Mobile generally caps at 'mid' unless the chip is clearly high-end.
    if (isMobile && detected === 'high' && cores < 8) {
      detected = 'mid';
    }

    setTier(detected);

    if (process.env.NODE_ENV !== 'production') {
      console.info('[usePerformanceTier]', {
        tier: detected,
        cores,
        memory,
        connection,
        dpr,
        isMobile,
      });
    }
  }, [isMobile, reducedMotion]);

  return tier;
}
