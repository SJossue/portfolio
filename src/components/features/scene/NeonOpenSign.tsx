'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DARK_METAL } from './garage-materials';

const NEON_GREEN_COLOR = '#00ff88';

/* Simplified block-letter segments for O, P, E, N */
const LETTER_SEGMENTS: Record<string, number[]> = {
  O: [0, 1, 2, 4, 5, 6],
  P: [0, 1, 2, 3, 4],
  E: [0, 1, 3, 4, 6],
  N: [1, 2, 4, 5], // verticals only for N
};

const CHAR_H = 0.5;
const CHAR_W = 0.3;
const SEG_T = 0.04;

function getSegPos(seg: number): { pos: [number, number, number]; size: [number, number, number] } {
  const hw = CHAR_W / 2;
  const hh = CHAR_H / 4;
  switch (seg) {
    case 0:
      return { pos: [0, hh * 2, 0], size: [CHAR_W, SEG_T, SEG_T] };
    case 1:
      return { pos: [-hw, hh, 0], size: [SEG_T, CHAR_H / 2, SEG_T] };
    case 2:
      return { pos: [hw, hh, 0], size: [SEG_T, CHAR_H / 2, SEG_T] };
    case 3:
      return { pos: [0, 0, 0], size: [CHAR_W, SEG_T, SEG_T] };
    case 4:
      return { pos: [-hw, -hh, 0], size: [SEG_T, CHAR_H / 2, SEG_T] };
    case 5:
      return { pos: [hw, -hh, 0], size: [SEG_T, CHAR_H / 2, SEG_T] };
    case 6:
      return { pos: [0, -hh * 2, 0], size: [CHAR_W, SEG_T, SEG_T] };
    default:
      return { pos: [0, 0, 0], size: [SEG_T, SEG_T, SEG_T] };
  }
}

function OpenLetter({ char, position }: { char: string; position: [number, number, number] }) {
  const segs = LETTER_SEGMENTS[char] ?? [];
  // N gets diagonal bar
  return (
    <group position={position}>
      {segs.map((seg) => {
        const { pos, size } = getSegPos(seg);
        return (
          <mesh key={seg} position={pos}>
            <boxGeometry args={size} />
            <meshStandardMaterial
              emissive={NEON_GREEN_COLOR}
              emissiveIntensity={3}
              color={NEON_GREEN_COLOR}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      {char === 'N' && (
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[SEG_T, CHAR_H * 0.9, SEG_T]} />
          <meshStandardMaterial
            emissive={NEON_GREEN_COLOR}
            emissiveIntensity={3}
            color={NEON_GREEN_COLOR}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

export function NeonOpenSign() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Slow strobe fade: intensity oscillates between 0.5 and 3
    const intensity = 0.5 + (Math.sin(t * 1.2) * 0.5 + 0.5) * 2.5;
    groupRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
        if (obj.material.toneMapped === false) {
          obj.material.emissiveIntensity = intensity;
        }
      }
    });
  });

  const spacing = 0.45;

  return (
    <group position={[14.75, 3.5, 5]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Backing */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[2.2, 1.2, 0.04]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Magenta border */}
      {/* Top */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshStandardMaterial
          emissive="#ff00cc"
          emissiveIntensity={3}
          color="#ff00cc"
          toneMapped={false}
        />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshStandardMaterial
          emissive="#ff00cc"
          emissiveIntensity={3}
          color="#ff00cc"
          toneMapped={false}
        />
      </mesh>
      {/* Left */}
      <mesh position={[-1.08, 0, 0]}>
        <boxGeometry args={[0.04, 1.1, 0.04]} />
        <meshStandardMaterial
          emissive="#ff00cc"
          emissiveIntensity={3}
          color="#ff00cc"
          toneMapped={false}
        />
      </mesh>
      {/* Right */}
      <mesh position={[1.08, 0, 0]}>
        <boxGeometry args={[0.04, 1.1, 0.04]} />
        <meshStandardMaterial
          emissive="#ff00cc"
          emissiveIntensity={3}
          color="#ff00cc"
          toneMapped={false}
        />
      </mesh>

      {/* Letters */}
      <group ref={groupRef} position={[-spacing * 1.5, 0.1, 0]}>
        {'OPEN'.split('').map((ch, i) => (
          <OpenLetter key={i} char={ch} position={[i * spacing, 0, 0]} />
        ))}
      </group>

      {/* Arrow below */}
      <group position={[0, -0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.8, 0.04, 0.04]} />
          <meshStandardMaterial
            emissive={NEON_GREEN_COLOR}
            emissiveIntensity={3}
            color={NEON_GREEN_COLOR}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.25, 0.04, 0.04]} />
          <meshStandardMaterial
            emissive={NEON_GREEN_COLOR}
            emissiveIntensity={3}
            color={NEON_GREEN_COLOR}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.25, 0.04, 0.04]} />
          <meshStandardMaterial
            emissive={NEON_GREEN_COLOR}
            emissiveIntensity={3}
            color={NEON_GREEN_COLOR}
            toneMapped={false}
          />
        </mesh>
      </group>

      <pointLight color={NEON_GREEN_COLOR} intensity={0.8} distance={6} decay={2} />
    </group>
  );
}
