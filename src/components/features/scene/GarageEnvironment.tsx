import { ContactShadows } from '@react-three/drei';

export function GarageEnvironment() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3, -15]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Right wall */}
      <mesh position={[15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 6, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

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
