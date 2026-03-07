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
    position: new THREE.Vector3(1, 2, 2),
    lookAt: new THREE.Vector3(6.5, 1, -2),
  },
  research: {
    position: new THREE.Vector3(2, 1.5, 5),
    lookAt: new THREE.Vector3(6, 0.3, 0),
  },
  tools: {
    position: new THREE.Vector3(-2, 1.7, -4),
    lookAt: new THREE.Vector3(3.5, 0, -8),
  },
  about: {
    position: new THREE.Vector3(1, 1.5, 10),
    lookAt: new THREE.Vector3(2.4, 0.5, -1),
  },
  experience: {
    position: new THREE.Vector3(-2, 1.5, 4),
    lookAt: new THREE.Vector3(-3.5, 0.3, 0),
  },
};

const LERP_FACTOR = 0.045;

export function CameraRig() {
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setCameraArrived = useSceneState((s) => s.setCameraArrived);

  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0));
  const isReturning = useRef(false);
  const arrivedRef = useRef(false);

  // Save the user's manual orbit position and target right before a transition
  const savedOrbitPosition = useRef(new THREE.Vector3(1, 3.5, 8));
  const savedOrbitTarget = useRef(new THREE.Vector3(0, 0.8, 0));

  const controls = useThree((state) => state.controls as OrbitControlsImpl | null);

  useEffect(() => {
    arrivedRef.current = false;
    // When selectedSection clears, instantly flag that we've left the state
    // so the UI unmounts immediately to prevent rendering conflicts.
    if (!selectedSection) {
      setCameraArrived(false);
    }
  }, [selectedSection, setCameraArrived]);

  useFrame(({ camera }) => {
    let target;

    if (selectedSection) {
      // Flying to a section
      target = SHOT_SECTIONS[selectedSection];
      isReturning.current = true;
      if (controls) controls.enabled = false;
    } else if (isReturning.current) {
      // Flying back to user's saved orbit
      target = { position: savedOrbitPosition.current, lookAt: savedOrbitTarget.current };
      if (controls) controls.enabled = false;

      const dist = camera.position.distanceTo(target.position);
      if (dist < 0.05) {
        // Arrived back at free-look state
        isReturning.current = false;
        if (controls) {
          // Sync target look to OrbitControls
          targetLookAt.current.copy(savedOrbitTarget.current);
          controls.target.copy(savedOrbitTarget.current);
          controls.update();
          controls.enabled = true;
        }
        return;
      }
    } else {
      // Free orbit mode: constantly track where the user is looking
      // so if they click a section, we remember exactly where they were
      if (controls) {
        targetLookAt.current.copy(controls.target);
        savedOrbitTarget.current.copy(controls.target);
        savedOrbitPosition.current.copy(camera.position);
      }
      return;
    }

    if (!target) return;

    // Smoothly interolate camera transform
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
