interface NeonTubeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
  color: string;
  intensity?: number;
}

export function NeonTube({
  position,
  rotation = [0, 0, 0],
  length,
  color,
  intensity = 3,
}: NeonTubeProps) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, length, 12]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={intensity}
          color={color}
          toneMapped={false}
        />
      </mesh>
      {/* Outer glow cylinder */}
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, length, 12]} />
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={intensity * 0.4}
          color={color}
          transparent
          opacity={0.15}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
