import { RUST_METAL, DARK_METAL, NEON_CYAN } from './garage-materials';

function Drum({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  color = RUST_METAL,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: Record<string, unknown>;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Barrel body */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.9, 12]} />
        <meshStandardMaterial {...color} />
      </mesh>
      {/* Top rim */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.03, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Bottom rim */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.03, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Center band */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.225, 0.225, 0.04, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}

export function OilDrums() {
  return (
    <group position={[12, 0, 8]}>
      {/* Standing drums */}
      <Drum position={[0, 0, 0]} />
      <Drum position={[0.5, 0, 0.2]} color={DARK_METAL} />

      {/* Tilted drum */}
      <Drum position={[-0.4, 0, 0.4]} rotation={[0.15, 0.3, 0]} />

      {/* Emissive leak puddle from tilted drum */}
      <mesh position={[-0.6, 0.005, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshStandardMaterial {...NEON_CYAN} transparent opacity={0.3} />
      </mesh>

      {/* Leak drip trail */}
      <mesh position={[-0.5, 0.005, 0.55]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <planeGeometry args={[0.06, 0.25]} />
        <meshStandardMaterial {...NEON_CYAN} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
