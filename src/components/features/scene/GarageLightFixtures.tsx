import { DARK_METAL, NEON_CYAN } from './garage-materials';

function HangingLamp({
  position,
  color = '#ffe4b5',
  intensity = 1.5,
}: {
  position: [number, number, number];
  color?: string;
  intensity?: number;
}) {
  return (
    <group position={position}>
      {/* Hanging rod */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 6]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Housing */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.2, 0.12, 12]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Emissive disc */}
      <mesh position={[0, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.14, 12]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={3}
          color={color}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={intensity} distance={8} decay={2} />
    </group>
  );
}

export function GarageLightFixtures() {
  return (
    <group>
      {/* Hanging industrial lamps from ceiling beams */}
      <HangingLamp position={[-6, 5.2, -2]} />
      <HangingLamp position={[0, 5.2, 3]} color="#ffe4b5" intensity={1.2} />
      <HangingLamp position={[6, 5.2, -7]} />

      {/* Emissive floor strips flanking car (cyan) */}
      <mesh position={[-2, 0.005, 0]}>
        <boxGeometry args={[0.08, 0.01, 6]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>
      <mesh position={[2, 0.005, 0]}>
        <boxGeometry args={[0.08, 0.01, 6]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>

      {/* Wall accent strips at baseboard level */}
      <mesh position={[-14.9, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.06, 28]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>
      <mesh position={[14.9, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.06, 28]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>
      <mesh position={[0, 0.1, -14.9]}>
        <boxGeometry args={[28, 0.06, 0.02]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>

      {/* Ceiling emissive strip along one beam */}
      <mesh position={[0, 5.58, -2]}>
        <boxGeometry args={[28, 0.02, 0.06]} />
        <meshStandardMaterial {...NEON_CYAN} />
      </mesh>
    </group>
  );
}
