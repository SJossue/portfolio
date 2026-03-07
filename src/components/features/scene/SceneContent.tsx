'use client';

import { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, BakeShadows } from '@react-three/drei';

import { GarageModel } from './GarageModel';
import { DeskModel } from './DeskModel';
import { CarModel } from './CarModel';
import { SceneHitboxes } from './SceneHitboxes';
import { useIsMobile } from '../../../hooks/useIsMobile';

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
  const isMobile = useIsMobile();
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
      {/* Stage 0+: Golden Hour / Sunset lighting */}
      {/* Soft blue/purple ambient fill representing the twilight sky overhead */}
      <ambientLight intensity={0.5} color="#6e85a6" />

      {/* Main warm sunlight — deeper orange, lower intensity for late sunset */}
      <directionalLight
        position={[-5, 4, 8]}
        color="#ff7f3f"
        intensity={isMobile ? 1.0 : 1.5}
        castShadow={!isMobile}
        shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Soft warm fill to soften the darkest shadows under the car/desk */}
      <pointLight
        position={[3, 2, 4]}
        color="#cc9666"
        intensity={isMobile ? 0.5 : 1.0}
        distance={15}
        decay={2}
      />

      {/* Dramatic rim light catching the edge of the car from behind */}
      {!isMobile && (
        <pointLight position={[1, 3, -6]} color="#ff5500" intensity={1} distance={20} decay={2} />
      )}

      {/* Warm desk lamp glow over the tools/work area — slightly dimmer */}
      <spotLight
        position={[2, 4, 4]}
        angle={Math.PI / 3}
        penumbra={0.6}
        intensity={isMobile ? 40 : 80}
        color="#ffcc99"
        distance={12}
        decay={2}
      />

      {/* Stage 1: Garage environment (largest model — 9.5MB) */}
      {stage >= 1 && <GarageModel />}

      {/* Stage 2: Desk (3.4MB) */}
      {stage >= 2 && <DeskModel position={[3, 0, 2.5]} rotation={[0, -Math.PI / 2.2, 0]} />}

      {/* Stage 3: Car + Environment map (1.3MB + env) */}
      {stage >= 3 && (
        <>
          <CarModel position={[0.5, -0.6, -1]} rotation={[0, -Math.PI / 8, 0]} />
          {!isMobile && (
            <>
              <Environment preset="sunset" environmentIntensity={0.25} background={false} />
              <BakeShadows />
            </>
          )}
        </>
      )}

      <SceneHitboxes />
    </group>
  );
}
