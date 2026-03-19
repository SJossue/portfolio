'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  stagger?: number;
  className?: string;
}

const animationDefaults: Record<Animation, gsap.TweenVars> = {
  'fade-up': { y: 40, opacity: 0 },
  'fade-in': { opacity: 0 },
  'slide-left': { x: -60, opacity: 0 },
  'slide-right': { x: 60, opacity: 0 },
};

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  stagger = 0,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tween: gsap.core.Tween | undefined;

    // Dynamically import ScrollTrigger to avoid Turbopack module resolution hang
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      const from = animationDefaults[animation];
      const targets = stagger ? el.children : el;

      gsap.set(targets, from);

      tween = gsap.to(targets, {
        ...Object.fromEntries(Object.keys(from).map((k) => [k, k === 'opacity' ? 1 : 0])),
        duration: 0.8,
        delay,
        stagger: stagger || undefined,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [animation, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
