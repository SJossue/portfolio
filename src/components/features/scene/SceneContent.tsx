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
      {/* Stage 0+: Clean Tech Showroom lighting */}
      <ambientLight intensity={0.4} color="#e6f2ff" />

      {/* Main overarching fill light (cool white) */}
      <pointLight position={[0, 8, 2]} color="#ffffff" intensity={2} distance={25} decay={2} />

      {/* Dramatic Spot on the car */}
      <spotLight
        position={[0, 6, 2]}
        angle={Math.PI / 3}
        penumbra={0.3}
        intensity={100}
        color="#ffffff"
        distance={20}
        decay={2}
        castShadow
      />

      {/* Focused Spot on the desk area */}
      <spotLight
        position={[2, 5, 5]}
        angle={Math.PI / 4}
        penumbra={0.5}
        intensity={60}
        color="#f4faff"
        distance={15}
        decay={2}
      />

      {/* Soft rim light behind the car to separate it from the background */}
      <pointLight position={[-3, 2, -6]} color="#b0d4ff" intensity={1.5} distance={15} decay={2} />

      {/* Stage 1: Garage environment (largest model — 9.5MB) */}
      {stage >= 1 && <GarageModel />}

      {/* Stage 2: Desk (3.4MB) */}
      {stage >= 2 && <DeskModel position={[2, 0, 5]} rotation={[0, -Math.PI / 3, 0]} />}

      {/* Stage 3: Car + Environment map (1.3MB + env) */}
      {stage >= 3 && (
        <>
          <CarModel position={[0.5, -0.6, -1]} rotation={[0, -Math.PI / 8, 0]} />
          <Environment preset="studio" environmentIntensity={0.8} background={false} />
        </>
      )}

      <SceneHitboxes />
    </group>
  );
}
