'use client';

import { Component, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { MobileScene } from './MobileScene';
import { SceneContent } from './SceneContent';
import { useSceneState } from './useSceneState';

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
}

type SceneMode = 'full' | 'lite' | 'fallback';

type SceneProfile = {
  mobile: boolean;
  mode: SceneMode;
};

function detectSceneProfile(): SceneProfile {
  const mobile = isMobileDevice();

  if (typeof document === 'undefined') {
    return { mobile, mode: 'fallback' };
  }

  const canvas = document.createElement('canvas');
  const contextOptions: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: mobile ? 'low-power' : 'high-performance',
  };

  const getContext = (
    contextType: 'webgl2' | 'webgl',
  ): WebGLRenderingContext | WebGL2RenderingContext | null => {
    try {
      return canvas.getContext(contextType, contextOptions) as
        | WebGLRenderingContext
        | WebGL2RenderingContext
        | null;
    } catch {
      return null;
    }
  };

  const webgl2 = getContext('webgl2');
  const gl = webgl2 || getContext('webgl');

  if (!gl) {
    return { mobile, mode: 'fallback' };
  }

  const isLowEnd =
    typeof gl.getParameter(gl.MAX_TEXTURE_SIZE) === 'number' &&
    (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) < 2048;

  if (webgl2 && !mobile && isLowEnd) {
    return { mobile, mode: 'lite' };
  }

  if (mobile) {
    return { mobile, mode: 'lite' };
  }

  return { mobile: false, mode: webgl2 ? 'full' : 'lite' };
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
  const [sceneMode, setSceneMode] = useState<SceneMode>('fallback');

  // Run all browser-only checks after mount to avoid hydration mismatch
  useEffect(() => {
    const profile = detectSceneProfile();
    setMobile(profile.mobile);
    setSceneMode(profile.mode);

    setReady(true);
  }, []);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
  }, []);

  // Before client-side checks complete, show the loader (matches SSR output)
  if (!ready) {
    return <SceneLoader />;
  }

  if (sceneMode === 'fallback') {
    return <MobileScene />;
  }

  if (contextLost) {
    return <MobileScene />;
  }

  const isLiteMode = sceneMode === 'lite';

  return (
    <SceneErrorBoundary>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          camera={{ position: [-5, 3.5, 10], fov: isLiteMode ? 60 : 50 }}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: isLiteMode ? 'low-power' : 'high-performance',
          }}
          dpr={isLiteMode ? 1 : [1, 1.5]}
          performance={{ min: isLiteMode ? 0.2 : 0.5 }}
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
          <fog attach="fog" args={isLiteMode ? ['#0a0908', 6, 14] : ['#0a0908', 12, 20]} />
          <SceneContent mobile={isLiteMode} />
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
