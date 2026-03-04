import { DARK_METAL, RUST_METAL } from './garage-materials';

export function WorkbenchVise({
  position = [-5.2, 0.78, -2.5] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Base plate */}
      <mesh>
        <boxGeometry args={[0.2, 0.03, 0.15]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Fixed jaw */}
      <mesh position={[0, 0.06, -0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.03]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>

      {/* Moving jaw */}
      <mesh position={[0, 0.06, 0.05]}>
        <boxGeometry args={[0.18, 0.1, 0.03]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>

      {/* Screw rod */}
      <mesh position={[0, 0.06, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Handle bar */}
      <mesh position={[0, 0.06, 0.16]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Handle knobs */}
      <mesh position={[-0.06, 0.06, 0.16]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>
      <mesh position={[0.06, 0.06, 0.16]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial {...RUST_METAL} />
      </mesh>

      {/* Anvil surface on back */}
      <mesh position={[0, 0.115, -0.05]}>
        <boxGeometry args={[0.12, 0.01, 0.06]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}
