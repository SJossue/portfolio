import { DARK_METAL } from './garage-materials';

interface CyberpunkPosterProps {
  position: [number, number, number];
  accentColor?: string;
  headerColor?: string;
}

export function CyberpunkPoster({
  position,
  accentColor = '#00f0ff',
  headerColor = '#ff6600',
}: CyberpunkPosterProps) {
  return (
    <group position={position}>
      {/* Backing panel */}
      <mesh>
        <boxGeometry args={[1.4, 2, 0.03]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>

      {/* Color band header */}
      <mesh position={[0, 0.8, 0.02]}>
        <boxGeometry args={[1.3, 0.25, 0.01]} />
        <meshStandardMaterial
          emissive={headerColor}
          emissiveIntensity={1.5}
          color={headerColor}
          toneMapped={false}
        />
      </mesh>

      {/* Fake text bars */}
      {[0.45, 0.3, 0.15, 0.0, -0.15].map((y, i) => (
        <mesh key={i} position={[-0.1, y, 0.02]}>
          <boxGeometry args={[0.8 - i * 0.08, 0.06, 0.005]} />
          <meshStandardMaterial
            emissive={accentColor}
            emissiveIntensity={1}
            color={accentColor}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Vertical accent bar */}
      <mesh position={[0.55, -0.1, 0.02]}>
        <boxGeometry args={[0.06, 1.2, 0.005]} />
        <meshStandardMaterial
          emissive={headerColor}
          emissiveIntensity={2}
          color={headerColor}
          toneMapped={false}
        />
      </mesh>

      {/* Hexagonal logo placeholder */}
      <mesh position={[0, -0.55, 0.02]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.18, 0.18, 0.01, 6]} />
        <meshStandardMaterial
          emissive={accentColor}
          emissiveIntensity={2}
          color={accentColor}
          toneMapped={false}
        />
      </mesh>

      {/* Barcode strips */}
      <group position={[-0.3, -0.85, 0.02]}>
        {[0, 0.04, 0.07, 0.1, 0.15, 0.18, 0.22, 0.26, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <boxGeometry args={[0.015, 0.1, 0.005]} />
            <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
