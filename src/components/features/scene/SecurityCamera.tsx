'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, PointLight } from 'three';
import { DARK_METAL } from './garage-materials';
import { useSceneState } from './useSceneState';

export function SecurityCamera() {
  const cameraGroupRef = useRef<Group>(null);
  const ledRef = useRef<PointLight>(null);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Slow Y-axis sweep
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.y = Math.sin(t * 0.3) * 0.6;
    }

    // LED blink
    if (ledRef.current) {
      ledRef.current.intensity = Math.sin(t * 4) > 0 ? 0.8 : 0;
    }
  });

  return (
    <group
      position={[-14.5, 5.2, -14]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSection('securityCamera');
      }}
    >
      {/* Wall bracket */}
      <mesh position={[0.1, 0, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Arm */}
      <mesh position={[0.3, -0.1, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.3, 0.06, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Rotating camera group */}
      <group ref={cameraGroupRef} position={[0.5, -0.15, 0]}>
        {/* Camera body */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 8]} />
          <meshStandardMaterial color="#0d0d14" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Lens */}
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
          <meshStandardMaterial color="#001122" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Red LED */}
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial
            emissive="#ff0000"
            emissiveIntensity={3}
            color="#ff0000"
            toneMapped={false}
          />
        </mesh>
        <pointLight
          ref={ledRef}
          position={[0, 0.07, 0]}
          color="#ff0000"
          intensity={0.8}
          distance={2}
          decay={2}
        />
      </group>
    </group>
  );
}
