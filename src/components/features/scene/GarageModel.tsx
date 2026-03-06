'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import type { JSX } from 'react';
import * as THREE from 'three';
import { useEmissiveGlow } from './useEmissiveGlow';

type GroupProps = JSX.IntrinsicElements['group'];

const MODEL_PATH = '/models/garage-transformed.glb';

export function GarageModel(props: GroupProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Permanently modify materials (floor darkening & lamp glows)
  useEffect(() => {
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Floor Darkening
        if (child.name === 'Scene_structure_001') {
          const mat = child.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            child.material = mat.clone();
            (child.material as THREE.MeshStandardMaterial).color.set('#040406'); // darker base color
            (child.material as THREE.MeshStandardMaterial).roughness = 0.9; // less reflective
          }
        }

        // Lamp Emissive Materials
        if (/^(Chandelier001_1|Light_tube005_1|Light_tube006|Light_tube014)/.test(child.name)) {
          const mat = child.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            child.material = mat.clone();
            (child.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#ffcc88');
            (child.material as THREE.MeshStandardMaterial).emissiveIntensity = 4.0;
          }
        }
      }
    });
  }, [cloned]);

  useEmissiveGlow(groupRef, 'projects', '#ffffff', 0.4, (name) =>
    /^Scene[_ ]setting_0(19|20|24|27)/.test(name),
  );
  useEmissiveGlow(groupRef, 'tools', '#ffffff', 0.4, (name) =>
    /^(Scene[_ ]setting_0(11|13|54|55)|Tools_)/.test(name),
  );
  useEmissiveGlow(groupRef, 'experience', '#ffffff', 0.4, (name) =>
    /^Scene[_ ]setting_091/.test(name),
  );

  return (
    <group ref={groupRef} {...props}>
      <primitive object={cloned} />
    </group>
  );
}
