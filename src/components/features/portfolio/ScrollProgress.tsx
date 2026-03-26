'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    let tween: gsap.core.Tween | undefined;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      tween = gsap.to(el, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label="Page scroll progress"
      className="fixed left-0 right-0 top-12 z-50 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 sm:top-14"
    />
  );
}
