'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DARK_METAL, NEON_CYAN, NEON_MAGENTA } from './garage-materials';
import { NeonTube } from './NeonTube';
import { useSceneState } from './useSceneState';

const PRODUCT_COLORS = ['#00f0ff', '#ff00cc', '#00f0ff'] as const;

export function VendingMachine() {
  const screenRef = useRef<THREE.Mesh>(null);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  useFrame(({ clock }) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      const flicker = Math.sin(clock.getElapsedTime() * 12) > 0.92 ? 0.3 : 1;
      mat.emissiveIntensity = 2 * flicker;
    }
  });

  return (
    <group
      position={[-14, 1.25, 2]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSection('vendingMachine');
      }}
    >
      {/* Cabinet body */}
      <mesh position={[0.3, 0, 0]}>
        <boxGeometry args={[0.8, 2.5, 1.2]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Glass front */}
      <mesh position={[0.72, 0.2, 0]}>
        <boxGeometry args={[0.02, 1.8, 1]} />
        <meshStandardMaterial
          color="#0a1a2a"
          metalness={0.1}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Product rows (3 rows x 3 items) */}
      {[0.6, 0.1, -0.4].map((rowY, ri) =>
        [-0.3, 0, 0.3].map((colZ, ci) => (
          <mesh key={`${ri}-${ci}`} position={[0.65, rowY, colZ]}>
            <boxGeometry args={[0.08, 0.15, 0.12]} />
            <meshStandardMaterial
              emissive={PRODUCT_COLORS[ri]}
              emissiveIntensity={1.5}
              color={PRODUCT_COLORS[ri]}
              toneMapped={false}
            />
          </mesh>
        )),
      )}

      {/* Screen */}
      <mesh ref={screenRef} position={[0.72, -0.7, 0]}>
        <boxGeometry args={[0.02, 0.4, 0.6]} />
        <meshStandardMaterial
          emissive="#00f0ff"
          emissiveIntensity={2}
          color="#001a2a"
          toneMapped={false}
        />
      </mesh>

      {/* Coin slot */}
      <mesh position={[0.72, -0.3, 0.3]}>
        <boxGeometry args={[0.02, 0.06, 0.12]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>

      {/* Top neon strip */}
      <NeonTube
        position={[0.5, 1.35, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        length={1}
        color="#ff00cc"
        distance={4}
      />
    </group>
  );
}
