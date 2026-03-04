'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function FpsMonitorInner() {
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;
    if (elapsed >= 1000) {
      const fps = Math.round((frames.current * 1000) / elapsed);
      document.documentElement.style.setProperty('--scene-fps', String(fps));
      frames.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}

export function FpsMonitor() {
  if (process.env.NODE_ENV !== 'development') return null;
  return <FpsMonitorInner />;
}
