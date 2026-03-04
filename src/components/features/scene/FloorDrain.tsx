import { DARK_METAL } from './garage-materials';

export function FloorDrain({
  position = [3, 0.003, 5] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[0.25, 0.025, 8, 24]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Grate bars */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, i) => (
        <mesh key={i} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.45, 0.02, 0.015]} />
          <meshStandardMaterial {...DARK_METAL} />
        </mesh>
      ))}

      {/* Dark center (drain hole) */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.24, 24]} />
        <meshStandardMaterial color="#020202" roughness={1} />
      </mesh>
    </group>
  );
}
