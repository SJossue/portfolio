'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className = '' }: SectionHeaderProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { scaleX: 1 });
      return;
    }

    let tween: gsap.core.Tween | undefined;

    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);

      tween = gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <div className={`mb-8 flex items-center gap-4 ${className}`}>
      <h2 className="shrink-0 text-2xl font-bold text-white sm:text-3xl">
        <span className="font-mono text-cyan-400">//</span> {title}
      </h2>
      <div
        ref={lineRef}
        className="h-px flex-1 origin-left bg-gradient-to-r from-cyan-400/40 to-transparent"
      />
    </div>
  );
}
