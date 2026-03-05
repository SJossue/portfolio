'use client';

import { useGLTF } from '@react-three/drei';
import type { JSX } from 'react';

type GroupProps = JSX.IntrinsicElements['group'];

const MODEL_PATH = '/models/garage-transformed.glb';

export function GarageModel(props: GroupProps) {
  const { scene } = useGLTF(MODEL_PATH);

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
