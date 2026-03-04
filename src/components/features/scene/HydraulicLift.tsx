'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { DARK_METAL, NEON_ORANGE, FLOOR_STAIN } from './garage-materials';
import { useSceneState } from './useSceneState';

const HAZARD_ORANGE = { color: '#ff8800', metalness: 0.3, roughness: 0.6 } as const;
const HAZARD_BLACK = { color: '#111111', metalness: 0.3, roughness: 0.6 } as const;

function HazardStripe({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, i * 0.16, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.06]} />
          <meshStandardMaterial {...(i % 2 === 0 ? HAZARD_ORANGE : HAZARD_BLACK)} />
        </mesh>
      ))}
    </group>
  );
}

export function HydraulicLift() {
  const crossArmRef = useRef<Group>(null);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  useFrame(({ clock }) => {
    if (crossArmRef.current) {
      crossArmRef.current.position.y =
        0.6 + Math.sin(clock.getElapsedTime() * (Math.PI / 4)) * 0.05;
    }
  });

  return (
    <group
      position={[-9, 0, 7]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedSection('hydraulicLift');
      }}
    >
      {/* Left rail */}
      <mesh position={[-0.8, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.8, 3.5]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <HazardStripe position={[-0.8, 0.05, 1.5]} />
      <HazardStripe position={[-0.8, 0.05, -1.5]} />

      {/* Right rail */}
      <mesh position={[0.8, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.8, 3.5]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <HazardStripe position={[0.8, 0.05, 1.5]} />
      <HazardStripe position={[0.8, 0.05, -1.5]} />

      {/* Left piston */}
      <mesh position={[-0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right piston */}
      <mesh position={[0.8, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cross arm platform */}
      <group ref={crossArmRef} position={[0, 0.6, 0]}>
        <mesh>
          <boxGeometry args={[2, 0.08, 3.2]} />
          <meshStandardMaterial {...DARK_METAL} />
        </mesh>
        {/* Accent edge */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[2.05, 0.02, 3.25]} />
          <meshStandardMaterial {...NEON_ORANGE} />
        </mesh>
      </group>

      {/* Floor oil stain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.005, 0.5]}>
        <circleGeometry args={[0.6, 16]} />
        <meshStandardMaterial {...FLOOR_STAIN} />
      </mesh>
    </group>
  );
}
