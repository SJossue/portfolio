'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CursorGlowProps {
  color: string;
  colorRgb: string;
}

export default function CursorGlow({ color, colorRgb }: CursorGlowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only enable on devices with a mouse (not touch)
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e: MouseEvent) => {
      gsap.to(el, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(${colorRgb}, 0.08), transparent 70%)`,
        filter: 'blur(40px)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
