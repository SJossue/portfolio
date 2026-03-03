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
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#050510]"
      role="status"
    >
      <div className="font-mono text-2xl uppercase tracking-[0.3em] text-cyan-400">
        Initializing
      </div>
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" />
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
            {/* Ceiling fill */}
            <pointLight position={[0, 5.5, 0]} color="#1a2040" intensity={0.3} />
            {/* Left wall cyan */}
            <pointLight
              position={[-14, 2.5, 0]}
              color="#00f0ff"
              intensity={1.5}
              distance={12}
              decay={2}
            />
            {/* Right wall magenta */}
            <pointLight
              position={[14, 2.5, 0]}
              color="#ff00cc"
              intensity={1.5}
              distance={12}
              decay={2}
            />
            {/* Back wall glow */}
            <pointLight
              position={[0, 3, -14]}
              color="#00f0ff"
              intensity={1.0}
              distance={10}
              decay={2}
            />
            {/* Workstation area */}
            <pointLight
              position={[-4, 2, -3]}
              color="#ff6600"
              intensity={0.8}
              distance={6}
              decay={2}
            />
            {/* Monitor area */}
            <pointLight
              position={[4, 3, -7]}
              color="#0066ff"
              intensity={0.8}
              distance={6}
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
      </Canvas>
    </Suspense>
  );
}
