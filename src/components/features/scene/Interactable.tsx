'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@react-three/drei';
import type { Mesh } from 'three';
import { useSceneState } from './useSceneState';

interface InteractableProps {
  id: string;
  label: string;
  section: string;
  position: [number, number, number];
  color: string;
}

export function Interactable({ id, label, section, position, color }: InteractableProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);

  useEffect(() => {
    return () => {
      if (hovered) {
        document.body.style.cursor = 'default';
      }
    };
  }, [hovered]);

  return (
    <Box
      ref={meshRef}
      args={[1.5, 1.5, 1.5]}
      position={position}
      onClick={() => setSelectedSection(section)}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      userData={{ label }}
    >
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.4 : 0} />
    </Box>
  );
}
