'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSceneState } from './useSceneState';
import { CarModel } from './CarModel';
import type { CarModelRef } from './CarModel';

export function CarRig() {
  const carRef = useRef<CarModelRef>(null);
  const introState = useSceneState((s) => s.introState);
  const setIntroState = useSceneState((s) => s.setIntroState);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (introState !== 'airingOut') return;
    if (!carRef.current?.chassis) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroState('revealing');
      },
    });

    tl.to(carRef.current.chassis.position, {
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
      <CarModel ref={carRef} />
    </group>
  );
}
