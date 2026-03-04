'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DARK_METAL } from './garage-materials';

/* 7-segment display layout for each character.
 * Segments are indexed 0–6:
 *    0
 *   ---
 * 1|   |2
 *   ---  3
 * 4|   |5
 *   ---
 *    6
 */
const SEGMENT_MAP: Record<string, number[]> = {
  J: [0, 4, 5, 6],
  O: [0, 1, 2, 4, 5, 6],
  S: [0, 1, 3, 5, 6],
  U: [1, 2, 4, 5, 6],
  E: [0, 1, 3, 4, 6],
  "'": [],
  G: [0, 1, 4, 5, 6],
  A: [0, 1, 2, 3, 4, 5],
  R: [0, 1, 2, 3, 4],
};

interface SegmentCharProps {
  char: string;
  position: [number, number, number];
  color: string;
  charIndex: number;
}

const CHAR_H = 0.7;
const CHAR_W = 0.4;
const SEG_THICK = 0.05;

function getSegmentTransform(seg: number): {
  pos: [number, number, number];
  size: [number, number, number];
} {
  const hw = CHAR_W / 2;
  const hh = CHAR_H / 4;
  switch (seg) {
    case 0:
      return { pos: [0, hh * 2, 0], size: [CHAR_W, SEG_THICK, SEG_THICK] };
    case 1:
      return { pos: [-hw, hh, 0], size: [SEG_THICK, CHAR_H / 2, SEG_THICK] };
    case 2:
      return { pos: [hw, hh, 0], size: [SEG_THICK, CHAR_H / 2, SEG_THICK] };
    case 3:
      return { pos: [0, 0, 0], size: [CHAR_W, SEG_THICK, SEG_THICK] };
    case 4:
      return { pos: [-hw, -hh, 0], size: [SEG_THICK, CHAR_H / 2, SEG_THICK] };
    case 5:
      return { pos: [hw, -hh, 0], size: [SEG_THICK, CHAR_H / 2, SEG_THICK] };
    case 6:
      return { pos: [0, -hh * 2, 0], size: [CHAR_W, SEG_THICK, SEG_THICK] };
    default:
      return { pos: [0, 0, 0], size: [SEG_THICK, SEG_THICK, SEG_THICK] };
  }
}

function SegmentChar({ char, position, color, charIndex }: SegmentCharProps) {
  const segments = SEGMENT_MAP[char] ?? [];
  if (char === "'") {
    return (
      <mesh position={position}>
        <boxGeometry args={[SEG_THICK, 0.12, SEG_THICK]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={3}
          color={color}
          toneMapped={false}
        />
      </mesh>
    );
  }
  return (
    <group position={position}>
      {segments.map((seg) => {
        const { pos, size } = getSegmentTransform(seg);
        return (
          <mesh key={seg} position={pos}>
            <boxGeometry args={size} />
            <meshStandardMaterial
              emissive={color}
              emissiveIntensity={3}
              color={color}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function NeonNameSign() {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!groupRef.current) return;
    const t = timeRef.current;
    // Slow intensity pulse
    const pulse = 0.85 + Math.sin(t * 1.5) * 0.15;
    groupRef.current.children.forEach((child) => {
      child.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
          if (obj.material.emissiveIntensity > 0) {
            // Random segment flicker
            const flicker = Math.random() > 0.995 ? 0.3 : 1;
            obj.material.emissiveIntensity = 3 * pulse * flicker;
          }
        }
      });
    });
  });

  const word1 = "JOSSUE'S";
  const word2 = 'GARAGE';
  const spacing = 0.55;

  return (
    <group position={[0, 4.5, -14.75]}>
      {/* Dark metal backing plate */}
      <mesh position={[0, -0.1, -0.05]}>
        <boxGeometry args={[6, 2, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      <group ref={groupRef}>
        {/* "JOSSUE'S" in cyan */}
        <group position={[-(word1.length * spacing) / 2 + spacing / 2, 0.45, 0]}>
          {word1.split('').map((ch, i) => (
            <SegmentChar
              key={i}
              char={ch}
              position={[i * spacing, 0, 0]}
              color="#00f0ff"
              charIndex={i}
            />
          ))}
        </group>

        {/* "GARAGE" in magenta */}
        <group position={[-(word2.length * spacing) / 2 + spacing / 2, -0.55, 0]}>
          {word2.split('').map((ch, i) => (
            <SegmentChar
              key={i}
              char={ch}
              position={[i * spacing, 0, 0]}
              color="#ff00cc"
              charIndex={i}
            />
          ))}
        </group>
      </group>

      {/* Shared point lights per word */}
      <pointLight
        position={[0, 0.45, 0.3]}
        color="#00f0ff"
        intensity={0.8}
        distance={6}
        decay={2}
      />
      <pointLight
        position={[0, -0.55, 0.3]}
        color="#ff00cc"
        intensity={0.8}
        distance={6}
        decay={2}
      />
    </group>
  );
}
