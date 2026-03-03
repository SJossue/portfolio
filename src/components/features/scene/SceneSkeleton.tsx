'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { CarRig } from './CarRig';
import { useSceneState } from './useSceneState';

export function SceneSkeleton() {
  const [showScene, setShowScene] = useState(false);
  const introState = useSceneState((s) => s.introState);

  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showScene) return null;

  return (
    <Canvas camera={{ position: [1.5, 0.8, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CameraRig />
      <CarRig />
      <OrbitControls enableZoom={false} enablePan={false} enabled={introState === 'garage'} />
    </Canvas>
  );
}
