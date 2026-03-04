'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#050510]"
      role="status"
    >
      <div className="font-mono text-2xl uppercase tracking-[0.3em] text-cyan-400">
        Initializing
      </div>
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-slide-lr rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 motion-reduce:animate-none" />
      </div>
      <div className="font-mono text-xs tracking-wider text-white/30">
        Loading 3D environment...
      </div>
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

  const isGarageReady = introState === 'garage';

  if (!hasWebGL2) {
    return <WebGLFallback />;
  }

  return (
    <Suspense fallback={<SceneLoader />}>
      <Canvas camera={{ position: [1.5, 0.8, 3], fov: 50 }}>
        <color attach="background" args={[isGarageReady ? '#050510' : '#0a0a0a']} />
        <ambientLight intensity={isGarageReady ? 0.05 : 0.5} />
        {isGarageReady ? (
          <>
            <fog attach="fog" args={['#050510', 8, 30]} />
            {/* Warm workshop light */}
            <pointLight
              position={[-2, 3, 0]}
              color="#ff6600"
              intensity={1}
              distance={12}
              decay={2}
            />
            {/* Cool monitor glow */}
            <pointLight
              position={[4, 3, -7]}
              color="#0066ff"
              intensity={0.8}
              distance={8}
              decay={2}
            />
            <GarageEnvironment />
          </>
        ) : (
          <pointLight position={[10, 10, 10]} />
        )}
        <CameraRig />
        <CarRig />
        <GarageInteractables />
        <OrbitControls enableZoom={false} enablePan={false} enabled={introState === 'garage'} />
        {isGarageReady && (
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.7} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </Suspense>
  );
}
