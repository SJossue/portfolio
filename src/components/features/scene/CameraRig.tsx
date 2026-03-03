'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneState } from './useSceneState';

const SHOT_CLOSEUP = {
  position: new THREE.Vector3(1.5, 0.8, 3),
  lookAt: new THREE.Vector3(0, 0.3, 0),
};

const SHOT_WIDE = {
  position: new THREE.Vector3(0, 2.5, 7),
  lookAt: new THREE.Vector3(0, 0.5, 0),
};

const SHOT_SECTIONS: Record<string, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
  projects: {
    position: new THREE.Vector3(-2, 1.5, -1),
    lookAt: new THREE.Vector3(-4, 0.75, -3),
  },
  contact: {
    position: new THREE.Vector3(2, 2.5, -4),
    lookAt: new THREE.Vector3(4, 2, -7),
  },
  about: {
    position: new THREE.Vector3(-7, 3, 0),
    lookAt: new THREE.Vector3(-9, 2.5, -2),
  },
};

const LERP_FACTOR = 0.02;
const ARRIVAL_THRESHOLD = 0.1;

export function CameraRig() {
  const introState = useSceneState((s) => s.introState);
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setIntroState = useSceneState((s) => s.setIntroState);
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    let target: { position: THREE.Vector3; lookAt: THREE.Vector3 };

    if (introState === 'idle' || introState === 'airingOut') {
      target = SHOT_CLOSEUP;
    } else if (introState === 'revealing') {
      target = SHOT_WIDE;
    } else if (selectedSection && SHOT_SECTIONS[selectedSection]) {
      target = SHOT_SECTIONS[selectedSection];
    } else {
      target = SHOT_WIDE;
    }

    camera.position.lerp(target.position, LERP_FACTOR);
    targetLookAt.current.lerp(target.lookAt, LERP_FACTOR);
    camera.lookAt(targetLookAt.current);

    if (introState === 'revealing') {
      const distance = camera.position.distanceTo(target.position);
      if (distance < ARRIVAL_THRESHOLD) {
        setIntroState('garage');
      }
    }
  });

  return null;
}
