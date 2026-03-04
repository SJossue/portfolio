import { Sparkles } from '@react-three/drei';
import { NEON_ORANGE } from './garage-materials';

export function WeldingSparks({
  position = [-5, 1.2, -4] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Spark particles */}
      <Sparkles
        count={15}
        scale={[0.8, 0.6, 0.8]}
        color="#ff8800"
        opacity={0.8}
        speed={1.5}
        size={1.5}
      />

      {/* Secondary white-hot sparks */}
      <Sparkles
        count={8}
        scale={[0.4, 0.4, 0.4]}
        color="#ffeecc"
        opacity={0.6}
        speed={2}
        size={0.8}
      />

      {/* Emissive hot spot on surface */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.12, 8]} />
        <meshStandardMaterial {...NEON_ORANGE} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
