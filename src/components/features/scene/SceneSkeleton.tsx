'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SceneContent } from './SceneContent';
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
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#0a0908]"
      role="status"
    >
      <div className="font-mono text-2xl uppercase tracking-[0.3em] text-white/80">Loading</div>
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-slide-lr rounded-full bg-gradient-to-r from-amber-400 to-orange-500 motion-reduce:animate-none" />
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

  if (!hasWebGL2) {
    return <WebGLFallback />;
  }

  return (
    <Suspense fallback={<SceneLoader />}>
      <Canvas camera={{ position: [0, 2, 2.5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <color attach="background" args={['#0a0908']} />
        <fog attach="fog" args={['#0a0908', 8, 15]} />
        <SceneContent />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
          target={[0, 1, -1.5]}
        />
      </Canvas>
    </Suspense>
  );
}
