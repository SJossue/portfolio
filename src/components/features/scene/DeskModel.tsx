'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { JSX } from 'react';

type GroupProps = JSX.IntrinsicElements['group'];

const MODEL_PATH = '/models/desk-transformed.glb';

/** Target size of the desk along its longest axis (in scene units). */
const TARGET_SIZE = 2;

export function DeskModel(props: GroupProps) {
  const { scene } = useGLTF(MODEL_PATH);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);

    // Compute bounding box to auto-center and auto-scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    console.log('[DeskModel] bounding box size:', size);
    console.log('[DeskModel] bounding box center:', center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;

    // Wrap in a pivot group that normalises transforms
    const pivot = new THREE.Group();
    pivot.add(clone);

    // Center XZ, sit on floor (y=0)
    clone.position.set(-center.x, -box.min.y, -center.z);
    pivot.scale.setScalar(scale);

    return pivot;
  }, [scene]);

  return (
    <group {...props}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
