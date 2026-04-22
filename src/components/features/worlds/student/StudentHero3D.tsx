'use client';

import { Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function Book({
  position,
  color,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  rotation: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Cover */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.18, 0.9]} />
        <meshStandardMaterial color={color} metalness={0.15} roughness={0.55} />
      </mesh>
      {/* Pages peeking out */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.12, 0.14, 0.84]} />
        <meshStandardMaterial color="#f8fafc" metalness={0} roughness={0.9} />
      </mesh>
      {/* Spine accent */}
      <mesh position={[-0.6, 0, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.92]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function FloatingPaper({
  position,
  rotation,
  rotationSpeed = 0.5,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.z = rotation[2] + Math.sin(t * rotationSpeed) * 0.12;
      ref.current.rotation.x = rotation[0] + Math.cos(t * rotationSpeed * 0.8) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[0.7, 0.95]} />
      <meshStandardMaterial
        color="#f1f5f9"
        opacity={0.92}
        transparent
        side={THREE.DoubleSide}
        roughness={0.85}
      />
    </mesh>
  );
}

function Laptop({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh>
        <boxGeometry args={[1.6, 0.08, 1.05]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Hinge offset screen, tilted open */}
      <group position={[0, 0.04, -0.48]} rotation={[-1.15, 0, 0]}>
        {/* Screen frame */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.6, 1, 0.05]} />
          <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Glowing display */}
        <mesh position={[0, 0.5, 0.03]}>
          <planeGeometry args={[1.46, 0.88]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Pencil({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <meshStandardMaterial color="#eab308" roughness={0.6} />
      </mesh>
      {/* Tip */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      {/* Eraser */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.12, 8]} />
        <meshStandardMaterial color="#f43f5e" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      {/* Cool cyan key */}
      <pointLight position={[3, 3, 3]} color="#06b6d4" intensity={3} distance={12} />
      {/* Cool accent */}
      <pointLight position={[-3, -2, 3]} color="#22d3ee" intensity={2} distance={10} />
      {/* Warm desk-lamp fill */}
      <pointLight position={[0, -1.5, 2]} color="#fbbf24" intensity={0.6} distance={8} />
      {/* Subtle directional for form */}
      <directionalLight position={[2, 4, 3]} intensity={0.3} />

      {/* Stacked cyan book */}
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.7}>
        <Book
          position={[-2, 0.4, -0.5]}
          color="#06b6d4"
          rotation={[0.15, 0.35, 0.05]}
          scale={1.05}
        />
      </Float>

      {/* Secondary darker cyan book */}
      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.55}>
        <Book
          position={[2.1, 0.8, -1.2]}
          color="#0891b2"
          rotation={[-0.25, -0.5, 0.12]}
          scale={0.95}
        />
      </Float>

      {/* Third accent book (sky) */}
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.9}>
        <Book
          position={[1.3, -1.3, -0.3]}
          color="#0e7490"
          rotation={[0.1, 0.7, -0.15]}
          scale={0.85}
        />
      </Float>

      {/* Glowing laptop in center-back */}
      <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.4}>
        <Laptop position={[0, -0.6, -2]} rotation={[0.1, 0.2, 0]} />
      </Float>

      {/* Floating papers */}
      <Float speed={0.9} rotationIntensity={0.6} floatIntensity={1.1}>
        <FloatingPaper
          position={[-1.6, 1.6, 0.6]}
          rotation={[0.3, -0.4, 0.2]}
          rotationSpeed={0.4}
        />
      </Float>
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={0.9}>
        <FloatingPaper
          position={[2.4, -0.4, 0.4]}
          rotation={[-0.2, 0.5, -0.3]}
          rotationSpeed={0.6}
        />
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.3}>
        <FloatingPaper position={[0.4, 1.9, -0.6]} rotation={[0.4, 0.2, 0.5]} rotationSpeed={0.3} />
      </Float>

      {/* Pencil drifting */}
      <Float speed={1.6} rotationIntensity={1} floatIntensity={0.8}>
        <Pencil position={[-2.3, -1.1, 0.3]} rotation={[0.4, 0.2, 0.9]} />
      </Float>

      <EffectComposer>
        <Bloom intensity={0.55} luminanceThreshold={0.65} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StudentHero3D() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
