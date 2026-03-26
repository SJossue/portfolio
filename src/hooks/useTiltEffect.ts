'use client';

import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useIsMobile } from './useIsMobile';

const MAX_TILT = 5; // degrees

export function useTiltEffect<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const isMobile = useIsMobile();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - y) * MAX_TILT * 2;
    const rotateY = (x - 0.5) * MAX_TILT * 2;

    gsap.to(el, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || isMobile) return;

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave]);

  return ref;
}
