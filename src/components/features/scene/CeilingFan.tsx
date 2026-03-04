'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { DARK_METAL } from './garage-materials';

export function CeilingFan({
  position = [0, 5.5, 3] as [number, number, number],
  speed = 0.4,
}: {
  position?: [number, number, number];
  speed?: number;
}) {
  const bladesRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group position={position}>
      {/* Mounting rod */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Motor housing */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.1, 0.08, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Rotating blades */}
      <group ref={bladesRef} position={[0, -0.05, 0]}>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4]}
            rotation={[-Math.PI / 2, angle, 0]}
          >
            <boxGeometry args={[0.12, 0.6, 0.008]} />
            <meshStandardMaterial {...DARK_METAL} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
