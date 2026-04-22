'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  duration?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.8,
  distance = 40,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const from: gsap.TweenVars = { opacity: 0, duration, delay, ease: 'power2.out' };
    if (direction === 'up') from.y = distance;
    if (direction === 'left') from.x = -distance;
    if (direction === 'right') from.x = distance;

    const tween = gsap.from(ref.current, {
      ...from,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, direction, duration, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
