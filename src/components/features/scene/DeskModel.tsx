'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { JSX } from 'react';

type GroupProps = JSX.IntrinsicElements['group'];

const MODEL_PATH = '/models/desk-transformed.glb';

/** Target size of the desk along its longest axis (in scene units). */
const TARGET_SIZE = 3.5;

export function DeskModel(props: GroupProps) {
  const { scene } = useGLTF(MODEL_PATH);

  // Clone is required: React Strict Mode (dev) unmounts/remounts, which
  // detaches the original scene. clone(true) shares geometry & materials
  // by reference so VRAM cost is negligible.
  const pivot = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;

    const group = new THREE.Group();
    group.add(clone);
    clone.position.set(-center.x, -box.min.y, -center.z);
    group.scale.setScalar(scale);

    return group;
  }, [scene]);

  return (
    <group {...props}>
      <primitive object={pivot} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
