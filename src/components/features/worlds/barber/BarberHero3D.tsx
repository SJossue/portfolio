'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Glowing timeline axis (core beam + soft halo sleeve)              */
/* ------------------------------------------------------------------ */

function TimelineAxis() {
  return (
    <group rotation={[0, 0, -0.18]}>
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 10, 16]} />
        <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={1.8} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 10, 24]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Milestone node: glowing sphere + rotating orbital ring            */
/* ------------------------------------------------------------------ */

function MilestoneNode({
  position,
  ringSpeed = 0.6,
  ringTilt = 0,
}: {
  position: [number, number, number];
  ringSpeed?: number;
  ringTilt?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * ringSpeed;
  });
  return (
    <group position={position}>
      {/* Core */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#ddd6fe" emissive="#8b5cf6" emissiveIntensity={2.4} />
      </mesh>
      {/* Halo */}
      <mesh>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.7}
          transparent
          opacity={0.2}
        />
      </mesh>
      {/* Orbital ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2 + ringTilt, 0, 0]}>
        <torusGeometry args={[0.4, 0.012, 8, 64]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Outer wire ring — "cycle of time" feel                            */
/* ------------------------------------------------------------------ */

function OuterRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.1;
  });
  return (
    <mesh ref={ref} position={[0, 0, -1]} rotation={[0.55, 0, 0]}>
      <torusGeometry args={[2.5, 0.01, 8, 128]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.9}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient depth particles                                           */
/* ------------------------------------------------------------------ */

function DepthOrbs() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.04;
  });
  const positions = useMemo(
    () =>
      [
        [-3.2, 1.6, -2.2],
        [2.9, -1.3, -1.9],
        [-2.6, -1.8, -0.7],
        [3.1, 1.9, -1.1],
        [-3.6, 0.4, -2.8],
        [1.6, 2.2, -2.4],
        [-1.8, -2.1, -1.2],
      ] as const,
    [],
  );
  return (
    <group ref={group}>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={2.2} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                             */
/* ------------------------------------------------------------------ */

export default function BarberHero3D() {
  // Nodes positioned along the axis (which is tilted -0.18 rad on Z).
  // Axis direction ≈ (sin(0.18), cos(0.18)) ≈ (0.179, 0.984).
  const nodes = useMemo<Array<[number, number, number]>>(() => {
    const dx = Math.sin(0.18);
    const dy = Math.cos(0.18);
    return [
      [-dx * 2.6, -dy * 2.6, 0.3],
      [-dx * 1.3, -dy * 1.3, 0.1],
      [0, 0, 0.4],
      [dx * 1.6, dy * 1.6, 0.0],
      [dx * 2.9, dy * 2.9, 0.3],
    ];
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 4]} color="#8b5cf6" intensity={2.4} />
      <pointLight position={[-3, -2, 3]} color="#a78bfa" intensity={1.3} />
      <pointLight position={[0, 4, -2]} color="#ffffff" intensity={0.6} />

      <Float speed={1.0} rotationIntensity={0.12} floatIntensity={0.35}>
        <group>
          <TimelineAxis />
          {nodes.map((pos, i) => (
            <MilestoneNode
              key={i}
              position={pos}
              ringSpeed={0.35 + (i % 3) * 0.22}
              ringTilt={(i % 2) * 0.4}
            />
          ))}
        </group>
      </Float>

      <OuterRing />
      <DepthOrbs />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom intensity={0.75} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
