'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { SceneContent } from './SceneContent';
import { useSceneState } from './useSceneState';
import { useIsMobile } from '@/hooks/useIsMobile';

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
      className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#111010]"
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

function ModelsReadySignal() {
  const setModelsReady = useSceneState((s) => s.setModelsReady);
  const signaled = useRef(false);

  useFrame(() => {
    if (!signaled.current) {
      signaled.current = true;
      setModelsReady();
    }
  });

  return null;
}

export function SceneSkeleton() {
  const introState = useSceneState((s) => s.introState);
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);
  const [hasWebGL2, setHasWebGL2] = useState(false);
  const isMobile = useIsMobile();

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
      <Canvas
        shadows={!isMobile}
        camera={{ position: isMobile ? [0, 3.5, 10] : [0, 2.5, 8], fov: 45 }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        dpr={isMobile ? [1, 2] : [1, 2]}
        performance={{ min: 0.5 }}
        onPointerMissed={() => {
          if (selectedSection) setSelectedSection(null);
        }}
      >
        <color attach="background" args={['#111010']} />
        <fog attach="fog" args={['#111010', 14, 24]} />
        <SceneContent />
        <ModelsReadySignal />
        <CameraRig />
        <OrbitControls
          makeDefault
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={10.5}
          minPolarAngle={Math.PI / 2.75}
          maxPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          target={[0, 0.8, 0]}
        />
      </Canvas>
    </Suspense>
  );
}
