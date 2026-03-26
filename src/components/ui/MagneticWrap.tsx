'use client';

import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

interface MagneticWrapProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticWrap({ children, strength = 0.3, className = '' }: MagneticWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    [strength],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave]);

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
