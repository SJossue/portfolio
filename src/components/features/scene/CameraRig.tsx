'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useSceneState } from './useSceneState';

const SHOT_CLOSEUP = {
  position: new Vector3(1.5, 0.8, 3),
  lookAt: new Vector3(0, 0.3, 0),
};

const SHOT_WIDE = {
  position: new Vector3(0, 2.5, 7),
  lookAt: new Vector3(0, 0.5, 0),
};

const LERP_FACTOR = 0.02;
const ARRIVAL_THRESHOLD = 0.1;

export function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef(SHOT_CLOSEUP.lookAt.clone());
  const introState = useSceneState((s) => s.introState);
  const setIntroState = useSceneState((s) => s.setIntroState);

  useFrame(() => {
    const target = introState === 'revealing' || introState === 'garage' ? SHOT_WIDE : SHOT_CLOSEUP;

    camera.position.lerp(target.position, LERP_FACTOR);
    lookAtTarget.current.lerp(target.lookAt, LERP_FACTOR);
    camera.lookAt(lookAtTarget.current);

    // Transition from revealing to garage when camera arrives
    if (introState === 'revealing') {
      const distance = camera.position.distanceTo(SHOT_WIDE.position);
      if (distance < ARRIVAL_THRESHOLD) {
        setIntroState('garage');
      }
    }
  });

  return null;
}
