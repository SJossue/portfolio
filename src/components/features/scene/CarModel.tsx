'use client';

import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

import type { JSX } from 'react';

type GroupProps = JSX.IntrinsicElements['group'];

export type CarModelRef = {
  chassis: THREE.Group | null;
  wheels: THREE.Group | null;
};

const MODEL_PATH = '/models/accord.glb';

/** Target size of the car along its longest axis (in scene units). */
const TARGET_SIZE = 5;

export const CarModel = forwardRef<CarModelRef, GroupProps>(function CarModel(props, ref) {
  const { scene } = useGLTF(MODEL_PATH);

  const cloned = useMemo(() => {
    const clone = scene.clone(true);

    // Compute bounding box to auto-center and auto-scale the model
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;

    // Wrap in a pivot group that normalises transforms
    const pivot = new THREE.Group();
    pivot.add(clone);

    // Center the model, keeping the bottom at y=0
    clone.position.set(-center.x, -box.min.y, -center.z);
    pivot.scale.setScalar(scale);

    return pivot;
  }, [scene]);

  const chassis = useMemo(
    () => (cloned.getObjectByName('Chassis') as THREE.Group) ?? null,
    [cloned],
  );
  const wheels = useMemo(() => (cloned.getObjectByName('Wheels') as THREE.Group) ?? null, [cloned]);

  useImperativeHandle(ref, () => ({ chassis, wheels }));

  return (
    <group {...props}>
      <primitive object={cloned} />
    </group>
  );
});

useGLTF.preload(MODEL_PATH);
