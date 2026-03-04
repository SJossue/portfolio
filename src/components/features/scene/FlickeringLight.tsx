'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DARK_METAL } from './garage-materials';

export function FlickeringLight({
  position = [-8, 5.2, -10] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;

    const on = Math.random() > 0.06;
    const intensity = on ? 2.5 + Math.random() * 0.5 : 0;
    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = intensity;
    }
    if (lightRef.current) {
      lightRef.current.intensity = on ? 1.2 : 0;
    }
  });

  return (
    <group position={position}>
      {/* Fixture housing */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Fluorescent tube */}
      <mesh ref={tubeRef}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial
          emissive="#e8ffe8"
          emissiveIntensity={2.5}
          color="#e8ffe8"
          toneMapped={false}
        />
      </mesh>

      {/* End caps */}
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 0, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.03, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      <pointLight ref={lightRef} color="#e8ffe8" intensity={1.2} distance={6} decay={2} />
    </group>
  );
}
