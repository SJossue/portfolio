'use client';

import { useEffect, useRef } from 'react';
import { Box, Cylinder } from '@react-three/drei';
import gsap from 'gsap';
import type { Group } from 'three';
import { useSceneState } from './useSceneState';

export function CarRig() {
  const chassisRef = useRef<Group>(null);
  const introState = useSceneState((s) => s.introState);
  const setIntroState = useSceneState((s) => s.setIntroState);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (introState !== 'airingOut') return;
    if (!chassisRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroState('revealing');
      },
    });

    tl.to(chassisRef.current.position, {
      y: -0.3,
      duration: 1.2,
      ease: 'power3.out',
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [introState, setIntroState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <group position={[-9, 0.5, 7]} rotation={[0, Math.PI * 0.15, 0]}>
      {/* Chassis — GSAP animates this group's Y position */}
      <group ref={chassisRef}>
        <Box args={[2, 1, 4]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#0d0d14"
            roughness={0.2}
            metalness={0.9}
            emissive="#00f0ff"
            emissiveIntensity={0.05}
          />
        </Box>
      </group>

      {/* Wheels — stay at fixed height */}
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" metalness={0.3} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" metalness={0.3} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" metalness={0.3} roughness={0.5} />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" metalness={0.3} roughness={0.5} />
      </Cylinder>
    </group>
  );
}
