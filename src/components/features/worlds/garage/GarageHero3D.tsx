'use client';

import { A11y } from '@react-three/a11y';
import { Environment, Float, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Honda Accord GLB model                                             */
/* ------------------------------------------------------------------ */

function CarModel({
  position = [0, 0, 0] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  const { scene } = useGLTF('/models/accord-transformed.glb');
  return (
    <primitive object={scene} position={position} scale={0.25} rotation={[0, Math.PI / 4, 0]} />
  );
}

useGLTF.preload('/models/accord-transformed.glb');

/* ------------------------------------------------------------------ */
/*  Static car (non-interactive)                                       */
/* ------------------------------------------------------------------ */

function StaticCar() {
  return (
    <group>
      <CarModel position={[-1.8, -1.15, 0]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Raspberry Pi style board                                           */
/* ------------------------------------------------------------------ */

function RaspberryPi({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* PCB board — classic raspberry pi green */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.05, 0.85]} />
        <meshStandardMaterial color="#0a5d2a" metalness={0.25} roughness={0.55} />
      </mesh>

      {/* CPU/SoC — silver metallic square */}
      <mesh position={[-0.1, 0.055, 0]}>
        <boxGeometry args={[0.28, 0.06, 0.28]} />
        <meshStandardMaterial color="#a8a8b0" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* USB ports — dark blocks on the right edge */}
      <mesh position={[0.45, 0.09, 0.22]}>
        <boxGeometry args={[0.25, 0.12, 0.15]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.45, 0.09, -0.1]}>
        <boxGeometry args={[0.25, 0.12, 0.15]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ethernet port — rectangular block */}
      <mesh position={[0.45, 0.09, -0.32]}>
        <boxGeometry args={[0.25, 0.14, 0.16]} />
        <meshStandardMaterial color="#2a2a32" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* GPIO header — black pin block (40 pins, simplified) */}
      <mesh position={[-0.2, 0.08, -0.35]}>
        <boxGeometry args={[0.85, 0.08, 0.08]} />
        <meshStandardMaterial color="#0a0a10" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Power LED — red emissive dot */}
      <mesh position={[-0.5, 0.06, 0.36]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff3030"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Activity LED — green emissive dot */}
      <mesh position={[-0.5, 0.06, 0.3]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial
          color="#00ff30"
          emissive="#00ff40"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Small capacitors — cylinders */}
      <mesh position={[0.1, 0.08, 0.28]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
        <meshStandardMaterial color="#c0a060" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.08, 0.28]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
        <meshStandardMaterial color="#c0a060" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Arduino style board                                                */
/* ------------------------------------------------------------------ */

function Arduino({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* PCB — classic arduino teal/navy */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.05, 0.75]} />
        <meshStandardMaterial color="#0d4d5c" metalness={0.25} roughness={0.55} />
      </mesh>

      {/* ATmega chip — black rectangle */}
      <mesh position={[0.05, 0.055, -0.05]}>
        <boxGeometry args={[0.38, 0.05, 0.14]} />
        <meshStandardMaterial color="#0a0a10" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* USB-B port — silver block */}
      <mesh position={[-0.45, 0.1, 0.22]}>
        <boxGeometry args={[0.22, 0.14, 0.2]} />
        <meshStandardMaterial color="#d0d0d8" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Barrel power jack — black */}
      <mesh position={[-0.45, 0.08, -0.2]}>
        <boxGeometry args={[0.22, 0.1, 0.14]} />
        <meshStandardMaterial color="#1a1a1e" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Digital pin header (top) */}
      <mesh position={[0.05, 0.08, 0.3]}>
        <boxGeometry args={[0.72, 0.08, 0.07]} />
        <meshStandardMaterial color="#0a0a10" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Analog pin header (bottom) */}
      <mesh position={[0.25, 0.08, -0.3]}>
        <boxGeometry args={[0.4, 0.08, 0.07]} />
        <meshStandardMaterial color="#0a0a10" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Power LED — green */}
      <mesh position={[0.4, 0.06, 0.05]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#00ff30"
          emissive="#00ff40"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* TX/RX LEDs — yellow */}
      <mesh position={[0.4, 0.06, 0.12]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Reset button — small silver */}
      <mesh position={[-0.3, 0.08, 0.05]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 10]} />
        <meshStandardMaterial color="#c0c0c8" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating blueprint rings                                           */
/* ------------------------------------------------------------------ */

function BlueprintRing({
  position,
  scale = 1,
  speed = 0.01,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += speed;
      ref.current.rotation.x += speed * 0.4;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[0.42, 0.02, 2, 6]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#f97316"
        emissiveIntensity={1}
        wireframe
        toneMapped={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient spark orbs                                                 */
/* ------------------------------------------------------------------ */

function Sparks() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  const positions = useMemo(
    () =>
      [
        [-3.0, 1.1, -1.5],
        [2.8, -0.8, -1.6],
        [-2.4, -1.2, -0.4],
        [3.1, 1.5, -0.6],
        [-3.3, 0.2, -2.2],
      ] as const,
    [],
  );
  return (
    <group ref={group}>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.06, 14, 14]} />
          <meshStandardMaterial
            color="#fcd34d"
            emissive="#f97316"
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

function Scene() {
  return (
    <>
      {/* Lighting — warm orange key with soft amber rim */}
      <ambientLight intensity={0.25} />
      <pointLight position={[3.5, 3, 3]} color="#f97316" intensity={1.2} distance={14} />
      <pointLight position={[-3, -1.5, 3]} color="#fcd34d" intensity={0.5} distance={10} />
      <spotLight
        position={[0, 5, 2.5]}
        angle={0.45}
        penumbra={0.55}
        intensity={0.3}
        color="#fed7aa"
        castShadow
      />
      <directionalLight position={[-2, 3, -2]} intensity={0.15} color="#fed7aa" />

      {/* Static Accord, wrapped in A11y for screen readers */}
      <A11y role="image" description="3D model of a Honda Accord.">
        <Suspense fallback={null}>
          <StaticCar />
        </Suspense>
      </A11y>

      {/* Floating blueprint rings */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.9}>
        <BlueprintRing position={[2.6, 1.3, -1]} scale={1.1} speed={0.012} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.85}>
        <BlueprintRing position={[-2.5, 0.7, 0]} speed={0.018} />
      </Float>
      <Float speed={2.1} rotationIntensity={0.5} floatIntensity={0.75}>
        <BlueprintRing position={[1.9, -0.9, 1]} scale={0.75} speed={0.015} />
      </Float>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={1.1}>
        <BlueprintRing position={[-1.8, 2.1, -0.7]} scale={0.7} speed={0.02} />
      </Float>

      {/* Floating electronics — Raspberry Pi + Arduino slightly right of center */}
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.6}>
        <RaspberryPi position={[1.2, 0.6, -0.5]} rotation={[0.2, -0.3, 0.15]} scale={0.85} />
      </Float>
      <Float speed={1.6} rotationIntensity={0.6} floatIntensity={0.75}>
        <Arduino position={[1.6, -0.6, 0.3]} rotation={[-0.15, 0.4, -0.2]} scale={0.7} />
      </Float>
      <Float speed={1.0} rotationIntensity={0.4} floatIntensity={0.5}>
        <RaspberryPi position={[0.8, -1.5, -0.8]} rotation={[0.3, 0.5, -0.1]} scale={0.55} />
      </Float>

      <Sparks />

      <Environment preset="warehouse" />

      <EffectComposer>
        <Bloom intensity={0.2} luminanceThreshold={0.8} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GarageHero3D() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [2.2, 0.2, 6], fov: 30 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
