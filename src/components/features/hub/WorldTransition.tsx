'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface WorldTransitionProps {
  active: boolean;
  color: string;
  colorRgb: string;
  onComplete: () => void;
}

export default function WorldTransition({
  active,
  color,
  colorRgb,
  onComplete,
}: WorldTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !overlayRef.current || !textRef.current) return;

    const overlay = overlayRef.current;
    const text = textRef.current;

    // Reset state
    overlay.style.opacity = '1';
    overlay.style.clipPath = 'circle(0% at 50% 50%)';
    text.style.opacity = '0';
    text.style.transform = 'scale(0.7)';

    const tl = gsap.timeline({
      onComplete,
    });

    // Expand circle
    tl.to(overlay, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 0.6,
      ease: 'power2.in',
    });

    // Fade in + scale up "ENTERING..." text slightly before the circle finishes
    tl.to(
      text,
      {
        opacity: 1,
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out',
      },
      0.2,
    );

    return () => {
      tl.kill();
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        backgroundColor: color,
        clipPath: 'circle(0% at 50% 50%)',
      }}
      aria-live="assertive"
      role="status"
    >
      <span
        ref={textRef}
        className="text-lg font-semibold tracking-[6px] text-white/90"
        style={{
          opacity: 0,
          transform: 'scale(0.7)',
          textShadow: `0 0 30px rgba(${colorRgb}, 0.5)`,
        }}
      >
        ENTERING...
      </span>
    </div>
  );
}
