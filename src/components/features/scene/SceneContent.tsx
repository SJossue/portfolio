'use client';

import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

import { GarageModel } from './GarageModel';
import { DeskModel } from './DeskModel';
import { CarModel } from './CarModel';
import { SceneHitboxes } from './SceneHitboxes';

/**
 * Composes all GLB models into the scene with appropriate positioning and lighting.
 *
 * Models are loaded progressively (one per frame batch) to avoid overwhelming
 * the GPU and causing a WebGL context loss — especially in dev mode where
 * React Strict Mode double-mounts components.
 *
 * Layout:
 * - Garage: the full environment shell (origin)
 * - Desk: front center, the first thing the user sees
 * - Car: center of the garage
 */
export function SceneContent() {
  const [stage, setStage] = useState(0);
  // Advance the loading stage each time a few frames have rendered,
  // giving the GPU time to process each model's geometry.
  useFrame(() => {
    if (stage < 3) {
      setStage((s) => s + 1);
    }
  });

  // Also advance on mount in case useFrame doesn't fire yet
  useEffect(() => {
    const t1 = setTimeout(() => setStage((s) => Math.max(s, 1)), 100);
    const t2 = setTimeout(() => setStage((s) => Math.max(s, 2)), 500);
    const t3 = setTimeout(() => setStage((s) => Math.max(s, 3)), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <group>
      {/* Stage 0+: Cyberpunk lighting (cheap, sets the scene) */}
      <ambientLight intensity={0.15} color="#1a0a2e" />

      {/* Neon magenta key light — left side */}
      <pointLight position={[-4, 3, 2]} color="#ff00ff" intensity={2.5} distance={18} decay={2} />

      {/* Neon cyan fill light — right side */}
      <pointLight position={[5, 3, 3]} color="#00ffff" intensity={2} distance={18} decay={2} />

      {/* Purple overhead glow */}
      <pointLight position={[0, 5, 0]} color="#8b00ff" intensity={1.5} distance={20} decay={2} />

      {/* Hot pink back rim light */}
      <pointLight position={[-3, 3, -5]} color="#ff1493" intensity={1} distance={14} decay={2} />

      {/* Spot on the car — angled from the user's perspective toward origin */}
      <spotLight
        position={[0, 5, 4]}
        angle={Math.PI / 4}
        penumbra={0.2}
        intensity={80}
        color="#ffffeeff"
        distance={20}
        decay={2}
      />

      {/* Subtle spot on the shelf — right of the car */}
      <spotLight
        position={[5, 5, -1]}
        angle={Math.PI / 3}
        penumbra={0.4}
        intensity={40}
        color="#e5ff00ff"
        distance={12}
        decay={2}
      />

      {/* Subtle spot on the workbench — behind the car */}
      <spotLight
        position={[0, 5, -5]}
        angle={Math.PI / 5}
        penumbra={0.6}
        intensity={40}
        color="#ff00ff"
        distance={12}
        decay={2}
      />

      {/* Stage 1: Garage environment (largest model — 9.5MB) */}
      {stage >= 1 && <GarageModel />}

      {/* Stage 2: Desk (3.4MB) */}
      {stage >= 2 && <DeskModel position={[0, 0, 6]} />}

      {/* Stage 3: Car + Environment map (1.3MB + env) */}
      {stage >= 3 && (
        <>
          <CarModel position={[0.5, -0.6, -1]} rotation={[0, -Math.PI / 8, 0]} />
          <Environment preset="night" environmentIntensity={0.2} background={false} />
        </>
      )}

      <SceneHitboxes />
    </group>
  );
}
