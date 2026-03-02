'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder } from '@react-three/drei';
import { useSceneState } from './useSceneState';

function CarModel() {
  return (
    <group position={[0, 0.5, 0]}>
      <Box args={[2, 1, 4]} position={[0, 0, 0]}>
        <meshStandardMaterial color="lightblue" />
      </Box>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[-1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
      <Cylinder args={[0.5, 0.5, 0.2]} position={[1, 0.5, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="black" />
      </Cylinder>
    </group>
  );
}

export function SceneSkeleton() {
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!showScene) return null;

  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CarModel />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
