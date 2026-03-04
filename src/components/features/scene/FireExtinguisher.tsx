import { DARK_METAL } from './garage-materials';

const RED_BODY = {
  color: '#8b1a1a',
  roughness: 0.5,
  metalness: 0.3,
} as const;

export function FireExtinguisher({
  position = [14.5, 1.2, -2] as [number, number, number],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Wall bracket */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Body cylinder */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 12]} />
        <meshStandardMaterial {...RED_BODY} />
      </mesh>

      {/* Top dome */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.07, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...RED_BODY} />
      </mesh>

      {/* Valve/handle */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.06, 8]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Handle lever */}
      <mesh position={[0.04, 0.34, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.08, 0.015, 0.02]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Nozzle */}
      <mesh position={[0.06, 0.28, 0]} rotation={[0, 0, -1.2]}>
        <cylinderGeometry args={[0.008, 0.005, 0.08, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Hose */}
      <mesh position={[0.04, 0.15, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      {/* Bottom ring */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.02, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
    </group>
  );
}
