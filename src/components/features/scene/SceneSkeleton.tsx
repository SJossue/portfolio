'use client';

import { Component, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { SceneContent } from './SceneContent';
import { useSceneState } from './useSceneState';

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
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

function SceneFallback({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#0a0908]"
      data-testid="scene-fallback"
    >
      <p className="max-w-xs text-center font-mono text-sm text-white/60">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white transition-colors hover:bg-white/10"
        >
          Reload
        </button>
      )}
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

/** Proper React error boundary (class component) to catch render/lifecycle errors. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SceneErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SceneFallback
          message="Something went wrong loading the 3D scene."
          onRetry={() => window.location.reload()}
        />
      );
    }
    return this.props.children;
  }
}

export function SceneSkeleton() {
  const selectedSection = useSceneState((s) => s.selectedSection);
  const setSelectedSection = useSceneState((s) => s.setSelectedSection);
  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [webgl, setWebgl] = useState(true);

  // Run all browser-only checks after mount to avoid hydration mismatch
  useEffect(() => {
    const m = isMobileDevice();
    setMobile(m);

    try {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext('webgl2')) {
        setWebgl(false);
      }
    } catch {
      setWebgl(false);
    }

    setReady(true);
  }, []);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
  }, []);

  // Before client-side checks complete, show the loader (matches SSR output)
  if (!ready) {
    return <SceneLoader />;
  }

  if (!webgl) {
    return <SceneFallback message="3D scene requires WebGL 2. Please use a modern browser." />;
  }

  if (contextLost) {
    return (
      <SceneFallback
        message="3D scene lost — GPU ran out of memory."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <SceneErrorBoundary>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          camera={{ position: [-5, 3.5, 10], fov: mobile ? 60 : 50 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: mobile ? 'low-power' : 'high-performance',
          }}
          dpr={mobile ? 1 : [1, 1.5]}
          performance={{ min: 0.5 }}
          onPointerMissed={() => {
            if (selectedSection) setSelectedSection(null);
          }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              handleContextLost();
            });
          }}
        >
          <color attach="background" args={['#0a0908']} />
          <fog attach="fog" args={['#0a0908', 12, 20]} />
          <SceneContent mobile={mobile} />
          <ModelsReadySignal />
          <CameraRig />
          <OrbitControls
            makeDefault
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={10.5}
            minPolarAngle={Math.PI / 2.2}
            maxPolarAngle={Math.PI / 2.2}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            target={[0, 0.8, 0]}
          />
        </Canvas>
      </Suspense>
    </SceneErrorBoundary>
  );
}
