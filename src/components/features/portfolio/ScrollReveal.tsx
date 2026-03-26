'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';

type Animation =
  | 'fade-up'
  | 'fade-in'
  | 'slide-left'
  | 'slide-right'
  | 'scale-up'
  | 'blur-in'
  | 'clip-reveal';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  stagger?: number;
  className?: string;
  scrub?: boolean;
}

const animationFrom: Record<Animation, gsap.TweenVars> = {
  'fade-up': { y: 40, opacity: 0 },
  'fade-in': { opacity: 0 },
  'slide-left': { x: -60, opacity: 0 },
  'slide-right': { x: 60, opacity: 0 },
  'scale-up': { scale: 0.9, opacity: 0 },
  'blur-in': { opacity: 0, filter: 'blur(8px)' },
  'clip-reveal': { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
};

const animationTo: Record<Animation, gsap.TweenVars> = {
  'fade-up': { y: 0, opacity: 1 },
  'fade-in': { opacity: 1 },
  'slide-left': { x: 0, opacity: 1 },
  'slide-right': { x: 0, opacity: 1 },
  'scale-up': { scale: 1, opacity: 1 },
  'blur-in': { opacity: 1, filter: 'blur(0px)' },
  'clip-reveal': { clipPath: 'inset(0% 0 0 0)', opacity: 1 },
};

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  stagger = 0,
  className = '',
  scrub = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let tween: gsap.core.Tween | undefined;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      const from = animationFrom[animation];
      const to = animationTo[animation];
      const targets = stagger ? el.children : el;

      gsap.set(targets, from);

      tween = gsap.to(targets, {
        ...to,
        duration: scrub ? undefined : 0.8,
        delay: scrub ? undefined : delay,
        stagger: stagger || undefined,
        ease: scrub ? 'none' : 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: scrub ? 'top 25%' : undefined,
          scrub: scrub ? 0.5 : false,
          toggleActions: scrub ? undefined : 'play none none none',
        },
      });
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [animation, delay, stagger, scrub]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
