'use client';

import { GarageModel } from './GarageModel';
import { DeskModel } from './DeskModel';
import { CarModel } from './CarModel';

/**
 * Composes all GLB models into the scene with appropriate positioning and lighting.
 *
 * Layout:
 * - Garage: the full environment shell (origin)
 * - Desk: front center, the first thing the user sees
 * - Car: center of the garage
 */
export function SceneContent() {
  return (
    <group>
      {/* Garage environment — sits at origin */}
      <GarageModel />

      {/* Desk — front center, facing the camera's initial position */}
      <DeskModel position={[3, 0, -1]} />

      {/* Car — center of the garage */}
      <CarModel position={[0, 0, -2]} />

      {/* Lighting to complement the GLB baked materials */}
      <ambientLight intensity={0.3} />

      {/* Warm overhead workshop light */}
      <pointLight position={[0, 4, 0]} color="#ffa500" intensity={2} distance={20} decay={2} />

      {/* Cool fill light from the side */}
      <pointLight position={[5, 3, 3]} color="#88ccff" intensity={0.8} distance={15} decay={2} />

      {/* Back rim light */}
      <pointLight position={[-3, 3, -5]} color="#ff6633" intensity={0.6} distance={12} decay={2} />
    </group>
  );
}
