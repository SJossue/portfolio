import { ContactShadows, MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import { NeonTube } from './NeonTube';

export function GarageEnvironment() {
  return (
    <group>
      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.2}
          roughness={0.9}
          color="#050505"
          metalness={0.3}
          mirror={0.5}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3, -15]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.6} />
      </mesh>

      {/* Right wall */}
      <mesh position={[15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#111111" metalness={0.7} roughness={0.6} />
      </mesh>

      {/* Neon tubes — back wall */}
      <NeonTube
        position={[-5, 2.5, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={8}
        color="#00f0ff"
        distance={8}
      />
      <NeonTube
        position={[5, 2.5, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={8}
        color="#00f0ff"
        distance={8}
      />
      <NeonTube
        position={[0, 0.2, -14.8]}
        rotation={[0, 0, Math.PI / 2]}
        length={20}
        color="#ff00cc"
        intensity={1.5}
        distance={6}
      />

      {/* Neon tubes — left wall */}
      <NeonTube position={[-14.8, 2, -5]} length={3} color="#ff00cc" distance={5} />
      <NeonTube position={[-14.8, 2, 3]} length={3} color="#ff00cc" distance={5} />
      <NeonTube position={[-14.8, 2, -10]} length={3} color="#ff00cc" distance={5} />

      {/* Neon tube — right wall */}
      <NeonTube
        position={[14.8, 2.5, -3]}
        rotation={[0, 0, Math.PI / 2]}
        length={10}
        color="#00f0ff"
        distance={8}
      />

      {/* Industrial pipes — back wall ceiling */}
      <mesh position={[-6, 5.5, -14.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 28, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.8, -14.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 28, 8]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Atmospheric particles */}
      <Sparkles count={40} scale={[20, 5, 20]} color="#00f0ff" opacity={0.15} speed={0.2} />

      <ContactShadows
        position={[0, 0, 0]}
        resolution={256}
        blur={2}
        opacity={0.6}
        far={10}
        frames={1}
      />
    </group>
  );
}
