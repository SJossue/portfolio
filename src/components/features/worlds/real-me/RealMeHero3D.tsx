'use client';

import { ContactShadows, Float } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function Joint({ radius = 0.18 }: { radius?: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color="#0f1a15"
        metalness={0.95}
        roughness={0.2}
        emissive="#10b981"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function RobotArm() {
  const baseRef = useRef<THREE.Group>(null);
  const shoulderRef = useRef<THREE.Group>(null);
  const elbowRef = useRef<THREE.Group>(null);
  const wristRef = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (baseRef.current) {
      baseRef.current.rotation.y = Math.sin(t * 0.35) * 0.6;
    }
    if (shoulderRef.current) {
      shoulderRef.current.rotation.z = Math.sin(t * 0.55) * 0.28 + 0.35;
    }
    if (elbowRef.current) {
      elbowRef.current.rotation.z = Math.sin(t * 0.75) * 0.45 - 0.55;
    }
    if (wristRef.current) {
      wristRef.current.rotation.x = Math.sin(t * 1.1) * 0.5;
      wristRef.current.rotation.z = Math.cos(t * 0.9) * 0.25;
    }
    if (gripperRef.current) {
      const pulse = (Math.sin(t * 2.2) + 1) * 0.5;
      gripperRef.current.scale.setScalar(0.9 + pulse * 0.15);
    }
  });

  return (
    <group ref={baseRef} position={[0, -1.1, 0]}>
      {/* Base plate */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.12, 40]} />
        <meshStandardMaterial color="#0a0f0c" metalness={0.9} roughness={0.35} />
      </mesh>

      {/* Base hub */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.55, 0.75, 0.38, 32]} />
        <meshStandardMaterial color="#12201a" metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Glowing ring around base */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.025, 12, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>

      {/* Shoulder joint */}
      <group ref={shoulderRef} position={[0, 0.4, 0]}>
        <Joint radius={0.22} />

        {/* Upper arm */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.28, 1.4, 0.28]} />
          <meshStandardMaterial color="#10b981" metalness={0.65} roughness={0.28} />
        </mesh>

        {/* Upper arm side plate (industrial accent) */}
        <mesh position={[0.16, 0.7, 0]}>
          <boxGeometry args={[0.02, 1.2, 0.22]} />
          <meshStandardMaterial color="#0f1a15" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Hydraulic piston */}
        <mesh position={[-0.22, 0.55, 0]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.05, 0.05, 0.9, 16]} />
          <meshStandardMaterial color="#2a3a34" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Elbow joint */}
        <group ref={elbowRef} position={[0, 1.4, 0]}>
          <Joint radius={0.2} />

          {/* Forearm */}
          <mesh position={[0.55, 0, 0]}>
            <boxGeometry args={[1.15, 0.22, 0.24]} />
            <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.22} />
          </mesh>

          {/* Forearm detail stripe */}
          <mesh position={[0.55, 0.12, 0]}>
            <boxGeometry args={[1.0, 0.01, 0.25]} />
            <meshStandardMaterial
              color="#34d399"
              emissive="#34d399"
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>

          {/* Wrist joint */}
          <group ref={wristRef} position={[1.12, 0, 0]}>
            <Joint radius={0.16} />

            {/* Wrist housing */}
            <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.14, 0.14, 0.3, 20]} />
              <meshStandardMaterial color="#1f2b26" metalness={0.9} roughness={0.25} />
            </mesh>

            {/* Gripper assembly */}
            <group ref={gripperRef} position={[0.42, 0, 0]}>
              {/* Gripper base */}
              <mesh>
                <boxGeometry args={[0.18, 0.22, 0.22]} />
                <meshStandardMaterial color="#0f1a15" metalness={0.85} roughness={0.3} />
              </mesh>

              {/* Left claw */}
              <mesh position={[0.18, 0.09, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.2, 0.06, 0.12]} />
                <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.25} />
              </mesh>

              {/* Right claw */}
              <mesh position={[0.18, -0.09, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.2, 0.06, 0.12]} />
                <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.25} />
              </mesh>

              {/* Laser tip / sensor */}
              <mesh position={[0.22, 0, 0]}>
                <sphereGeometry args={[0.055, 16, 16]} />
                <meshStandardMaterial
                  color="#6ee7b7"
                  emissive="#34d399"
                  emissiveIntensity={3.5}
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function FloatingHex({
  position,
  speed,
  scale = 1,
  wireframe = true,
}: {
  position: [number, number, number];
  speed: number;
  scale?: number;
  wireframe?: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += speed;
      ref.current.rotation.x += speed * 0.6;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[0.32, 0.045, 2, 6]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#10b981"
        emissiveIntensity={0.9}
        wireframe={wireframe}
        toneMapped={false}
      />
    </mesh>
  );
}

function CircuitNode({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(t * 3 + position[0]) * 0.8;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

function Scene() {
  return (
    <>
      {/* Lighting — emerald key with cool cyan rim */}
      <ambientLight intensity={0.18} />
      <pointLight position={[3.5, 3, 3]} color="#10b981" intensity={3.2} distance={14} />
      <pointLight position={[-3, -1.5, 3]} color="#06b6d4" intensity={1.6} distance={10} />
      <spotLight
        position={[0, 5, 2.5]}
        angle={0.45}
        penumbra={0.55}
        intensity={2.2}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-2, 3, -2]} intensity={0.35} color="#a7f3d0" />

      {/* Robotic arm */}
      <RobotArm />

      {/* Contact shadow beneath base */}
      <ContactShadows
        position={[0, -1.17, 0]}
        opacity={0.55}
        scale={6}
        blur={2.4}
        far={2}
        color="#10b981"
      />

      {/* Floating hex accents */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <FloatingHex position={[2.7, 1.2, -1]} speed={0.012} scale={1.1} />
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.9}>
        <FloatingHex position={[-2.4, 0.6, 0]} speed={0.02} />
      </Float>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
        <FloatingHex position={[1.8, -0.8, 1]} speed={0.016} scale={0.8} />
      </Float>
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.7}>
        <FloatingHex position={[-1.7, 2, -0.7]} speed={0.018} scale={0.7} />
      </Float>
      <Float speed={1.3} rotationIntensity={0.35} floatIntensity={1.2}>
        <FloatingHex position={[0.2, 2.4, -1.6]} speed={0.01} scale={1.3} wireframe />
      </Float>

      {/* Pulsing cyan circuit nodes */}
      <Float speed={0.8} floatIntensity={0.4}>
        <CircuitNode position={[2.2, -1.3, 0.6]} />
      </Float>
      <Float speed={0.9} floatIntensity={0.5}>
        <CircuitNode position={[-2.6, -0.8, 1.1]} />
      </Float>
      <Float speed={1.1} floatIntensity={0.6}>
        <CircuitNode position={[1.1, 2.1, 0.2]} />
      </Float>

      <EffectComposer>
        <Bloom intensity={0.85} luminanceThreshold={0.4} luminanceSmoothing={0.28} mipmapBlur />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0012, 0.0012)}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RealMeHero3D() {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [3.2, 1.1, 4.2], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
