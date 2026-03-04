import { DARK_METAL } from './garage-materials';

const RUBBER = {
  color: '#0f0f0f',
  roughness: 0.95,
  metalness: 0.05,
} as const;

function Tire({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.28, 0.1, 8, 16]} />
      <meshStandardMaterial {...RUBBER} />
    </mesh>
  );
}

export function TireRack() {
  return (
    <group position={[14.5, 0, 5]}>
      {/* Rack frame — horizontal bars */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.06, 0.06, 2]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[0.06, 0.06, 2]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Rack frame — vertical supports */}
      <mesh position={[0, 1.7, -0.9]}>
        <boxGeometry args={[0.06, 2.4, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 1.7, 0.9]}>
        <boxGeometry args={[0.06, 2.4, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Bottom row tires */}
      <Tire position={[-0.05, 1.2, -0.5]} />
      <Tire position={[-0.05, 1.2, 0.1]} />
      <Tire position={[-0.05, 1.2, 0.7]} />

      {/* Top row tires */}
      <Tire position={[-0.05, 2.2, -0.3]} />
      <Tire position={[-0.05, 2.2, 0.4]} />
    </group>
  );
}
