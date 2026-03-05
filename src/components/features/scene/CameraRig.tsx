'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useSceneState } from './useSceneState';

const SHOT_WIDE = {
  position: new THREE.Vector3(-2, 3.5, 10),
  lookAt: new THREE.Vector3(0, 0.5, 0),
};

/**
 * Camera positions for each section. The camera flies from its current
 * position to the target when a section is selected.
 *
 * When nothing is selected, the CameraRig does NOT animate — OrbitControls
 * takes over instead so the user can freely orbit the scene.
 */
const SHOT_SECTIONS: Record<string, { position: THREE.Vector3; lookAt: THREE.Vector3 }> = {
  projects: {
    position: new THREE.Vector3(2, 2, 1.5),
    lookAt: new THREE.Vector3(4.4, 1.3, -0.5),
  },
  contact: {
    position: new THREE.Vector3(0, 2, 8),
    lookAt: new THREE.Vector3(5, 0.3, 3),
  },
  tools: {
    position: new THREE.Vector3(-2, 2, -4),
    lookAt: new THREE.Vector3(3, 0.5, -8),
  },
  about: {
    position: new THREE.Vector3(-0.3, 1.5, 5),
    lookAt: new THREE.Vector3(0.3, 0.5, -1),
  },
  experience: {
    position: new THREE.Vector3(-6, 1.5, 4),
    lookAt: new THREE.Vector3(0, 1.2, -1),
  },
};

const LERP_FACTOR = 0.045;

export function CameraRig() {
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setCameraArrived = useSceneState((s) => s.setCameraArrived);
  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0));
  const isReturning = useRef(false);
  const arrivedRef = useRef(false);
  const controls = useThree((state) => state.controls as OrbitControlsImpl | null);

  useEffect(() => {
    arrivedRef.current = false;
  }, [selectedSection]);

  useFrame(({ camera }) => {
    let target;

    if (selectedSection) {
      // Flying to a section
      target = SHOT_SECTIONS[selectedSection];
      isReturning.current = true;
      if (controls) controls.enabled = false;
    } else if (isReturning.current) {
      // Flying back to initial wide shot
      target = SHOT_WIDE;
      if (controls) controls.enabled = false;

      const dist = camera.position.distanceTo(target.position);
      if (dist < 0.15) {
        // Arrived at wide shot, give control back to OrbitControls
        isReturning.current = false;
        if (controls) {
          // Snap camera to exact position before re-enabling controls
          camera.position.copy(SHOT_WIDE.position);
          targetLookAt.current.copy(SHOT_WIDE.lookAt);
          camera.lookAt(SHOT_WIDE.lookAt);
          controls.target.copy(SHOT_WIDE.lookAt);
          controls.update();
          controls.enabled = true;
        }
        return;
      }
    } else {
      // Free orbit mode: just keep the targetLookAt synced to the OrbitControls target
      // so that if the user clicks a section while orbiting, the transition is smooth
      if (controls) {
        targetLookAt.current.copy(controls.target);
      }
      return;
    }

    if (!target) return;

    camera.position.lerp(target.position, LERP_FACTOR);
    targetLookAt.current.lerp(target.lookAt, LERP_FACTOR);
    camera.lookAt(targetLookAt.current);

    if (controls) {
      controls.target.copy(targetLookAt.current);
    }

    if (
      selectedSection &&
      !arrivedRef.current &&
      camera.position.distanceTo(target.position) < 0.5
    ) {
      arrivedRef.current = true;
      setCameraArrived(true);
    }
  });

  return null;
}
