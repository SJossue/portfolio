'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import type { JSX } from 'react';
import * as THREE from 'three';
import { useEmissiveGlow } from './useEmissiveGlow';

type GroupProps = JSX.IntrinsicElements['group'];

const MODEL_PATH = '/models/garage2-transformed.glb';

export function GarageModel(props: GroupProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Effects
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

useGLTF.preload(MODEL_PATH);
