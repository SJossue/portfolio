'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    // Bridge Lenis scroll events to GSAP ScrollTrigger
    let scrollTriggerReady = false;
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerReady = true;

      lenis.on('scroll', () => {
        if (scrollTriggerReady) {
          ScrollTrigger.update();
        }
      });
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [enabled]);
}
