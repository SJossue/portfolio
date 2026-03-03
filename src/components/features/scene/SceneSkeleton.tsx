'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { CarRig } from './CarRig';
import { GarageEnvironment } from './GarageEnvironment';
import { GarageInteractables } from './GarageInteractables';
import { useSceneState } from './useSceneState';

function isWebGL2Available(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch {
    return false;
  }
}

function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center" role="status">
      <p className="text-sm text-white/60">Loading scene...</p>
    </div>
  );
}

function WebGLFallback() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-neutral-900"
      data-testid="webgl-fallback"
    >
      <p className="text-sm text-white/60">
        3D scene requires WebGL 2. Please use a modern browser.
      </p>
    </div>
  );
}

export function SceneSkeleton() {
  const introState = useSceneState((s) => s.introState);
  const [hasWebGL2, setHasWebGL2] = useState(false);

  useEffect(() => {
    if (isWebGL2Available()) {
      setHasWebGL2(true);
    }
  }, []);

  if (!hasWebGL2) {
    return <WebGLFallback />;
  }

  return (
    <Suspense fallback={<SceneLoader />}>
      <Canvas camera={{ position: [1.5, 0.8, 3], fov: 50 }}>
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 10, 35]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[-3, 5, 0]} intensity={1} color="#e8e4df" />
        <pointLight position={[3, 5, 0]} intensity={1} color="#e8e4df" />
        <directionalLight position={[0, 3, 8]} intensity={0.4} />
        {(introState === 'revealing' || introState === 'garage') && <GarageEnvironment />}
        <CameraRig />
        <CarRig />
        <GarageInteractables />
        <OrbitControls enableZoom={false} enablePan={false} enabled={introState === 'garage'} />
      </Canvas>
    </Suspense>
  );
}
