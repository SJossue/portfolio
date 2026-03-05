'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import type { JSX } from 'react';

type GroupProps = JSX.IntrinsicElements['group'];

const MODEL_PATH = '/models/garage-transformed.glb';

export function GarageModel(props: GroupProps) {
  const { scene } = useGLTF(MODEL_PATH);

  // Clone is required: React Strict Mode (dev) unmounts/remounts, which
  // detaches the original scene. clone(true) shares geometry & materials
  // by reference so VRAM cost is negligible.
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <group {...props}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
