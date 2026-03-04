'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export function FpsMonitor() {
  const [fps, setFps] = useState(60);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frames.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;
    if (elapsed >= 1000) {
      setFps(Math.round((frames.current * 1000) / elapsed));
      frames.current = 0;
      lastTime.current = now;
    }
  });

  if (process.env.NODE_ENV !== 'development') return null;

  const color = fps >= 55 ? '#00ff88' : fps >= 30 ? '#ffaa00' : '#ff4444';

  return (
    <group position={[0, 0, 0]}>
      {/* Renders nothing in the 3D scene — FPS displayed via Html would be expensive.
          Instead this component just logs FPS to a CSS variable for the HUD to read. */}
      {null}
    </group>
  );
}
