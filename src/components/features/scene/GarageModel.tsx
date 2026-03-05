'use client';

import { useMemo, useRef } from 'react';
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

  // Garage maps to two sections with different glow colors
  useEmissiveGlow(groupRef, 'projects', '#ff6600', 1.5, (name) =>
    /^Scene setting_(019|020|024|027|039)/.test(name),
  );
  useEmissiveGlow(groupRef, 'tools', '#ff00cc', 1.5);

  return (
    <group ref={groupRef} {...props}>
      <primitive object={cloned} />
    </group>
  );
}
